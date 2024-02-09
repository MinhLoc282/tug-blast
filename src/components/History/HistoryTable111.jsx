/* eslint-disable react/jsx-no-bind */
import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Form, Table } from 'react-bootstrap';
import moment from 'moment';
import contract from '../../ethereum/con1.js';

import { FAKE_DATA } from '../../backend/fakeApi.js';

function HistoryDataTable() {
  const [filterText, setFilterText] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('');
  const [hideDirector, setHideDirector] = React.useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

  const [buyTugData, setBuyTugData] = React.useState();

  const main = async () => {
    try {
      const isBuyTugExist = localStorage.getItem('HistoryTugData');
      if (isBuyTugExist) {
        const buyTugResponse = JSON.parse(isBuyTugExist);
        const isTimeExpired = buyTugResponse?.expiryTime < moment().unix();
        if (!isTimeExpired) {
          setBuyTugData(JSON.parse(buyTugResponse?.historyTugData));
          return;
        }
      }
      const result1 = FAKE_DATA.tugPairs;

      const epochArray = result1;

      const result2 = FAKE_DATA.tugPairs;

      const result3 = FAKE_DATA.pairUserEpoches;

      const costBasisArray = result3.data.data.pairUserEpoches;
      let startTime = await contract.methods.startTime().call();
      startTime = Math.round(startTime);

      let tugDuration = await contract.methods.epochDuration().call();
      tugDuration = Math.round(tugDuration);

      const currentTimeinEpochSeconds = Math.round(Date.now() / 1000);

      const currentEpoch = await contract.methods.currentEpoch().call();

      let result222 = currentTimeinEpochSeconds - (startTime + tugDuration);

      const days = Math.floor(result222 / (3600 * 24));
      result222 -= days * 3600 * 24;
      const hrs = Math.floor(result222 / 3600);
      result222 -= hrs * 3600;
      const mnts = Math.floor(result222 / 60);
      result222 -= mnts * 60;

      const timeToExpiry = `${days}d:${hrs}h:${result222}s`; // 10/29/2013

      const EpochData = await contract.methods.epochData(currentEpoch).call();

      const myPayoff = [];
      const status = [];
      const uncollectedEpochs = FAKE_DATA.pairUsers;

      const uncollectedEpochsArray = uncollectedEpochs;

      for (let i = 0; i < epochArray.length; i++) {
        myPayoff[i] = 1000000;
        status[i] = 'onGoing';
      }

      const totalPoolSize = EpochData.totalPot;

      const totalToken0Shares = EpochData.token0SharesIssued;

      const totalToken1Shares = EpochData.token1SharesIssued;

      const ExpectedPayoffWin = 99;
      const ExpectedPayoffLoose = 20;

      // costBasisArray
      const CostBasis = 100;

      const AveragePrice0 = totalToken0Shares / CostBasis;

      const pairsArry = result1.data.data.tugPairs;
      let totalData = [];

      for (let item = 0; item < pairsArry.length; item++) {
        totalData = [...totalData, {
          no: item + 1,
          timeToExpiry,
          myPayoff: 1000000,
          status: 'onGoing',
          AveragePrice0,
          ExpectedPayoffWin,
          ExpectedPayoffLoose,
          totalPoolSize,
          id: pairsArry[item].id,
          totalToken0Deposits: pairsArry[item].totalToken0Deposits,
        }];
      }
      const pairsArry2 = result2;

      totalData = totalData.map((item) => {
        const isDataExist = pairsArry2.find((o) => o.id === item.id);

        if (isDataExist) {
          return {
            ...item, totalToken1Deposits: isDataExist.totalToken1Deposits,
          };
        }
        return { ...item };
      });

      totalData = totalData.map((item) => {
        const isDataExist = costBasisArray.find((o) => o.id.split('.')[0] === item.id);
        const isClaimed = uncollectedEpochsArray.find((o) => o.id.split('.')[0] === item.id);
        if (isDataExist) {
          const avgVal1 = ((parseInt(totalToken0Shares)) / (parseInt(isDataExist.totalDeposits)) || 0);
          const avgVal2 = ((parseInt(totalToken1Shares)) / (parseInt(isDataExist.totalDeposits)) || 0);

          return {
            ...item,
            CostBasis: isDataExist.totalDeposits,
            AveragePrice: `${avgVal1}/${avgVal2}`,
            closingPrice: 12122,
            status: isClaimed ? 'Claimed' : 'UnClaimed',
            return: (item.myPayoff / CostBasis),
          };
        }
        return { ...item };
      });

      const localData = { expiryTime: moment().add(2, 'hours').unix(), historyTugData: JSON.stringify(totalData) };

      localStorage.setItem('HistoryTugData', JSON.stringify(localData));
      setBuyTugData(totalData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    main();
  }, []);
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.no,
      sortable: true,
    },
    {
      name: 'Time to expiry DD:HH:MM:SS',
      selector: (row) => row.timeToExpiry,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Pair Token A/Token B',
      selector: (row) => row.token_AB,
      cell: (row) => (
        <p>
          <img
            height=""
            width="16px"
            alt={row.name}
            className="me-1"
            src="../assets/icons.png"
          />
          ETH/BTC
        </p>
      ),
    },
    {
      name: 'Cost Basis',
      selector: (row) => row.CostBasis,
      sortable: true,
    },
    {
      name: 'Average purchase price',
      selector: (row) => row.AveragePrice,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Closing Price',
      selector: (row) => row.closingPrice,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Payoff',
      selector: (row) => row.myPayoff,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: '% return',
      selector: (row) => row.return,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: 'Status',
      cell: (row) => (
        <Button
          className="status-tug"
          id={
              row.status === 'Ongoing'
                ? 'Ongoing'
                : row.status === 'Claimed'
                  ? 'Claimed'
                  : 'notclaimed'
            }
        >
          {row.status}
        </Button>
      ),
      sortable: true,
    },
  ];

  useEffect(() => {
    if (window.innerWidth < 600) {
      setHideDirector(true);
    }
  }, [setHideDirector]);
  const data = [
    {
      id: 1,
      end_date: '19/05/2022',
      token_AB: 'Tokens',
      cost: '3:00',
      purchase_price: 'john',
      closing_price: 'Tokens',
      payoff: '3067',
      return: '342',
      status: 'Ongoing',
    },
    {
      id: 2,
      end_date: '19/05/2021',
      token_AB: 'Commodites',
      cost: '3:00',
      purchase_price: 'Commodites',
      closing_price: '20/04',
      payoff: 'Tokens',
      return: 'Tokens',
      status: 'Claimed',
    },
    {
      id: 3,
      end_date: '19/05/2022',
      token_AB: 'Commodites',
      cost: '3:00',
      purchase_price: 'john',
      closing_price: 'jane',
      payoff: 'Commodites',
      return: '342',
      status: 'Not Claimed',
    },
    {
      id: 4,
      end_date: '19/05/2022',
      token_AB: 'Commodites',
      cost: '3:00',
      purchase_price: 'Commodites',
      closing_price: 'Commodites',
      payoff: 'Commodites',
      return: '342',
      status: 'Ongoing',
    },
    {
      id: 5,
      end_date: '19/05/2022',
      token_AB: 'Commodites',
      cost: '3:00',
      purchase_price: 'Equities',
      closing_price: 'Equities',
      payoff: 'Equities',
      return: '342',
      status: 'Claimed',
    },
  ];

  function FilterComponent({ filterText, onFilter, onClear }) {
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
            name="Tokens"
            className={`${activeFilter === 'Tokens' ? 'all-btn' : null}`}
            onClick={() => {
              setActiveFilter('Tokens');
              setFilterText('Tokens');
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
            className={`${activeFilter === 'Commodities' ? 'all-btn' : null}`}
            name="Commodites"
            onClick={() => {
              setActiveFilter('Commodities');
              setFilterText('Commodities');
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

  function ExpandedComponent() {
    return (
      <>
        <h4 className="text-white py-3">History</h4>
        <Table striped bordered hover variant="dark" id="detailtable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Side</th>
              <th># of Synth Tokens</th>
              <th>Cost Basis</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val) => (
              <tr>
                <td>{val.end_date}</td>
                <td>{val.token_AB}</td>
                <td>{val.payoff}</td>
                <td>{val.return}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }

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

  return (
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
        data={buyTugData}
        customStyles={customStyles}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />
      <Table
        striped
        hover
        variant="dark"
        id="total-table"
        className="mt-5 total-tr"
      >
        <tbody>
          <tr>
            <td colSpan={2} />
            <td>Total</td>
            <td colSpan={5} />
            <td>$5504</td>
            <td>302%</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default HistoryDataTable;
