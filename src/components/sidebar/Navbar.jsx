import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeProvider';
import logo from '../../assets/img/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo ohSansi" className="navbar-logo" />
          <div className="navbar-brand-text">
            <h1 className="navbar-brand-title">ohSansi</h1>
            <p className="navbar-brand-subtitle">UMSS</p>
          </div>
        </Link>

        <nav className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
          <a href="#areas" className="navbar-link">Áreas</a>
          <a href="#inscripcion" className="navbar-link">Inscripción</a>
          <a href="#contacto" className="navbar-link">Contacto</a>
          
          <button 
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          <button 
            className="navbar-close-menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </nav>

        <button 
          className="navbar-hamburger"
          onClick={() => setIsMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>
    </header>
  );
};

export default Navbar;