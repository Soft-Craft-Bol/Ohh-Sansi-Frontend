import React, { useEffect, useState } from 'react';
import { 
  FaUserGraduate, FaUsers, FaSearch, FaMoneyCheckAlt, 
  FaFileInvoice, FaUpload, FaFacebookF, FaInstagram, 
  FaTiktok, FaFlask, FaAtom, FaMicroscope, FaSquareRootAlt, 
  FaCalendarAlt, FaChevronRight 
} from 'react-icons/fa';
import { GiChemicalDrop, GiBrain } from 'react-icons/gi';
import { IoMdRibbon } from 'react-icons/io';
import './LandingPage.css';

const LandingPage = () => {
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('matematica');

  useEffect(() => {
    // Animaciones y efectos
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      import('scrollreveal').then((ScrollReveal) => {
        const sr = ScrollReveal.default();
        
        sr.reveal('.landing-hero-content', {
          duration: 1000,
          distance: '40px',
          easing: 'cubic-bezier(0.5, 0, 0, 1)',
          scale: 0.95
        });

        sr.reveal('.landing-action-card', {
          duration: 800,
          distance: '30px',
          interval: 150,
          origin: 'bottom',
          easing: 'cubic-bezier(0.5, 0, 0, 1)'
        });

        sr.reveal('.landing-catalog-card', {
          duration: 800,
          distance: '30px',
          interval: 150,
          origin: 'bottom',
          easing: 'cubic-bezier(0.5, 0, 0, 1)'
        });
      });
    }

    // Efecto de partículas
    const createParticles = () => {
      if (typeof window !== 'undefined' && document.querySelector('.landing-particles-container')) {
        const container = document.querySelector('.landing-particles-container');
        const particleCount = window.innerWidth < 768 ? 15 : 30;
        const fragment = document.createDocumentFragment();
        const scienceIcons = ['🧪', '🔬', '⚗️', '🧫', '🔭', '📊', '🧮', '⚛️'];

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'landing-science-particle';
          particle.textContent = scienceIcons[Math.floor(Math.random() * scienceIcons.length)];
          particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: ${1 + Math.random() * 1.5}rem;
            animation-duration: ${10 + Math.random() * 20}s;
            animation-delay: ${Math.random() * 5}s;
            opacity: ${0.2 + Math.random() * 0.3};
          `;
          fragment.appendChild(particle);
        }
        container.innerHTML = '';
        container.appendChild(fragment);
      }
    };

    const particleTimeout = setTimeout(createParticles, 500);
    return () => clearTimeout(particleTimeout);
  }, []);

  const areas = [
    {
      id: 'matematica',
      name: "Matemática",
      icon: <FaSquareRootAlt />,
      grades: "1ro a 6to de secundaria",
      color: "#1a4b8c",
      description: "Desarrolla tu pensamiento lógico y resolución de problemas matemáticos complejos."
    },
    {
      id: 'fisica',
      name: "Física",
      icon: <FaAtom />,
      grades: "3ro a 6to de secundaria",
      color: "#2a6fdb",
      description: "Explora los principios fundamentales del universo y las leyes que lo gobiernan."
    },
    {
      id: 'quimica',
      name: "Química",
      icon: <GiChemicalDrop />,
      grades: "3ro a 6to de secundaria",
      color: "#3a86ff",
      description: "Descubre la composición de la materia y sus transformaciones."
    },
    {
      id: 'biologia',
      name: "Biología",
      icon: <FaMicroscope />,
      grades: "3ro a 6to de secundaria",
      color: "#4d9eff",
      description: "Estudia la vida y los organismos en todos sus niveles de organización."
    }
  ];

  const quickActions = [
    { icon: <FaUserGraduate />, title: "Inscripción Individual", link: "/inscripcion-individual" },
    { icon: <FaUsers />, title: "Inscripción Masiva", link: "/inscripcion-masiva" },
    { icon: <FaSearch />, title: "Consultar Estado", link: "/estado-de-inscripcion" },
    { icon: <FaMoneyCheckAlt />, title: "Método de Pago", link: "/metodo-pago" },
    { icon: <FaFileInvoice />, title: "Generar Orden", link: "/orden-de-pago" },
    { icon: <FaUpload />, title: "Subir Boleta", link: "/subir-boleta" }
  ];

  return (
    <div className="landing-container">
      {/* Fondo con efecto de partículas */}
      <div className="landing-hero-background">
        <div className="landing-wave landing-wave1"></div>
        <div className="landing-wave landing-wave2"></div>
        <div className="landing-wave landing-wave3"></div>
        <div className="landing-particles-container"></div>
      </div>

      {/* Sección Hero */}
      <header className="landing-hero-section">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <IoMdRibbon /> Edición 2024
          </div>
          <h1>
            <span className="landing-title-gradient">Olimpiadas Científicas</span>
            <span className="landing-title-brand">ohSansi</span>
          </h1>
          <p className="landing-hero-subtitle">
            <FaFlask className="landing-inline-icon" />
            Facultad de Ciencias y Tecnología - Universidad Mayor de San Simón
            <FaMicroscope className="landing-inline-icon" />
          </p>
          <div className="landing-cta-container">
            <a href="#catalogo" className="landing-btn-primary">
              Ver áreas de competencia <FaChevronRight />
            </a>
            <a href="#acciones" className="landing-btn-secondary">
              Inscripciones <FaChevronRight />
            </a>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <FaAtom className="landing-floating-atom" />
        <GiChemicalDrop className="landing-floating-chemical" />
      </header>

      {/* Banner de estado */}
      {registrationOpen && (
        <div className="landing-status-banner">
          <div className="landing-status-content">
            <span className="landing-status-badge">
              <FaCalendarAlt className="landing-status-icon" />
              Pre-inscripciones abiertas
            </span>
            <p className="landing-status-text">
              Periodo activo hasta el 30 de noviembre | 
              <span className="landing-status-highlight"> ¡Postula ahora!</span>
            </p>
          </div>
        </div>
      )}

      {/* Sección de catálogo */}
      <section id="catalogo" className="landing-catalog-section">
        <div className="landing-section-header">
          <h2 className="landing-section-title">
            <span className="landing-title-decorator landing-left"></span>
            Áreas de Competencia
            <span className="landing-title-decorator landing-right"></span>
          </h2>
          <p className="landing-section-subtitle">Selecciona un área para conocer los detalles</p>
        </div>

        {/* Pestañas de áreas */}
        <div className="landing-tabs-container">
          {areas.map(area => (
            <button
              key={area.id}
              className={`landing-tab ${activeTab === area.id ? 'active' : ''}`}
              style={{ borderBottomColor: activeTab === area.id ? area.color : 'transparent' }}
              onClick={() => setActiveTab(area.id)}
            >
              {area.name}
            </button>
          ))}
        </div>

        {/* Contenido de área activa */}
        <div className="landing-tab-content">
          {areas.filter(area => area.id === activeTab).map(area => (
            <div key={area.id} className="landing-area-detail">
              <div className="landing-area-icon" style={{ backgroundColor: `${area.color}20` }}>
                {React.cloneElement(area.icon, { style: { color: area.color } })}
              </div>
              <div className="landing-area-info">
                <h3 style={{ color: area.color }}>{area.name}</h3>
                <p>{area.description}</p>
                <div className="landing-area-meta">
                  <span className="landing-meta-item">
                    <FaUserGraduate /> Grados: {area.grades}
                  </span>
                  <span className="landing-meta-item">
                    <FaCalendarAlt /> Inscripciones hasta: 30/11/2024
                  </span>
                </div>
                <button 
                  className="landing-btn-primary"
                  style={{ backgroundColor: area.color }}
                >
                  Ver temario completo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Grid de áreas (versión alternativa) */}
        <div className="landing-catalog-grid">
          {areas.map((area, index) => (
            <div 
              key={index} 
              className="landing-catalog-card"
              style={{ 
                borderTop: `4px solid ${area.color}`,
                boxShadow: `0 10px 20px ${area.color}20`
              }}
            >
              <div className="landing-catalog-icon" style={{ color: area.color }}>
                {area.icon}
              </div>
              <h3>{area.name}</h3>
              <p className="landing-catalog-description">{area.description}</p>
              <div className="landing-catalog-grades">
                <FaUserGraduate />
                <span>{area.grades}</span>
              </div>
              <button 
                className="landing-catalog-button"
                style={{ backgroundColor: area.color }}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Acciones rápidas */}
      <section id="acciones" className="landing-quick-actions">
        <div className="landing-section-header">
          <h2 className="landing-section-title">
            <span className="landing-title-decorator landing-left"></span>
            Accesos Directos
            <span className="landing-title-decorator landing-right"></span>
          </h2>
          <p className="landing-section-subtitle">Realiza tus trámites de inscripción fácilmente</p>
        </div>

        <div className="landing-actions-grid">
          {quickActions.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              className={`landing-action-card ${!registrationOpen ? 'landing-actions-disabled' : ''}`}
            >
              <div className="landing-card-hover-effect"></div>
              <div className="landing-icon-container">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <span className="landing-action-arrow">
                <FaChevronRight />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <h3 className="landing-title-brand">ohSansi</h3>
            <p>Olimpiadas Científicas</p>
            <p>Facultad de Ciencias y Tecnología</p>
            <p>Universidad Mayor de San Simón</p>
          </div>
          
          <div className="landing-social-icons">
            <a href="https://www.facebook.com/people/Ohsansi/61560666333554/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/ohsansi/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@ohsansi" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>
          </div>
        </div>
        
        <p className="landing-footer-text">
          &copy; 2025 Olimpiadas Científicas ohSansi - UMSS.
          <span className="landing-footer-highlight">¡Descubre el científico que llevas dentro!</span>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;