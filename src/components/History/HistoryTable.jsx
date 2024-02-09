/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from 'react-data-table-component';
import {
  TailSpin,
} from 'react-loader-spinner';
import {
  Button,
  Form,
  Row,
  Col,
  Container,
  Modal,
} from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import Web3 from 'web3';
import moment from 'moment';
import { ReactComponent as BTCIcon } from '../../assets/images/btc.svg';
import { ReactComponent as ETHIcon } from '../../assets/images/eth.svg';
import { ReactComponent as MATICIcon } from '../../assets/images/matic.svg';
import { ReactComponent as SANDIcon } from '../../assets/images/sand.svg';
import { FAKE_DATA } from '../../backend/fakeApi';
import { useAccount } from 'wagmi';

const getEpochListForTable = async (account, pairId) => {
  const result3 = FAKE_DATA.pairUserEpoches;
  const arr = result3;
  const token = [];
  arr.map((item) => {
    if (account !== undefined) {
      if (item.id.includes(account.toLowerCase())) {
        const dataList = item.id.split('.');
        if (dataList[0] === pairId) {
          token.push(item.epoch);
        }
      }
    }
  });
  return token;
};

const filterList = async (account, pairId, epochNumber) => {
  const result3 = FAKE_DATA.pairUserEpoches;
  const arr = result3;
  let token = [];
  arr.map((item) => {
    if (account !== undefined) {
      if (item.id.includes(account.toLowerCase())) {
        const dataList = item.id.split('.');
        if (dataList[0] === pairId && (dataList[2] === epochNumber)) {
          // checkFlag = true;
          token = item;
        }
      }
    }
  });
  return token;
};

const getSuccessData = async (totaldata) => {
  try {
    let maShares = 0;
    let saShares = 0;
    let etShares = 0;
    let btShares = 0;
    let msPOff = 0;
    let ebPOff = 0;
    let totalPayOff = 0;

    for (let i = 0; i < totaldata.length; i++) {
      if (totaldata[i].checkTotal === 0 && totaldata[i].myPayOff !== '' && totaldata[i].status === 'Not Claimed') {
        if (totaldata[i].token0Symbol === 'MATIC' && totaldata[i].token1Symbol === 'SAND') {
          maShares += parseInt(totaldata[i].token0SharesHeld);
          saShares += parseInt(totaldata[i].token1SharesHeld);
          msPOff += parseInt(totaldata[i].myPayOff);
        } else if (totaldata[i].token0Symbol === 'ETH' && totaldata[i].token1Symbol === 'BTC') {
          etShares += parseInt(totaldata[i].token0SharesHeld);
          btShares += parseInt(totaldata[i].token1SharesHeld);
          ebPOff += parseInt(totaldata[i].myPayOff);
        }
      }

      if (totaldata[i].checkTotal === 1) {
        totalPayOff = totaldata[i].totalPayOff;
      }
    }

    const tData = {
      maShares, saShares, msPOff, etShares, btShares, ebPOff, totalPayOff,
    };
    return tData;
  } catch (e) {
    toast.error(e, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  }
};

function TugClaimSuccesModal(props) {
  const {
    show, onHide, maticshare, sandshare, mspayoff, ethshare, btcshare, ebpayoff, totalpayoff,
  } = props;

  return (
    <Modal
      {...props}
      show={show}
      onHide={() => { onHide(); }}
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
            <span className="climsml">
              <br />
              {maticshare}
              {' '}
              synth MATIC tokens &
              {' '}
              {sandshare}
              {' '}
              synth SAND tokens
            </span>
            <br />
            {' for '}
            <span className="smal-blu">
              {mspayoff}
              {' '}
              USDT
            </span>
          </small>
        </div>
        <div className="amount-dai select-token">
          <small className="per-dair d-block w-100">
            You have cliamed
            {' '}
            <span className="climsml">
              <br />
              {ethshare}
              {' '}
              synth ETH tokens &
              {' '}
              {btcshare}
              {' '}
              synth BTC tokens
            </span>
            <br />
            {' for '}
            <span className="smal-blu">
              {ebpayoff}
              {' '}
              USDT
            </span>
          </small>
        </div>

        <div className="amount-dai" style={{ marginTop: '8px' }}>
          <Row className="w-100">
            <Col sm={6}>
              <small className="mb-1">Total</small>
              <h1 className="mb-0">{totalpayoff}</h1>
            </Col>
            <Col sm={6} className="text-end">
              <Button className="synth-tokenbtn">
                <img
                  src="../assets/usdt-logo.png"
                  alt="ETH"
                  className="me-2"
                  style={{ width: '18px' }}
                />
                USDT
              </Button>
            </Col>
          </Row>
        </div>

        <div className="buy-div">
          <Button
            className="buy-btn purple-btn"
            onClick={() => { onHide(); localStorage.setItem('showModal', false); }}
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

const getEpochByUser = async (account, pairId, epochesList) => {
  let token = [];
  epochesList.map((item) => {
    if (account !== undefined) {
      if (item.id.includes(account.toLowerCase())) {
        const dataList = item.id.split('.');
        if (dataList[0] === pairId) {
          token = item;
        }
      }
    }
  });
  return token;
};

function HistoryDataTable() {
  const {
    address,
  } = useAccount();
  const [modalShow, setModalShow] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState('');
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const [hideDirector, setHideDirector] = React.useState(true);
  const [buyTugData, setBuyTugData] = React.useState();
  const [sucdata, setSucdata] = React.useState();
  const [loading, setLoading] = React.useState();
  const [maticshare, setMaticshare] = React.useState(0);
  const [sandshare, setSandshare] = React.useState(0);
  const [mspayoff, setMspayoff] = React.useState(0);
  const [ethshare, setEthshare] = React.useState(0);
  const [btcshare, setBtcshare] = React.useState(0);
  const [ebpayoff, setEbpayoff] = React.useState(0);
  const [totalpayoff, setTotalpayoff] = React.useState(0);

  const main = async () => {
    try {
      setLoading(true);
      if (localStorage.getItem('walletAddress') != null) {
        // setAccountW(localStorage.getItem("walletAddress"));
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

      //
      const address1 = '0x35378862c4794D55cC36B5bd2ecFC2401699825B'; // tokenRegistryContract
      const abi = '[{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"}],"name":"InvalidPrice","type":"error"},{"inputs":[{"internalType":"uint8","name":"invalidIndex","type":"uint8"}],"name":"InvalidTokenIndex","type":"error"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"SymbolAlreadyRegistered","type":"error"},{"inputs":[{"internalType":"address","name":"chainlinkAddress","type":"address"}],"name":"UnableToReadOraclePriceDuringRegistry","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint8","name":"index","type":"uint8"}],"name":"TokenRegistered","type":"event"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"}],"name":"chainlinkOracles","outputs":[{"internalType":"contract AggregatorV3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"_index","type":"uint8"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint8","name":"decimal","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"_index","type":"uint8"}],"name":"getSymbol","outputs":[{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_symbol","type":"string"}],"name":"getTokenIndex","outputs":[{"internalType":"uint8","name":"index","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"_chainlinkOracle","type":"address"}],"name":"registerToken","outputs":[{"internalType":"uint8","name":"index","type":"uint8"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"","type":"uint8"}],"name":"symbols","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenCount","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
      // eslint-disable-next-line no-eval
      const abiJson = eval(abi);
      const con2Alc = new web3Alchemy.eth.Contract(abiJson, address1);// tokenRegistryContractObj

      // tugPairs
      const { tugPairs } = FAKE_DATA;
      const pairsArry = tugPairs;
      // get upcollected Epochs
      const unCollectEpDataList = FAKE_DATA.pairUsers;

      const pairUsers = unCollectEpDataList;
      let totalData = [];
      let totalCostBasis = 0;
      let totalPayOff = 0;
      const claimList = [];
      let checkCount = 0;

      for (let item = 0; item < pairsArry.length; item++) {
        let unCollectEpochesByAccount = await getEpochByUser(address, pairsArry[item].id, pairUsers);
        if (unCollectEpochesByAccount !== []) {
          unCollectEpochesByAccount = unCollectEpochesByAccount.uncollectedEpochs;
          claimList.push({ pairId: pairsArry[item].id, epochs: unCollectEpochesByAccount });
        }

        const epochList = await getEpochListForTable(address, pairsArry[item].id);

        const token1Symbol = await con2Alc.methods.getSymbol(pairsArry[item].token1Index).call();
        const token0Symbol = await con2Alc.methods.getSymbol(pairsArry[item].token0Index).call();

        const con1Alc = new web3Alchemy.eth.Contract(ABI, pairsArry[item].id);

        let startTime = await con1Alc.methods.startTime().call();
        startTime = Math.round(startTime);
        let tugDuration = await con1Alc.methods.epochDuration().call();
        tugDuration = Math.round(tugDuration);

        const latestEpoch = pairsArry[item].latestClaimableEpoch;
        // if(epochList.length === 0){
        //   checkFlag = true;
        // }
        for (let j = 0; j < epochList.length; j++) {
          checkCount = j;
          var epochNum = epochList[j];
          // get epochEndDate

          const epochEnddate = new Date(startTime * 1000 + tugDuration * epochNum * 1000).toLocaleDateString();

          // get tokenSaresHeld
          const sharedData = await con1Alc.methods.getSharesBalance(epochNum, address).call();

          const token0SharesHeld = sharedData.token0Shares;
          const token1SharesHeld = sharedData.token1Shares;

          // get toeknCostBasis
          let costBasisObj = {};
          if (address !== undefined && address !== null) {
            costBasisObj = await filterList(address, pairsArry[item].id, epochNum);
          }

          const token0CostBasis = costBasisObj.token0Deposits;
          const token1CostBasis = costBasisObj.token1Deposits;

          // get my payOff
          let myPayOff = 0;
          if (epochNum !== (latestEpoch + 1)) {
            myPayOff = await con1Alc.methods.getWinnings(epochNum, address).call();
          }
          // set status
          let status = '';
          const checkStatus = unCollectEpochesByAccount.find((item) => {
            if (item === epochNum) return item;
          });

          if (epochNum === (latestEpoch + 1)) {
            // status = "Ongoing";
            continue;
          } else if (checkStatus !== undefined) {
            status = 'Not Claimed';
          } else {
            status = 'Claimed';
          }

          const totalItem = {
            checkTotal: 0,
            epochNumber: epochNum,
            tugEndDate: epochEnddate,
            token0Symbol,
            token1Symbol,
            token0SharesHeld,
            token1SharesHeld,
            token0CostBasis,
            token1CostBasis,
            myPayOff,
            status,
          };

          totalData.push(totalItem);
          totalCostBasis += parseInt(token0CostBasis) + parseInt(token1CostBasis);

          totalPayOff += parseInt(myPayOff);
        }
      }
      if (checkCount > 0) {
        const ttItem = { checkTotal: 1, totalCostBasis, totalPayOff };
        totalData = [...totalData, ttItem];
        setLoading(false);
      }

      const localData = { expiryTime: moment().add(2, 'hours').unix(), claimData: JSON.stringify(totalData) };
      localStorage.setItem('ClaimData', JSON.stringify(localData));

      setBuyTugData(totalData);

      const sData = await getSuccessData(totalData);

      setMaticshare(sData.maShares);
      setSandshare(sData.saShares);
      setMspayoff(sData.msPOff);
      setEthshare(sData.etShares);
      setBtcshare(sData.btShares);
      setEbpayoff(sData.ebPOff);
      setTotalpayoff(sData.totalPayOff);

      setSucdata(sData);
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    if (address) {
      main();
    }
  }, [address]);

  useEffect(() => {
    if (modalShow) {
      main();
    }
  }, [modalShow]);

  const columns = [
    {
      name: 'Epoch Number',
      selector: (row) => row.epochNumber,
      sortable: true,
    },
    {
      name: 'Tug end Date',
      selector: (row) => row.tugEndDate,
      sortable: true,
      style: {
        div: {
          color: '#9584FF',
        },
      },
    },
    {
      name: 'Tug Pair Token A/Token B',
      selector: (row) => row.pair,
      cell: (row) => {
        if (row.checkTotal === 1) {
          return (
            <span className="tugPairTitle totalPairtStyle">
              TOTAL
            </span>
          );
        }
        if (row.token0Symbol === 'MATIC' && row.token1Symbol === 'SAND') {
          return (
            <span className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <MATICIcon width="1rem" className="iconSvg" />
                  {row.token0Symbol}
                </li>
                <li>
                  <SANDIcon width="1rem" className="iconSvg" />
                  {row.token1Symbol}
                </li>
              </ul>

            </span>
          );
        } if (row.token0Symbol === 'ETH' && row.token1Symbol === 'BTC') {
          return (
            <span className="tugPairTitle">
              <ul className="tugPUL eb">
                <li>
                  <ETHIcon width="1rem" className="iconSvg" />
                  {row.token0Symbol}
                </li>
                <li>
                  <BTCIcon width="1rem" className="iconSvg" />
                  {row.token1Symbol}
                </li>
              </ul>

            </span>
          );
        }
      },
    },
    {
      name: '# of Shares Held',
      selector: (row) => row.token0SharesHeld,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <ul className="sharesHeld">
              <li>
                {row.token0SharesHeld ? row.token0SharesHeld : '-'}
              </li>
              <li>
                {row.token1SharesHeld ? row.token1SharesHeld : '-'}
              </li>
            </ul>
          );
        }
      },
      sortable: true,
    },
    {
      name: 'Cost Basis',
      sortable: true,
      selector: (row) => row.totalCostBasis,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <ul className="costBasis">
              <li>
                {row.token0CostBasis ? `$${row.token0CostBasis}` : '-'}
              </li>
              <li>
                {row.token1CostBasis ? `$${row.token1CostBasis}` : '-'}
              </li>
            </ul>
          );
        }
        return (
          <p className="totalPairtStyle">
            {row.totalCostBasis ? `$${row.totalCostBasis}` : '-'}
          </p>
        );
      },
    },
    {
      name: 'My Payoff',
      selector: (row) => row.myPayOff,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <p className="">
              {row.myPayOff ? `$${row.myPayOff}` : '-'}
            </p>
          );
        }
        return (
          <p className="">
            {row.totalPayOff ? `$${row.totalPayOff}` : '-'}
          </p>
        );
      },
      sortable: true,
    },
    {
      name: '% return',
      sortable: true,

      selector: (row) => row.totalPayOff,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <ul className="returnUL">
              <li hidden={!!row.myPayOff}>
                -
              </li>
              <li hidden={!row.myPayOff} className="">
                <span className="">
                  {(parseInt(row.myPayOff) / (parseInt(row.token0CostBasis) + parseInt(row.token1CostBasis)) * 100).toFixed(2)}
                  %(
                  {row.myPayOff}
                  /
                  {parseInt(row.token0CostBasis) + parseInt(row.token1CostBasis)}
                  )
                </span>
              </li>
            </ul>
          );
        }
        return (
          <p className="totalPayOffAB">
            <span hidden={!!row.totalPayOff}>-</span>
            <span className="" hidden={!row.totalPayOff}>
              {' '}
              {(parseInt(row.totalPayOff) / parseInt(row.totalCostBasis) * 100).toFixed(2)}
              %
            </span>
          </p>
        );
      },
      style: {
        div: {
          color: '#9584FF',
        },
      },
    },
    {
      name: 'Status',
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
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
          );
        }
        return (
          null
        );
      },
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '62px',
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

  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: 'red !important' };
    }
  };

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
            name="Tokens"
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
            name="Commodites"
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
  useEffect(() => {
    if (window.innerWidth < 600) {
      setHideDirector(true);
    }
  }, [setHideDirector]);

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

  useEffect(() => {
    if (address) {
      setHideDirector(true);
    }

    setHideDirector(false);
  }, []);

  return (
    !address ? null
      : (
        <div className="invent-comp py-4">
          <TugClaimSuccesModal
            show={modalShow}
            totaldata={sucdata}
            maticshare={maticshare}
            sandshare={sandshare}
            mspayoff={mspayoff}
            ethshare={ethshare}
            btcshare={btcshare}
            ebpayoff={ebpayoff}
            totalpayoff={totalpayoff}
          // totaldata={{"maShares":1111}}
            onHide={() => setModalShow(false)}
          />
          <Button
            type="button"
            className="collapseheader"
            onClick={() => setHideDirector(!hideDirector)}
          >
            {hideDirector ? 'Show Details' : 'Hide Details'}
          </Button>
          <div className="spinnerTagMain" hidden={!loading}><TailSpin color="#00BFFF" height={80} width={80} /></div>
          <DataTable
            className="dataList"
            noDataComponent="Loading data please wait"
          // title="Contact List"
            columns={columns}
            data={buyTugData}
          // pagination
            customStyles={customStyles}
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
          // selectableRows
            persistTableHead
            getRowStyle={getRowStyle}
          />
        </div>
      )
  );
}

export default HistoryDataTable;
