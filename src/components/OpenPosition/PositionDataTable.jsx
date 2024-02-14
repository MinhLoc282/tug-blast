import React, { useState, useEffect } from 'react';
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
import { useEthers } from '@usedapp/core';
import _ from 'lodash';
import Web3 from 'web3';
import moment from 'moment';
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
import { CONNECTION, PUBLIC_KEY, PYTH_CONTACT_ADDRESS, PYTH_SC, TOKEN_REGISTRY, TUGPAIR_BTC_XAU, TUGPAIR_ETH_BTC, TUGPAIR_ETH_MSFT } from '../../constant';
import { PythHttpClient } from '@pythnetwork/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_ABI } from '../../constant/tokenAbi';
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { PYTH_ABI } from '../../constant/pythAbi';
import IPythAbi from "@pythnetwork/pyth-sdk-solidity/abis/IPyth.json";

import { useWeb3Signer } from '../../hooks/ethersHooks';
import { useAccount } from 'wagmi';

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

              <h1 className="mb-0">{localStorage.getItem('buyAmount')}</h1>
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
                {symbols[0] === 'TSLA' && <img
                  src={tslaLogo}
                  className="me-2 ethr"
                  style={{
                    width: '25px', height: '25px', margin: '4px 0', borderRadius: '100%',
                  }}
                  alt=""
                />}

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
  const [noOfShares, setnoOfShares] = React.useState('0');
  const [loading, setLoading] = React.useState(false);
  const [balance, setBalance] = React.useState('5301.78');
  const [approvedAmount, setApprovedAmount] = React.useState('');
  // const [tokenStyle, setTokenStyle] =

  // const [tugModal, setTugModal] = React.useState(false);
  // const [buySide, setBuySide] = React.useState(false);
  // const [ModalShow, setModalShow] = React.useState(false);

  // setApprove(true)

  const updateAmount = async () => {
    try {

      let apAmount;

      if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);
    
        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          //selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress)

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);
    
        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          //selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress)

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);
    
        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          //selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress)

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      }
      setApprovedAmount(apAmount);
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const getBalance = async () => {
    try {

      const newBalance = await web3.eth.getBalance(address);
      const balanceToWei = web3.utils.fromWei(newBalance);
      const roundBalance = Math.round(Number(balanceToWei) * 1000) / 1000;
      setBalance(roundBalance);
    } catch (error) {
    }
  };

  useEffect(() => {
    getBalance();
  }, [address]);

  useEffect(() => {
    updateAmount();
  }, [address, selectedTugId]);

  const getShares = async (amount) => {
    // return;
    if (amount === 0) {
      setnoOfShares('0')
      return;
    }
    if (amount === undefined || amount === null) { return; }
    if (sideS < 0) {
      return;
    }
    if (!price.btc || !price.eth) {
      return;
    }

    setnoOfShares('fetching shares...');

    let sharesA;
    let sharesB;

    if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
      const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);
  
      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(Number(amount), 0, Math.trunc(price.btc), Math.trunc(price.eth)).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(Number(amount), 1, Math.trunc(price.btc), Math.trunc(price.eth)).call();
    } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
      const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);
  
      
      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(Number(amount), 0, Math.round(price.bnb), Math.round(price.matic)).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(Number(amount), 1, Math.round(price.bnb), Math.round(price.matic)).call();
      
    } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
      const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);
  
      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(Number(amount), 0, Math.trunc(price.btc), Math.trunc(price.gld)).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(Number(amount), 1, Math.trunc(price.btc), Math.trunc(price.gld)).call();
    }
    
    setnoOfShares(parseInt(sideS === 0 ? sharesA : sharesB));
  };

  useEffect(() => {
    getShares(amount)
  }, [sideS])

  const debounceFun = _.debounce((amount) => {
    getShares(amount);
  }, 2000);

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
      
      const myPythContact = new web3.eth.Contract(PYTH_ABI, PYTH_SC);
      const pythEvmContact = new web3.eth.Contract(IPythAbi, PYTH_CONTACT_ADDRESS);
      
      const connectionEVM = new EvmPriceServiceConnection(
        "https://hermes.pyth.network"
      ); // See Price Service endpoints section below for other endpoints
        
      let priceUpdateData;

      if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
        const priceIds = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id in testnet
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
        ];

        priceUpdateData = await connectionEVM.getPriceFeedsUpdateData(priceIds);
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const priceIds = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // BNB/USD price id in testnet
          "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1", // MATIC/USD price id in testnet
        ];

        priceUpdateData = await connectionEVM.getPriceFeedsUpdateData(priceIds);
        
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const priceIds = [
          // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in testnet
          "0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2", // GOLD/USD price id in testnet
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
      
      await tugPairContract.methods
        .deposit(Number(amount * 10**9), Number(sideS), priceUpdateData)
        .send({ from: address, value: updateFee, maxPriorityFeePerGas: 10 ** 10, maxFeePerGas: 10 ** 10 });

      setLoading(false);
      setAmount('');
      setnoOfShares('0');
      setTugModal(false);
      setBuySide(symbols[sideS]);
      setModalShow(true);
      toast.success(
        <div>
          <div>{`Bought ${noOfShares} ${symbols[sideS]} side shares`}</div>
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
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);
    
        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          //selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress)

        await tokenContact.methods
          .approve(TUGPAIR_ETH_BTC, amount * 10 ** 9)
          .send({ from: address, maxPriorityFeePerGas: 10 ** 10, maxFeePerGas: 10 ** 10 });
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);
    
        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          //selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress)

        await tokenContact.methods
          .approve(TUGPAIR_ETH_MSFT, amount * 10 ** 9)
          .send({ from: address, maxPriorityFeePerGas: 10 ** 10, maxFeePerGas: 10 ** 10 });
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);
    
        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          //selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress)

        await tokenContact.methods
          .approve(TUGPAIR_BTC_XAU, amount * 10 ** 9)
          .send({ from: address, maxPriorityFeePerGas: 10 ** 10, maxFeePerGas: 10 ** 10 });
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
                <CloseButton className="clsBtn" variant="white" onClick={() => { setTugModal(false); setAmount(0); setDropdownTitle('Choose side'); setnoOfShares('0'); }} />
                <Container>
                  <Row className="w-100 amount-dai-header">
                    <Col xs={4}>
                      <h4>Choose a side</h4>
                    </Col>
                    <Col xs={4}>
                      <span onClick={() => { setDropdownTitle(`${symbols[0]} Side`); setsideS(0); getShares(amount); }} className="token-val">
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
                      <span onClick={() => { setDropdownTitle(`${symbols[1]} Side`); setsideS(1); getShares(amount); }} className="token-val">
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
                      <p>Amount(gwei)</p>
                      <input
                        className="buy-amount-input"
                        value={amount}
                        type="number"
                        min={0}
                        placeholder="Enter Amount"
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // debounce here
                          debounceFun(e.target?.value);
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
                      {typeof noOfShares === 'number' ? <h1>{noOfShares}</h1> : (
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
                    {Number(approvedAmount) < Number(amount) && (
                    <button type="button" onClick={onApprove}>
                      Approve
                    </button>
                    )}

                    {Number(approvedAmount) >= Number(amount) && (
                    <button type="button" onClick={SuccessTug}>
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
  const [days, setDays] = useState(2);
  const [hours, setHours] = useState(0);
  const [minutes, setMintues] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [[dys, hrs, mins, secs], setTime] = useState([days, hours, minutes, seconds]);

  const tick = () => {
    if (dys === 0 && hrs === 0 && mins === 0 && secs === 0) {
      setTime([1, 59, 59, 59]);
    } else if (hrs === 0 && mins === 0 && secs === 0) {
      setTime([dys - 1, 59, 59, 59]);
    } else if (mins === 0 && secs === 0) {
      setTime([dys, hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([dys, hrs, mins - 1, 59]);
    } else {
      setTime([dys, hrs, mins, secs - 1]);
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  const main = async () => {
    try {
      setLoading(true);

      // =============== getPrice start ==============

      const connection = new Connection(CONNECTION);
      const pythPublicKey = new PublicKey(PUBLIC_KEY);

      const pythClient = new PythHttpClient(connection, pythPublicKey);
      const data = await pythClient.getData();

      let priceSaved = {}
      
      for (const symbol of data.symbols) {
        const priceRes = data.productPrice.get(symbol);
        
        if (priceRes.price && symbol === 'Crypto.ETH/USD') {
          priceSaved.eth = priceRes.price
        }
        if (priceRes.price && symbol === 'Crypto.BTC/USD') {
          priceSaved.btc = priceRes.price
        } 
        if (priceRes.price && symbol === 'Equity.US.MSFT/USD') {
          priceSaved.msft = priceRes.price
        }
        if (priceRes.price && symbol === 'Metal.XAU/USD') {
          priceSaved.xau = priceRes.price
        }
      }

      setPrice(priceSaved)

      // =============== getPrice end ==============

      const tokenRegistryContact = new web3.eth.Contract(TOKEN_REGISTRY_ABI, TOKEN_REGISTRY);// tokenRegistryContractObj

      const result2 = FAKE_DATA.tugPairs;

      let pairsArry = [FAKE_DATA.tugPairs[0], FAKE_DATA.tugPairs[2]]
      
      let totalData = [];

      for (let item = 0; item < pairsArry.length; item++) {
        // setting time and payoff
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, pairsArry[item].id);
        let startTime = await tugPairContact.methods.startTime().call();
        startTime = Math.round(startTime);

        const currentUserEpoch = await tugPairContact.methods.getUserCurrentEpoch(address).call();
        let tugDuration = await tugPairContact.methods.epochDuration().call();
        tugDuration = Math.round(tugDuration);
        
        const currentTimeinEpochSeconds = Math.round(Date.now() / 1000);
        
        const currentEpoch = await tugPairContact.methods.currentEpoch().call();
        
        let result222 = tugDuration - (currentTimeinEpochSeconds - startTime) % tugDuration;
        
        const days = Math.floor(result222 / (3600 * 24));
        const deltaDays = Math.floor(result222 / (3600 * 24)) % (tugDuration / 3600 / 24);
        result222 -= days * 3600 * 24;
        const deltaHrs = Math.floor(result222 / 3600);
        result222 -= deltaHrs * 3600;
        const deltaMnts = Math.floor(result222 / 60);
        result222 -= deltaMnts * 60;
        const timeToExpiry = `${deltaDays}d:${deltaHrs}h:${deltaMnts}m:${result222}s`; // 10/29/2013
        
        // set Current Time
        setTime([deltaDays, deltaHrs, deltaMnts, result222]);
        
        const currentMultiplier = 0;
        
        const EpochData = await tugPairContact.methods.epochData(currentEpoch).call();
        
        const token0Initialprice = EpochData.token0InitialPrice / 10 ** 8;
        const token1Initialprice = EpochData.token1InitialPrice / 10 ** 8;
        
        const totalPoolSize = EpochData.totalPot;
        const totalToken0Shares = EpochData.token0SharesIssued;
        const totalToken1Shares = EpochData.token1SharesIssued;
        
        // ------------testing version
        const sharedData = await tugPairContact.methods.getSharesBalance(currentEpoch, address).call();
        let token0SharesHeld = sharedData.token0Shares;
        let token1SharesHeld = sharedData.token1Shares;
        if (address == null || address === undefined) {
          token0SharesHeld = 0;
          token1SharesHeld = 0;
        }
        
        const token0CostBasis = currentUserEpoch.totalDepositA;
        const token1CostBasis = currentUserEpoch.totalDepositB;
        
        // John this is the right one
        const currentPayoffAWin = (((parseInt(totalPoolSize) * (0.79)) / (parseInt(totalToken0Shares))) * parseInt(token0SharesHeld)) || 0;
        const currentPayoffBWin = (((parseInt(totalPoolSize) * (0.79)) / (parseInt(totalToken1Shares))) * parseInt(token1SharesHeld)) || 0;
        const currentPayoffALose = (((parseInt(totalPoolSize) * (0.2)) / (parseInt(totalToken0Shares))) * parseInt(token0SharesHeld)) || 0;
        const currentPayoffBLose = (((parseInt(totalPoolSize) * (0.2)) / (parseInt(totalToken1Shares))) * parseInt(token1SharesHeld)) || 0;
        
        //-------------
        // default
        let token1Symbol;
        let token0Symbol;
        const token1SymbolRes = await tokenRegistryContact.methods.getSymbol(pairsArry[item].token1Index).call();
        const token0SymbolRes = await tokenRegistryContact.methods.getSymbol(pairsArry[item].token0Index).call();


        // ======= setPrice start ==========
        let token1CurrentPrice;
        let token0CurrentPrice;

        if (token1SymbolRes === 'Crypto.BTC/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
          token1Symbol = 'BTC';
          token0Symbol = 'ETH';
          
          token1CurrentPrice = Number(priceSaved.btc)
          token0CurrentPrice = Number(priceSaved.eth)
        } else if (token1SymbolRes === 'Equity.US.MSFT/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
          token1Symbol = 'MSFT';
          token0Symbol = 'ETH';
        
          token1CurrentPrice = Number(priceSaved.msft)
          token0CurrentPrice = Number(priceSaved.eth)
        } else if (token1SymbolRes === 'Metal.XAU/USD' && token0SymbolRes === 'Crypto.BTC/USD') {
          token1Symbol = 'GOLD';
          token0Symbol = 'BTC';

          token1CurrentPrice = Number(priceSaved.xau)
          token0CurrentPrice = Number(priceSaved.btc)
        }

        // ======= setPrice end ==========
        const TOKEN1currentPrice = token1CurrentPrice / 10 ** 8;
        const TOKEN0currentPrice = token0CurrentPrice / 10 ** 8;

        const tokenAprice = ((TOKEN0currentPrice - token0Initialprice) / token0Initialprice) * 100;
        const tokenBprice = ((TOKEN1currentPrice - token1Initialprice) / token1Initialprice) * 100;

        const tokenADeposit = (parseInt(totalToken0Shares) / (parseInt(totalToken0Shares) + parseInt(totalToken1Shares))) * 100;
        const tokenBDeposit = 100 - tokenADeposit;

        totalData = [...totalData, {
          checkTotal: 0,
          token0SharesHeld,
          token1SharesHeld,
          token0CostBasis,
          token1CostBasis,
          currentPayoffAWin,
          currentPayoffALose,
          currentPayoffBWin,
          currentPayoffBLose,
          TOKEN0currentPrice,
          TOKEN1currentPrice,
          totalToken0Shares,
          totalToken1Shares,
          totalPoolSize,
          no: item + 1,
          id: pairsArry[item].id,
          timeToExpiry,
          currentMultiplier,
          tokenAprice,
          tokenBprice,
          token0Symbol: token0Symbol,
          token1Symbol: token1Symbol,
          tokenADeposit,
          tokenBDeposit,
        }];
      }
      const pairsArry2 = result2;

      let totalCostBasis = 0;
      let totalWinPayOff = 0;
      let totalLosePayOff = 0;

      totalData = await totalData.map((item) => {
        if (item.token0CostBasis === undefined) {
          item.token0CostBasis = 0;
        }
        if (item.token1CostBasis === undefined) {
          item.token1CostBasis = 0;
        }
        if (item.currentPayoffAWin === undefined) {
          item.currentPayoffAWin = 0;
        }
        if (item.currentPayoffBWin === undefined) {
          item.currentPayoffBWin = 0;
        }
        if (item.currentPayoffALose === undefined) {
          item.currentPayoffALose = 0;
        }
        if (item.currentPayoffBLose === undefined) {
          item.currentPayoffBLose = 0;
        }
        totalCostBasis += parseInt(item.token0CostBasis) + parseInt(item.token1CostBasis);
        totalWinPayOff += parseFloat(item.currentPayoffAWin) + parseFloat(item.currentPayoffBWin);
        totalLosePayOff += parseFloat(item.currentPayoffALose) + parseFloat(item.currentPayoffBLose);

        const isDataExist = pairsArry2.find((o) => o.id === item.id);

        if (isDataExist) {
          return {
            ...item, priceSynthB: ((parseInt(isDataExist.totalToken1Deposits) / parseInt(isDataExist.totalDeposits)) * 100),
          };
        }

        return { ...item };
      });

      if (Number.isNaN(totalCostBasis)) {
        totalCostBasis = 0;
      }

      const totalItem = {
        checkTotal: 1, totalCostBasis, totalWinPayOff, totalLosePayOff,
      };
      totalData = [...totalData, totalItem];

      const localData = { expiryTime: moment().add(2, 'hours').unix(), buyTugData: JSON.stringify(totalData) };
      localStorage.setItem('BuyTugData', JSON.stringify(localData));

      setBuyTugData(totalData);
      setLoading(false);
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (address) {
      main();
    }
  }, [address, web3]);

  useEffect(() => {
    if (modalShow) {
      main();
    }
  }, [modalShow]);

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.no,
      sortable: true,
    },
    {
      name: 'Time to expiry DD:HH:MM:SS',
      selector: (row) => (row.checkTotal === 1 ? ('') : (`${dys.toString().padStart(2, '0')}:${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)),
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
            <p className="tugPairTitle">
              <ul className="tugPUL ms">
                <li>
                  <ETHIcon width="1rem" className="iconSvg" />
                  {row.token1Symbol}
                  
                </li>
                <li>
                  <BTCIcon width="1rem" height="1.5rem" className="iconSvg" />
                  {row.token0Symbol}
                </li>
              </ul>
            </p>
          );
        } else if (row.token0Symbol === 'ETH' && row.token1Symbol === 'MSFT') {
          return (
            <p className="tugPairTitle">
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
            </p>
          );
        } else if (row.token0Symbol === 'BTC' && row.token1Symbol === 'GOLD') {
          return (
            <p className="tugPairTitle">
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
            </p>
          );
        }
        return (
          <p className="tugPairTitle">
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
          </p>
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
            $
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
                  $
                  {row.currentPayoffAWin.toFixed(2)}
                  /
                  {' '}
                </span>
                <span className="payOffB">
                  {' '}
                  $
                  {row.currentPayoffALose.toFixed(2)}
                </span>
              </li>

              <li hidden={!!row.token1SharesHeld}>
                -
              </li>
              <li hidden={!row.token1SharesHeld} className="payOffAB">
                <span className="payOffA">
                  {' '}
                  $
                  {row.currentPayoffBWin.toFixed(2)}
                  /
                  {' '}
                </span>
                <span className="payOffB">
                  {' '}
                  $
                  {row.currentPayoffBLose.toFixed(2)}
                </span>
              </li>
            </ul>
          );
        }

        return (
          <p className="totalPayOffAB">
            <span className="payOffA">
              $
              {row.totalWinPayOff.toFixed(2)}
              /
            </span>
            <span className="payOffB">
              $
              {row.totalLosePayOff.toFixed(2)}
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
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
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
