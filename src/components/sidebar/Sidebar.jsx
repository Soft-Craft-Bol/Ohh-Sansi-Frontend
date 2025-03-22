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
import { signOut } from '../../utils/authFuntions';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarVisible }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    signOut();
  };

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
          <Link to="/home" className="link" onClick={() => handleMenuClick('dashboard')}>
            <FaThLarge className="icon" />
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li className={activeMenu === 'store' ? 'active' : ''}>
          <Link to="/formulario" className="link" onClick={() => handleMenuClick('store')}>
            <FaShoppingBag className="icon" />
            <span className="text">Formulario</span>
          </Link>
        </li>
        <li className={activeMenu === 'analytics' ? 'active' : ''}>
          <Link to="/home" className="link" onClick={() => handleMenuClick('analytics')}>
            <FaChartPie className="icon" />
            <span className="text">Analytics</span>
          </Link>
        </li>
        <li className={activeMenu === 'message' ? 'active' : ''}>
          <Link to="/message" className="link" onClick={() => handleMenuClick('message')}>
            <FaCommentDots className="icon" />
            <span className="text">Message</span>
          </Link>
        </li>
        <li className={activeMenu === 'team' ? 'active' : ''}>
          <Link to="/team" className="link" onClick={() => handleMenuClick('team')}>
            <FaUsers className="icon" />
            <span className="text">Team</span>
          </Link>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <Link to="/settings" className="link">
            <FaCog className="icon" />
            <span className="text">Settings</span>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout">
            <FaSignOutAlt className="icon" />
            <span className="text">Logout</span>
          </button>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;