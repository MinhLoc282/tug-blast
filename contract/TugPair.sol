// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";
import "openzeppelin/access/Ownable.sol";
import "openzeppelin/security/Pausable.sol";
import "openzeppelin/token/ERC20/IERC20.sol";
import "./interface/TugPairInterface.sol";
import "../interface/TugStorageInterface.sol";
import "../price/interface/PricingEngineInterface.sol";
import "../price/interface/TokenRegistryInterface.sol";

contract TugPair is TugPairInterface, Ownable, Pausable {
    using FixedPointMathLib for uint256;

    struct EpochData {
        uint256 token0InitialPrice; // initial price of token set during epoch initialization
        uint256 token1InitialPrice; // initial price of token set during epoch initialization
        mapping(address => uint256) token0ShareBalance;
        uint256 token0SharesIssued;
        mapping(address => uint256) token1ShareBalance;
        uint256 token1SharesIssued;
        uint256 totalPot; // Total amount of DAI deposited by users for this epoch
        mapping(address => bool) hasAlreadyCollectedWinnnings; // mapping of whether users have already collected winnings
        int8 winningSide; // -1 if none has won yet. 0 for token0, 1 for token1
    }

    error InvalidTokenIndex(uint8 invalidTokenIndex);
    error InvalidTokenPrice(uint8 tokenIndexWithInvalidPrice);
    error EpochDurationIsZero();
    error DepositIsZero();
    error InvalidDepositSide(uint8 invalidSide);
    error CannotDepositToEpochZero();
    error DepositTooLow(uint256 amount);
    error EpochNotConcluded(uint256 epoch);
    error EpochPreviouslyConcluded(uint256 epoch);
    error EpochOutOfSync(uint256 currentEpoch);
    error InvalidSharePrice();
    error EpochWinningsAlreadyClaimed(uint256 epoch, address user);
    error InvalidTreasuryAddress();
    error TokenTransferFailed();

    TugStorageInterface public immutable tugStorage;
    PricingEngineInterface public immutable pricingEngine;
    TokenRegistryInterface public immutable tokenRegistry;
    IERC20 public immutable depositToken;
    uint8 public immutable token0Index;
    uint8 public immutable token1Index;
    uint256 public immutable startTime;
    uint256 public immutable epochDuration;
    uint256 public currentEpoch;
    mapping(uint256 => EpochData) public epochData;
    uint256 public accumulatedFees;

    uint256 public constant FEE = 10; // out of 10,000 - 0.10%
    uint256 public constant WIN_SIDE_MUL = 7900; // out of 10,000 - 79%
    uint256 public constant WIN_FEE = 100; // out of 10,000 - 1%
    uint256 public constant LOSE_SIDE_MUL = 2000; // out of 10,000 - 20%

    constructor(
        address _tugStorageAddress,
        address _depositToken,
        uint8 _token0Index,
        uint8 _token1Index,
        uint256 _startTime,
        uint256 _epochDuration
    ) {
        if (_token0Index == 0) revert InvalidTokenIndex(_token0Index);
        if (_token1Index == 0) revert InvalidTokenIndex(_token1Index);
        if (_epochDuration == 0) revert EpochDurationIsZero(); // prevent dividing by 0 when calculating price
        tugStorage = TugStorageInterface(_tugStorageAddress);

        // Fixed at initialization to ensure that admins have decreased influence over economics
        pricingEngine = PricingEngineInterface(
            tugStorage.getPricingEngineAddress()
        );
        tokenRegistry = TokenRegistryInterface(
            tugStorage.getTokenRegistryAddress()
        );

        depositToken = IERC20(_depositToken);
        token0Index = _token0Index;
        token1Index = _token1Index;
        startTime = _startTime;
        epochDuration = _epochDuration;
    }

    // ------------ View Functions ------------ //
    /// @inheritdoc TugPairInterface
    function getDepositToken()
        external
        view
        override
        returns (address depositTokenToReturn)
    {
        depositTokenToReturn = address(depositToken);
    }

    /// @inheritdoc TugPairInterface
    function getLatestEpoch()
        external
        view
        override
        returns (uint256 latestEpoch)
    {
        latestEpoch = currentEpoch;
    }

    /// @notice Returns true if the given epoch has already ended.
    function epochEnded(uint256 epochToCheck) private view returns (bool) {
        uint256 epochEndTime = startTime + epochToCheck * epochDuration;
        return block.timestamp >= epochEndTime;
    }

    /// @notice Returns the amount of shares to distribute in the current block for given amount and side.
    /// @param _amount # of deposit tokens to deposit (DAI)
    /// @param _side Side to deposit DAI on. 0 for token0, 1 for token 1
    /// @return qtyOfShares to be issued
    function getQtyOfSharesToIssue(uint256 _amount, uint8 _side)
        public
        view
        returns (uint256 qtyOfShares)
    {
        uint256 sharePrice = pricingEngine.getUsdPerShare(
            startTime + (currentEpoch - 1) * epochDuration, // start time of epoch
            startTime + currentEpoch * epochDuration, // end time of epoch
            block.timestamp,
            epochData[currentEpoch].token0InitialPrice,
            epochData[currentEpoch].token1InitialPrice,
            token0Index,
            token1Index,
            _side
        );
        uint8 shareDecimal = pricingEngine.getSharePriceDecimal();

        // Rounded down to avoid exploitation by using very small deposits to get 1 share. Unlikely to be profitable due to chain fees but possible.
        qtyOfShares = _amount.mulDivDown(10**shareDecimal, sharePrice);
    }

    /// @notice Returns the share balance for a given epoch
    function getSharesBalance(uint256 epochToCheck, address user)
        external
        view
        returns (uint256 token0Shares, uint256 token1Shares)
    {
        token0Shares = epochData[epochToCheck].token0ShareBalance[user];
        token1Shares = epochData[epochToCheck].token1ShareBalance[user];
    }

    /// @notice Returns the shares issued so far for a given epoch
    function getSharesIssued(uint256 epochToCheck)
        external
        view
        returns (uint256 token0SharesIssued, uint256 token1SharesIssued)
    {
        token0SharesIssued = epochData[epochToCheck].token0SharesIssued;
        token1SharesIssued = epochData[epochToCheck].token1SharesIssued;
    }

    /// @inheritdoc TugPairInterface
    /// @dev Winnings = (# shares / total shares issued) * (totalPot * side multiplier). Rounded down to prevent paying out more than what we have.
    function getWinnings(uint256 _epoch, address _user)
        public
        view
        override
        returns (uint256 amountOfDaiWinnings)
    {
        EpochData storage thisEpochData = epochData[_epoch];
        int8 winningSide = thisEpochData.winningSide;
        if (_epoch > currentEpoch || winningSide == -1)
            revert EpochNotConcluded(_epoch); // if _epoch is higher than current, winningSide is still 0.

        uint256 token0SharesIssued = thisEpochData.token0SharesIssued;
        if (token0SharesIssued > 0) {
            uint256 token0SideMultipler = winningSide == 0
                ? WIN_SIDE_MUL
                : LOSE_SIDE_MUL;
            amountOfDaiWinnings += thisEpochData
                .token0ShareBalance[_user]
                .mulDivDown(
                    thisEpochData.totalPot.mulDivDown(
                        token0SideMultipler,
                        10000
                    ),
                    thisEpochData.token0SharesIssued
                );
        }

        uint256 token1SharesIssued = thisEpochData.token1SharesIssued;
        if (token1SharesIssued > 0) {
            uint256 token1SideMultipler = winningSide == 1
                ? WIN_SIDE_MUL
                : LOSE_SIDE_MUL;
            amountOfDaiWinnings += thisEpochData
                .token1ShareBalance[_user]
                .mulDivDown(
                    thisEpochData.totalPot.mulDivDown(
                        token1SideMultipler,
                        10000
                    ),
                    thisEpochData.token1SharesIssued
                );
        }
    }

    // ------------ Mutative Functions ------------ //
    /// @notice Closes the epoch and sets the winner according to current ratio.
    /// @param _epoch Epoch to close.
    /// @dev Only call after checking that the end-time for this epoch has already passed.
    function concludeEpoch(uint256 _epoch) private {
        if (epochData[_epoch].winningSide == -1) {
            // Only update once
            uint256 oldToken0Price = epochData[_epoch].token0InitialPrice;
            uint256 oldToken1Price = epochData[_epoch].token1InitialPrice;
            uint256 oldRatio = oldToken0Price.mulDivUp(10000, oldToken1Price);

            (uint256 currentToken0Price, ) = tokenRegistry.getPrice(
                token0Index
            );
            (uint256 currentToken1Price, ) = tokenRegistry.getPrice(
                token1Index
            );
            uint256 currentRatio = currentToken0Price.mulDivUp(
                10000,
                currentToken1Price
            );

            if (currentRatio > oldRatio) {
                epochData[_epoch].winningSide = 0;
            } else {
                epochData[_epoch].winningSide = 1;
            }

            accumulatedFees += epochData[_epoch].totalPot.mulDivDown(
                WIN_FEE,
                10000
            );

            emit EpochEnded(_epoch);
        }
    }

    /// @notice Update epoch to latest. Conclude any old epochs.
    function updateEpoch() public {
        while (epochEnded(currentEpoch)) {
            // Keeps progressing epoch until it's up to date.
            uint256 oldCurrentEpoch = currentEpoch;
            if (oldCurrentEpoch != 0) {
                // epoch 0 doesn't exist and doesn't need to be concluded
                concludeEpoch(oldCurrentEpoch);
            }
            uint256 newEpoch = ++oldCurrentEpoch;
            currentEpoch = newEpoch;

            (uint256 token0InitialPrice, ) = tokenRegistry.getPrice(
                token0Index
            );
            if (token0InitialPrice == 0) revert InvalidTokenPrice(token0Index);
            epochData[newEpoch].token0InitialPrice = token0InitialPrice;

            (uint256 token1InitialPrice, ) = tokenRegistry.getPrice(
                token1Index
            );
            if (token1InitialPrice == 0) revert InvalidTokenPrice(token1Index);
            epochData[newEpoch].token1InitialPrice = token1InitialPrice;
            epochData[newEpoch].winningSide = -1; // -1 indicates that neither side has won yet.

            emit EpochStarted(newEpoch);
        }
    }

    /// @inheritdoc TugPairInterface
    function deposit(uint256 _amount, uint8 _side)
        external
        override
        whenNotPaused
    {
        // Checks
        if (_amount == 0) revert DepositIsZero();
        if (_side > 1) revert InvalidDepositSide(_side); // _side can only be 0 or 1
        updateEpoch();
        if (currentEpoch == 0) revert CannotDepositToEpochZero();
        if (epochEnded(currentEpoch)) revert EpochOutOfSync(currentEpoch); // Do NOT proceed with desposit if the current epoch has already ended.

        // Effects
        uint256 feeToCollect = _amount.mulDivDown(FEE, 10000);
        accumulatedFees += feeToCollect;
        uint256 depositAmountAfterFees = _amount - feeToCollect;
        epochData[currentEpoch].totalPot += depositAmountAfterFees;

        uint256 qtySharesToIssue = getQtyOfSharesToIssue(
            depositAmountAfterFees,
            _side
        );
        if (qtySharesToIssue == 0) revert DepositTooLow(_amount);
        if (_side == 0) {
            epochData[currentEpoch].token0ShareBalance[
                _msgSender()
            ] += qtySharesToIssue;
            epochData[currentEpoch].token0SharesIssued += qtySharesToIssue;
        } else {
            epochData[currentEpoch].token1ShareBalance[
                _msgSender()
            ] += qtySharesToIssue;
            epochData[currentEpoch].token1SharesIssued += qtySharesToIssue;
        }

        emit Deposit(
            currentEpoch,
            _msgSender(),
            _side,
            _amount,
            qtySharesToIssue
        );

        // Interactions
        bool success = depositToken.transferFrom(
            _msgSender(),
            address(this),
            _amount
        );
        if (!success) revert TokenTransferFailed();
    }

    /// @inheritdoc TugPairInterface
    function collectWinnings(uint256[] calldata _epochs) external override {
        updateEpoch();
        uint256 amountToSendUser = 0;
        for (uint256 i = 0; i < _epochs.length; ++i) {
            // Checks
            if (
                !epochData[_epochs[i]].hasAlreadyCollectedWinnnings[
                    _msgSender()
                ]
            ) {
                uint256 epochWinnings = getWinnings(_epochs[i], _msgSender());
                // Effects
                epochData[_epochs[i]].hasAlreadyCollectedWinnnings[
                    _msgSender()
                ] = true;
                amountToSendUser += epochWinnings;
                emit Collection(_epochs[i], _msgSender(), epochWinnings);
            } else {
                revert EpochWinningsAlreadyClaimed(_epochs[i], _msgSender());
            }
        }

        // Interactions
        if (amountToSendUser > 0) {
            bool success = depositToken.transfer(
                _msgSender(),
                amountToSendUser
            );
            if (!success) revert TokenTransferFailed();
        }
    }

    /// @notice Pause deposits
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause deposits
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Send all collected fees to treasury
    function collectFees() external onlyOwner {
        address treasuryAddress = tugStorage.getTreasuryAddress();
        if (treasuryAddress == address(0)) revert InvalidTreasuryAddress();
        uint256 amtToTransfer = accumulatedFees;
        accumulatedFees = 0;
        bool success = depositToken.transfer(treasuryAddress, amtToTransfer);
        if (!success) revert TokenTransferFailed();
    }
}
