import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Col,
  Container,
  Row,
  Button,
  Form,
} from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import Web3Modal from 'web3modal';
import whiteLogo from '../assets/images/tug-1.png';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useDisconnect, useAccount } from 'wagmi';

import web3 from '../ethereum/web3';
import {
  setAccount,
} from '../slice/slice';

import { ReactComponent as LoadingIcon } from '../assets/images/white-loader.svg';

const checkingNetwork = async () => {
  const chainId = await web3.eth.getChainId();
  if (chainId !== 168587773) {
    // toast.error('Please connect the polygon mainnet', {
    toast.error('Please connect the Smart Chain Testnet', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  }
};

function Header(props) {
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.counter.pending);
  const { sidebarHandler } = props;

  const {
    address,
  } = useAccount();

  const { disconnect } = useDisconnect()

  const { open } = useWeb3Modal()

  useEffect(() => {
    if (address) {
      localStorage.setItem('walletAddress', address);
      dispatch(setAccount(address));
      checkingNetwork();
    } else if (localStorage.getItem('walletAddress') == null) {
      toast.error('Please connect the wallet!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  }, [address]);

  const handleConnect = async () => {
    try {
      if (!address) {
        open();
      }
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleClipboard = async () => {
    try {
      await disconnect();
      localStorage.removeItem('walletAddress');
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <header className="app-head">
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          <Col xs={1} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className="header-hamburger text-center"
              onClick={sidebarHandler}
            >
              <span />
              <span />
              <span />
            </div>
          </Col>

          <Col
            xs={11}
            className="d-flex justify-content-end align-items-center"
          >
            <div className="head-part-2 d-flex align-items-center">
              <h5 className="header-logo">
                <img
                  src={whiteLogo}
                  className="img-fluid"
                  alt="Solutions dgr"
                />
              </h5>
              {/* <h4 className="hed-yellow">37,7 USDT </h4>
              <h4 className="hed-prpl">2 NFTs</h4> */}
              {pending <= 0
                ? (
                  <div className="walletAddressInput">
                    {/* <Form.Control type="text" disabled value={account} onClick={handleClipboard}/> */}
                    <Form.Control type="text" value={address || ''} onClick={handleClipboard} />
                  </div>
                )
                : (
                  <div className="pendingTransaction">
                    <div>
                      {pending}
                      {' '}
                      Pending
                    </div>
                    <LoadingIcon className="white-loader" />
                  </div>
                )}
            </div>
            <Button
              className="theme-white-btn collect-wallet"
              onClick={handleConnect}
              id={address ? 'metButt' : null}
            >
              <img
                alt="collect wallet"
                src="../assets/MetaMask.png"
                className="img-fluid "
              />
              Connect Wallet
            </Button>

            {/* <button
                className="theme-white-btn collect-wallet"
                onClick={handleClipboard}
              >
                {shortenAddress(account)}
              </button> */}

            {/* <p className="thdots"><img className="img-fluid" src="../assets/more.png" alt="more fields" /></p> */}
            {/* <NavDropdown
              title={
                <div className="userprofile">
                  <span className="me-2 fs-6 theme-xs-sm-hide">{auth.user}</span>
                  <img className="img-fluid" src="../assets/more.png" alt="more fields" />
                </div>
              }
              id="basic-nav-dropdown"
              className="header-profile"
            >
              {/* {!auth.user ? (
                <>
                  <NavDropdown.Item as={Link} to="/signin">
                    Log In
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item className="theme-blue-btn" onClick={handleLogout}>
                    Log Out
                  </NavDropdown.Item>
                </>
              )}
          </NavDropdown> */}
          </Col>
        </Row>
      </Container>
    </header>
  );
}
export default Header;
