import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Users, MapPin, GraduationCap } from 'lucide-react';
import { getCatalogoOlimpiada, getReporteInscritos } from '../../../api/api';
import { exportToPDFInscritos, exportToExcelInscritos, exportToCSVInscritos } from '../../../utils/exportUtils';
import './ListaInscritos.css';

const ListaInscritos = () => {
  const [selectedOlimpiada, setSelectedOlimpiada] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  
  // Estados para los datos del catálogo
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [catalogoCompleto, setCatalogoCompleto] = useState([]);

  // Cargar catálogo al montar el componente
  useEffect(() => {
    cargarCatalogo();
  }, []);

  // Actualizar áreas cuando cambie la olimpiada seleccionada
  useEffect(() => {
    if (selectedOlimpiada && catalogoCompleto.length > 0) {
      console.log('Olimpiada seleccionada:', selectedOlimpiada);
      console.log('Catálogo completo:', catalogoCompleto);
      
      // Extraer áreas únicas de la olimpiada seleccionada
      const areasOlimpiada = catalogoCompleto
        .filter(item => item.nombreOlimpiada === selectedOlimpiada)
        .map(item => item.nombreArea)
        .filter((area, index, self) => self.indexOf(area) === index); // Remover duplicados
      
      console.log('Áreas encontradas:', areasOlimpiada);
      setAreas(areasOlimpiada);
      setSelectedArea(''); // Resetear área seleccionada
    } else {
      setAreas([]);
      setSelectedArea('');
    }
  }, [selectedOlimpiada, catalogoCompleto]);

  const cargarCatalogo = async () => {
    try {
      setLoadingCatalogo(true);
      const response = await getCatalogoOlimpiada();
      
      console.log('Respuesta completa:', response);
      
      // La respuesta de Axios viene en response.data
      const data = response?.data || response;
      
      console.log('Data extraída:', data);
      
      if (data && Array.isArray(data)) {
        setCatalogoCompleto(data);
        
        // Extraer olimpiadas únicas
        const olimpiadasUnicas = data
          .map(item => item.nombreOlimpiada)
          .filter((olimpiada, index, self) => self.indexOf(olimpiada) === index);
        
        console.log('Olimpiadas únicas:', olimpiadasUnicas);
        setOlimpiadas(olimpiadasUnicas);
      } else {
        console.error('Los datos no son un array válido:', data);
      }
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      alert('Error al cargar el catálogo de olimpiadas');
    } finally {
      setLoadingCatalogo(false);
    }
  };

  const handleGenerarReporte = async () => {
    if (!selectedOlimpiada) {
      alert('Por favor selecciona una olimpiada');
      return;
    }

    setLoading(true);
    
    try {
      // Preparar parámetros para la API
      const params = {
        olimpiada: selectedOlimpiada,
        ...(selectedArea && { area: selectedArea })
      };
      
      const response = await getReporteInscritos(params);
      
      if (response && Array.isArray(response)) {
        setInscritos(response);
      } else {
        // Si no hay datos, usar datos de ejemplo para prueba
        const datosEjemplo = [
          {
            apellido_paterno: "Coria",
            apellido_materno: "Pereddo", 
            nombre_participante: "Jorge",
            id_inscripcion: 2105,
            nombre_colegio: "NUEVA ESTRELLA IRPA GRANDE",
            nombre_municipio: "TEOPONTE",
            nombre_departamento: "LA PAZ"
          },
          {
            apellido_paterno: "Rolon",
            apellido_materno: "Martinez",
            nombre_participante: "Sofia",
            id_inscripcion: 2106,
            nombre_colegio: "KANATA",
            nombre_municipio: "Cochabamba",
            nombre_departamento: "COCHABAMBA"
          },
          {
            apellido_paterno: "DIAZ CASTRO",
            apellido_materno: "",
            nombre_participante: "ADRIANA CAMILA",
            id_inscripcion: 2107,
            nombre_colegio: "KANATA",
            nombre_municipio: "Cochabamba", 
            nombre_departamento: "SACABA"
          }
        ];
        setInscritos(datosEjemplo);
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte');
      setInscritos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportarPDF = () => {
    if (inscritos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    const titulo = `Lista de Inscritos - ${selectedOlimpiada}${selectedArea ? ` - ${selectedArea}` : ''}`;
    exportToPDFInscritos(inscritos, titulo, selectedArea);
  };

  const handleExportarExcel = () => {
    if (inscritos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    const titulo = `Lista de Inscritos - ${selectedOlimpiada}${selectedArea ? ` - ${selectedArea}` : ''}`;
    exportToExcelInscritos(inscritos, titulo);
  };

  const handleExportarCSV = () => {
    if (inscritos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    const titulo = `Lista de Inscritos - ${selectedOlimpiada}${selectedArea ? ` - ${selectedArea}` : ''}`;
    exportToCSVInscritos(inscritos, titulo);
  };

  if (loadingCatalogo) {
    return (
      <div className="ra-lista-inscritos">
        <div className="ra-main-content">
          <div className="ra-loading-state">
            <div className="ra-spinner"></div>
            <p>Cargando catálogo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ra-lista-inscritos">
      <div className="ra-main-content">
        {/* Filtros */}
        <div className="ra-filters-card">
          <div className="ra-filters-header">
            <Filter className="ra-filter-icon" />
            <h2 className="ra-filters-title">Filtros de Búsqueda</h2>
          </div>
          
          <div className="ra-filters-grid">
            <div>
              <label className="ra-label">
                Olimpiada *
              </label>
              <select
                value={selectedOlimpiada}
                onChange={(e) => setSelectedOlimpiada(e.target.value)}
                className="ra-select"
                disabled={loadingCatalogo}
              >
                <option value="">Seleccionar olimpiada</option>
                {olimpiadas.map((olimpiada, index) => (
                  <option key={index} value={olimpiada}>
                    {olimpiada}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="ra-label">
                Área
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="ra-select"
                disabled={!selectedOlimpiada || areas.length === 0}
              >
                <option value="">Todas las áreas</option>
                {areas.map((area, index) => (
                  <option key={index} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="ra-button-container">
              <button
                onClick={handleGenerarReporte}
                disabled={loading || !selectedOlimpiada}
                className="ra-button-primary"
              >
                {loading ? (
                  <>
                    <div className="ra-spinner"></div>
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <FileText className="ra-icon" />
                    <span>Generar Reporte</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {inscritos.length > 0 && (
          <div className="ra-results-card">
            {/* Header del reporte */}
            <div className="ra-results-header">
              <div className="ra-results-header-content">
                <div>
                  <h3 className="ra-results-title">
                    {selectedOlimpiada} {selectedArea && `- ${selectedArea}`}
                  </h3>
                  <div className="ra-results-stats">
                    <div className="ra-stat-item">
                      <Users className="ra-icon" />
                      <span>
                        {inscritos.length} participantes
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Botones de exportación */}
                <div className="ra-export-buttons">
                  <button
                    onClick={handleExportarPDF}
                    className="ra-button-export"
                  >
                    <Download className="ra-icon" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={handleExportarExcel}
                    className="ra-button-export"
                  >
                    <Download className="ra-icon" />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={handleExportarCSV}
                    className="ra-button-export"
                  >
                    <Download className="ra-icon" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla responsive */}
            <div className="ra-table-container">
              <table className="ra-table">
                <thead className="ra-table-header">
                  <tr>
                    <th className="ra-table-th">
                      Apellidos y Nombres
                    </th>
                    <th className="ra-table-th">
                      Colegio
                    </th>
                    <th className="ra-table-th">
                      Ubicación
                    </th>
                    <th className="ra-table-th">
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className="ra-table-tbody">
                  {inscritos.map((inscrito, index) => (
                    <tr key={inscrito.id_inscripcion || index} className="ra-table-row">
                      <td className="ra-table-td">
                        <div className="ra-participant-name">
                          {inscrito.apellido_paterno} {inscrito.apellido_materno}
                        </div>
                        <div className="ra-participant-firstname">
                          {inscrito.nombre_participante}
                        </div>
                      </td>
                      <td className="ra-table-td">
                        <div className="ra-college-info">
                          <GraduationCap className="ra-college-icon" />
                          <span className="ra-college-name">
                            {inscrito.nombre_colegio}
                          </span>
                        </div>
                      </td>
                      <td className="ra-table-td">
                        <div className="ra-location-info">
                          <MapPin className="ra-location-icon" />
                          <div className="ra-location-text">
                            <div>{inscrito.nombre_municipio}</div>
                            <div className="ra-location-department">
                              {inscrito.nombre_departamento}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="ra-table-td">
                        <span className="ra-id-badge">
                          #{inscrito.id_inscripcion}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer con información adicional */}
            <div className="ra-results-footer">
              <div className="ra-footer-text">
                <p className="ra-footer-org">
                  Organizado por Universidad Mayor de San Simón
                </p>
                <p className="ra-footer-date">
                  Reporte generado el {new Date().toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {inscritos.length === 0 && !loading && (
          <div className="ra-empty-state">
            <FileText className="ra-empty-icon" />
            <h3 className="ra-empty-title">
              No hay datos para mostrar
            </h3>
            <p className="ra-empty-description">
              Selecciona una olimpiada y genera el reporte para ver los inscritos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaInscritos;