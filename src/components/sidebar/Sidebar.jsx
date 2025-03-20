import React, { useState } from 'react';
import {
  FaSmile,
  FaThLarge,
  FaShoppingBag,
  FaChartPie,
  FaCommentDots,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarVisible }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <section id="sidebar" className={!isSidebarVisible ? 'hide' : ''}>
      <Link to="/" className="brand">
        <FaSmile className="icon" />
        <span className="text">AdminHub</span>
      </Link>
      <ul className="side-menu top">
        <li className={activeMenu === 'dashboard' ? 'active' : ''}>
          <Link to="/home" onClick={() => handleMenuClick('dashboard')}> 
            <FaThLarge className="icon" />
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li className={activeMenu === 'store' ? 'active' : ''}>
          <Link to="/inicio" onClick={() => handleMenuClick('store')}>
            <FaShoppingBag className="icon" />
            <span className="text">My Store</span>
          </Link>
        </li>
        <li className={activeMenu === 'analytics' ? 'active' : ''}>
          <Link to="/home" onClick={() => handleMenuClick('analytics')}> 
            <FaChartPie className="icon" />
            <span className="text">Analytics</span>
          </Link>
        </li>
        <li className={activeMenu === 'message' ? 'active' : ''}>
          <Link to="/message" onClick={() => handleMenuClick('message')}> 
            <FaCommentDots className="icon" />
            <span className="text">Message</span>
          </Link>
        </li>
        <li className={activeMenu === 'team' ? 'active' : ''}>
          <Link to="/team" onClick={() => handleMenuClick('team')}> 
            <FaUsers className="icon" />
            <span className="text">Team</span>
          </Link>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <Link to="/settings"> 
            <FaCog className="icon" />
            <span className="text">Settings</span>
          </Link>
        </li>
        <li>
          <Link to="/logout" className="logout">
            <FaSignOutAlt className="icon" />
            <span className="text">Logout</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;