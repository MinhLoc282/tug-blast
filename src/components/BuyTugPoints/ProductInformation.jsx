/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';

import {
  Button, Form, Row, Col, Table, Modal,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import copyTo from '../../assets/images/copy.svg';

function BuyTugDataTable() {
  const [modalShow, setModalShow] = React.useState(false);

  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const [hideDirector, setHideDirector] = React.useState(false);
  function PricingModel(props) {
    return (
      <Modal
        {...props}
        size="lg"
        id="g-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="modl-headr">
          <Modal.Title id="contained-modal-title-vcenter" className="h5">
            Solutions POS - Good, Better, Best PricingModel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>
            Specify
            at $0.00
          </h6>
          <Table className="global-table text-center" striped responsive>
            <thead>
              <tr>
                <th>Price Level</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0.00</td>
                <td>0.00</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Row className="g-2 d-flex justify-content-lg-end justify-content-center">
            <Col className="col-auto">
              <Link to="#">
                <Button className="theme-white-btn" onClick={props.onHide}>
                  Close
                </Button>
              </Link>
            </Col>
            <Col className="col-auto">
              <Button className="theme-white-btn">
                <img alt="copy" src={copyTo} className="img-fluid collect-wallet" />
                {' '}
                Copy to
              </Button>
            </Col>
            <Col className="col-auto">
              <Button className="theme-orange-btn" onClick={props.onHide}>
                Save
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    );
  }
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: '',
      maxWidth: '1px',
      minWidth: '2px',
      cell: (row) => <img height="" width="16px" alt={row.name} src="../assets/icons.png" />,
    },
    {
      name: 'Tug Pair Token A/Token B',
      selector: (row) => row.pair,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Time to expiry DD:HH:MM:SS',
      selector: (row) => row.expiry,
      sortable: true,
      style: {
        '&::before': {
          content: '',
          backgroundImage: ' url("../assets/icons.png")',
          width: '22px',
          height: '12px',
          display: 'inlineBlock',
          marginRight: '10px',
        },
      },
      omit: hideDirector,
    },
    {
      name: 'Current multiplier',
      selector: (row) => row.current,
      sortable: true,
      omit: hideDirector,
    }, {
      name: 'Market price of Token B',
      selector: (row) => row.token,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Price of synth Token A',
      selector: (row) => row.tokenb,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Total Pool Size ($)',
      selector: (row) => row.price,
      sortable: true,
    }, {
      name: 'Action',
      selector: (row) => row.action,
      cell: () => (
        <Button className="tug-modelbtn" onClick={() => setModalShow(true)}>TUG</Button>
      ),
    },
  ];
  const data = [
    {
      id: 1,
      pair: 'Beetlejuice',
      year: '1988',
      expiry: '3:00',
      current: 'john',
      token: 'jane',
      tokenb: '3067',
      price: '342',
    },
    {
      id: 2,
      pair: 'Beetlejce',
      year: '19883',
      expiry: '3:40',
      current: 'tom',
      token: 'jne',
      tokenb: '35567',
      price: '34233',
    },
    {
      id: 3,
      pair: 'Wali',
      year: '2022',
      expiry: '12/30/2025',
      current: 'hamza',
      token: '5',
      tokenb: '455',
      price: '90',
    },
    {
      id: 3,
      pair: 'Qy',
      year: '2012',
      expiry: '12/02/2025',
      current: 'yix',
      token: '53',
      tokenb: '322',
      price: '903',
    },
    {
      id: 4,
      pair: 'Wali',
      year: '2022',
      expiry: '12/30/2025',
      current: 'hamza',
      token: '5',
      tokenb: '455',
      price: '90',
    }, {
      id: 5,
      pair: 'waqas',
      year: '123',
      expiry: '14/30/2025',
      current: 'ali',
      token: '53',
      tokenb: 'gsf44',
      price: '40',
    }, {
      id: 6,
      pair: 'kafayat',
      year: '2027',
      expiry: '12/30/2023',
      current: 'yix',
      token: '5',
      tokenb: '455',
      price: '90',
    }, {
      id: 7,
      pair: 'bilal',
      year: '2042',
      expiry: '17/30/2025',
      current: 'qy',
      token: '52',
      tokenb: '4535',
      price: '906',
    }, {
      id: 8,
      pair: 'atif',
      year: '2222',
      expiry: '16/30/2025',
      current: 'hamza',
      token: '53',
      tokenb: '4553',
      price: '502',
    }, {
      id: 9,
      pair: 'zain',
      year: '2042',
      expiry: '02/30/2025',
      current: 'kafayat',
      token: '5',
      tokenb: '455',
      price: '30',
    },
    {
      id: 10,
      pair: 'Manan',
      year: '2082',
      expiry: '02/30/2025',
      current: 'kafayat',
      token: '56',
      tokenb: '4505',
      price: '300',
    },
  ];
  const customStyles = {
    rows: {
      style: {
        minHeight: '62px', // override the row height
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
  const filteredItems = data.filter((item) => item.pair && item.pair.toLowerCase().includes(filterText.toLowerCase())
    || item.current && item.current.toLowerCase().includes(filterText.toLowerCase())
    || item.token && item.token.toLowerCase().includes(filterText.toLowerCase())
    || item.tokenb && item.tokenb.toLowerCase().includes(filterText.toLowerCase())
    || item.price && item.price.toLowerCase().includes(filterText.toLowerCase()));
  function FilterComponent({ filterText, onFilter }) {
    return (
      <div className="searchmain">
        <div className="Filteritems">
          <Form.Control
            type="text"
            id="search"
            placeholder="Filter By Name"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
          />
        </div>
        <div className="filtertabs">
          <Button type="button" className="all-btn">
            All
          </Button>
          <Button type="button">
            Coin
          </Button>
          <Button type="button">
            NFTs
          </Button>
          <Button type="button">
            Commodites
          </Button>
          <Button type="button">
            Equities
          </Button>

        </div>
      </div>
    );
  }
  useEffect(() => {
    if (window.innerWidth < 600) {
      setHideDirector(true);
    }
  });

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div className="invent-comp py-4">
      <PricingModel show={modalShow} onHide={() => setModalShow(false)} />
      <Button type="button" className="collapseheader" onClick={() => setHideDirector(!hideDirector)}>
        Collapse
      </Button>
      <DataTable
          // title="Contact List"
        columns={columns}
        data={filteredItems}
        pagination
        customStyles={customStyles}
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
          // selectableRows
        persistTableHead
      />
    </div>
  );
}

export default BuyTugDataTable;
