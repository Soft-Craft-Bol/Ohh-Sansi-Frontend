import React, { useEffect, useState } from 'react';
import {
  FaUserGraduate, FaUsers, FaSearch, FaMoneyCheckAlt,
  FaFileInvoice, FaUpload, FaSquareRootAlt, FaCalendarAlt,
  FaChevronRight, FaAtom, FaMicroscope, FaCheckCircle
} from 'react-icons/fa';
import { GiChemicalDrop } from 'react-icons/gi';
import { IoMdRibbon } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { getOlimpiadaPreinscripcion, getConvocatoriaArea } from '../../api/api';
import './LandingPage.css';
import { formatGrados } from '../../utils/GradesOrder';
import NetworkErrorAlert from '../../pages/404NotFound/NetworkErrorAlert';

const staticOlimpiadaData = {
  olimpiada: {
    nombreOlimpiada: "OLIMPIADA CIENTÍFICA NACIONAL SAN SIMÓN 2024",
    anio: new Date().getFullYear(),
    precioOlimpiada: "50",
    idOlimpiada: "static"
  },
  periodoOlimpiada: {
    nombrePeriodo: "Periodo de Inscripción",
    fechaInicio: new Date(),
    fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  catalogoOlimpiada: [
    {
      nombreArea: "Matemática",
      grados: "6to a 12mo",
      descripcionArea: "Competencia de resolución de problemas matemáticos",
      idArea: "static-math"
    },
    {
      nombreArea: "Física",
      grados: "6to a 12mo",
      descripcionArea: "Competencia de principios y aplicaciones físicas",
      idArea: "static-physics"
    }
  ]
};

const LandingPage = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [olimpiadaData, setOlimpiadaData] = useState(staticOlimpiadaData);
  const [activeTab, setActiveTab] = useState('matematica');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfBase64, setPdfBase64] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [showNetworkError, setShowNetworkError] = useState(false);

  const getDynamicAreas = () => {
    if (!olimpiadaData?.catalogoOlimpiada) return [];

    return olimpiadaData.catalogoOlimpiada.map(catalogo => {
      let icon;
      switch(catalogo.nombreArea.toLowerCase()) {
        case 'matemática':
        case 'matematica':
          icon = <FaSquareRootAlt />;
          break;
        case 'física':
        case 'fisica':
          icon = <FaAtom />;
          break;
        case 'química':
        case 'quimica':
          icon = <GiChemicalDrop />;
          break;
        case 'biología':
        case 'biologia':
          icon = <FaMicroscope />;
          break;
        default:
          icon = <IoMdRibbon />;
      }

      const areaColors = {
        'matemática': '#2563eb',
        'matematica': '#2563eb',
        'física': '#7c3aed',
        'fisica': '#7c3aed',
        'química': '#059669',
        'quimica': '#059669',
        'biología': '#dc2626',
        'biologia': '#dc2626'
      };

      return {
        id: catalogo.nombreArea.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        name: catalogo.nombreArea,
        icon: icon,
        grades: formatGrados(catalogo.grados) || "6to a 12mo",
        color: areaColors[catalogo.nombreArea.toLowerCase()] || '#6b7280',
        description: catalogo.descripcionArea || `Competencia de ${catalogo.nombreArea}`,
        idArea: catalogo.idArea
      };
    });
  };

  const dynamicAreas = getDynamicAreas();

  const handleVerConvocatoria = async (area) => {
    try {
      if (olimpiadaData.olimpiada.idOlimpiada === "static") {
        window.alert('Estás viendo información de ejemplo. La convocatoria real no está disponible en este momento.');
        return;
      }

      const response = await getConvocatoriaArea(area.idArea, olimpiadaData.olimpiada.idOlimpiada);
      const data = response.data;
      if (data.convocatorias && data.convocatorias.length > 0) {
        setPdfBase64(data.convocatorias[0].pdf_base64);
        setModalTitle(area.name);
        setModalOpen(true);
      } else {
        window.alert('No hay convocatoria disponible para esta área.');
      }
    } catch (err) {
      window.alert('No se pudo obtener la convocatoria.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowNetworkError(false);
      
      const response = await getOlimpiadaPreinscripcion();
      const data = response.data;

      const today = new Date();
      const startDate = new Date(data.periodoOlimpiada.fechaInicio);
      const endDate = new Date(data.periodoOlimpiada.fechaFin);
      const isPeriodActive = today >= startDate && today <= endDate;

      setOlimpiadaData(data);
      setRegistrationOpen(isPeriodActive);
      
      if (data?.catalogoOlimpiada?.length > 0) {
        const firstArea = data.catalogoOlimpiada[0].nombreArea.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        setActiveTab(firstArea);
      }
    } catch (err) {
      setError(err.message || "Error al cargar los datos");
      setShowNetworkError(true);
      // Mantenemos los datos estáticos
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const quickActions = [
    { icon: <FaUserGraduate />, title: "Inscripción Individual", link: "/inscripcion-individual" },
    { icon: <FaUsers />, title: "Inscripción Masiva", link: "/inscripcion-masiva" },
    { icon: <FaSearch />, title: "Consultar Estado", link: "/estado-de-inscripcion" },
    { icon: <FaFileInvoice />, title: "Generar Orden", link: "/orden-de-pago" },
    { icon: <FaUpload />, title: "Subir Comprobante", link: "/subir-boleta" }
  ];

  const { olimpiada, periodoOlimpiada } = olimpiadaData;

  return (
    <div className="landing-container">
      {showNetworkError && (
        <NetworkErrorAlert 
          error={error} 
          onRetry={fetchData}
        />
      )}

      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-content">
            {loading ? (
              <div className="landing-skeleton" style={{width: '150px', height: '30px'}}></div>
            ) : (
              <div className="landing-hero-badge">
                <IoMdRibbon />
                <span>Edición {olimpiada.anio}</span>
              </div>
            )}
            
            <h1 className="landing-hero-title">
              {loading ? (
                <div className="landing-skeleton landing-skeleton-title"></div>
              ) : (
                <span className="landing-title-main">{olimpiada.nombreOlimpiada}</span>
              )}
            </h1>

            {loading ? (
              <div className="landing-skeleton landing-skeleton-text" style={{width: '70%', margin: '0 auto 2rem'}}></div>
            ) : (
              <p className="landing-hero-subtitle">
                Facultad de Ciencias y Tecnología<br />
                Universidad Mayor de San Simón
              </p>
            )}

            <div className="landing-hero-info">
              {loading ? (
                <>
                  <div className="landing-skeleton landing-skeleton-text" style={{width: '200px'}}></div>
                  <div className="landing-skeleton landing-skeleton-text" style={{width: '200px'}}></div>
                </>
              ) : (
                <>
                  <div className="landing-info-item">
                    <FaMoneyCheckAlt />
                    <span>Bs. {olimpiada.precioOlimpiada} por área</span>
                  </div>
                  <div className="landing-info-item">
                    <FaCalendarAlt />
                    <span>Hasta {new Date(periodoOlimpiada.fechaFin).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>

            {!loading && registrationOpen && olimpiadaData.olimpiada.idOlimpiada !== "static" && (
              <div className="landing-status-active">
                <FaCheckCircle />
                <span>Inscripciones abiertas</span>
              </div>
            )}

            {!loading && olimpiadaData.olimpiada.idOlimpiada === "static" && (
              <div className="landing-status-demo">
                <FaCheckCircle />
                <span>Modo demostración - Información de ejemplo</span>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions - Solo muestra si no está cargando y las inscripciones están abiertas */}
        {!loading && registrationOpen && olimpiadaData.olimpiada.idOlimpiada !== "static" ? (
          <section id="inscripcion" className="landing-actions">
            <div className="landing-section-header">
              <h2 className="landing-section-title">Proceso de Inscripción</h2>
              <p className="landing-section-subtitle">Completa tu inscripción siguiendo estos pasos</p>
            </div>

            <div className="landing-actions-grid">
              {quickActions.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="landing-action-card"
                >
                  <div className="landing-action-icon">
                    {item.icon}
                  </div>
                  <h3 className="landing-action-title">{item.title}</h3>
                  <FaChevronRight className="landing-action-arrow" />
                </Link>
              ))}
            </div>
          </section>
        ) : !loading && (
          <div className="landing-closed-message">
            <h3>
              {olimpiadaData.olimpiada.idOlimpiada === "static" 
                ? "Información de demostración - Inscripciones no disponibles" 
                : "Las inscripciones se encuentran cerradas"}
            </h3>
            <p>
              {olimpiadaData.olimpiada.idOlimpiada === "static" ? (
                "Conéctate a internet para ver la información real"
              ) : (
                <>
                  Próximo periodo: {periodoOlimpiada.nombrePeriodo}<br />
                  {new Date(periodoOlimpiada.fechaInicio).toLocaleDateString()} - {' '}
                  {new Date(periodoOlimpiada.fechaFin).toLocaleDateString()}
                </>
              )}
            </p>
          </div>
        )}

        {/* Areas Section */}
        <section id="areas" className="landing-areas">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              {loading ? (
                <div className="landing-skeleton landing-skeleton-text" style={{width: '250px', margin: '0 auto'}}></div>
              ) : (
                "Áreas de Competencia"
              )}
            </h2>
            <p className="landing-section-subtitle">
              {loading ? (
                <div className="landing-skeleton landing-skeleton-text" style={{width: '300px', margin: '0.5rem auto 0'}}></div>
              ) : (
                "Elige el área científica que más te apasione"
              )}
            </p>
          </div>

          {loading ? (
            <div className="landing-tabs">
              {[1, 2].map(i => (
                <div key={i} className="landing-skeleton" style={{width: '100px', height: '40px'}}></div>
              ))}
            </div>
          ) : dynamicAreas.length > 0 ? (
            <>
              <div className="landing-tabs">
                {dynamicAreas.map(area => (
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
                {dynamicAreas.filter(area => area.id === activeTab).map(area => (
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
                        onClick={() => handleVerConvocatoria(area)}
                      >
                        Ver convocatoria
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="landing-no-areas">
              <p>No hay áreas disponibles para esta olimpiada</p>
            </div>
          )}

          {!loading && (
            <div className="landing-deadline">
              <FaCalendarAlt />
              <span>Inscripciones hasta: {new Date(periodoOlimpiada.fechaFin).toLocaleDateString()}</span>
            </div>
          )}
        </section>
      </main>

      {modalOpen && (
        <div className="convocatoria-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="convocatoria-modal" onClick={e => e.stopPropagation()}>
            <div className="convocatoria-modal-header">
              <h3>{modalTitle}</h3>
              <button className="convocatoria-modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="convocatoria-modal-body">
              <embed
                src={`data:application/pdf;base64,${pdfBase64}`}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;