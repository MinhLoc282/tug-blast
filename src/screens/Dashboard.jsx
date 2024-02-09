import React, { useEffect, useState } from 'react';
import {
  Outlet, useLocation, useNavigate,
} from 'react-router-dom';
import '../assets/css/main.css';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';

function Dashboard() {
  const [sidebarToggle, setsidebarToggle] = useState(false);

  const sidebarHandler = () => {
    setsidebarToggle((wasOpened) => !wasOpened);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const myCompName = localStorage.getItem('Page Name');
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/buy_tug_points');
    }
  }, []);
  return (
    <div className="position-relative bg-white d-flex p-0">
      <Sidebar
        sidebarToggle={sidebarToggle}
        setsidebarToggle={setsidebarToggle}
      />
      <div className={`content ${sidebarToggle && 'show'}`}>
        <Header sidebarHandler={sidebarHandler} name={myCompName} />

        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
