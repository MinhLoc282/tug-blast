import Web3 from './web3';

const url = 'https://polygon-mumbai.g.alchemy.com/v2/S4-_XPXzdAcnjGgrgP8tMZWXGd_ds7y3'; // providerForWeb3ForCallsOnly

const web3Alchemy = new Web3(url);
const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tugStorageAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_depositToken',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: '_token0Index',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_token1Index',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_epochDuration',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'CannotDepositToEpochZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DepositIsZero',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'DepositTooLow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EpochDurationIsZero',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'EpochNotConcluded',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'currentEpoch',
        type: 'uint256',
      },
    ],
    name: 'EpochOutOfSync',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'EpochPreviouslyConcluded',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'EpochWinningsAlreadyClaimed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'invalidSide',
        type: 'uint8',
      },
    ],
    name: 'InvalidDepositSide',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSharePrice',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'invalidTokenIndex',
        type: 'uint8',
      },
    ],
    name: 'InvalidTokenIndex',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'tokenIndexWithInvalidPrice',
        type: 'uint8',
      },
    ],
    name: 'InvalidTokenPrice',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTreasuryAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokenTransferFailed',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdCollected',
        type: 'uint256',
      },
    ],
    name: 'Collection',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint8',
        name: 'side',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sharesIssued',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'EpochEnded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'EpochStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LOSE_SIDE_MUL',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WIN_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WIN_SIDE_MUL',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'accumulatedFees',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collectFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_epochs',
        type: 'uint256[]',
      },
    ],
    name: 'collectWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentEpoch',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_side',
        type: 'uint8',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'epochData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'token0InitialPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'token1InitialPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'token0SharesIssued',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'token1SharesIssued',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalPot',
        type: 'uint256',
      },
      {
        internalType: 'int8',
        name: 'winningSide',
        type: 'int8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'epochDuration',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDepositToken',
    outputs: [
      {
        internalType: 'address',
        name: 'depositTokenToReturn',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLatestEpoch',
    outputs: [
      {
        internalType: 'uint256',
        name: 'latestEpoch',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_side',
        type: 'uint8',
      },
    ],
    name: 'getQtyOfSharesToIssue',
    outputs: [
      {
        internalType: 'uint256',
        name: 'qtyOfShares',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'epochToCheck',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getSharesBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: 'token0Shares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'token1Shares',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'epochToCheck',
        type: 'uint256',
      },
    ],
    name: 'getSharesIssued',
    outputs: [
      {
        internalType: 'uint256',
        name: 'token0SharesIssued',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'token1SharesIssued',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_epoch',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getWinnings',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOfDaiWinnings',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pricingEngine',
    outputs: [
      {
        internalType: 'contract PricingEngineInterface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token0Index',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token1Index',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenRegistry',
    outputs: [
      {
        internalType: 'contract TokenRegistryInterface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tugStorage',
    outputs: [
      {
        internalType: 'contract TugStorageInterface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateEpoch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const address = '0x9830d8ddb8a181a5cE66C9612dA363AeCdB73E3E'; // tugPairContract
const con4Alc = new web3Alchemy.eth.Contract(ABI, address);// tugPairContractObj

export default con4Alc;
