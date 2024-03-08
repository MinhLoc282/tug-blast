/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import DataTable from 'react-data-table-component';
import {
  Button, Form, Container, Row, Col, Modal,
} from 'react-bootstrap';
import { ReactComponent as ETHIcon } from '../../assets/images/eth.svg';

function StakeTugDataTable() {
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

  const [activeFilter, setActiveFilter] = React.useState('');
  const [tugNFTS, setTugNFTS] = React.useState(false);
  const [hideDirector, setHideDirector] = React.useState(false);
  const [tugNFTSSuccess, setTugNFTSSuccess] = React.useState(false);

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
    },

    {
      name: 'Tug Pair Token A/ Token B',
      selector: (row) => row.action,
      cell: (row) => (
        <p>
          <img
            height=""
            width="16px"
            alt={row.name}
            className="me-1"
            src="../assets/icons.png"
          />
          ETH
        </p>
      ),
    },
    {
      name: 'Time to expiry DD:HH:MM:SS',
      selector: (row) => row.pair,
      omit: hideDirector,
    },
    {
      name: 'Current multiplier',
      selector: (row) => row.current,
      omit: hideDirector,
    },
    {
      name: 'Total Pool Size($)',
      selector: (row) => row.token,
      omit: hideDirector,
    },
    {
      name: 'Total current Earnings for NFT stakers',
      selector: (row) => row.tokenb,
      omit: hideDirector,
    },
    {
      name: '# of NFTs staked',
      selector: (row) => row.price,
    },
    {
      name: '',
      selector: (row) => row.action,
      cell: (row) => (
        <Button
          className="tug-modelbtn"
          id={row.tugbutton}
          onClick={() => setTugNFTS(true)}
        >
          STAKE
        </Button>
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
      tugbutton: 'disabled',
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
      tugbutton: 'disabled',
    },
    {
      id: 4,
      pair: 'Comodities',
      year: '2012',
      expiry: '12/02/2025',
      current: 'yix',
      token: '53',
      tokenb: '322',
      price: '903',
    },
    {
      id: 5,
      pair: 'Coin',
      year: '2022',
      expiry: '12/30/2025',
      current: 'hamza',
      token: '5',
      tokenb: '455',
      price: '90',
    },
    {
      id: 6,
      pair: 'NFTs',
      year: '123',
      expiry: '14/30/2025',
      current: 'ali',
      token: '53',
      tokenb: 'gsf44',
      price: '40',
    },
    {
      id: 7,
      pair: 'kafayat',
      year: '2027',
      expiry: '12/30/2023',
      current: 'yix',
      token: '5',
      tokenb: '455',
      price: '90',
      tugbutton: 'disabled',
    },
    {
      id: 8,
      pair: 'bilal',
      year: '2042',
      expiry: '17/30/2025',
      current: 'qy',
      token: '52',
      tokenb: '4535',
      price: '906',
    },
    {
      id: 9,
      pair: 'atif',
      year: '2222',
      expiry: '16/30/2025',
      current: 'hamza',
      token: '53',
      tokenb: '4553',
      price: '502',
    },
    {
      id: 10,
      pair: 'zain',
      year: '2042',
      expiry: '02/30/2025',
      current: 'kafayat',
      token: '5',
      tokenb: '455',
      price: '30',
    },
    {
      id: 11,
      pair: 'Equities',
      year: '2082',
      expiry: '02/30/2025',
      current: 'kafayat',
      token: '56',
      tokenb: '4505',
      price: '300',
    },
    {
      id: 12,
      pair: 'Equities 44',
      year: '2082',
      expiry: '02/30/2025',
      current: 'kafayat 33',
      token: '56',
      tokenb: '4505',
      price: '300',
    },
    {
      id: 13,
      pair: 'NFTs 54',
      year: '1233',
      expiry: '14/30/2025',
      current: 'ali Khan',
      token: '53',
      tokenb: 'gsf44',
      price: '40',
    },
  ];
  const filteredItems = data.filter(
    (item) => (item.pair
        && item.pair.toLowerCase().includes(filterText.toLowerCase()))
      || (item.current
        && item.current.toLowerCase().includes(filterText.toLowerCase()))
      || (item.token
        && item.token.toLowerCase().includes(filterText.toLowerCase()))
      || (item.tokenb
        && item.tokenb.toLowerCase().includes(filterText.toLowerCase()))
      || (item.price
        && item.price.toLowerCase().includes(filterText.toLowerCase())),
  );
  function FilterComponent({ onFilter, onClear }) {
    return (
      <div className="searchmain">
        <div className="Filteritems">
          <Form.Control
            type="text"
            id="search"
            placeholder="Search for Tug Pairs"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
          />
        </div>
        <div className="filtertabs">
          <Button
            type="button"
            name="All"
            className={`${activeFilter === '' ? 'all-btn' : null}`}
            onClick={() => {
              onClear();
              setActiveFilter('');
            }}
          >
            All
          </Button>
          <Button
            type="button"
            name="Coin"
            className={`${activeFilter === 'Coin' ? 'all-btn' : null}`}
            onClick={() => {
              setActiveFilter('Coin');
              setFilterText('Coin');
            }}
          >
            Tokens
          </Button>
          <Button
            type="button"
            name="NFTs"
            className={`${activeFilter === 'NFTs' ? 'all-btn' : null}`}
            onClick={() => {
              setFilterText('NFTs');
              setActiveFilter('NFTs');
            }}
          >
            NFTs
          </Button>

          <Button
            type="button"
            className={`${activeFilter === 'Comodities' ? 'all-btn' : null}`}
            name="Comodites"
            onClick={() => {
              setActiveFilter('Comodities');
              setFilterText('Comodities');
            }}
          >
            Commodities
          </Button>
          <Button
            type="button"
            name="Equities"
            className={`${activeFilter === 'Equities' ? 'all-btn' : null}`}
            onClick={() => {
              setActiveFilter('Equities');
              setFilterText('Equities');
            }}
          >
            Equities
          </Button>
        </div>
      </div>
    );
  }

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

  const StakeTugNFTsSuccess = () => {
    setTugNFTSSuccess(true);
    setTugNFTS(false);
  };

  function StakeTugModal(props) {
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
              <small className="per-dair">You current own 28 Tug NFTs</small>
            </p>
          </div>
          <div className="amount-dai">
            <Row className="w-100 me-0">
              {tugNFT.map((val, i) => (
                <Col xs={6} sm={4} key={i} className="position-relative mt-2">
                  <div>
                    <img
                      src={val.image}
                      className="w-100 rounded"
                      alt="stak-1"
                    />
                  </div>
                  <p className="my-1">
                    <small className="per-dair">{val.tugdetail}</small>
                  </p>
                  <Form.Check className="stake-check" label="" />
                </Col>
              ))}
            </Row>
          </div>

          <div className="buy-div">
            <Button
              className="purple-btn w-100 fw-bold text-black"
              onClick={StakeTugNFTsSuccess}
            >
              STAKE
            </Button>
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
  function StakeSuccessModal(props) {
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
  const customStyles = {
    rows: {
      style: {
        minHeight: '62px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '5px',
        paddingRight: '14px',
      },
    },
  };
  return (
    <>
      <div className="search-header">
        <Button
          type="button"
          className="collapseheader"
          onClick={() => setHideDirector(!hideDirector)}
        >
          {hideDirector ? 'Show Details' : 'Hide Details'}
        </Button>
        <DataTable
          columns={columns}
          data={filteredItems}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          customStyles={customStyles}
        />
      </div>
      <StakeTugModal show={tugNFTS} onHide={() => setTugNFTS(false)} />
      <StakeSuccessModal
        show={tugNFTSSuccess}
        onHide={() => setTugNFTSSuccess(false)}
      />
    </>
  );
}

export default StakeTugDataTable;
