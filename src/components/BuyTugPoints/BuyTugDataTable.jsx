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
import _ from 'lodash';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { PythHttpClient } from '@pythnetwork/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { BigNumber } from 'bignumber.js';
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import IPythAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import { useAccount } from 'wagmi';
import { ReactComponent as BTCIcon } from '../../assets/images/btc.svg';
// import { ReactComponent as BNBIcon } from '../../assets/images/bnb.svg';
import { ReactComponent as ETHIcon } from '../../assets/images/eth.svg';
import { ReactComponent as LoadingIcon } from '../../assets/images/blue-loader.svg';
import { ReactComponent as SubmittedIcon } from '../../assets/images/submitted.svg';

import {
  setPositionCount, decreasePending,
} from '../../slice/slice';
import { FAKE_DATA } from '../../backend/fakeApi';
import gldLogo from '../../assets/images/gld.png';
// import maticLogo from '../../assets/images/matic.png';
import msftLogo from '../../assets/images/microsoft.png';
import tslaLogo from '../../assets/images/tsla.png';
import dogeLogo from '../../assets/images/doge.png';
import {
  CONNECTION, PUBLIC_KEY, PYTH_CONTACT_ADDRESS,
  TOKEN_REGISTRY, TUGPAIR_BTC_XAU, TUGPAIR_ETH_BTC, TUGPAIR_ETH_MSFT,
} from '../../constant';
import { TOKEN_REGISTRY_ABI } from '../../constant/tokenRegistryAbi';
import { TUGPAIR_ABI } from '../../constant/tugPairAbi';
// import { PYTH_ABI } from '../../constant/pythAbi';
import { TOKEN_ABI } from '../../constant/tokenAbi';
import { useWeb3Signer } from '../../hooks/ethersHooks';

function TokenSuccessModal(props) {
  const dispatch = useDispatch();

  const positionCount = useSelector((state) => state.counter.positionCount);

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
            <Col xs={12}>
              <small className="per-dair d-block w-100">
                for Tug Pair
                {' '}
                {/* <img
                  src="../assets/usdt-logo.png"
                  width="25px"
                  className="me-2"
                  alt="ETH"
                /> */}
                {symbols[0] === 'BTC' && <BTCIcon width="25px" className="me-2 ethr" />}
                {symbols[0] === 'ETH' && <ETHIcon width="25px" className="me-2 ethr" />}

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
            onClick={() => { setModalShow(false); dispatch(setPositionCount(positionCount + 1)); }}
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
    symbols,
    selectedTugId, setTugModal, setBuySide, setModalShow, show, onHide, price,
  } = props;
  const {
    address,
  } = useAccount();
  const [amount, setAmount] = useState(0);
  const [dropdownTitle, setDropdownTitle] = useState('Choose side');
  const [sideS, setsideS] = React.useState(-1);
  const [noOfShares, setnoOfShares] = React.useState('0');
  const [loading, setLoading] = React.useState(false);
  const [hash, setHash] = React.useState('');
  const [balance, setBalance] = React.useState('5301.78');
  const [approvedAmount, setApprovedAmount] = React.useState(0);
  const dispatch = useDispatch();
  const web3 = useWeb3Signer();

  const updateAmount = useCallback(async () => {
    try {
      let apAmount;

      if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);

        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);

        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

        apAmount = await tokenContact.methods.allowance(address, selectedTugId).call();
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);

        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

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
          const tokenContact = new web3.eth.Contract(TOKEN_ABI, '0x4200000000000000000000000000000000000023');
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
    if (number === 0) {
      setnoOfShares('0');
      return;
    }
    if (number === undefined || number === null) { return; }
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

    const numberBigNum = new BigNumber(number || 0);
    const numberInWei = numberBigNum.times(new BigNumber(10).pow(18));

    if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
      const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);

      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 0).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 1).call();
    } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
      const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);

      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 0).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 1).call();
    } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
      const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);

      sharesA = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 0).call();
      sharesB = await tugPairContact.methods.getQtyOfSharesToIssue(numberInWei.toString(), 1).call();
    }

    setnoOfShares(parseFloat(sideS === 0 ? web3.utils.fromWei(sharesA, 'ether') : web3.utils.fromWei(sharesB, 'ether')));
  }, [sideS, price, symbols, setnoOfShares, web3]);

  useEffect(() => {
    getShares(amount);
  }, [sideS, amount, getShares]);

  const debounceFun = _.debounce((number) => {
    getShares(number);
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
          '0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1', // MSFT/USD price id in testnet
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

      const amountBigNum = new BigNumber(amount || 0);
      const approvalAmount = amountBigNum.times(new BigNumber(10).pow(18));

      await tugPairContract.methods
        .deposit(approvalAmount, Number(sideS), priceUpdateData)
        .send({ from: address, value: updateFee });

      dispatch(decreasePending());
      setHash('');
      setLoading(false);
      setAmount(0);
      setnoOfShares(0);
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
          onClick: () => {
            // window.open(`https://mumbai.polygonscan.com/tx/${tempHash}`, '_blank');
          },
        },
      );
    } catch (error) {
      console.log(error);
      if (error === undefined) {
        toast.error('Failed. Please try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } else {
        toast.error(error.message, {
          // toast.error("Please approve token or update limit", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      }

      setLoading(false);
    }
    setLoading(false);
    setHash('');
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      if (symbols[0] === 'ETH' && symbols[1] === 'BTC') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_BTC);

        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          // selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

        const amountBigNum = new BigNumber(amount);
        const approvalAmount = amountBigNum.times(new BigNumber(10).pow(18));

        await tokenContact.methods
          .approve(TUGPAIR_ETH_BTC, approvalAmount)
          .send({ from: address });
      } else if (symbols[0] === 'ETH' && symbols[1] === 'MSFT') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_ETH_MSFT);

        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          // selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

        const amountBigNum = new BigNumber(amount);
        const approvalAmount = amountBigNum.times(new BigNumber(10).pow(18));

        await tokenContact.methods
          .approve(TUGPAIR_ETH_MSFT, approvalAmount)
          .send({ from: address });
      } else if (symbols[0] === 'BTC' && symbols[1] === 'GOLD') {
        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, TUGPAIR_BTC_XAU);

        const tokenAddress = await tugPairContact.methods
          .depositToken()
          .call();
          // selectedTugId, amount > 100000 ? amount : 100000

        const tokenContact = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

        const amountBigNum = new BigNumber(amount);
        const approvalAmount = amountBigNum.times(new BigNumber(10).pow(18));

        await tokenContact.methods
          .approve(TUGPAIR_BTC_XAU, approvalAmount)
          .send({ from: address });
      }

      setLoading(false);

      updateAmount();
    } catch (error) {
      setLoading(false);

      console.log(error);

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
      dialogClassName={loading ? 'modal-loading' : ''}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      onHide={() => { onHide(); setHash(''); setLoading(false); }}
    >
      <Modal.Header className="modl-headr w-100 d-block tug">
        {
          loading ? null
            : (
              <Modal.Title id="contained-modal-title-vcenter" className="h5">
                <CloseButton className="clsBtn" variant="white" onClick={() => { setTugModal(false); setAmount(0); setDropdownTitle('Choose side'); setnoOfShares(0); setsideS(-1); }} />
                <Container>
                  <Row className="w-100 amount-dai-header">
                    <Col xs={4}>
                      <h4>Choose a side</h4>
                    </Col>
                    <Col xs={4}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => { setsideS(0); setDropdownTitle(`${symbols[0]} Side`); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setsideS(0);
                            setDropdownTitle(`${symbols[0]} Side`);
                          }
                        }}
                        className="token-val"
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
                        onClick={() => { setsideS(1); setDropdownTitle(`${symbols[1]} Side`); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setsideS(1);
                            setDropdownTitle(`${symbols[1]} Side`);
                          }
                        }}
                        className="token-val"
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
          hash
            ? (
              <div className="submitted-body">
                <div className="submitted-wrapper">
                  <SubmittedIcon />
                </div>

                <div className="submitted-content">
                  <div>Transaction Submitted</div>

                  <a target="_blank" rel="noopener noreferrer" href={`https://mumbai.polygonscan.com/tx/${hash}`}>View on Explorer</a>

                  <button
                    type="button"
                    onClick={() => {
                      setTugModal(false);
                      setTimeout(() => {
                        setHash('');
                        setLoading(false);
                      }, 200);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : loading
              ? (
                <div className="loading-body">
                  <div className="loading-wrapper">
                    <LoadingIcon className="loading-icon" />
                  </div>

                  <div className="loading-content">
                    <div>Waiting For Confirmation</div>

                    {BigNumber(approvedAmount) ? <div>{`Swapping ${parseFloat(amount)} WETH for ${noOfShares} of shares for the ${dropdownTitle}`}</div> : 'Approving WETH for Tug Finance'}

                    <div>Confirm this transaction in your wallet</div>
                  </div>
                </div>
              )
              : (
                <>
                  <div className="amount-dai select-token">
                    <Row className="w-100">
                      <Col xs={6}>
                        <p>Amount(ether)</p>

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
                      {BigNumber(approvedAmount) < BigNumber(amount) && (
                      <button
                        type="button"
                        onClick={onApprove}
                      >
                        Approve
                      </button>
                      )}

                      {BigNumber(approvedAmount) >= BigNumber(amount) && (
                      <button
                        type="button"
                        onClick={SuccessTug}
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

function BuyTugDataTable() {
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
  const [totalPoolSizeM, setTotalPoolSizeM] = React.useState(0);
  const [totalAPot, setTotalAPot] = React.useState(0);
  const [totalBPot, setTotalBPot] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [buyTugData, setBuyTugData] = React.useState();
  const [selectedTugId, setSelectedTugId] = useState();
  const [curMultiplier, setCurMultiplier] = useState(0);
  const [tugDur, setTugDur] = useState();
  const [price, setPrice] = useState();
  const [[dys, hrs, mins, secs], setTime] = useState([3, 0, 0, 0]);

  const tick = () => {
    if (dys === 0 && hrs === 0 && mins === 0 && secs === 0) {
      setTime([2, 59, 59, 59]);
    } else if (hrs === 0 && mins === 0 && secs === 0) {
      setTime([dys - 1, 59, 59, 59]);
    } else if (mins === 0 && secs === 0) {
      setTime([dys, hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([dys, hrs, mins - 1, 59]);
    } else {
      setTime([dys, hrs, mins, secs - 1]);
    }

    const curExpTime = (((dys * 24 + hrs) * 60 + mins) * 60 + secs);
    const cmp = (curExpTime / tugDur) * 2;

    const threshold = 0.001;
    if (Math.abs(cmp - curMultiplier) >= threshold) {
        setCurMultiplier(cmp);
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);

    return () => clearInterval(timerId);
  });

  const fetchPriceData = async () => {
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

    return priceSaved;
  };

  const calculateCurrentPayoffs = (totalPoolSize, totalToken0Shares, sharesForOneDai0, totalToken1Shares, sharesForOneDai1, curMultiplier) => {
    const dailyYieldPerTokenA = 0.04 * (tugDur / 86400) * totalPoolSize * 0.79;

    const currentPayoffA = (dailyYieldPerTokenA / (parseFloat(totalToken0Shares) + parseFloat(sharesForOneDai0))) * curMultiplier || 0;
    const currentPayoffB = (dailyYieldPerTokenA / (parseFloat(totalToken1Shares) + parseFloat(sharesForOneDai1))) * curMultiplier || 0;

    return { currentPayoffA, currentPayoffB };
  };

  const main = useCallback(async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const priceSaved = await fetchPriceData();

      // =============== getPrice end ==============

      const tokenRegistryContact = new web3.eth.Contract(TOKEN_REGISTRY_ABI, TOKEN_REGISTRY);

      // let pairsArry = [FAKE_DATA.tugPairs[0], FAKE_DATA.tugPairs[1], FAKE_DATA.tugPairs[2]]
      const pairsArry = [FAKE_DATA.tugPairs[0], FAKE_DATA.tugPairs[1],
        FAKE_DATA.tugPairs[3], FAKE_DATA.tugPairs[4]];

      const totalData = await pairsArry.reduce(async (accumulatorPromise, pair, index) => {
        const accumulator = await accumulatorPromise;

        await new Promise(resolve => setTimeout(resolve, 300));

        const tugPairContact = new web3.eth.Contract(TUGPAIR_ABI, pair.id);
        let startTime = pair.startTime;
        startTime = Math.round(startTime);

        let tugDuration = pair.tugDuration;
        tugDuration = Math.round(tugDuration);

        setTugDur(tugDuration);

        const currentTimeinEpochSeconds = Math.round(Date.now() / 1000);

        const currentEpoch = await tugPairContact.methods.currentEpoch().call();

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
        setTime([deltaDays, deltaHrs, deltaMnts, result222]);

        const EpochData = await tugPairContact.methods.epochData(currentEpoch).call();

        const token0Initialprice = EpochData.token0InitialPrice / 10 ** 26;
        const token1Initialprice = EpochData.token1InitialPrice / 10 ** 26;

        const totalPoolSize = EpochData.totalPot;

        const totalToken0Shares = EpochData.token0SharesIssued;
        const totalToken1Shares = EpochData.token1SharesIssued;

        // default
        let token1Symbol;
        let token0Symbol;

        const token1SymbolRes = await tokenRegistryContact
            .methods.getSymbol(pair.token1Index).call();
        const token0SymbolRes = await tokenRegistryContact
            .methods.getSymbol(pair.token0Index).call();

        // QtyOfShareToIssue
        let sharesForOneDai0;
        let sharesForOneDai1;

        let token1CurrentPrice;
        let token0CurrentPrice;

        if (token1SymbolRes === 'Crypto.BTC/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
            token1Symbol = 'BTC';
            token0Symbol = 'ETH';

            sharesForOneDai0 = await tugPairContact.methods.getQtyOfSharesToIssue(10 ** 8, 0).call();
            sharesForOneDai1 = await tugPairContact.methods.getQtyOfSharesToIssue(10 ** 8, 1).call();

            token1CurrentPrice = Number(priceSaved.btc);
            token0CurrentPrice = Number(priceSaved.eth);
        } else if (token1SymbolRes === 'Equity.US.MSFT/USD' && token0SymbolRes === 'Crypto.ETH/USD') {
            token1Symbol = 'MSFT';
            token0Symbol = 'ETH';

            sharesForOneDai0 = await tugPairContact.methods.getQtyOfSharesToIssue(10 ** 8, 0).call();
            sharesForOneDai1 = await tugPairContact.methods.getQtyOfSharesToIssue(10 ** 8, 1).call();

            token1CurrentPrice = Number(priceSaved.msft);
            token0CurrentPrice = Number(priceSaved.eth);
        } else if (token1SymbolRes === 'Metal.XAU/USD' && token0SymbolRes === 'Crypto.BTC/USD') {
            token1Symbol = 'GOLD';
            token0Symbol = 'BTC';

            sharesForOneDai0 = await tugPairContact.methods.getQtyOfSharesToIssue(10 ** 8, 0).call();
            sharesForOneDai1 = await tugPairContact.methods.getQtyOfSharesToIssue(10 ** 8, 1).call();

            token1CurrentPrice = Number(priceSaved.xau);
            token0CurrentPrice = Number(priceSaved.btc);
        }

        const TOKEN1currentPrice = token1CurrentPrice / 10 ** 8;
        const TOKEN0currentPrice = token0CurrentPrice / 10 ** 8;

        const tokenAprice = ((TOKEN0currentPrice - token0Initialprice) / token0Initialprice) * 100;
        const tokenBprice = ((TOKEN1currentPrice - token1Initialprice) / token1Initialprice) * 100;

        let currentPayoffA = 0;
        let currentPayoffB = 0;

        if (pair.type === 'Yield') {
          const payoffs = calculateCurrentPayoffs(totalPoolSize, totalToken0Shares, sharesForOneDai0, totalToken1Shares, sharesForOneDai1, curMultiplier);
          currentPayoffA = payoffs.currentPayoffA;
          currentPayoffB = payoffs.currentPayoffB;
        } else {
          currentPayoffA = (((parseFloat(totalPoolSize) * (0.79))
            / (parseFloat(totalToken0Shares) + parseFloat(sharesForOneDai0)))
            * parseFloat(sharesForOneDai0)) || 0;

          currentPayoffB = (((parseFloat(totalPoolSize) * (0.79))
            / (parseFloat(totalToken1Shares) + parseFloat(sharesForOneDai1)))
            * parseFloat(sharesForOneDai1)) || 0;
        }


        let tokenADeposit = (parseFloat(totalToken0Shares)
            / (parseFloat(totalToken0Shares) + parseFloat(totalToken1Shares))) * 100;
        let tokenBDeposit = (parseFloat(totalToken1Shares)
            / (parseFloat(totalToken0Shares) + parseFloat(totalToken1Shares))) * 100;

        if (totalToken0Shares === '0') {
            tokenADeposit = 0;
        } else {
            tokenADeposit = tokenADeposit.toFixed(2);
        }
        if (totalToken1Shares === '0') {
            tokenBDeposit = 0;
        } else {
            tokenBDeposit = tokenBDeposit.toFixed(2);
        }

        const btnFlag = false;

        const colorFlag = parseFloat(tokenAprice) >= parseFloat(tokenBprice);

        accumulator.push({
            currentPayoffA,
            currentPayoffB,
            TOKEN0currentPrice,
            TOKEN1currentPrice,
            totalToken0Shares,
            totalToken1Shares,
            totalPoolSize: web3.utils.fromWei(totalPoolSize.toString(), 'gwei'),
            no: index + 1,
            type: pair.type,
            id: pair.id,
            timeToExpiry,
            currentMultiplier: curMultiplier || 0,
            tokenAprice,
            tokenBprice,
            priceSynthA: ((parseFloat(pair.totalToken0Deposits)
                / parseFloat(pair.totalDeposits)) * 100),
            priceSynthB: ((parseFloat(pair.totalToken1Deposits)
                / parseFloat(pair.totalDeposits)) * 100),
            token0Symbol,
            token1Symbol,
            tokenADeposit,
            tokenBDeposit,
            sharesForOneDai0,
            sharesForOneDai1,
            btnFlag,
            colorFlag,
        });

        return accumulator;
    }, Promise.resolve([]));

      const localData = { expiryTime: moment().add(2, 'hours').unix(), buyTugData: JSON.stringify(totalData) };

      localStorage.setItem('BuyTugData', JSON.stringify(localData));

      setBuyTugData(totalData);
      setLoading(false);
    } catch (error) {
      console.log('erorrrrrrrrr', error);

      if (error.code === -32007) {
        toast.error('Request limit reached', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    }
  }, [web3]);

  const debouncedMain = useCallback(debounce(main, 1000), [main]);

  useEffect(() => {
    const delayedUpdate = debounce(() => {
        if (curMultiplier && buyTugData && tugDur) {
            const updatedData = buyTugData.map(item => {
                const totalPoolBigNum = new BigNumber(item.totalPoolSize);
                const totalPoolSize = totalPoolBigNum.times(new BigNumber(10).pow(9));
                const payoffs = calculateCurrentPayoffs(
                    totalPoolSize,
                    item.totalToken0Shares,
                    item.sharesForOneDai0,
                    item.totalToken1Shares,
                    item.sharesForOneDai1,
                    curMultiplier
                );

                return {
                    ...item,
                    currentPayoffA: payoffs.currentPayoffA,
                    currentPayoffB: payoffs.currentPayoffB
                };
            });
            setBuyTugData(updatedData);
        }
    }, 1000);

    delayedUpdate();

    return () => {
        delayedUpdate.cancel();
    };
  }, [curMultiplier, tugDur]);


  useEffect(() => {
    if (
      dys === 3
      && hrs === 0
      && mins === 0
      && secs === 0
    ) {
      debouncedMain();
    }
  }, [dys, hrs, mins, secs, debouncedMain]);

  useEffect(() => {
    if (address && web3) {
      debouncedMain();
    }
  }, [address, web3, debouncedMain]);

  useEffect(() => {
    if (modalShow && address) {
      debouncedMain();
    }
  }, [modalShow, address, debouncedMain]);

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.no,
      sortable: true,
    },
    {
      name: 'Tug Type',
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: 'Tug Pair Token A/Token B',
      selector: (row) => row.pair,
      cell: (row) => {
        if (row.token0Symbol === 'ETH' && row.token1Symbol === 'BTC') {
          return (
            <div className="tugpairsGroup">
              <span className="tugpairsIcon">
                <ETHIcon width="1rem" className="iconSvg" />
                <BTCIcon width="1rem" className="iconSvg btcIcon" />
              </span>
              <span className="tugPairTitle">
                {row.token0Symbol}
                /
                {row.token1Symbol}
              </span>
            </div>
          );
        } if (row.token0Symbol === 'ETH' && row.token1Symbol === 'MSFT') {
          return (
            <div className="tugpairsGroup">
              <span className="tugpairsIcon">
                <ETHIcon width="1rem" className="iconSvg" />
                <img src={msftLogo} className="iconSvg btcIcon" style={{ width: '1rem', top: '9px', borderRadius: '100%' }} alt="" />
              </span>
              <span className="tugPairTitle">
                {row.token0Symbol}
                /
                {row.token1Symbol}
              </span>
            </div>
          );
        } if (row.token0Symbol === 'BTC' && row.token1Symbol === 'GOLD') {
          return (
            <div className="tugpairsGroup">
              <span className="tugpairsIcon">
                <BTCIcon width="1rem" className="iconSvg " />
                <img src={gldLogo} className="iconSvg btcIcon" style={{ width: '1rem', marginTop: '40px', borderRadius: '100%' }} alt="" />
              </span>
              <span className="tugPairTitle">
                {row.token0Symbol}
                /
                {row.token1Symbol}
              </span>
            </div>
          );
        }
        return (
          <div className="tugpairsGroup">
            <span className="tugpairsIcon">
              <img src={tslaLogo} className="iconSvg" style={{ width: '1rem', borderRadius: '100%' }} alt="" />
              <img src={dogeLogo} className="iconSvg btcIcon" style={{ width: '1rem', marginTop: '18px', borderRadius: '100%' }} alt="" />
            </span>
            <span className="tugPairTitle">
              {row.token0Symbol}
              /
              {row.token1Symbol}
            </span>
          </div>
        );
      },
    },

    {
      name: 'Time to expiry DD:HH:MM:SS',
      selector: () => `${dys.toString().padStart(2, '0')}:${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      sortable: true,
      style: {
        div: {
          color: '#9584FF',
        },
      },
    },
    {
      name: 'Current multiplier',
      selector: () => `${curMultiplier?.toFixed(2)}x`,
      sortable: true,
    },
    {
      name: 'Token A Price Change (%)',
      selector: (row) => <div style={{ color: row.colorFlag ? '#15A624' : '#ED5828' }}>{(`${['', '+'][+(row.tokenAprice > 0)] + row.tokenAprice.toFixed(2)}%`)}</div>,
      sortable: true,
      cellClass: 'tokenAPChange',
      field: 'string',
    },
    {
      name: 'Token B Price Change (%)',
      selector: (row) => <div style={{ color: !row.colorFlag ? '#15A624' : '#ED5828' }}>{(`${['', '+'][+(row.tokenBprice > 0)] + row.tokenBprice.toFixed(2)}%`)}</div>,
      sortable: true,
      class: 'kkk',
    },
    {
      name: 'Token A Deposit %',
      selector: (row) => `${row.tokenADeposit}%`,
      sortable: true,
    },
    {
      name: 'Token B Deposit %',
      selector: (row) => `${row.tokenBDeposit}%`,
      sortable: true,
    },
    {
      name: 'WETH Total Pool Size (in gwei)',
      selector: (row) => `${row.totalPoolSize}`,
      sortable: true,

    },
    {
      name: 'Current payoff per WETH (A wins/B wins)',
      selector: (row) => (`${row.currentPayoffA.toFixed(2)}/${row.currentPayoffB.toFixed(2)}`),
      sortable: true,
      style: {
        div: {
          color: '#9584FF',
        },
      },
    },
    {
      name: '',
      selector: (row) => row.action,
      cell: (row) => (

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
              setTotalPoolSizeM(row.totalPoolSize);
            } else {
              toast.error('Please connect wallet.', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              });
            }
          }}
        >
          TUG
        </Button>
      ),
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
        ':nth-child(2)': {
          minWidth: '125px',
        },
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        ':nth-child(2)': {
          minWidth: '125px',
        },
        paddingLeft: '5px', // override the cell padding for data cells
        paddingRight: '14px',
      },
    },

  };

  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: 'red' };
    }

    return null;
  };

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
        totalPoolSize={totalPoolSizeM}
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

      <div className="spinnerTagMain" hidden={!loading}>
        <TailSpin color="#00BFFF" height={80} width={80} />
      </div>

      <DataTable
        noDataComponent="Loading data please wait"
        columns={columns}
        data={buyTugData}
        customStyles={customStyles}
        rowS
        paginationResetDefaultPage={resetPaginationToggle}
        // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        getRowStyle={getRowStyle}
      />
    </div>
  );
}

function FilterComponent() {
  return (
    <>

    </>
  );
}

export default BuyTugDataTable;
