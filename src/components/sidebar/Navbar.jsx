import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaTimes, FaBell, FaMoon, FaSun } from 'react-icons/fa';
import './Navbar.css';
import userCircle from '../../assets/img/user-circle.svg';

const Navbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar abierto por defecto

  const toggleSearch = () => {
    if (window.innerWidth < 576) {
      setIsSearchVisible(!isSearchVisible);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('hide', !isSidebarVisible);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 576) {
        setIsSearchVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav>
      <i className='bx bx-menu' onClick={toggleSidebar}>
        <FaBars />
      </i>
      <input
        type="checkbox"
        id="switch-mode"
        hidden
        checked={isDarkMode}
        onChange={toggleDarkMode}
      />
      <label htmlFor="switch-mode" className="switch-mode">
        {isDarkMode ? <FaSun /> : <FaMoon />} 
      </label>
      <a href="#" className="notification">
        <FaBell />
        <span className="num">8</span>
      </a>
      <a href="#" className="profile">
        <img src={userCircle} alt="Profile" />
      </a>
    </nav>
  );
};

export default Navbar;
