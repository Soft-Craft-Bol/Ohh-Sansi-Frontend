import React, { useEffect, useState } from 'react';
import {
  FaUserGraduate, FaUsers, FaSearch, FaMoneyCheckAlt,
  FaFileInvoice, FaUpload, FaFacebookF, FaInstagram,
  FaTiktok, FaSquareRootAlt, FaCalendarAlt, FaChevronRight,
  FaAtom, FaMicroscope, FaCheckCircle, FaClock
} from 'react-icons/fa';
import { GiChemicalDrop } from 'react-icons/gi';
import { IoMdRibbon } from 'react-icons/io';
import { getOlimpiadaPreinscripcion } from '../../api/api';
import './LandingPage.css';
import logo from '../../assets/img/logo.png';

const LandingPage = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('matematica');
  const [olimpiadaData, setOlimpiadaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOlimpiadaPreinscripcion();
        const data = response.data;

        // Validar periodo activo
        const today = new Date();
        const startDate = new Date(data.periodoOlimpiada.fechaInicio);
        const endDate = new Date(data.periodoOlimpiada.fechaFin);
        const isPeriodActive = today >= startDate && today <= endDate;

        setOlimpiadaData(data);
        setRegistrationOpen(isPeriodActive);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="landing-loading-container">Cargando información...</div>;
  if (error) return <div className="landing-error-container">Error: {error}</div>;

  const { olimpiada, periodoOlimpiada } = olimpiadaData;

  const areas = [
    {
      id: 'matematica',
      name: "Matemática",
      icon: <FaSquareRootAlt />,
      grades: "1ro a 6to de secundaria",
      color: "#2563eb",
      description: "Desarrolla tu pensamiento lógico y habilidades de resolución de problemas matemáticos complejos."
    },
    {
      id: 'fisica',
      name: "Física",
      icon: <FaAtom />,
      grades: "3ro a 6to de secundaria",
      color: "#7c3aed",
      description: "Explora los principios fundamentales del universo y las leyes físicas que lo gobiernan."
    },
    {
      id: 'quimica',
      name: "Química",
      icon: <GiChemicalDrop />,
      grades: "3ro a 6to de secundaria",
      color: "#059669",
      description: "Descubre la composición de la materia y sus fascinantes transformaciones químicas."
    },
    {
      id: 'biologia',
      name: "Biología",
      icon: <FaMicroscope />,
      grades: "3ro a 6to de secundaria",
      color: "#dc2626",
      description: "Estudia la vida y los organismos vivientes en todos sus niveles de organización."
    }
  ];

  const quickActions = [
    { icon: <FaUserGraduate />, title: "Inscripción Individual", link: "/inscripcion-individual" },
    { icon: <FaUsers />, title: "Inscripción Masiva", link: "/inscripcion-masiva" },
    { icon: <FaSearch />, title: "Consultar Estado", link: "/estado-de-inscripcion" },
    { icon: <FaMoneyCheckAlt />, title: "Métodos de Pago", link: "/metodo-pago" },
    { icon: <FaFileInvoice />, title: "Generar Orden", link: "/orden-de-pago" },
    { icon: <FaUpload />, title: "Subir Comprobante", link: "/subir-boleta" }
  ];

  return (
    <div className="landing-container">
      {/* Header minimalista */}
      <header className="landing-header">
        <div className="landing-header-content">
          <div className="landing-brand">
            <div className="landing-brand-icon">
              <IoMdRibbon />
            </div>
            <div className="landing-brand-text">
              <h1 className="landing-brand-title">ohSansi</h1>
              <p className="landing-brand-subtitle">UMSS</p>
            </div>
          </div>
          <nav className="landing-nav">
            <a href="#areas" className="landing-nav-link">Áreas</a>
            <a href="#inscripcion" className="landing-nav-link">Inscripción</a>
            <a href="#contacto" className="landing-nav-link">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Hero Section Minimalista */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <IoMdRibbon />
            <span>Edición {new Date(olimpiada.fechaInicio).getFullYear()}</span>
          </div>
          
          <h1 className="landing-hero-title">
            <span className="landing-title-main">{olimpiada.nombreOlimpiada}</span>
          </h1>
          
          <p className="landing-hero-subtitle">
            Facultad de Ciencias y Tecnología<br />
            Universidad Mayor de San Simón
          </p>

          <div className="landing-hero-info">
            <div className="landing-info-item">
              <FaMoneyCheckAlt />
              <span>Bs. {olimpiada.precioOlimpiada} por área</span>
            </div>
            <div className="landing-info-item">
              <FaCalendarAlt />
              <span>Hasta {new Date(periodoOlimpiada.fechaFin).toLocaleDateString()}</span>
            </div>
          </div>

          {registrationOpen && (
            <div className="landing-status-active">
              <FaCheckCircle />
              <span>Inscripciones abiertas</span>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      {registrationOpen ? (
        <section id="inscripcion" className="landing-actions">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Proceso de Inscripción</h2>
            <p className="landing-section-subtitle">Completa tu inscripción siguiendo estos pasos</p>
          </div>

          <div className="landing-actions-grid">
            {quickActions.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="landing-action-card"
              >
                <div className="landing-action-icon">
                  {item.icon}
                </div>
                <h3 className="landing-action-title">{item.title}</h3>
                <FaChevronRight className="landing-action-arrow" />
              </a>
            ))}
          </div>
        </section>
      ) : (
        <div className="landing-closed-message">
          <h3>Las inscripciones se encuentran cerradas</h3>
          <p>
            Próximo periodo: {periodoOlimpiada.nombrePeriodo}<br />
            {new Date(periodoOlimpiada.fechaInicio).toLocaleDateString()} - {' '}
            {new Date(periodoOlimpiada.fechaFin).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Areas Section */}
      <section id="areas" className="landing-areas">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Áreas de Competencia</h2>
          <p className="landing-section-subtitle">Elige el área científica que más te apasione</p>
        </div>

        <div className="landing-tabs">
          {areas.map(area => (
            <button
              key={area.id}
              className={`landing-tab ${activeTab === area.id ? 'landing-tab-active' : ''}`}
              onClick={() => setActiveTab(area.id)}
            >
              {area.name}
            </button>
          ))}
        </div>

        <div className="landing-area-content">
          {areas.filter(area => area.id === activeTab).map(area => (
            <div key={area.id} className="landing-area-card">
              <div 
                className="landing-area-icon" 
                style={{ backgroundColor: `${area.color}15`, color: area.color }}
              >
                {area.icon}
              </div>
              <div className="landing-area-info">
                <h3 className="landing-area-title" style={{ color: area.color }}>
                  {area.name}
                </h3>
                <p className="landing-area-description">{area.description}</p>
                <div className="landing-area-meta">
                  <FaUserGraduate />
                  <span>Grados: {area.grades}</span>
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

        <div className="landing-deadline">
          <FaCalendarAlt />
          <span>Inscripciones hasta: {new Date(periodoOlimpiada.fechaFin).toLocaleDateString()}</span>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-main">
            <div className="landing-footer-brand">
              <div className="landing-brand">
                <div className="landing-brand-icon">
                  <logo/>
                </div>
                <div className="landing-brand-text">
                  <h3 className="landing-brand-title">ohSansi</h3>
                  <p className="landing-brand-subtitle">UMSS</p>
                </div>
              </div>
              <p className="landing-footer-description">
                Olimpiadas Científicas de la Facultad de Ciencias y Tecnología, 
                Universidad Mayor de San Simón.
              </p>
            </div>

            <div className="landing-footer-contact">
              <h4 className="landing-footer-title">Contacto</h4>
              <div className="landing-contact-info">
                <div className="landing-contact-item">
                  <FaClock />
                  <span>Lun - Vie: 8:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className="landing-footer-social">
              <h4 className="landing-footer-title">Síguenos</h4>
              <div className="landing-social-links">
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
          </div>

          <div className="landing-footer-bottom">
            <p className="landing-footer-text">
              &copy; {new Date().getFullYear()} Olimpiadas Científicas ohSansi - UMSS.
              <span className="landing-footer-highlight">¡Descubre el científico que llevas dentro!</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;