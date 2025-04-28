import React, { useEffect } from 'react';
import { FaUserGraduate, FaUsers, FaSearch, FaMoneyCheckAlt, FaFileInvoice, FaUpload, FaFacebookF, FaInstagramSquare, FaTiktok, FaFlask, FaAtom, FaMicroscope } from 'react-icons/fa';
import { GiChemicalDrop, GiBrain } from 'react-icons/gi';
import ScrollReveal from 'scrollreveal';
import './LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    // Configuración de ScrollReveal
    ScrollReveal().reveal('.hero-content', { 
      duration: 1000, 
      origin: 'top', 
      distance: '100px', 
      reset: false,
      easing: 'cubic-bezier(0.5, 0, 0, 1)'
    });
    
    ScrollReveal().reveal('.action-card', { 
      duration: 800, 
      origin: 'bottom', 
      distance: '50px', 
      reset: false,
      interval: 200,
      easing: 'cubic-bezier(0.5, 0, 0, 1)'
    });
    
    ScrollReveal().reveal('.footer-ohsansi', { 
      duration: 1000, 
      origin: 'bottom', 
      distance: '50px', 
      reset: false 
    });

    // Efecto de partículas científicas
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'science-particle';
      
      // Tipos de partículas (átomos, moléculas, etc.)
      const types = ['atom', 'molecule', 'flask', 'brain'];
      const type = types[Math.floor(Math.random() * types.length)];
      particle.classList.add(type);
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${5 + Math.random() * 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      
      document.querySelector('.particles-container').appendChild(particle);
    };

    // Crear partículas
    for (let i = 0; i < 30; i++) {
      createParticle();
    }

    return () => {
      document.querySelectorAll('.science-particle').forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="landing-container">
      {/* Fondo con efecto de olas y partículas */}
      <div className="hero-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="particles-container"></div>
      </div>

      <header className="hero-section">
        <div className="hero-content">
          <h1>
            <span className="title-gradient">Olimpiadas Científicas</span>
            <span className="title-ohsansi">ohSansi</span>
          </h1>
          <p className="hero-subtitle">
            <FaFlask className="inline-icon" /> 
            Facultad de Ciencias y Tecnología - Universidad Mayor de San Simón
            <FaMicroscope className="inline-icon" />
          </p>
          <div className="cta-container">
            <a href="#acciones" className="btn-primary-landing pulse-animation">
              ¡Explorar!
              <span className="hover-effect"></span>
            </a>
          </div>
        </div>
        
        {/* Elementos científicos flotantes */}
        <div className="floating-elements">
          <FaAtom className="floating-atom" />
          <GiChemicalDrop className="floating-chemical" />
          <GiBrain className="floating-brain" />
        </div>
      </header>

      <section id="acciones" className="quick-actions">
        <h2 className="section-title">
          <span className="title-decorator left"></span>
          Accesos Directos
          <span className="title-decorator right"></span>
        </h2>
        
        <div className="actions-grid">
          {[
            { icon: <FaUserGraduate />, title: "Inscripción Individual", link: "/inscripcion-individual" },
            { icon: <FaUsers />, title: "Inscripción Masiva", link: "/inscripcion-masiva" },
            { icon: <FaSearch />, title: "Consultar Estado", link: "/estado-de-inscripcion" },
            { icon: <FaMoneyCheckAlt />, title: "Método de Pago", link: "/metodo-pago" },
            { icon: <FaFileInvoice />, title: "Generar Orden", link: "/orden-de-pago" },
            { icon: <FaUpload />, title: "Subir Boleta", link: "/subir-boleta" }
          ].map((item, index) => (
            <a key={index} href={item.link} className="action-card">
              <div className="icon-container">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <div className="card-hover-effect"></div>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer-ohsansi">
        <div className="social-icons">
          <a href="https://www.facebook.com/people/Ohsansi/61560666333554/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
            <span className="social-tooltip">Facebook</span>
          </a>
          <a href="https://www.instagram.com/ohsansi/" target="_blank" rel="noopener noreferrer">
            <FaInstagramSquare />
            <span className="social-tooltip">Instagram</span>
          </a>
          <a href="https://www.tiktok.com/@ohsansi" target="_blank" rel="noopener noreferrer">
            <FaTiktok />
            <span className="social-tooltip">TikTok</span>
          </a>
        </div>
        <p className="footer-text">
          &copy; 2025 Olimpiadas Científicas ohSansi - UMSS.
          <span className="footer-highlight">¡Descubre el científico que llevas dentro!</span>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;