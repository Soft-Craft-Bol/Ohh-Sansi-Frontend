import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/img/logo.png';
import './Navbar.css';
import { Breadcrumbs } from './Breadcrumbs';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Cierra el menú al navegar
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

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
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            Inicio
          </Link>
          
          <a 
            href="#areas" 
            className="navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Áreas
          </a>
          
          <a 
            href="#inscripcion" 
            className="navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Inscripción
          </a>
          
          <Link 
            to="/faq" 
            className={`navbar-link ${location.pathname === '/faq' ? 'active' : ''}`}
          >
            Preguntas Frecuentes
          </Link>
          
          
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
          aria-label="Abrir menú"
        >
          <FaBars />
        </button>
      </div>
      <Breadcrumbs />
    </header>
  );
};

export default Navbar;