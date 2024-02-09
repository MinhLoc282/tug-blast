import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../screens/auth';

function SignInForm() {
  const schema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().required(),
  });
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.path || '/services';

  const handleSubmit = (values) => {
    // alert(JSON.stringify(values), "data");
    console.log(values.userName, 'userName');
    auth.login(values.userName);
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="signin-main">
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
          userName: '',
          password: '',
        }}
      >
        {({
          handleSubmit, handleChange, values, touched, errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit} className="Signupmainform">
            <div>
              <h4>
                <span>Login</span>
              </h4>
              <Form.Group controlId="userName" className="mb-3">
                <Form.Label htmlFor="User-Name" className="text-white">User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  isInvalid={!!errors.userName}
                  value={values.userName}
                  onChange={handleChange}
                  isValid={touched.userName && !errors.userName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.userName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label htmlFor="password" className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  isInvalid={errors.password}
                  value={values.password}
                  onChange={handleChange}
                  isValid={touched.password && !errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="submitbtnblock">
              <p>
                <Link to="#" className="forgot">
                  Forgot Password
                </Link>
              </p>
              <Button type="submit" className="mt-3 theme-orange-btn">
                Log In
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignInForm;
