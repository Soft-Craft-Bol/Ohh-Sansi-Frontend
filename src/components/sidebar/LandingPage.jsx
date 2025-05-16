import React, { useEffect } from 'react';
import { FaUserGraduate, FaUsers, FaSearch, FaMoneyCheckAlt, FaFileInvoice, FaUpload, FaFacebookF, FaInstagramSquare, FaTiktok, FaFlask, FaAtom, FaMicroscope } from 'react-icons/fa';
import { GiChemicalDrop, GiBrain } from 'react-icons/gi';
import './LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    // Cargar ScrollReveal solo cuando sea necesario
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      import('scrollreveal').then((ScrollReveal) => {
        ScrollReveal.default().reveal('.hero-content', { 
          duration: 1000, 
          origin: 'top', 
          distance: '100px',
          easing: 'cubic-bezier(0.5, 0, 0, 1)'
        });
        
        ScrollReveal.default().reveal('.action-card', { 
          duration: 800, 
          origin: 'bottom', 
          distance: '50px',
          interval: 200,
          easing: 'cubic-bezier(0.5, 0, 0, 1)'
        });
      });
    }

    // Efecto de partículas simplificado (solo 10 en móvil)
    const createParticles = () => {
      if (typeof window !== 'undefined' && document.querySelector('.particles-container')) {
        const container = document.querySelector('.particles-container');
        const particleCount = window.innerWidth < 768 ? 10 : 20;
        
        // Usar fragmento de documento para inserción masiva
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'science-particle';
          
          // Asignar posición y animación directamente
          particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-duration: ${5 + Math.random() * 10}s;
            animation-delay: ${Math.random() * 5}s;
            opacity: ${Math.random() * 0.3 + 0.1};
          `;
          
          fragment.appendChild(particle);
        }
        
        container.appendChild(fragment);
      }
    };

    // Retrasar la creación de partículas para priorizar contenido
    const particleTimeout = setTimeout(createParticles, 500);

    return () => {
      clearTimeout(particleTimeout);
      if (typeof window !== 'undefined' && document.querySelector('.particles-container')) {
        document.querySelector('.particles-container').innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="landing-container">
      {/* Fondo optimizado */}
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
            <a href="#acciones" className="btn-primary-landing">
              ¡Explorar!
            </a>
          </div>
        </div>
        
        {/* Elementos científicos estáticos (mejor performance) */}
        <FaAtom className="floating-atom" />
        <GiChemicalDrop className="floating-chemical" />
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
            </a>
          ))}
        </div>
      </section>

      <footer className="footer-ohsansi">
        <div className="social-icons">
          <a href="https://www.facebook.com/people/Ohsansi/61560666333554/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/ohsansi/" target="_blank" rel="noopener noreferrer">
            <FaInstagramSquare />
          </a>
          <a href="https://www.tiktok.com/@ohsansi" target="_blank" rel="noopener noreferrer">
            <FaTiktok />
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