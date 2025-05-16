import React, { useState, useEffect, useRef } from 'react';
import { FaMoon, FaSignOutAlt, FaSun, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserEdit, FaUsers, FaClipboardCheck, FaFileInvoiceDollar, FaUpload, FaMoneyCheckAlt } from 'react-icons/fa';
import { getUser, removeToken, signOut, getToken } from '../../utils/authFuntions';
import './Navbar.css';
import logo from '../../assets/img/logo.png';
import ScrollReveal from 'scrollreveal';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openAdminDropdown, setOpenAdminDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
      if (savedMode === 'true') {
        document.body.classList.add('dark');
      }
    }
  }, []);

  useEffect(() => {
    const userData = getUser();
    const token = getToken();

    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(true);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }

    ScrollReveal().reveal('nav', {
      duration: 1000,
      origin: 'top',
      distance: '60px',
      easing: 'ease-in-out',
      reset: false
    });
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setOpenAdminDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    setOpenAdminDropdown(false);
  };

  const toggleAdminDropdown = () => {
    setOpenAdminDropdown(!openAdminDropdown);
    setOpenDropdown(null);
  };


  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo Olimpiadas" className="logo-nav" />
          <span className="logo-text">Olimpiadas ohSansi</span>
        </Link>
      </div>

      <div className="nav-center">
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-item">
              <FaHome className="nav-icon" /> Inicio
            </Link>
          </li>

          <li className="dropdown" ref={dropdownRef}>
            <span
              className="dropdown-toggle"
              onClick={() => toggleDropdown('inscripciones')}
              onMouseEnter={() => setOpenDropdown('inscripciones')}
            >
              <FaClipboardCheck className="nav-icon" />
              Inscripciones
            </span>
            <ul className={`dropdown-menu ${openDropdown === 'inscripciones' ? 'show' : ''}`}>
              <li><Link to="/inscripcion-individual" className="nav-item"><FaUserEdit className="nav-icon" /> Individual</Link></li>
              <li><Link to="/inscripcion-masiva" className="nav-item"><FaUsers className="nav-icon" /> Masiva</Link></li>
              <li><Link to="/estado-de-inscripcion" className="nav-item"><FaClipboardCheck className="nav-icon" /> Estado</Link></li>
              <li><Link to="/orden-de-pago" className="nav-item"><FaFileInvoiceDollar className="nav-icon" /> Orden de Pago</Link></li>
              <li><Link to="/subir-boleta" className="nav-item"><FaUpload className="nav-icon" /> Subir Boleta</Link></li>
              <li><Link to="/metodo-pago" className="nav-item"><FaMoneyCheckAlt className="nav-icon" /> Método de Pago</Link></li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        <label htmlFor="switch-mode" className="switch-mode">
          <input
            type="checkbox"
            id="switch-mode"
            hidden
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </label>

        {isAuthenticated && isAdmin && (
          <div className="admin-dropdown" ref={adminDropdownRef}>
            <FaUserCircle
              className="admin-icon"
              onClick={toggleAdminDropdown}
              onMouseEnter={() => setOpenAdminDropdown(true)}
            />
            <div className={`admin-dropdown-menu ${openAdminDropdown ? 'show' : ''}`}>
              <Link to="/admin" className="nav-item"><FaClipboardCheck className="nav-icon" /> Panel Admin</Link>
              <button onClick={handleLogout} className="nav-item"><FaSignOutAlt className="nav-icon" /> Cerrar Sesión</button>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <Link to="/login" className="login-link">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
