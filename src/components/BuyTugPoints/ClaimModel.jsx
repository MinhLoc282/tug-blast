/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Container, Row, Col, Button, Modal,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function PointsClaimModal(props) {
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
                <span className="climsml">48,86579 synth ETH tokens</span>
              </small>
            </Col>
          </Row>
        </div>
        <div className="amount-dai" style={{ marginTop: '8px' }}>
          <Row className="w-100">
            <Col sm={6}>
              <small className="mb-1">For</small>
              <h1 className="mb-0">393.34562</h1>
            </Col>
            <Col sm={6} className="text-end">
              <Button className="synth-tokenbtn">
                <img src="../assets/usdt-logo.png" width="25px" className="ethr" alt="ETH" />
                USDT
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
export function PointsClaimSuccessModal(props) {
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
          <Row className="w-100">
            <Col sm={12}>
              <small className="per-dair d-block w-100">
                You have cliamed
                {' '}
                <span className="climsml">48,86579 synth ETH tokens</span>
              </small>
            </Col>
          </Row>
        </div>
        <div className="amount-dai" style={{ marginTop: '8px' }}>
          <Row className="w-100">
            <Col sm={6}>
              <small className="mb-1">For</small>
              <h1 className="mb-0">393.34562</h1>
            </Col>
            <Col sm={6} className="text-end">
              <Button className="synth-tokenbtn">
                <img src="../assets/usdt-logo.png" alt="ETH" />
                USDT
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
