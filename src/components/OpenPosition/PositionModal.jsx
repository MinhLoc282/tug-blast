import React from 'react';
import {
  Container, Row, Col, Button, Modal, Dropdown,
} from 'react-bootstrap';
import { ReactComponent as ETHIcon } from '../../assets/images/eth.svg';

export function TugSelect(props) {
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
                <h4>Tug</h4>
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

      <Modal.Body className="p-0">
        <div className="synth-price">
          <Row className="w-100">
            <Col xs={4}>
              <p>
                <b>Synth Price</b>
              </p>
              <p>
                <b>Tug Pool</b>
              </p>
              <p>
                <b>Expected Payoff*</b>
              </p>
            </Col>
            <Col xs={4}>
              <p>$1.03</p>
              <p>$1.03</p>
              <p>$1.03</p>
            </Col>
            <Col xs={4}>
              <p>$0.03</p>
              <p>$0.03</p>
              <p>$0.03</p>
            </Col>
            <small className="per-dair">*per USDT of current prices</small>
          </Row>
        </div>
        <div className="amount-dai">
          <Row className="w-100">
            <Col xs={6}>
              <p>Amount</p>
              <h1>0.00001</h1>
            </Col>
            <Col xs={6}>
              <Dropdown id="dai">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img
                    src="../assets/usdt-logo.png"
                    alt="dai"
                    className="me-2"
                    style={{ width: '18px' }}
                  />
                  {' '}
                  USDT
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">ETH</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">BTC</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>
        <p className="model-arrow-down">
          <img src="../assets/down1.svg" alt="arrow-down" />
        </p>
        <div className="amount-dai select-token">
          <Row className="w-100">
            <Col xs={6}>
              <p>Amount</p>
              <h1>0.00001</h1>
            </Col>
            <Col xs={6}>
              <Dropdown id="dai" className="sl-token">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select Token
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Synth ETH</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Synth BTC</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>
        <div className="buy-div">
          <Button className="buy-btn">BUY</Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="text-start justify-content-sm-start ps-5">
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

        {/* <Button className="theme-white-btn" onClick={props.hide}>
            Cancel
          </Button> */}
      </Modal.Footer>
    </Modal>
  );
}
export function TokenSuccessModal(props) {
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
              <h1 className="mb-0">48.34562</h1>
            </Col>
            <Col xs={6} className="text-end">
              <Button className="synth-tokenbtn global-btn">
                Synth ETH Tokens
              </Button>
            </Col>
          </Row>
        </div>
        {/* <p className="model-arrow-down"><img src="../assets/down1.svg" alt="arrow-down" /></p> */}
        <div className="amount-dai select-token">
          <Row className="w-100">
            <Col xs={6}>
              <small className="per-dair d-block w-100">
                for a Tug Pair
                {' '}
                <img
                  src="../assets/usdt-logo.png"
                  alt="ETH"
                  className="me-2 ethr"
                />
                {' '}
                ETC
              </small>
            </Col>
          </Row>
        </div>
        <div className="buy-div">
          <Button className="buy-btn close-purple" onClick={props.hide}>
            CLOSE
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="text-start justify-content-sm-start ps-5">
        <small className="per-dair d-block w-100">
          Price of Synth ETH $1.03
        </small>
        {/* <Button className="theme-white-btn" onClick={props.hide}>
            Cancel
          </Button> */}
      </Modal.Footer>
    </Modal>
  );
}
