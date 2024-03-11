import React, { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from 'react-data-table-component';
import { TailSpin } from 'react-loader-spinner';
import {
  Button,
  Row,
  Col,
  Container,
  Modal,
} from 'react-bootstrap';
import moment from 'moment';
import debounce from 'lodash/debounce';
import IPythAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { useAccount } from 'wagmi';
import { ReactComponent as BTCIcon } from '../../assets/images/btc.svg';
import { ReactComponent as ETHIcon } from '../../assets/images/eth.svg';
import msftLogo from '../../assets/images/microsoft.png';
import gldLogo from '../../assets/images/gld.png';

import { FAKE_DATA } from '../../backend/fakeApi';
import { TUGPAIR_ABI } from '../../constant/tugPairAbi';
import {
  PYTH_CONTACT_ADDRESS, TOKEN_REGISTRY, TUGPAIR_BTC_XAU, TUGPAIR_BTC_XAU_FULL, TUGPAIR_ETH_BTC, TUGPAIR_ETH_BTC_FULL,
} from '../../constant';
import { TOKEN_REGISTRY_ABI } from '../../constant/tokenRegistryAbi';
import { useWeb3Signer } from '../../hooks/ethersHooks';

const getSuccessData = async (totaldata) => {
  try {
    let ethbShares = 0;
    let ebtcShares = 0;
    let btcgShares = 0;
    let bgoldShares = 0;
    let ebPOff = 0;
    let bgPOff = 0;
    let totalPayOff = 0;

    for (let i = 0; i < totaldata.length; i += 1) {
      if (totaldata[i].checkTotal === 0 && totaldata[i].myPayOff !== '' && totaldata[i].status === 'Not Claimed') {
        if (totaldata[i].token0Symbol === 'ETH' && totaldata[i].token1Symbol === 'BTC') {
          ethbShares += parseFloat(totaldata[i].token0SharesHeld);
          ebtcShares += parseFloat(totaldata[i].token1SharesHeld);
          ebPOff += parseFloat(totaldata[i].myPayOff);
        } else if (totaldata[i].token0Symbol === 'BTC' && totaldata[i].token1Symbol === 'GOLD') {
          btcgShares += parseFloat(totaldata[i].token0SharesHeld);
          bgoldShares += parseFloat(totaldata[i].token1SharesHeld);
          bgPOff += parseFloat(totaldata[i].myPayOff);
        }
      }

      if (totaldata[i].checkTotal === 1) {
        totalPayOff = totaldata[i].totalPayOff;
      }
    }

    const tData = {
      ethbShares, ebtcShares, ebPOff, btcgShares, bgoldShares, bgPOff, totalPayOff,
    };
    return tData;
  } catch (e) {
    toast.error(e, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  }

  return null;
};

function TugClaimSuccesModal(props) {
  const {
    show, onHide, btcgshare, bgoldshare,
    bgpayoff, ethbshare, ebtcshare, ebpayoff, totalclaimpayoff, setPageLoad,
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
            You have claimed
            {' '}
            <span className="climsml">
              <br />
              {ethbshare}
              {' '}
              ETH shares &
              {' '}
              {ebtcshare}
              {' '}
              BTC shares
            </span>
            <br />
            {' for '}
            <span className="smal-blu">
              {ebpayoff}
              {' '}
              WETH
            </span>
          </small>
        </div>
        <div className="amount-dai select-token">
          <small className="per-dair d-block w-100">
            You have claimed
            {' '}
            <span className="climsml">
              <br />
              {btcgshare}
              {' '}
              BTC shares &
              {' '}
              {bgoldshare}
              {' '}
              GOLD shares
            </span>
            <br />
            {' for '}
            <span className="smal-blu">
              {bgpayoff}
              {' '}
              WETH
            </span>
          </small>
        </div>
        {/* <div className="text-center">
          <img src="../assets/more.png" alt="more" />
        </div> */}

        <div className="amount-dai" style={{ marginTop: '8px' }}>
          <Row className="w-100">
            <Col sm={6}>
              <small className="mb-1">Total</small>
              <h1 className="mb-0">{totalclaimpayoff}</h1>
            </Col>
            <Col sm={6} className="text-end">
              <Button className="synth-tokenbtn">
                <img
                  src="../assets/usdt-logo.png"
                  width="25px"
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
            onClick={() => { onHide(); localStorage.setItem('showModal', false); setPageLoad(true); }}
          >
            CLOSE
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const claimAll = async (claimList, account, web3) => {
  try {
    let checkEmpty = true;
    for (let i = 0; i < claimList.length; i += 1) {
      if (claimList[i].epochNumber.length !== 0) {
        checkEmpty = false;
      }
    }
    if (checkEmpty) {
      toast.error('There is no claimed data', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    const pythEvmContact = new web3.eth.Contract(IPythAbi, PYTH_CONTACT_ADDRESS);
    const connectionEVM = new EvmPriceServiceConnection(
      'https://hermes.pyth.network',
    ); // See Price Service endpoints section below for other endpoints

    // // ETH - MSFT
    // const priceIds2 = [
    //   '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    // BNB/USD price id in testnet
    //   "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1",
    // MATIC/USD price id in testnet
    // ];

    // // ETH - MSFT
    // const priceUpdateData2 = await connectionEVM.getPriceFeedsUpdateData(priceIds2);

    // // ETH - MSFT
    // const updateFee2 = await pythEvmContact.methods
    // .getUpdateFee(priceUpdateData2)
    // .call();

    const promises = claimList.map(async (claim) => {
      if (claim.pairId === TUGPAIR_ETH_BTC && claim.epochNumber.length !== 0) {
        const ContractTugPair = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);

        // ETH - BTC
        const priceIds1 = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD price id in testnet
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
        ];

        // In order to use Pyth prices in your protocol you need to
        // submit the price update data to Pyth contract in your target
        // chain. `getPriceFeedsUpdateData` creates the update data
        // which can be submitted to your contract. Then your contract should
        // call the Pyth Contract with this data.

        // ETH - BTC
        const priceUpdateData1 = await connectionEVM.getPriceFeedsUpdateData(priceIds1);

        // ETH - BTC
        const updateFee1 = await pythEvmContact.methods
          .getUpdateFee(priceUpdateData1)
          .call();

        await ContractTugPair.methods
          .collectWinnings(claim.epochNumber, priceUpdateData1)
          .send({
            from: account,
            value: updateFee1,
          });
      // eslint-disable-next-line brace-style
      } else if (claim.pairId === TUGPAIR_ETH_BTC_FULL && claim.epochNumber.length !== 0) {
        const ContractTugPair = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC_FULL);

        // ETH - BTC
        const priceIds1 = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD price id in testnet
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
        ];

        // In order to use Pyth prices in your protocol you need to
        // submit the price update data to Pyth contract in your target
        // chain. `getPriceFeedsUpdateData` creates the update data
        // which can be submitted to your contract. Then your contract should
        // call the Pyth Contract with this data.

        // ETH - BTC
        const priceUpdateData1 = await connectionEVM.getPriceFeedsUpdateData(priceIds1);

        // ETH - BTC
        const updateFee1 = await pythEvmContact.methods
          .getUpdateFee(priceUpdateData1)
          .call();

        await ContractTugPair.methods
          .collectWinnings(claim.epochNumber, priceUpdateData1)
          .send({
            from: account,
            value: updateFee1,
          });
      // eslint-disable-next-line brace-style
      }
      // else if (claimList[i].pairId === TUGPAIR_ETH_MSFT
      // && claimList[i].epochNumber.length !== 0) {
      //   const ContractTugPair = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);
      //   await ContractTugPair.methods
      //     .collectWinnings(claimList[i].epochNumber, priceUpdateData2)
      //     .send({
      //       from: account,
      //       value: updateFee2,
      //       maxPriorityFeePerGas: 10 ** 10, maxFeePerGas: 10 ** 10,
      //     });
      // }
      else if (claim.pairId === TUGPAIR_BTC_XAU && claim.epochNumber.length !== 0) {
        const ContractTugPair = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);
        // BTC - XAU
        const priceIds3 = [
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
          '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2', // GOLD/USD price id in testnet
        ];

        // BTC - XAU
        const priceUpdateData3 = await connectionEVM.getPriceFeedsUpdateData(priceIds3);

        // BTC - XAU
        const updateFee3 = await pythEvmContact.methods
          .getUpdateFee(priceUpdateData3)
          .call();

        await ContractTugPair.methods
          .collectWinnings(claim.epochNumber, priceUpdateData3)
          .send({
            from: account,
            value: updateFee3,
          });
      } else if (claim.pairId === TUGPAIR_BTC_XAU_FULL && claim.epochNumber.length !== 0) {
        const ContractTugPair = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU_FULL);
        // BTC - XAU
        const priceIds3 = [
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
          '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2', // GOLD/USD price id in testnet
        ];

        // BTC - XAU
        const priceUpdateData3 = await connectionEVM.getPriceFeedsUpdateData(priceIds3);

        // BTC - XAU
        const updateFee3 = await pythEvmContact.methods
          .getUpdateFee(priceUpdateData3)
          .call();

        await ContractTugPair.methods
          .collectWinnings(claim.epochNumber, priceUpdateData3)
          .send({
            from: account,
            value: updateFee3,
          });
      }
    });

    await Promise.all(promises);

    toast.success('Success!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    // show success modal
  } catch (e) {
    toast.error('Operation failed', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  }
};

function ClaimProceedDataTable() {
  const {
    address,
  } = useAccount();
  const web3 = useWeb3Signer();

  const [modalShow, setModalShow] = React.useState(false);
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const [hideDirector, setHideDirector] = React.useState(true);
  const [buyTugData, setBuyTugData] = React.useState();
  const [sucdata, setSucdata] = React.useState();
  const [loading, setLoading] = React.useState();
  const [ebtcshare, setEBtcshare] = React.useState(0);
  const [bgoldshare, setBGoldshare] = React.useState(0);
  const [ebpayoff, setEBpayoff] = React.useState(0);
  const [ethbshare, setEthBshare] = React.useState(0);
  const [btcgshare, setBtcGshare] = React.useState(0);
  const [bgpayoff, setbgpayoff] = React.useState(0);
  const [totalpayoff, setTotalpayoff] = React.useState(0);
  const [totalclaimpayoff, setTotalClaimPayOff] = React.useState(0);
  const [claimdatalist, setClaimdatalist] = React.useState([]);
  const [pageload, setPageLoad] = React.useState(false);

  const main = useCallback(async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const tokenRegistryContact = new web3.eth.Contract(
        TOKEN_REGISTRY_ABI,
        TOKEN_REGISTRY,
      );// tokenRegistryContractObj

      // tugPairs
      const pairsArry = [FAKE_DATA.tugPairs[0], FAKE_DATA.tugPairs[1],
        FAKE_DATA.tugPairs[3], FAKE_DATA.tugPairs[4]];
      // get upcollected Epochs
      let totalData = [];
      let totalCostBasis = 0;
      let totalPayOff = 0;
      const claimList = [];
      const totalClaimPO = 0;

      const promises = pairsArry.map(async (pair) => {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, pair.id);
        const currentEpoch = await tugPairContact.methods.currentEpoch().call();

        const currentUserEpoch = await tugPairContact.methods.getUserCurrentEpoch(address).call();

        // set status
        let status = '';

        if (Number(currentUserEpoch.latestEpoch) > 0
        && Number(currentUserEpoch.latestEpoch) < Number(currentEpoch)) {
          const resWinning = await tugPairContact
            .methods.getWinnings(Number(currentUserEpoch.latestEpoch), address).call();

          if (Number(resWinning) > 0) {
            status = 'Not Claimed';

            const token1SymbolRes = await tokenRegistryContact
              .methods.getSymbol(pair.token1Index).call();
            const token0SymbolRes = await tokenRegistryContact
              .methods.getSymbol(pair.token0Index).call();

            let token1Symbol;
            let token0Symbol;

            if (token1SymbolRes === 'Crypto.BTC/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
              token1Symbol = 'BTC';
              token0Symbol = 'ETH';
            } else if (token1SymbolRes === 'Equity.US.MSFT/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
              token1Symbol = 'MSFT';
              token0Symbol = 'ETH';
            } else if (token1SymbolRes === 'Metal.XAU/USD' && token0SymbolRes === 'Crypto.BTC/USD') {
              token1Symbol = 'GOLD';
              token0Symbol = 'BTC';
            }

            claimList.push({
              pairId: pair.id,
              epochNumber: [Number(currentUserEpoch.latestEpoch)],
            });

            const epochNum = currentUserEpoch.latestEpoch;
            let tugDuration = pair.tugDuration;
            tugDuration = Math.round(tugDuration);

            const tugEndDate = new Date((pair.startTime + epochNum * tugDuration) * 1000);

            // get tokenSaresHeld
            const sharedData = await tugPairContact
              .methods.getSharesBalance(epochNum, address).call();

            const token0SharesHeld = web3.utils.fromWei(sharedData.token0Shares.toString(), 'ether');
            const token1SharesHeld = web3.utils.fromWei(sharedData.token1Shares.toString(), 'ether');

            const token0CostBasis = web3.utils.fromWei(currentUserEpoch.totalDepositA.toString(), 'ether');
            const token1CostBasis = web3.utils.fromWei(currentUserEpoch.totalDepositB.toString(), 'ether');

            // get my payOff
            const myPayOff = web3.utils.fromWei(resWinning.toString(), 'ether');

            const totalItem = {
              checkTotal: 0,
              epochNumber: epochNum,
              tugEndDate: tugEndDate.toLocaleDateString(),
              type: pair.type,
              token0SharesHeld,
              token1SharesHeld,
              token0CostBasis,
              token1CostBasis,
              myPayOff,
              status,
              token0Symbol,
              token1Symbol,
            };

            totalData.push(totalItem);
            totalCostBasis += parseFloat(token0CostBasis) + parseFloat(token1CostBasis);
            totalCostBasis += 0 + 0;

            totalPayOff += parseFloat(myPayOff);
          }
        }
      });

      await Promise.all(promises);

      const ttItem = { checkTotal: 1, totalCostBasis, totalPayOff };
      totalData = [...totalData, ttItem];
      const localData = { expiryTime: moment().add(2, 'hours').unix(), claimData: JSON.stringify(totalData) };
      localStorage.setItem('ClaimData', JSON.stringify(localData));

      setBuyTugData(totalData);

      const sData = await getSuccessData(totalData);

      setEthBshare(sData.ethbShares);
      setEBtcshare(sData.ebtcShares);
      setEBpayoff(sData.ebPOff);
      setBtcGshare(sData.btcgShares);
      setBGoldshare(sData.bgoldShares);
      setbgpayoff(sData.bgPOff);
      setTotalpayoff(sData.totalPayOff);
      setTotalClaimPayOff(totalClaimPO);
      setSucdata(sData);

      setClaimdatalist(claimList);

      setLoading(false);
    } catch (error) {
      console.log(error);

      if (error.code === -32007) {
        toast.error('Request limit reached', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    }
  }, [web3, address, setLoading, setBuyTugData,
    setEBtcshare, setBGoldshare, setEBpayoff,
    setEthBshare, setBtcGshare, setbgpayoff, setTotalpayoff,
    setTotalClaimPayOff, setSucdata, setClaimdatalist]);

  const debouncedMain = useCallback(debounce(main, 1000), [main]);
  // setApprove(true)
  useEffect(() => {
    if (address && web3) {
      debouncedMain();
    }
  }, [address, web3, debouncedMain]);

  // useEffect(() => {
  //   if (modalShow) {
  //     main();
  //   }
  // }, [modalShow]);

  useEffect(() => {
    if (pageload) {
      debouncedMain();
    }
  }, [pageload, debouncedMain]);

  const columns = [
    {
      name: 'Epoch Number',
      selector: (row) => row.epochNumber,
      sortable: true,
    },
    {
      name: 'Epoch Number',
      selector: (row) => row.type,
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
        if (row.token0Symbol === 'ETH' && row.token1Symbol === 'BTC') {
          return (
            <span className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <ETHIcon width="1rem" height="1rem" className="iconSvg" />
                  {row.token0Symbol}
                </li>
                <li>
                  <BTCIcon width="1rem" height="1rem" className="iconSvg " />
                  {row.token1Symbol}
                </li>
              </ul>

            </span>
          );
        } if (row.token0Symbol === 'ETH' && row.token1Symbol === 'MSFT') {
          return (
            <span className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <ETHIcon width="1rem" height="1rem" className="iconSvg" />
                  {row.token0Symbol}
                </li>
                <li>
                  <img src={msftLogo} className="iconSvg" style={{ width: '1rem', height: '1rem', borderRadius: '100%' }} alt="" />
                  {row.token1Symbol}
                </li>
              </ul>

            </span>
          );
        } if (row.token0Symbol === 'BTC' && row.token1Symbol === 'GOLD') {
          return (
            <span className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <BTCIcon width="1rem" height="1rem" className="iconSvg " />
                  {row.token0Symbol}
                </li>
                <li>
                  <img src={gldLogo} className="iconSvg" style={{ width: '1rem', height: '1rem', borderRadius: '100%' }} alt="" />
                  {row.token1Symbol}
                </li>
              </ul>

            </span>
          );
        }

        return null;
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

        return null;
      },
      sortable: true,
    },
    {
      name: 'Cost Basis(WETH)',
      sortable: true,
      selector: (row) => row.totalCostBasis,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <ul className="costBasis">
              <li>
                {row.token0CostBasis ? `${row.token0CostBasis}` : '-'}
              </li>
              <li>
                {row.token1CostBasis ? `${row.token1CostBasis}` : '-'}
              </li>
            </ul>
          );
        }
        return (
          <p className="totalPairtStyle">
            {row.totalCostBasis ? `${row.totalCostBasis}` : '-'}
          </p>
        );
      },
    },
    {
      name: 'My Payoff(WETH)',
      selector: (row) => row.myPayOff,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <p className="">
              {row.myPayOff ? `${row.myPayOff}` : '-'}
            </p>
          );
        }
        return (
          <p className="">
            {row.totalPayOff ? `${row.totalPayOff}` : '-'}
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
                  {((parseFloat(row.myPayOff)
                  / (parseFloat(row.token0CostBasis)
                  + parseFloat(row.token1CostBasis))) * 100).toFixed(2)}
                  %
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
              {((parseFloat(row.totalPayOff) / parseFloat(row.totalCostBasis)) * 100).toFixed(2)}
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
              id={row.epochNumber}
            >
              {row.status}
            </Button>
          );
        }
        return (
          <Button
            className="status-tug"
            id="claimAll"
            onClick={() => {
              claimAll(claimdatalist, address, web3).then((result) => {
                if (result) {
                  setModalShow(true);
                }
              });
            }}
          >
            CLAIM ALL
          </Button>
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

    return null;
  };

  function FilterComponent() {
    return (
      <>

      </>
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
  }, [address]);

  return (
    !address ? null
      : (
        <div className="invent-comp py-4">
          <TugClaimSuccesModal
            show={modalShow}
            totaldata={sucdata}
            ebtcshare={ebtcshare}
            bgoldshare={bgoldshare}
            ethbshare={ethbshare}
            btcgshare={btcgshare}
            bgpayoff={bgpayoff}
            ebpayoff={ebpayoff}
            totalpayoff={totalpayoff}
            totalclaimpayoff={totalclaimpayoff}
            setPageLoad={setPageLoad}
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
            columns={columns}
            data={buyTugData}
            customStyles={customStyles}
            paginationResetDefaultPage={resetPaginationToggle}
            // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            getRowStyle={getRowStyle}
          />
        </div>
      )
  );
}

export default ClaimProceedDataTable;
