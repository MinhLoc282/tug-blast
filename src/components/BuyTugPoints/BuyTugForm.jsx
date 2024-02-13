/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import {
  Button, Form, Row, Col,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

function BuyTugForm() {
  const schema = yup.object().shape({
    sku: yup.string(),
  });
  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: 'ID',
        field: 'name',
        attributes: {
          'aria-controls': 'DataTable',
          'aria-label': 'Name',
          className: 'headname',
        },
      },
      {
        label: 'Tug Pair Token A/Token B',
        field: 'position',
        width: 200,
      },
      {
        label: 'Time to expiry DD:HH:MM:SS',
        field: 'office',
        width: 200,
      },
      {
        label: 'Current multiplier',
        field: 'age',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Market price of Token B',
        field: 'date',
        sort: 'disabled',
        width: 150,
      },
      {
        label: 'Market price of Token B',
        field: 'salary',
        sort: 'disabled',
        width: 100,
      }, {
        label: 'Price of synth Token A',
        field: 'synth',
        sort: 'disabled',
        width: 100,
      }, {
        label: 'Price of synth Token B',
        field: 'salary',
        sort: 'disabled',
        width: 100,
      }, {
        label: 'Total Pool Size ($)',
        field: 'size',
        sort: 'disabled',
        width: 100,
      }, {
        label: 'Current Payoff per WETH (A wins/B wins)',
        field: 'wins',
        sort: 'disabled',
        width: 100,
      },
      {
        label: '',
        field: 'tug',
        sort: 'disabled',
        width: 100,
      },
    ],
    rows: [
      {
        name: 'Tiger Nixon',
        position: 'BTC ETH',
        office: '02:12:43:55',
        age: '61',
        date: '2011/04/25',
        salary: '$320',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Garrett Winters',
        position: 'BTC ETH',
        office: '02:12:43:55',
        age: '63',
        date: '2011/07/25',
        salary: '$170',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Ashton Cox',
        position: 'BTC ETH',
        office: '02:12:43:55',
        age: '66',
        date: '2009/01/12',
        salary: '$86',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Cedric Kelly',
        position: 'BTC ETH',
        office: '06:12:43:55',
        age: '22',
        date: '2012/03/29',
        salary: '$433',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Garrett Winters',
        position: 'BTC ETH',
        office: '08:12:43:55',
        age: '63',
        date: '2011/07/25',
        salary: '$170',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Ashton Cox',
        position: 'BTC ETH',
        office: '12:12:43:55',
        age: '66',
        date: '2009/01/12',
        salary: '$86',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Cedric Kelly',
        position: 'BTC ETH',
        office: '02:12:43:55',
        age: '22',
        date: '2012/03/29',
        salary: '$433',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Garrett Winters',
        position: 'BTC OHT',
        office: '07:12:43:55',
        age: '63',
        date: '2011/07/25',
        salary: '$170',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Ashton Cox',
        position: 'BRR ETH',
        office: '02:12:43:55',
        age: '66',
        date: '2009/01/12',
        salary: '$86',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Cedric Kelly',
        position: 'BTC ETH',
        office: '02:12:43:55',
        age: '22',
        date: '2012/03/29',
        salary: '$433',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Ashton Cox',
        position: 'BTC ETH',
        office: '02:12:43:55',
        age: '66',
        date: '2009/01/12',
        salary: '$86',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
      {
        name: 'Cedric Kelly',
        position: 'BTC ETH',
        office: '05:12:43:55',
        age: '22',
        date: '2012/03/29',
        salary: '$433',
        synth: '$320',
        size: '$320',
        wins: '$4430/$5.220',
        tug: 'TUG',
      },
    ],
  });
  const handleSubmit = (values) => {
    console.log(values, 'values');
  };

  return (
    <div className="invent-comp py-4">
      <Formik
        validationSchema={schema}
        a
        onSubmit={handleSubmit}
        initialValues={{
          sku: '',
        }}
      >
        {({
          handleSubmit, handleChange, errors,
        }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
            className="Invetory-Form global-form"
          >
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} xl={4}>

                <Form.Group as={Row} controlId="sku" className="mb-3">
                  <Form.Control
                    id="g-field"
                    type="text"
                    name="skuu"
                    onChange={handleChange}
                    style={{ width: '70%', margin: 'auto' }}
                  />
                </Form.Group>
                <Form.Group as={Row} controlId="g-select" className=" mb-3">
                  <Form.Label className=" mt-0" column sm="3">
                    Reserved
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      name="production_cat"
                      size="lg"
                      className="form-control form-select "
                      onChange={handleChange}
                    >
                      <option value="color" />
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Form.Select>
                  </Col>
                  <Form.Control.Feedback type="invalid">
                    {errors.production_cat}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row className="chckbox">
                  <Col xs={3} />
                  <Col xs={9}>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <label className="checkbox path w-100 position-relative">
                        <input type="checkbox" label="Hide" />
                        <svg viewBox="0 0 21 21">
                          <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
                        </svg>
                        {' '}
                        <span className="c-label">
                          Prompt
                        </span>
                      </label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

            </Row>
            <Row className="g-2 d-flex justify-content-end">
              <Col className="col-auto">
                <Button type="submit" className="theme-orange-btn">Save</Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>

  );
}

export default BuyTugForm;
