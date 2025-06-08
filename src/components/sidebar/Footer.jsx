import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaClock, FaMailBulk, FaMailchimp } from 'react-icons/fa';
import logo from '../../assets/img/logo.png';
import './Footer.css';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contacto" className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-brand-info">
              <img src={logo} alt="Logo ohSansi" className="footer-logo" />
              <div className="footer-brand-text">
                <h3 className="footer-brand-title">ohSansi</h3>
                <p className="footer-brand-subtitle">UMSS</p>
              </div>
            </div>
            <p className="footer-description">
              Olimpiadas Científicas de la Facultad de Ciencias y Tecnología, 
              Universidad Mayor de San Simón.
            </p>
          </div>

          
            <h4 className="footer-title">Contacto</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <a 
                  href="mailto:ohsansi@umss.edu"
                >
                  <Mail className="footer-icon" />
                  <span>
                    ohsansi@umss.edu
                  </span>
                </a>
              </div>
            </div>
       

          <div className="footer-social">
            <h4 className="footer-title">Síguenos</h4>
            <div className="footer-social-links">
              <a 
                href="https://www.facebook.com/people/Ohsansi/61560666333554/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://www.instagram.com/ohsansi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://www.tiktok.com/@ohsansi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} Olimpiadas Científicas ohSansi - UMSS.
            <span className="footer-highlight">¡Descubre el científico que llevas dentro!</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;