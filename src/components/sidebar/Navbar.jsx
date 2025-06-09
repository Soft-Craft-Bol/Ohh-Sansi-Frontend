import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBars, FaTimes, FaHome, FaFlask, FaUserPlus, FaChevronDown,
  FaUserGraduate, FaUsers, FaSearch, FaFileInvoice, FaUpload
} from 'react-icons/fa';
import logo from '../../assets/img/logo.png';
import './Navbar.css';
import  {Breadcrumbs}  from './Breadcrumbs';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const quickActions = [
    { 
      icon: <FaUserGraduate />, 
      title: "Inscripción Individual", 
      link: "/inscripcion-individual",
      description: "Inscribe a un estudiante"
    },
    { 
      icon: <FaUsers />, 
      title: "Inscripción Masiva", 
      link: "/inscripcion-masiva",
      description: "Inscribe múltiples estudiantes"
    },
    { 
      icon: <FaSearch />, 
      title: "Consultar Estado", 
      link: "/estado-de-inscripcion",
      description: "Verifica tu inscripción"
    },
    { 
      icon: <FaFileInvoice />, 
      title: "Generar Orden", 
      link: "/orden-de-pago",
      description: "Genera orden de pago"
    },
    { 
      icon: <FaUpload />, 
      title: "Subir Comprobante", 
      link: "/subir-boleta",
      description: "Sube tu comprobante de pago"
    }
  ];

  useEffect(() => {
    setIsMenuOpen(false);
    setIsQuickActionsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-dropdown')) {
        setIsQuickActionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path, sectionId = null) => {
    if (location.pathname === '/') {
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        if (sectionId) {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
    setIsQuickActionsOpen(false);
  };

  const handleQuickActionClick = (link) => {
    navigate(link);
    setIsQuickActionsOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <button
            className="navbar-brand"
            onClick={() => handleNavigation('/')}
            aria-label="Ir al inicio"
          >
            <img src={logo} alt="Logo UMSS" className="navbar-logo" />
            <div className="navbar-brand-text">
              <h1 className="navbar-brand-title">ohSansi</h1>
              <p className="navbar-brand-subtitle">UMSS</p>
            </div>
          </button>

          <div className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
            <button
              className="navbar-close-menu"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <FaTimes />
            </button>

            <button
              className="navbar-link"
              onClick={() => handleNavigation('/')}
            >
              <FaHome className="navbar-link-icon" />
              <span>Inicio</span>
            </button>

            <button
              className="navbar-link"
              onClick={() => handleNavigation('/', 'areas')}
            >
              <FaFlask className="navbar-link-icon" />
              <span>Áreas</span>
            </button>

            <div className="navbar-dropdown">
              <button
                className={`navbar-link navbar-dropdown-trigger ${isQuickActionsOpen ? 'active' : ''}`}
                onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              >
                <FaUserPlus className="navbar-link-icon" />
                <span>Inscripción</span>
                <FaChevronDown className={`navbar-dropdown-arrow ${isQuickActionsOpen ? 'rotated' : ''}`} />
              </button>

              {isQuickActionsOpen && (
                <div className="navbar-dropdown-menu">
                  <div className="navbar-dropdown-header">
                    <h4>Proceso de Inscripción</h4>
                    <p>Accede directamente a cada paso</p>
                  </div>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="navbar-dropdown-item"
                      onClick={() => handleQuickActionClick(action.link)}
                    >
                      <div className="navbar-dropdown-item-icon">
                        {action.icon}
                      </div>
                      <div className="navbar-dropdown-item-content">
                        <span className="navbar-dropdown-item-title">{action.title}</span>
                        <span className="navbar-dropdown-item-desc">{action.description}</span>
                      </div>
                    </button>
                  ))}
                  <div className="navbar-dropdown-footer">
                    <button
                      className="navbar-dropdown-footer-btn"
                      onClick={() => handleNavigation('/', 'inscripcion')}
                    >
                      Ver información completa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            className="navbar-hamburger"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <FaBars />
          </button>
        </div>
      </nav>

      <Breadcrumbs />
    </>
  );
};

export default Navbar;