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

const LandingPage = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [olimpiadaData, setOlimpiadaData] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfBase64, setPdfBase64] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Función para generar las áreas dinámicas
  const getDynamicAreas = () => {
    if (!olimpiadaData?.catalogoOlimpiada) return [];

    return olimpiadaData.catalogoOlimpiada.map(catalogo => {
      // Asigna iconos según el área
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

      // Define colores por área
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
        grades: formatGrados(catalogo.grados),
        color: areaColors[catalogo.nombreArea.toLowerCase()] || '#6b7280',
        description: catalogo.descripcionArea || `Competencia de ${catalogo.nombreArea}`
      };
    });
  };

  // Obtener las áreas dinámicas
  const dynamicAreas = getDynamicAreas();
  const handleVerConvocatoria = async (area) => {
    try {
      const areaObj = olimpiadaData.catalogoOlimpiada.find(
        a => a.nombreArea.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === area.id
      );
      if (!areaObj) return;

      const idArea = areaObj.idArea;
      const idOlimpiada = olimpiadaData.olimpiada.idOlimpiada;

      const response = await getConvocatoriaArea(idArea, idOlimpiada);
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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOlimpiadaPreinscripcion();
        const data = response.data;

        const today = new Date();
        const startDate = new Date(data.periodoOlimpiada.fechaInicio);
        const endDate = new Date(data.periodoOlimpiada.fechaFin);
        const isPeriodActive = today >= startDate && today <= endDate;

        setOlimpiadaData(data);
        setRegistrationOpen(isPeriodActive);
        setError(null);
        
        // Establecer la primera pestaña como activa después de cargar los datos
        if (data?.catalogoOlimpiada?.length > 0) {
          const firstArea = data.catalogoOlimpiada[0].nombreArea.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          setActiveTab(firstArea);
        }
      } catch (err) {
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-container">Cargando información...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!olimpiadaData) {
    return null;
  }

  const { olimpiada, periodoOlimpiada } = olimpiadaData;

  const quickActions = [
    { icon: <FaUserGraduate />, title: "Inscripción Individual", link: "/inscripcion-individual" },
    { icon: <FaUsers />, title: "Inscripción Masiva", link: "/inscripcion-masiva" },
    { icon: <FaSearch />, title: "Consultar Estado", link: "/estado-de-inscripcion" },
    { icon: <FaFileInvoice />, title: "Generar Orden", link: "/orden-de-pago" },
    { icon: <FaUpload />, title: "Subir Comprobante", link: "/subir-boleta" }
  ];

  return (
    <div className="landing-container">
      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-content">
            <div className="landing-hero-badge">
              <IoMdRibbon />
              <span>Edición {olimpiada.anio}</span>
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

          {dynamicAreas.length > 0 ? (
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

          <div className="landing-deadline">
            <FaCalendarAlt />
            <span>Inscripciones hasta: {new Date(periodoOlimpiada.fechaFin).toLocaleDateString()}</span>
          </div>
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