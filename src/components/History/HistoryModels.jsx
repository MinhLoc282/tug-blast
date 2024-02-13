import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function HistoryModal(props) {
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
          <Button className="buy-btn purple-btn" onClick={props.hide}>
            CLOSE
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="text-start justify-content-sm-start ps-5">
        <Link to="#">
          <small className="per-dair d-block w-100">
            Click here to check your position
          </small>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
export function HistoryAllModal(props) {
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
          <img src="../assets/more.png" alt="" />
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
                  className="me-2 ethr"
                  style={{ width: '18px' }}
                />
                WETH
              </Button>
            </Col>
          </Row>
        </div>

        <div className="buy-div">
          <Button className="buy-btn purple-btn" onClick={props.hide}>
            CLOSE
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="text-start justify-content-sm-start ps-5">
        <Link to="#">
          <small className="per-dair d-block w-100">
            Click here to check your position
          </small>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
