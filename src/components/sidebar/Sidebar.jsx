import React, { useState } from 'react';
import {
  FaSmile,
  FaThLarge,
  FaShoppingBag,
  FaChartPie,
  FaQuestionCircle,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import { PiClipboardTextFill } from "react-icons/pi";
import { MdOutlinePayment } from "react-icons/md";
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
        <li className={activeMenu === 'analytics' ? 'active' : ''}>
          <Link to="/form" className="link" onClick={() => handleMenuClick('analytics')}>
            <PiClipboardTextFill className="icon" />
            <span className="text">Inscripciónes</span>
          </Link>
        </li>
        <li className={activeMenu === 'store' ? 'active' : ''}>
          <Link to="/inicio" className="link" onClick={() => handleMenuClick('store')}>
            <MdOutlinePayment className="icon" />
            <span className="text">Pagos</span>
          </Link>
        </li>
        <li className={activeMenu === 'message' ? 'active' : ''}>
          <Link to="/inicio" className="link" onClick={() => handleMenuClick('message')}>
            <FaChartPie className="icon" />
            <span className="text">Reportes</span>
          </Link>
        </li>
        <li className={activeMenu === 'team' ? 'active' : ''}>
          <Link to="/inicio" className="link" onClick={() => handleMenuClick('team')}>
            <FaQuestionCircle className="icon" />
            <span className="text">Ayuda</span>
          </Link>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <Link to="/inicio" className="link">
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