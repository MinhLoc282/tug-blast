import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from 'react-data-table-component';
import {
  TailSpin,
} from 'react-loader-spinner';
import {
  Button,
  Row,
  Col,
  Container,
  Modal,
  CloseButton,
} from 'react-bootstrap';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { PythHttpClient } from '@pythnetwork/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { BigNumber } from 'bignumber.js';
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import IPythAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import { useAccount } from 'wagmi';
import { ReactComponent as BTCIcon } from '../../assets/images/btc.svg';
import { ReactComponent as BNBIcon } from '../../assets/images/bnb.svg';
import { ReactComponent as ETHIcon } from '../../assets/images/eth.svg';

import { FAKE_DATA } from '../../backend/fakeApi';
import gldLogo from '../../assets/images/gld.png';
import maticLogo from '../../assets/images/matic.png';
import msftLogo from '../../assets/images/microsoft.png';
import tslaLogo from '../../assets/images/tsla.png';
import dogeLogo from '../../assets/images/doge.png';
import { TUGPAIR_ABI } from '../../constant/tugPairAbi';
import { TOKEN_REGISTRY_ABI } from '../../constant/tokenRegistryAbi';
import {
  CONNECTION, PUBLIC_KEY, PYTH_CONTACT_ADDRESS,
  TOKEN_ADDRESS,
  TOKEN_REGISTRY, TUGPAIR_BTC_XAU, TUGPAIR_BTC_XAU_FULL, TUGPAIR_ETH_BTC, TUGPAIR_ETH_BTC_FULL, TUGPAIR_ETH_MSFT,
} from '../../constant';
import { TOKEN_ABI } from '../../constant/tokenAbi';

import { useWeb3Signer } from '../../hooks/ethersHooks';
import { ethers } from 'ethers';

function TokenSuccessModal(props) {
  const {
    buySide, symbols, setModalShow, show, onHide,
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
              <Col xs={12} className="text-center">
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
        <div className="amount-dai">
          <Row className="w-100">
            <Col xs={6}>
              <p className="mb-1">You&apos;ve bought</p>

              <h1 className="mb-0">{parseFloat(localStorage.getItem('buyAmount')).toFixed(3)}</h1>
            </Col>
            <Col xs={6} className="text-end">
              <Button className="synth-winstn global-btn">
                {buySide}
                {' '}
                Side
              </Button>
            </Col>
          </Row>
        </div>
        <div className="amount-dai select-token">
          <Row className="w-100">
            <Col xs={6}>
              <small className="per-dair d-block w-100">
                for Tug Pair
                {symbols[0] === 'BTC' && <BTCIcon width="25px" className="me-2 ethr" />}
                {symbols[0] === 'BNB' && <BNBIcon width="25px" className="me-2 ethr" />}
                {symbols[0] === 'TSLA' && (
                <img
                  src={tslaLogo}
                  className="me-2 ethr"
                  style={{
                    width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                  }}
                  alt=""
                />
                )}

                {symbols[1] === 'ETH' && <ETHIcon width="25px" className="me-2 ethr" />}

                {symbols[1] === 'GOLD' && (
                <img
                  src={gldLogo}
                  className="me-2 ethr"
                  style={{
                    width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                  }}
                  alt=""
                />
                )}

                {symbols[1] === 'MATIC' && (
                <img
                  src={maticLogo}
                  className="me-2 ethr"
                  style={{
                    width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                  }}
                  alt=""
                />
                )}

                {symbols[1] === 'DOGE' && (
                <img
                  src={dogeLogo}
                  className="me-2 ethr"
                  style={{
                    width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                  }}
                  alt=""
                />
                )}
                {symbols[0]}
                {' '}
                {symbols[1]}
              </small>
            </Col>
          </Row>
        </div>
        <div className="buy-div">
          <Button
            className="buy-btn close-purple"
            onClick={() => { setModalShow(false); }}
          >
            CLOSE
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function ButTugModal(props) {
  const {
    symbols, selectedTugId, setTugModal, setBuySide, setModalShow, show, onHide, price,
  } = props;
  const {
    address,
  } = useAccount();
  const web3 = useWeb3Signer();
  const [amount, setAmount] = useState();
  const [dropdownTitle, setDropdownTitle] = useState('Choose side');
  const [sideS, setsideS] = React.useState(-1);
  const [noOfShares, setnoOfShares] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [balance, setBalance] = React.useState('5301.78');
  const [approvedAmount, setApprovedAmount] = React.useState('');
  // const [tokenStyle, setTokenStyle] =

  // const [tugModal, setTugModal] = React.useState(false);
  // const [buySide, setBuySide] = React.useState(false);
  // const [ModalShow, setModalShow] = React.useState(false);

  // setApprove(true)

  const updateAmount = useCallback(async () => {
    try {
      let apAmount;

      if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
        const tokenContact = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const tokenContact = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const tokenContact = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      }

      setApprovedAmount(apAmount);
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  }, [web3, symbols, address, selectedTugId, setApprovedAmount]);

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (address) {
          const tokenContact = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
          const newBalance = await tokenContact.methods.balanceOf(address).call();
          const balanceToWei = web3.utils.fromWei(newBalance);
          const roundBalance = Math.round(Number(balanceToWei) * 1000) / 1000;

          setBalance(roundBalance);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getBalance();
  }, [address, web3]);

  useEffect(() => {
    updateAmount();
  }, [address, selectedTugId, updateAmount]);

  const getShares = useCallback(async (number) => {
    // return;
    if (number === 0 || number === "0") {
      setnoOfShares(0);
      return;
    }
    if (number === undefined || number === null || number === '') { return; }
    if (sideS < 0) {
      return;
    }
    if (!price.btc || !price.eth) {
      return;
    }
    // if (!price.msft || !price.xau) {
    //   return;
    // }

    setnoOfShares('fetching shares...');

    let sharesA;
    let sharesB;

    const numberInWei = ethers.utils.parseUnits(number || 0, 18)

    if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
      let tugPairContact
      if (selectedTugId === TUGPAIR_ETH_BTC) {
        tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);
      } else if (selectedTugId === TUGPAIR_ETH_BTC_FULL) {
        tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC_FULL);
      }

      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 0).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 1).call();
    } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
      const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);

      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 0).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 1).call();
    } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
      let tugPairContact
      if (selectedTugId === TUGPAIR_BTC_XAU) {
        tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);
      } else if (selectedTugId === TUGPAIR_BTC_XAU_FULL) {
        tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU_FULL);
      }

      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 0).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 1).call();
    }

    setnoOfShares(parseFloat(sideS === 0 ? web3.utils.fromWei(sharesA, 'ether') : web3.utils.fromWei(sharesB, 'ether')));
  }, [sideS, price, symbols, setnoOfShares, web3, selectedTugId]);

  useEffect(() => {
    const debouncedGetShares = debounce(getShares, 500);
    debouncedGetShares(amount);
    return () => {
      debouncedGetShares.cancel();
    };
  }, [sideS, amount, getShares]);

  const toggleBtn = async () => {
  };

  const SuccessTug = async () => {
    try {
      if (address === '') {
        toast.error('Please connect the wallet!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        return;
      }
      // checking network
      const chainId = await web3.eth.getChainId();
      if (chainId !== 168587773) {
        toast.error('Please connect the Smart Chain Testnet', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        return;
      }

      if (amount === 0) {
        toast.error('Please ...', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        return;
      }

      setLoading(true);

      localStorage.setItem('buyAmount', noOfShares);

      const tugPairContract = new web3.eth.Contract(TUGPAIR_ABI, selectedTugId);
      const pythEvmContact = new web3.eth.Contract(IPythAbi, PYTH_CONTACT_ADDRESS);

      const connectionEVM = new EvmPriceServiceConnection(
        'https://hermes.pyth.network',
      ); // See Price Service endpoints section below for other endpoints

      let priceUpdateData;

      if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
        const priceIds = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD price id in testnet
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
        ];

        priceUpdateData = await connectionEVM.getPriceFeedsUpdateData(priceIds);
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const priceIds = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // BNB/USD price id in testnet
          '0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1', // MATIC/USD price id in testnet
        ];

        priceUpdateData = await connectionEVM.getPriceFeedsUpdateData(priceIds);
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const priceIds = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
          '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2', // GOLD/USD price id in testnet
        ];

        priceUpdateData = await connectionEVM.getPriceFeedsUpdateData(priceIds);
      }

      const updateFee = await pythEvmContact.methods
        .getUpdateFee(priceUpdateData)
        .call();

      //   const getPrice = await myPythContact.methods
      //   .getPrice(3, priceUpdateData)
      //   .send({ value: updateFee, from: account });

      //   console.log('============getPrice==============', getPrice);

      const approvalAmount = ethers.utils.parseUnits(amount || 0, 18)

      await tugPairContract.methods
        .deposit(approvalAmount, Number(sideS), priceUpdateData)
        .send({ from: address, value: updateFee });

      setLoading(false);
      setAmount(0);
      setnoOfShares(0);
      setTugModal(false);
      setBuySide(symbols[sideS]);
      setModalShow(true);
      toast.success(
        <div>
          <div>{`Bought ${noOfShares.toFixed(3)} ${symbols[sideS]} side shares`}</div>
          <div className="link-text">View on Explorer</div>
        </div>,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          theme: 'dark',
          onClick: () => {},
        },
      );
    } catch (error) {
      if (error === undefined) {
        toast.error('Failed. Please try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } else {
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      }
      setLoading(false);
    }
    setLoading(false);
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
        const tokenContact = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

        const approvalAmount = ethers.utils.parseUnits(amount || 0, 18)

        await tokenContact.methods
          .approve(selectedTugId, approvalAmount)
          .send({ from: address });
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const tokenContact = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

        const approvalAmount = ethers.utils.parseUnits(amount || 0, 18)

        await tokenContact.methods
          .approve(TUGPAIR_ETH_MSFT, approvalAmount)
          .send({ from: address });
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const tokenContact = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

        const approvalAmount = ethers.utils.parseUnits(amount || 0, 18)

        await tokenContact.methods
          .approve(selectedTugId, approvalAmount)
          .send({ from: address });
      }

      setLoading(false);

      updateAmount();
    } catch (error) {
      setLoading(false);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  return (
    <Modal
      show={show}
      size="lg"
      id="g-modal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      onHide={() => { onHide(); }}
    >
      <Modal.Header className="modl-headr w-100 d-block tug">
        {
          loading ? null
            : (
              <Modal.Title id="contained-modal-title-vcenter" className="h5">
                <CloseButton className="clsBtn" variant="white" onClick={() => { setTugModal(false); setAmount(0); setDropdownTitle('Choose side'); setnoOfShares(0); }} />
                <Container>
                  <Row className="w-100 amount-dai-header">
                    <Col xs={4}>
                      <h4>Choose a side</h4>
                    </Col>
                    <Col xs={4}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => { setDropdownTitle(`${symbols[0]} Side`); setsideS(0); getShares(amount); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setsideS(0);
                            setDropdownTitle(`${symbols[0]} Side`);
                          }
                        }}
                        className={`token-val${sideS === 0 ? ' selected' : ''}`}
                      >
                        {symbols[0] === 'BTC' && <BTCIcon width="25px" height="32px" className="me-2 ethr" />}
                        {symbols[0] === 'ETH' && <ETHIcon width="25px" className="me-2 ethr" />}
                        {symbols[0] === 'MSFT' && (
                        <img
                          src={tslaLogo}
                          className="me-2 ethr"
                          style={{
                            width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                          }}
                          alt=""
                        />
                        )}
                        {symbols[0]}
                      </span>
                    </Col>
                    <Col xs={4}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => { setDropdownTitle(`${symbols[1]} Side`); setsideS(1); getShares(amount); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setsideS(1);
                            setDropdownTitle(`${symbols[1]} Side`);
                          }
                        }}
                        className={`token-val${sideS === 1 ? ' selected' : ''}`}
                      >
                        {symbols[1] === 'BTC' && <BTCIcon width="25px" height="32px" className="me-2 ethr" />}
                        {symbols[1] === 'GOLD' && (
                        <img
                          src={gldLogo}
                          className="me-2 ethr"
                          style={{
                            width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                          }}
                          alt=""
                        />
                        )}
                        {symbols[1] === 'MSFT' && (
                        <img
                          src={msftLogo}
                          className="me-2 ethr"
                          style={{
                            width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                          }}
                          alt=""
                        />
                        )}
                        {symbols[1] === 'DOGE' && (
                        <img
                          src={dogeLogo}
                          className="me-2 ethr"
                          style={{
                            width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                          }}
                          alt=""
                        />
                        )}

                        {symbols[1]}
                      </span>
                    </Col>
                  </Row>
                </Container>
              </Modal.Title>
            )
        }
      </Modal.Header>

      <Modal.Body className="p-0">
        {
          loading ? <div className="spinnerTag"><TailSpin color="#00BFFF" height={80} width={80} /></div>
            : (
              <>
                <div className="amount-dai select-token">
                  <Row className="w-100">
                    <Col xs={6}>
                      <p>Amount (WETH)</p>
                      <input
                        className="buy-amount-input"
                        value={amount}
                        type="number"
                        min={0}
                        placeholder="Enter Amount"
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setAmount(e.target.value);
                        }}
                      />
                    </Col>
                    <Col xs={6} className="text-end">
                      <p className="da-blcn">
                        WETH Balance:
                        {' '}
                        {balance}
                      </p>
                      <Button className="dai-balance">
                        <img
                          src="../assets/usdt-logo.png"
                          width="25px"
                          alt="usdt-logo.png"
                        />
                        WETH
                      </Button>
                    </Col>
                  </Row>
                </div>
                <p className="model-arrow-down">
                  <img src="../assets/down1.svg" alt="arrow-down" />
                </p>
                <div className="amount-dai select-token">
                  <Row className="w-100">
                    <Col xs={6}>
                      <p>Number of Shares</p>
                      {typeof noOfShares === 'number' ? <h1>{noOfShares.toFixed(3)}</h1> : (
                        <small className="per-dair d-block w-100">
                          {noOfShares}
                        </small>
                      )}
                    </Col>
                    <Col xs={6}>
                      <Button
                        className="chooseSideBtn"
                        onClick={() => { toggleBtn(); }}
                      >
                        {dropdownTitle}
                      </Button>
                    </Col>
                  </Row>
                </div>
                <div className="buy-div">
                  <div className="modal-buy-app-buttons">
                  {new BigNumber(approvedAmount).comparedTo(new BigNumber(amount).times(new BigNumber(10).pow(18))) < 0 && (
                      <button
                        type="button"
                        onClick={onApprove}
                        className="purple"
                      >
                        Approve
                      </button>
                    )}

                    {new BigNumber(approvedAmount).comparedTo(new BigNumber(amount).times(new BigNumber(10).pow(18))) >= 0 && (
                      <button
                        type="button"
                        onClick={SuccessTug}
                        className="purple"
                      >
                        BUY
                      </button>
                    )}
                  </div>
                </div>
              </>
            )
        }
      </Modal.Body>

      <Modal.Footer className="text-start justify-content-sm-start ps-5" />
    </Modal>
  );
}

function PositionDataTable() {
  const {
    address,
  } = useAccount();
  const web3 = useWeb3Signer();
  const [modalShow, setModalShow] = React.useState(false);
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const [hideDirector, setHideDirector] = React.useState(true);
  const [tugModal, setTugModal] = React.useState(false);
  const [symbols, setSymbols] = React.useState([]);
  const [buySide, setBuySide] = React.useState(0);
  const [totalAPot, setTotalAPot] = React.useState(0);
  const [totalBPot, setTotalBPot] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [buyTugData, setBuyTugData] = React.useState();
  const [selectedTugId, setSelectedTugId] = useState();
  const [price, setPrice] = useState();
  const [[dysYield, hrsYield, minsYield, secsYield], setYieldTime] = useState([3, 0, 0, 0]);
  const [[dysFull, hrsFull, minsFull, secsFull], setFullTime] = useState([1, 0, 0, 0]);

  const tick = () => {
    if (dysYield === 0 && hrsYield === 0 && minsYield === 0 && secsYield === 0) {
      setYieldTime([2, 23, 59, 59]);
    } else {
      setYieldTime(prevTime => {
        const [dys, hrs, mins, secs] = prevTime;
        if (hrs === 0 && mins === 0 && secs === 0) {
          return [dys - 1, 23, 59, 59];
        } else if (mins === 0 && secs === 0) {
          return [dys, hrs - 1, 59, 59];
        } else if (secs === 0) {
          return [dys, hrs, mins - 1, 59];
        } else {
          return [dys, hrs, mins, secs - 1];
        }
      });
    }

    if (dysFull === 0 && hrsFull === 0 && minsFull === 0 && secsFull === 0) {
      setFullTime([0, 23, 59, 59]);
    } else {
      setFullTime(prevTime => {
        const [dys, hrs, mins, secs] = prevTime;
        if (hrs === 0 && mins === 0 && secs === 0) {
          return [dys - 1, 23, 59, 59];
        } else if (mins === 0 && secs === 0) {
          return [dys, hrs - 1, 59, 59];
        } else if (secs === 0) {
          return [dys, hrs, mins - 1, 59];
        } else {
          return [dys, hrs, mins, secs - 1];
        }
      });
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  const main = useCallback(async () => {
    try {
      setLoading(true);

      // =============== getPrice start ==============

      const connection = new Connection(CONNECTION);
      const pythPublicKey = new PublicKey(PUBLIC_KEY);

      const pythClient = new PythHttpClient(connection, pythPublicKey);
      const data = await pythClient.getData();

      const priceSaved = {};

      data.symbols.forEach((symbol) => {
        const priceRes = data.productPrice.get(symbol);

        if (priceRes.price) {
          switch (symbol) {
            case 'Crypto.ETH/USD':
              priceSaved.eth = priceRes.price;
              break;
            case 'Crypto.BTC/USD':
              priceSaved.btc = priceRes.price;
              break;
            case 'Equity.US.MSFT/USD':
              priceSaved.msft = priceRes.price;
              break;
            case 'Metal.XAU/USD':
              priceSaved.xau = priceRes.price;
              break;
            default:
              break;
          }
        }
      });

      setPrice(priceSaved);

      // =============== getPrice end ==============

      const tokenRegistryContact = new web3.eth.Contract(TOKEN_REGISTRY_ABI, TOKEN_REGISTRY);

      const result2 = FAKE_DATA.tugPairs;

      const pairsArry = [FAKE_DATA.tugPairs[0], FAKE_DATA.tugPairs[1],
        FAKE_DATA.tugPairs[3], FAKE_DATA.tugPairs[4]];

      let totalData = await pairsArry.reduce(async (accumulatorPromise, pair, index) => {
        const accumulator = await accumulatorPromise;

        await new Promise(resolve => setTimeout(resolve, 300));

        // setting time and payoff
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, pair.id);
        let startTime = pair.startTime;
        startTime = Math.round(startTime);

        let tugDuration = pair.tugDuration;
        tugDuration = Math.round(tugDuration);

        const currentUserEpoch = await tugPairContact.methods.getUserCurrentEpoch(address).call();

        const currentTimeinEpochSeconds = Math.round(Date.now() / 1000);

        const currentEpoch = await tugPairContact.methods.currentEpoch().call();

        if (currentEpoch !== currentUserEpoch.latestEpoch) {
          return accumulatorPromise;
        }

        let result222 = tugDuration - ((currentTimeinEpochSeconds - startTime) % tugDuration);

        const days = Math.floor(result222 / (3600 * 24));
        const deltaDays = Math.floor(result222 / (3600 * 24)) % (tugDuration / 3600 / 24);
        result222 -= days * 3600 * 24;
        const deltaHrs = Math.floor(result222 / 3600);
        result222 -= deltaHrs * 3600;
        const deltaMnts = Math.floor(result222 / 60);
        result222 -= deltaMnts * 60;
        const timeToExpiry = `${deltaDays}d:${deltaHrs}h:${deltaMnts}m:${result222}s`; // 10/29/2013

        // set Current Time
        if (pair.type === "Yield") {
          setYieldTime([deltaDays, deltaHrs, deltaMnts, result222]);
        } else if (pair.type === "Full") {
          setFullTime([deltaDays, deltaHrs, deltaMnts, result222]);
        }

        const currentMultiplier = 0;

        const EpochData = await tugPairContact.methods.epochData(currentEpoch).call();

        const token0Initialprice = EpochData.token0InitialPrice / 10 ** 8;
        const token1Initialprice = EpochData.token1InitialPrice / 10 ** 8;

        const totalPoolSize = EpochData.totalPot;

        const totalToken0Shares = EpochData.token0SharesIssued;
        const totalToken1Shares = EpochData.token1SharesIssued;

        // ------------testing version
        const sharedData = await tugPairContact
          .methods.getSharesBalance(currentEpoch, address).call();
        let token0SharesHeld = sharedData.token0Shares;
        let token1SharesHeld = sharedData.token1Shares;
        if (address == null || address === undefined) {
          token0SharesHeld = 0;
          token1SharesHeld = 0;
        }

        const token0CostBasis = web3.utils.fromWei(currentUserEpoch.totalDepositA.toString(), 'ether');
        const token1CostBasis = web3.utils.fromWei(currentUserEpoch.totalDepositB.toString(), 'ether');

        // John this is the right one
        let currentPayoffAWin = 0;
        let currentPayoffBWin = 0;
        let currentPayoffALose = 0;
        let currentPayoffBLose = 0;

        if (pair.type === 'Yield') {
          currentPayoffAWin = (((parseFloat(totalPoolSize) * (0.79) * (0.04) * parseFloat(pair.tugDuration / 86400))
          / (parseFloat(totalToken0Shares))) * parseFloat(token0SharesHeld)) || 0;
          currentPayoffBWin = (((parseFloat(totalPoolSize) * (0.79) * (0.04) * parseFloat(pair.tugDuration / 86400))
          / (parseFloat(totalToken1Shares))) * parseFloat(token1SharesHeld)) || 0;
          currentPayoffALose = (((parseFloat(totalPoolSize) * (0.2) * (0.04) * parseFloat(pair.tugDuration / 86400))
          / (parseFloat(totalToken0Shares))) * parseFloat(token0SharesHeld)) || 0;
          currentPayoffBLose = (((parseFloat(totalPoolSize) * (0.2) * (0.04) * parseFloat(pair.tugDuration / 86400))
          / (parseFloat(totalToken1Shares))) * parseFloat(token1SharesHeld)) || 0;
        } else {
          currentPayoffAWin = 0;
          currentPayoffBWin = 0;
          currentPayoffALose = 0;
          currentPayoffBLose = 0;
        }
        //-------------
        // default
        let token1Symbol;
        let token0Symbol;
        const token1SymbolRes = pair.token1Symbol;
        const token0SymbolRes = pair.token0Symbol;

        // ======= setPrice start ==========
        let token1CurrentPrice;
        let token0CurrentPrice;

        if (token1SymbolRes === 'Crypto.BTC/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
          token1Symbol = 'BTC';
          token0Symbol = 'ETH';

          token1CurrentPrice = Number(priceSaved.btc);
          token0CurrentPrice = Number(priceSaved.eth);
        } else if (token1SymbolRes === 'Equity.US.MSFT/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
          token1Symbol = 'MSFT';
          token0Symbol = 'ETH';

          token1CurrentPrice = Number(priceSaved.msft);
          token0CurrentPrice = Number(priceSaved.eth);
        } else if (token1SymbolRes === 'Metal.XAU/USD' && token0SymbolRes === 'Crypto.BTC/USD') {
          token1Symbol = 'GOLD';
          token0Symbol = 'BTC';

          token1CurrentPrice = Number(priceSaved.xau);
          token0CurrentPrice = Number(priceSaved.btc);
        }

        // ======= setPrice end ==========
        const TOKEN1currentPrice = token1CurrentPrice / 10 ** 8;
        const TOKEN0currentPrice = token0CurrentPrice / 10 ** 8;

        const tokenAprice = ((TOKEN0currentPrice - token0Initialprice) / token0Initialprice) * 100;
        const tokenBprice = ((TOKEN1currentPrice - token1Initialprice) / token1Initialprice) * 100;

        const tokenADeposit = (parseFloat(totalToken0Shares)
        / (parseFloat(totalToken0Shares) + parseFloat(totalToken1Shares))) * 100;
        const tokenBDeposit = 100 - tokenADeposit;

        accumulator.push({
          checkTotal: 0,
          token0SharesHeld: parseFloat(web3.utils.fromWei(token0SharesHeld.toString(), 'ether')),
          token1SharesHeld: parseFloat(web3.utils.fromWei(token1SharesHeld.toString(), 'ether')),
          token0CostBasis,
          token1CostBasis,
          currentPayoffAWin: parseFloat(web3.utils.fromWei(currentPayoffAWin.toString(), 'ether')),
          currentPayoffALose: parseFloat(web3.utils.fromWei(currentPayoffALose.toString(), 'ether')),
          currentPayoffBWin: parseFloat(web3.utils.fromWei(currentPayoffBWin.toString(), 'ether')),
          currentPayoffBLose: parseFloat(web3.utils.fromWei(currentPayoffBLose.toString(), 'ether')),
          TOKEN0currentPrice,
          TOKEN1currentPrice,
          totalToken0Shares,
          totalToken1Shares,
          totalPoolSize: web3.utils.fromWei(totalPoolSize.toString(), 'ether'),
          no: index + 1,
          currentEpoch,
          type: pair.type,
          id: pair.id,
          timeToExpiry,
          currentMultiplier,
          tokenAprice,
          tokenBprice,
          token0Symbol,
          token1Symbol,
          tokenADeposit,
          tokenBDeposit,
        });

        return accumulator;
      }, Promise.resolve([]));

      const pairsArry2 = result2;

      let totalCostBasis = 0;
      let totalWinPayOff = 0;
      let totalLosePayOff = 0;
      let totalSharesHeld = 0;

      // totalData = await totalData.map((item) => {
      //   if (item.token0CostBasis === undefined) {
      //     item.token0CostBasis = 0;
      //   }
      //   if (item.token1CostBasis === undefined) {
      //     item.token1CostBasis = 0;
      //   }
      //   if (item.currentPayoffAWin === undefined) {
      //     item.currentPayoffAWin = 0;
      //   }
      //   if (item.currentPayoffBWin === undefined) {
      //     item.currentPayoffBWin = 0;
      //   }
      //   if (item.currentPayoffALose === undefined) {
      //     item.currentPayoffALose = 0;
      //   }
      //   if (item.currentPayoffBLose === undefined) {
      //     item.currentPayoffBLose = 0;
      //   }
      //   totalCostBasis += parseFloat(item.token0CostBasis) + parseFloat(item.token1CostBasis);
      //   totalWinPayOff += parseFloat(item.currentPayoffAWin)
      // + parseFloat(item.currentPayoffBWin);
      //   totalLosePayOff += parseFloat(item.currentPayoffALose)
      // + parseFloat(item.currentPayoffBLose);

      //   const isDataExist = pairsArry2.find((o) => o.id === item.id);

      //   if (isDataExist) {
      //     return {
      //       ...item, priceSynthB: ((parseFloat(isDataExist.totalToken1Deposits)
      //   / parseFloat(isDataExist.totalDeposits)) * 100),
      //     };
      //   }

      //   return { ...item };
      // });

      const updatedTotalData = totalData.map((item) => {
        const newItem = { ...item };

        newItem.token0CostBasis = newItem.token0CostBasis || 0;
        newItem.token1CostBasis = newItem.token1CostBasis || 0;
        newItem.currentPayoffAWin = newItem.currentPayoffAWin || 0;
        newItem.currentPayoffBWin = newItem.currentPayoffBWin || 0;
        newItem.currentPayoffALose = newItem.currentPayoffALose || 0;
        newItem.currentPayoffBLose = newItem.currentPayoffBLose || 0;
        newItem.token0SharesHeld = newItem.token0SharesHeld || 0;
        newItem.token1SharesHeld = newItem.token1SharesHeld || 0;

        // Update totalCostBasis, totalWinPayOff, and totalLosePayOff
        totalCostBasis += parseFloat(newItem.token0CostBasis)
        + parseFloat(newItem.token1CostBasis);
        totalWinPayOff += parseFloat(newItem.currentPayoffAWin)
        + parseFloat(newItem.currentPayoffBWin);
        totalLosePayOff += parseFloat(newItem.currentPayoffALose)
        + parseFloat(newItem.currentPayoffBLose);
        totalSharesHeld += parseFloat(newItem.token0SharesHeld)
        + parseFloat(newItem.token1SharesHeld)

        // Find the corresponding data in pairsArry2
        const isDataExist = pairsArry2.find((o) => o.id === newItem.id);

        // Update priceSynthB if data exists in pairsArry2
        if (isDataExist) {
          newItem.priceSynthB = ((parseFloat(isDataExist.totalToken1Deposits)
          / parseFloat(isDataExist.totalDeposits)) * 100);
        }

        // Return the updated item
        return newItem;
      });

      if (Number.isNaN(totalCostBasis)) {
        totalCostBasis = 0;
      }

      const totalItem = {
        checkTotal: 1, totalCostBasis, totalWinPayOff, totalLosePayOff, totalSharesHeld,
      };
      totalData = [...updatedTotalData, totalItem];

      const localData = { expiryTime: moment().add(2, 'hours').unix(), buyTugData: JSON.stringify(totalData) };
      localStorage.setItem('BuyTugData', JSON.stringify(localData));

      setBuyTugData(totalData);
      setLoading(false);
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  }, [web3, address]);

  const debouncedMain = useCallback(debounce(main, 1000), [main]);

  useEffect(() => {
    if (address) {
      debouncedMain();
    }
  }, [address, web3, debouncedMain]);

  useEffect(() => {
    if (modalShow) {
      debouncedMain();
    }
  }, [modalShow, debouncedMain]);

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.currentEpoch,
      sortable: true,
    },
    {
      name: 'Tug Type',
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: 'Time Left DD:HH:MM:SS',
      selector: (row) => {
        if (row.type === "Yield") {
          return `${dysYield.toString().padStart(2, '0')}:${hrsYield.toString().padStart(2, '0')}:${minsYield.toString().padStart(2, '0')}:${secsYield.toString().padStart(2, '0')}`;
        } else if (row.type === "Full") {
          return `${dysFull.toString().padStart(2, '0')}:${hrsFull.toString().padStart(2, '0')}:${minsFull.toString().padStart(2, '0')}:${secsFull.toString().padStart(2, '0')}`;
        } else {
          return '';
        }
      },
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
            <p className="tugPairTitle totalPairtStyle">
              TOTAL
            </p>
          );
        }
        if (row.token0Symbol === 'ETH' && row.token1Symbol === 'BTC') {
          return (
            <div className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <ETHIcon width="1rem" className="iconSvg" />
                  {row.token0Symbol}

                </li>
                <li>
                  <BTCIcon width="1rem" height="1.5rem" className="iconSvg" />
                  {row.token1Symbol}
                </li>
              </ul>
            </div>
          );
        } if (row.token0Symbol === 'ETH' && row.token1Symbol === 'MSFT') {
          return (
            <div className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <ETHIcon width="1rem" className="iconSvg" />
                  {row.token0Symbol}
                </li>
                <li>
                  <img src={msftLogo} className="iconSvg" style={{ width: '1rem', minWidth: '16px', borderRadius: '100%' }} alt="" />
                  {row.token1Symbol}
                </li>
              </ul>
            </div>
          );
        } if (row.token0Symbol === 'BTC' && row.token1Symbol === 'GOLD') {
          return (
            <div className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <BTCIcon width="1rem" height="1.5rem" className="iconSvg" />
                  {row.token0Symbol}
                </li>
                <li>
                  <img src={gldLogo} className="iconSvg" style={{ width: '16px', minWidth: '16px', borderRadius: '100%' }} alt="" />
                  {row.token1Symbol}
                </li>
              </ul>
            </div>
          );
        }
        return (
          <div className="tugPairTitle">
            <ul className="tugPUL ms">
              <li>
                <img src={tslaLogo} className="iconSvg" style={{ width: '1rem', minWidth: '16px', borderRadius: '100%' }} alt="" />
                {row.token0Symbol}
              </li>
              <li>
                <img src={dogeLogo} className="iconSvg" style={{ width: '1rem', minWidth: '16px', borderRadius: '100%' }} alt="" />
                {row.token1Symbol}
              </li>
            </ul>
          </div>
        );
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
                {row.token0SharesHeld ? row.token0SharesHeld.toFixed(3) : '-'}
              </li>
              <li>
                {row.token1SharesHeld ? row.token1SharesHeld.toFixed(3) : '-'}
              </li>
            </ul>
          );
        }

        return (
          <p className="totalPairtStyle">
            {row.totalSharesHeld.toFixed(3)}
          </p>
        );
      },
      sortable: true,
    },
    {
      name: 'Cost Basis (WETH)',
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
            {row.totalCostBasis}
          </p>
        );
      },

    },
    {
      name: 'Expected Payoff on Successful Tug based on current pool size',
      sortable: true,

      selector: (row) => row.totalWinPayOff,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <ul className="expectedPayOff">
              <li hidden={!!row.token0SharesHeld}>
                -
              </li>
              <li hidden={!row.token0SharesHeld} className="payOffAB">
                <span className="payOffA">
                  {' '}
                  {row.currentPayoffAWin.toFixed(7)}
                  /
                  {' '}
                </span>
                <span className="payOffB">
                  {' '}
                  {row.currentPayoffALose.toFixed(7)}
                </span>
              </li>

              <li hidden={!!row.token1SharesHeld}>
                -
              </li>
              <li hidden={!row.token1SharesHeld} className="payOffAB">
                <span className="payOffA">
                  {' '}
                  {row.currentPayoffBWin.toFixed(7)}
                  /
                  {' '}
                </span>
                <span className="payOffB">
                  {' '}
                  {row.currentPayoffBLose.toFixed(7)}
                </span>
              </li>
            </ul>
          );
        }

        return (
          <p className="totalPayOffAB">
            <span className="payOffA">
              {row.totalWinPayOff.toFixed(7)}
              /
            </span>
            <span className="payOffB">
              {row.totalLosePayOff.toFixed(7)}
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
      name: '',
      selector: (row) => row.action,
      cell: (row) => {
        if (row.checkTotal === 0) {
          return (
            <Button
              className="tug-modelbtn"
              id={row.tugbutton}
              onClick={() => {
                if (address) {
                  setTugModal(true);
                  setSelectedTugId(row.id);
                  setSymbols([row.token0Symbol, row.token1Symbol]);
                  setTotalAPot(row.totalToken0Shares);
                  setTotalBPot(row.totalToken1Shares);
                } else {
                  toast.error('Please connect your wallet.', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                  });
                }
              }}
            >
              TUG
            </Button>
          );
        }

        return '';
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
    return null;
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
          <TokenSuccessModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            buySide={buySide}
            symbols={symbols}
            setModalShow={setModalShow}
          />

          <ButTugModal
            show={tugModal}
            price={price}
            onHide={() => setTugModal(false)}
            totalAPot={totalAPot}
            totalBPot={totalBPot}
            symbols={symbols}
            selectedTugId={selectedTugId}
            setTugModal={setTugModal}
            setBuySide={setBuySide}
            setModalShow={setModalShow}
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

export default PositionDataTable;
