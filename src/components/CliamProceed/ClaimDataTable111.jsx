/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable import/extensions */
import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect } from 'react';
import {
  Button,
  Form,
  Modal,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import moment from 'moment';
import Web3 from 'web3';
import DataTable from 'react-data-table-component';
import contract from '../../ethereum/con1.js';

import web3 from '../../ethereum/web3.js';

import { FAKE_DATA } from '../../backend/fakeApi';

function ClaimProceedDataTable() {
  const [filterText, setFilterText] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('');
  const [tugClaim, setTugClaimModal] = React.useState(false);
  const [hideDirector, setHideDirector] = React.useState(false);
  const [tugclaimsuccess, setTugClaimSuccesModal] = React.useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const [buyTugData, setBuyTugData] = React.useState();

  const main = async () => {
    try {
      const isBuyTugExist = localStorage.getItem('ClaimTugData');
      if (isBuyTugExist) {
        const buyTugResponse = JSON.parse(isBuyTugExist);
        const isTimeExpired = buyTugResponse?.expiryTime < moment().unix();
        if (!isTimeExpired) {
          console.log('here is the data from local storage', JSON.parse(isBuyTugExist));
          setBuyTugData(JSON.parse(buyTugResponse?.claimTugData));
          return;
        }
      }
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
      const address = '0x15F976917330Fe5D51D87971fCE599d4Ad586846'; // tugPairContract
      const con1Alc = new web3Alchemy.eth.Contract(ABI, address);// tugPairContractObj

      const result1 = FAKE_DATA.tugPairs;

      const epochArray = result1;

      const result2 = FAKE_DATA.tugPairs;

      const result3 = FAKE_DATA.pairUserEpoches;

      const costBasisArray = result3;

      let startTime = await contract.methods.startTime().call();
      startTime = Math.round(startTime);

      let tugDuration = await con1Alc.methods.epochDuration().call();
      tugDuration = Math.round(tugDuration);

      const currentTimeinEpochSeconds = Math.round(Date.now() / 1000);

      const currentEpoch = await con1Alc.methods.currentEpoch().call();

      let result222 = currentTimeinEpochSeconds - (startTime + tugDuration);
      const days = Math.floor(result222 / (3600 * 24));
      result222 -= days * 3600 * 24;
      const hrs = Math.floor(result222 / 3600);
      result222 -= hrs * 3600;
      const mnts = Math.floor(result222 / 60);
      result222 -= mnts * 60;
      // let time = new Date(result222)
      // let normalDate = new Date(sec).toLocaleString('en-GB',{timeZone:'UTC'})
      const timeToExpiry = `${days}d:${hrs}h:${result222}s`; // 10/29/2013

      const EpochData = await con1Alc.methods.epochData(currentEpoch).call();

      const myPayoff = [];
      const status = [];
      const uncollectedEpochs = FAKE_DATA.pairUsers;

      const uncollectedEpochsArray = uncollectedEpochs;

      for (let i = 0; i < epochArray.length; i++) {
        myPayoff[i] = 1000000;
        status[i] = 'onGoing';
      }

      const totalPoolSize = EpochData.totalPot;

      const totalToken0Shares = EpochData.token0SharesIssued;

      const totalToken1Shares = EpochData.token1SharesIssued;
      const ExpectedPayoffWin = 99;
      const ExpectedPayoffLoose = 20;

      // costBasisArray
      const CostBasis = 100;

      const AveragePrice0 = totalToken0Shares / CostBasis;

      const pairsArry = result1;
      let totalData = [];

      for (let item = 0; item < pairsArry.length; item++) {
        totalData = [...totalData, {
          no: item + 1,
          myPayoff: 1000000,
          AveragePrice0,
          ExpectedPayoffWin,
          ExpectedPayoffLoose,
          totalPoolSize,
          id: pairsArry[item].id,
          timeToExpiry,
          totalToken0Deposits: pairsArry[item].totalToken0Deposits,
        }];
      }
      const pairsArry2 = result2;

      totalData = totalData.map((item) => {
        const isDataExist = pairsArry2.find((o) => o.id === item.id);

        if (isDataExist) {
          return {
            ...item, totalToken1Deposits: isDataExist.totalToken1Deposits,
          };
        }
        return { ...item };
      });

      totalData = totalData.map((item) => {
        const isDataExist = costBasisArray.find((o) => o.id.split('.')[0] === item.id);
        const isClaimed = uncollectedEpochsArray.find((o) => o.id.split('.')[0] === item.id);

        if (isDataExist) {
          const avgVal1 = ((parseInt(totalToken0Shares)) / (parseInt(isDataExist.totalDeposits)) || 0);
          const avgVal2 = ((parseInt(totalToken1Shares)) / (parseInt(isDataExist.totalDeposits)) || 0);

          return {
            ...item,
            CostBasis: isDataExist.totalDeposits,
            AveragePrice: `${avgVal1}/${avgVal2}`,
            return: (item.myPayoff / CostBasis),
            status: isClaimed ? 'Claimed' : 'UnClaimed',

          };
        }
        return { ...item };
      });

      const localData = { expiryTime: moment().add(2, 'hours').unix(), claimTugData: JSON.stringify(totalData) };

      localStorage.setItem('ClaimTugData', JSON.stringify(localData));
      setBuyTugData(totalData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    main();
  }, []);
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.no,
      sortable: true,
    },
    {
      name: 'Time to expiry DD:HH:MM:SS',
      selector: (row) => row.timeToExpiry,
      sortable: true,
    },
    {
      name: 'Pair Token A/Token B',
      selector: (row) => row.pair,
      sortable: true,
      cell: (row) => (
        <p className="d-block w-100">
          <img
            height=""
            width="16px"
            alt={row.name}
            className="me-1"
            src="../assets/icons.png"
          />
          BTC/ETH
        </p>
      ),
    },

    {
      name: '# tokens held',
      selector: (row) => `${row.totalToken0Deposits}/ ${row.totalToken1Deposits}`,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Cost Basis',
      selector: (row) => row.CostBasis,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'My Payoff',
      selector: (row) => row.myPayoff,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: '% return',
      selector: (row) => row.return,
      sortable: true,
      omit: hideDirector,
    },

    {
      name: 'Status',
      cell: (row) => (
        <Button
          className="status-tug"
          id={
              row.status === 'Ongoing'
                ? 'Ongoing'
                : row.status === 'Claimed'
                  ? 'Claimed'
                  : 'notclaimed'
            }
        >
          {row.status}
        </Button>
      ),
    },
  ];

  function FilterComponent({ filterText, onFilter, onClear }) {
    return (
      <div className="searchmain">
        <div className="Filteritems">
          <Form.Control
            type="text"
            id="search"
            placeholder="Search for Tug Pairs"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
          />
        </div>
        <div className="filtertabs">
          <Button
            type="button"
            name="All"
            className={`${activeFilter === '' ? 'all-btn' : null}`}
            onClick={() => {
              onClear();
              setActiveFilter('');
            }}
          >
            All
          </Button>
          <Button
            type="button"
            name="Coin"
            className={`${activeFilter === 'Tokens' ? 'all-btn' : null}`}
            onClick={() => {
              setActiveFilter('Tokens');
              setFilterText('Tokens');
            }}
          >
            Tokens
          </Button>
          <Button
            type="button"
            name="NFTs"
            className={`${activeFilter === 'NFTs' ? 'all-btn' : null}`}
            onClick={() => {
              setFilterText('NFTs');
              setActiveFilter('NFTs');
            }}
          >
            NFTs
          </Button>

          <Button
            type="button"
            className={`${activeFilter === 'Commodities' ? 'all-btn' : null}`}
            name="Comodites"
            onClick={() => {
              setActiveFilter('Commodities');
              setFilterText('Commodities');
            }}
          >
            Commodities
          </Button>
          <Button
            type="button"
            name="Equities"
            className={`${activeFilter === 'Equities' ? 'all-btn' : null}`}
            onClick={() => {
              setActiveFilter('Equities');
              setFilterText('Equities');
            }}
          >
            Equities
          </Button>
        </div>
      </div>
    );
  }

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  function TugClaimSuccesModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        id="g-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="modl-headr w-100 d-block tug">
          <Modal.Title id="contained-modal-title-vcenter" className="h5">
            <Container>
              <Row className="w-100">
                <Col sm={12} className="text-center">
                  <p className="mb-1">
                    <img src="../assets/check-box.png" alt="ETH" />
                  </p>
                  <h4>Success!</h4>
                </Col>
              </Row>
            </Container>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="amount-dai select-token">
            <small className="per-dair d-block w-100">
              You have cliamed
              {' '}
              <span className="climsml">48,86579 synth ETH tokens</span>
              {' '}
              <span className="smal-blu">5893.39 WETH</span>
            </small>
          </div>
          <div className="amount-dai select-token">
            <small className="per-dair d-block w-100">
              You have cliamed
              {' '}
              <span className="climsml">456 synth META for</span>
              {' '}
              <span className="smal-blu">5893.39 WETH</span>
            </small>
          </div>
          <div className="text-center">
            <img src="../assets/more.png" alt="more" />
          </div>
          <div className="amount-dai select-token">
            <small className="per-dair d-block w-100">
              You have cliamed
              {' '}
              <span className="climsml">48,86579 synth ETH tokens</span>
              {' '}
              for
              {' '}
              <span className="smal-blu">2530.39 WETH</span>
            </small>
          </div>
          <div className="amount-dai" style={{ marginTop: '8px' }}>
            <Row className="w-100">
              <Col sm={6}>
                <small className="mb-1">Total</small>
                <h1 className="mb-0">7383.57</h1>
              </Col>
              <Col sm={6} className="text-end">
                <Button className="synth-tokenbtn">
                  <img
                    src="../assets/usdt-logo.png"
                    alt="ETH"
                    className="me-2"
                    style={{ width: '18px' }}
                  />
                  WETH
                </Button>
              </Col>
            </Row>
          </div>

          <div className="buy-div">
            <Button className="buy-btn purple-btn" onClick={props.onHide}>
              CLOSE
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className="text-start justify-content-sm-start ps-5">
          <small className="per-dair d-block w-100">
            Click here to check your position
          </small>
        </Modal.Footer>
      </Modal>
    );
  }

  function TugClaimModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        id="g-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="modl-headr w-100 d-block tug">
          <Modal.Title id="contained-modal-title-vcenter" className="h5">
            <Container>
              <Row className="w-100">
                <Col sm={12} className="text-center">
                  <p className="mb-1">
                    <img src="../assets/check-box.png" alt="ETH" />
                  </p>
                  <h4>Success</h4>
                </Col>
              </Row>
            </Container>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div className="amount-dai select-token">
            <Row className="w-100">
              <Col sm={12}>
                <small className="per-dair d-block w-100">
                  You have cliamed
                  {' '}
                  <span className="climsml">48.49514 synth ETH tokens</span>
                </small>
              </Col>
            </Row>
          </div>
          <div className="amount-dai" style={{ marginTop: '8px' }}>
            <Row className="w-100">
              <Col sm={6}>
                <small className="mb-1">For</small>
                <h1 className="mb-0">383..57</h1>
                <img
                  src="../assets/tugcursor.png"
                  alt="tugcursor"
                  className="tugcursor"
                />
              </Col>
              <Col sm={6} className="text-end">
                <Button className="synth-tokenbtn">
                  <img
                    src="../assets/usdt-logo.png"
                    alt="ETH"
                    className="me-2"
                    style={{ width: '18px' }}
                  />
                  WETH
                </Button>
              </Col>
            </Row>
          </div>

          <div className="buy-div">
            <Button
              className="buy-btn purple-btn"
              onClick={() => {
                setTugClaimModal(false);
              }}
            >
              CLOSE
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className="text-start justify-content-sm-start ps-5">
          <small className="per-dair d-block w-100">
            Click here to check your position
          </small>
        </Modal.Footer>
      </Modal>
    );
  }

  useEffect(() => {
    if (window.innerWidth < 600) {
      setHideDirector(true);
    }
  }, [setHideDirector]);
  const customStyles = {
    rows: {
      style: {
        minHeight: '62px', // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '5px', // override the cell padding for data cells
        paddingRight: '14px',
      },
    },
  };
  const claimAll = async () => {
    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    const result4 = FAKE_DATA.tugPairs;
    let UserEpochs = [];
    const epochArray = result4;

    for (let i = 0; i < epochArray.length; i++) {
      UserEpochs = [...UserEpochs, epochArray[i].id];
    }

    await contract.methods.collectWinnings(UserEpochs).send({
      from: account,
    });
  };
  return (
    <>
      <div className="search-header">
        <Button
          type="button"
          className="collapseheader"
          onClick={() => setHideDirector(!hideDirector)}
        >
          Show Details
        </Button>
        <DataTable
          columns={columns}
          data={buyTugData}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          customStyles={customStyles}
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
        />
      </div>
      <div style={{ float: 'right' }}>
        <Button
          className="tug-modelbtn claim-all"
          onClick={() => { setTugClaimModal(true); claimAll(); }}
        >
          CLAIM ALL
        </Button>

      </div>
      <TugClaimModal show={tugClaim} onHide={() => setTugClaimModal(false)} />
      <TugClaimSuccesModal
        show={tugclaimsuccess}
        onHide={() => setTugClaimSuccesModal(false)}
      />
    </>
  );
}

export default ClaimProceedDataTable;
