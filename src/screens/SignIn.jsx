import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../assets/css/main.css';
import SignInForm from '../components/signin/SignInForm';
import appLogo from '../assets/images/logo.png';

function SignIn() {
  return (
    <Container fluid className="">
      <Row className="vh-100">
        <Col xs={12} md={6} className="login_bg px-4 py-5" id="Signup-comp">
          <SignInForm />
        </Col>
        <Col
          xs={12}
          md={6}
          className="py-5 px-4 order-md-last order-sm-first order-first col-md-6 justify-content-center col-12 d-flex align-items-center"
        >
          <img
            src={appLogo}
            className="img-fluid mx-auto d-block"
            alt="Solution DGR"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
