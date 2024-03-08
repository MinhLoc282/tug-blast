/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import {
  Container, Row, Col, Button, Modal,
} from 'react-bootstrap';
import React from 'react';
import { ReactComponent as ETHIcon } from '../../assets/images/eth.svg';

export function StakeTugModal(props) {
  const [tugNFT, setTugNFT] = React.useState([
    {
      image: '../assets/1.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
    {
      image: '../assets/2.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
    {
      image: '../assets/3.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
    {
      image: '../assets/4.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
    {
      image: '../assets/3.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
    {
      image: '../assets/1.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
  ]);
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
              <Col xs={4}>
                <h4>Stake</h4>
              </Col>
              <Col xs={4}>
                <img
                  src="../assets/usdt-logo.png"
                  width="25px"
                  alt="ETH"
                  className="me-2 ethr"
                />
                ETH
              </Col>
              <Col xs={4}>
                <ETHIcon width="25px" className="me-2 ethr" />
                BTC
              </Col>
            </Row>
          </Container>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 dddd">
        <div className="synth-price">
          <small className="per-dair">
            Total Earnings for NFT stakers: 0.96
          </small>
          <p>
            <small className="per-dair"># of NFT Stakes so far: 20</small>
          </p>
        </div>
        <div className="stake-tug">
          <h1>Your Tug NFTs</h1>
          <p>
            <small className="per-dair"># of NFT Stakes so far: 20</small>
          </p>
        </div>
        <div className="amount-dai">
          <Row className="w-100 me-0">
            {tugNFT.map((val, i) => (
              <Col xs={4} key={i}>
                <div>
                  <img
                    src={val.image}
                    className="w-100 rounded"
                    alt="stak-1"
                  />
                </div>
                <p className="mb-1">
                  <small className="per-dair">{val.tugdetail}</small>
                </p>
              </Col>
            ))}
          </Row>
        </div>

        <div className="buy-div">
          <Button className="purple-btn w-100">BUY</Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="text-start dddd justify-content-sm-start ps-5">
        <small className="per-dair d-block w-100">
          Price of Synth ETH $1.03
        </small>
        <small className="per-dair d-block w-100">
          current Time Multiplier :2x
          {' '}
        </small>
        <small className="per-dair d-block w-100">
          Price of Synth ETH $1.03
        </small>
        <small className="per-dair d-block w-100">
          Price of Synth ETH $1.000046
        </small>
      </Modal.Footer>
    </Modal>
  );
}
export function StakeSuccessModal(props) {
  const { onHide } = props;

  const [tugNFT2, setTugNFT2] = React.useState([
    {
      image: '../assets/1.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
    {
      image: '../assets/2.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
    {
      image: '../assets/3.webp',
      tugdetail: 'Total Earnings for NFT stakers',
    },
  ]);
  return (
    <Modal
      {...props}
      size="lg"
      id="g-modal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="modl-headr w-100 d-block tug pb-1">
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
          <Row className="w-100 me-0">
            {tugNFT2.map((val, i) => (
              <Col xs={4} key={i}>
                <div>
                  <img
                    src={val.image}
                    className="w-100 rounded"
                    alt="stak-1"
                  />
                </div>
                <p className="mb-1">
                  <small className="per-dair">{val.tugdetail}</small>
                </p>
              </Col>
            ))}
          </Row>
        </div>
        <div className="buy-div mt-4">
          <Button className="purple-btn w-100" onClick={onHide}>
            CLOSE
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="text-start justify-content-sm-start ps-5">
        <small className="per-dair d-block w-100">
          Price of Synth ETH $1.03
        </small>
      </Modal.Footer>
    </Modal>
  );
}
