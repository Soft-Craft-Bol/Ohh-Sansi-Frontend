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

const Sidebar = ({ isSidebarVisible }) => { // Recibimos el estado del sidebar desde el componente padre
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <section id="sidebar" className={!isSidebarVisible ? 'hide-text' : ''}> 
      <a href="#" className="brand">
        <FaSmile className="icon" /> 
        <span className="text">AdminHub</span>
      </a>
      <ul className="side-menu top">
        <li className={activeMenu === 'dashboard' ? 'active' : ''}>
          <a href="#" onClick={() => handleMenuClick('dashboard')}>
            <FaThLarge className="icon" /> {/* Icono de dashboard */}
            <span className="text">Dashboard</span>
          </a>
        </li>
        <li className={activeMenu === 'store' ? 'active' : ''}>
          <a href="#" onClick={() => handleMenuClick('store')}>
            <FaShoppingBag className="icon" /> {/* Icono de store */}
            <span className="text">My Store</span>
          </a>
        </li>
        <li className={activeMenu === 'analytics' ? 'active' : ''}>
          <a href="#" onClick={() => handleMenuClick('analytics')}>
            <FaChartPie className="icon" /> {/* Icono de analytics */}
            <span className="text">Analytics</span>
          </a>
        </li>
        <li className={activeMenu === 'message' ? 'active' : ''}>
          <a href="#" onClick={() => handleMenuClick('message')}>
            <FaCommentDots className="icon" /> {/* Icono de message */}
            <span className="text">Message</span>
          </a>
        </li>
        <li className={activeMenu === 'team' ? 'active' : ''}>
          <a href="#" onClick={() => handleMenuClick('team')}>
            <FaUsers className="icon" /> {/* Icono de team */}
            <span className="text">Team</span>
          </a>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <a href="#">
            <FaCog className="icon" /> {/* Icono de settings */}
            <span className="text">Settings</span>
          </a>
        </li>
        <li>
          <a href="#" className="logout">
            <FaSignOutAlt className="icon" /> {/* Icono de logout */}
            <span className="text">Logout</span>
          </a>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;