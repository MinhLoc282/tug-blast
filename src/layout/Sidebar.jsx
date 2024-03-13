import React, { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Navbar } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { sidebarMenu, sidebarMenu2 } from './sidebarData';
import whiteLogo from '../assets/images/tug-logo.png';

import {
  setPositionCount, setProceedsCount,
} from '../slice/slice';

import { useAccount } from 'wagmi';

function Sidebar(props) {
  const { sidebarToggle } = props;
  const location = useLocation();
  const [mobileview, setMobileView] = React.useState(false);
  const {
    address,
  } = useAccount();

  const posCount = useSelector((state) => state.counter.positionCount);
  const procCount = useSelector((state) => state.counter.proceedsCount);

  const dispatch = useDispatch();

  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobileView(true);
    }
  }, [setMobileView]);

  useEffect(() => {
    if (address) {
      // setPsCount(posCount);
    } else {
      dispatch(setPositionCount(0));
    }
  }, [posCount]);

  useEffect(() => {
    if (address) {
      setProceedsCount(procCount);
    } else {
      dispatch(setProceedsCount(0));
    }
  }, [procCount]);

  return (
    <div className={`sidebar ${sidebarToggle && 'show'}`}>
      <div className="logo_brand py-3">
        <Navbar.Brand as={Link} to="/buy_tug_points">
          <img
            src={whiteLogo}
            className="img-fluid sidebar-logo"
            alt="Solutions dgr"
          />
        </Navbar.Brand>
      </div>
      <Nav as="ul" className="flex-column sidebar-menu pt-4 flex-nowrap">
        <p className="mt-3 markets">Market</p>
        {sidebarMenu.map((item, i) => (
          <Nav.Item as="li" key={i} className="my-1">
            <Nav.Link
              as={Link}
              to={item.link}
              className={item.link === location.pathname && 'active'}
              onClick={() => (mobileview ? props.setsidebarToggle(!sidebarToggle) : null)}
            >
              {item.link === location.pathname
                    && localStorage.setItem('Page Name', item.name)}
              <img
                src={item.icon}
                className="theme-img-white"
                alt={item.name}
                width="22px"
                height="22px"
                style={{ marginRight: '10px' }}
              />
              {item.name}
            </Nav.Link>
          </Nav.Item>
        ))}
        <hr className="my-5 hrmob" />
        <div className="mb-3">
          <p className="portfolio">Portfolio</p>
          {sidebarMenu2.map((item, i) => (
            <Nav.Item as="li" key={i} className="my-1">
              <Nav.Link
                as={Link}
                to={item.link}
                    // onClick={() => props.setsidebarToggle(!sidebarToggle)}
                onClick={() => {
                  // test
                  // mobileview ? props.setsidebarToggle(!sidebarToggle) : null;
                  if (item.items === '2') {
                    dispatch(setPositionCount(0));
                  } else if (item.items === '1') {
                    dispatch(setProceedsCount(0));
                  }
                }}
                className={item.link === location.pathname && 'active'}
              >
                {item.link === location.pathname
                      && localStorage.setItem('Page Name', item.name)}
                <img
                  src={item.icon}
                  className="theme-img-white"
                  alt={item.name}
                  width="22px"
                  height="22px"
                  style={{ marginRight: '10px' }}
                />
                {item.name}
                {item.items === '2' ? (
                  <span className="nav-items" hidden={posCount <= 0}>{posCount}</span>
                ) : (item.items === '1'
                  ? (
                    <span className="nav-items" hidden={procCount <= 0}>{procCount}</span>
                  )
                  : null)}
              </Nav.Link>
            </Nav.Item>
          ))}
        </div>
      </Nav>
    </div>
  );
}
export default Sidebar;
