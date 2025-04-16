import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Step4Form.css";
import BuscadorCodigo from "../buscadorCodigo/BuscadorCodigo";
import { getTutorAreaParticipanteInfo, setTutorAreaParticipante } from "../../api/api";
import Swal from "sweetalert2";

const Step4Form = ({ formData, updateFormData, onNext, onPrev }) => {
  const [codigoIntroducido, setCodigoIntroducido] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [participanteData, setParticipanteData] = useState(null);
  const [tutoresAsignaciones, setTutoresAsignaciones] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigator = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleInputChange = (e) => {
    setCodigoIntroducido(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!codigoIntroducido.trim()) {
      setError("Por favor, introduce un código válido");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, introduce un código válido',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }
    
    setLoading(true);
    setError("");
    setParticipanteData(null);
    setTutoresAsignaciones([]);
    
    try {
      const response = await getTutorAreaParticipanteInfo(codigoIntroducido);
      const data = response.data;
      
      if (data.status === "success") {
        const nombreCompleto = `${data.participante.nombreParticipante} ${data.participante.apellidoPaterno} ${data.participante.apellidoMaterno || ''}`.trim();
        const tutoresFormateados = data.tutoresParticipante.map(tutor => {
          const tipoTutor = data.tipoTutores.find(tipo => tipo.idTipoTutor === tutor.idTipoTutor);
          const esTutorLegal = tipoTutor && tipoTutor.nombreTipoTutor === "LEGAL";
          
          return {
            id: tutor.idTutor,
            nombre: `${tutor.nombresTutor} ${tutor.apellidosTutor}`,
            ci: `${tutor.carnetIdentidadTutor}${tutor.complementoCiTutor ? tutor.complementoCiTutor : ''}`,
            tipo: tipoTutor ? tipoTutor.nombreTipoTutor : "DESCONOCIDO",
            area: esTutorLegal ? "NO CORRESPONDE" : "",
            areaId: null,
            esTutorLegal
          };
        });
        
        setParticipanteData({
          nombre: nombreCompleto,
          tutores: data.tutoresParticipante.length,
          academicos: data.tutoresParticipante.filter(tutor => {
            const tipoTutor = data.tipoTutores.find(tipo => tipo.idTipoTutor === tutor.idTipoTutor);
            return tipoTutor && tipoTutor.nombreTipoTutor === "ACADEMICO";
          }).length,
          areas: data.areasParticipante.map(area => area.nombreArea),
          areasData: data.areasParticipante,
          idParticipante: data.participante.idParticipante,
        });
        
        setTutoresAsignaciones(tutoresFormateados);
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Éxito',
        //   text: 'Datos del participante cargados correctamente',
        //   timer: 2000,
        //   timerProgressBar: true
        // });
      } else {
        setError("No se encontraron datos para el código ingresado");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontraron datos para el código ingresado',
        });
      }
    } catch (err) {
      console.error("Error al buscar los datos:", err);
      if (err.response) {
        const statusCode = err.response.status;
        const errorData = err.response.data;
        
        let errorMessage;
        if (statusCode === 404) {
          errorMessage = errorData.message || "No se encontró el participante con el CI proporcionado";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = "Error al buscar los datos del participante. Intente nuevamente.";
        }
        
        setError(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      } else if (err.message && err.message.includes("Network Error")) {
        const errorMessage = "Error de conexión. Verifique su conexión a internet.";
        setError(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: errorMessage,
        });
      } else {
        const errorMessage = "Error al buscar los datos del participante. Intente nuevamente.";
        setError(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    setSelectedIndex(index);
    setDropdownOpen(!dropdownOpen);
  };

  const selectArea = (areaId, nombreArea) => {
    const updatedTutores = [...tutoresAsignaciones];
    updatedTutores[selectedIndex].area = nombreArea;
    updatedTutores[selectedIndex].areaId = areaId;
    
    setTutoresAsignaciones(updatedTutores);
    setDropdownOpen(false);
  };

  const handleSubmitAsignaciones = async () => {
    const tutoresSinAsignar = tutoresAsignaciones.filter(tutor => !tutor.esTutorLegal && !tutor.area);
    
    if (tutoresSinAsignar.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Existen tutores académicos sin área asignada',
      });
      return;
    }
    const asignaciones = tutoresAsignaciones
      .filter(tutor => !tutor.esTutorLegal && tutor.areaId)
      .map(tutor => ({
        idTutor: tutor.id,
        idArea: tutor.areaId,
        idParticipante: participanteData.idParticipante
      }));

    console.log("Asignaciones a enviar:", asignaciones);
    
    if (asignaciones.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'No hay asignaciones para guardar',
      });
      return;
    }
    
    try {
      const confirmResult = await Swal.fire({
        icon: 'question',
        title: 'Confirmar asignación',
        text: '¿Estás seguro de que deseas asignar estas áreas a los tutores?',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      });
      
      if (confirmResult.isConfirmed) {
        setSubmitting(true);
        await setTutorAreaParticipante(asignaciones);
        
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Áreas asignadas correctamente a los tutores',
          timer: 2000,
          timerProgressBar: true
        });
        if (onNext) {
          onNext();
        }
        navigator("/home");
      }
    } catch (err) {
      console.error("Error al asignar áreas:", err);
      
      let errorMessage = "Error al asignar áreas a los tutores. Intente nuevamente.";
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          errorMessage = err.response.data.errors;
        }
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (codigoIntroducido === "666666") {
      handleSearch();
    }
  }, []);
  
  const getErrorMessage = (errorText) => {
    if (errorText.includes("Ci de participante no encontrado")) {
      return "CI de participante no encontrado, documento inválido";
    } else if (errorText.includes("No se encontraron areas de competencia")) {
      return "No se encontraron áreas de competencia registradas para el participante";
    } else if (errorText.includes("No se encontraron tutores académicos")) {
      return "No hay tutores académicos registrados para este participante";
    } else if (errorText.includes("No se encontraron tutores registrados")) {
      return "No se encontraron tutores registrados para el participante";
    } else {
      return errorText || "Error al procesar la solicitud";
    }
  };

  return (
    <div>
      <h2>Asociar áreas a tutores</h2>
      
      <BuscadorCodigo
        descripcion="Introduce el carnet del participante para obtener los tutores."
        placeholder="Introduce el CI del participante"
        codigoIntroducidoTexto="Carnet introducido:"
        codigoIntroducido={codigoIntroducido}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSearch={handleSearch}
        error={error}
        containerVariants={containerVariants}
      />
      
      {loading && <div className="loading">Cargando datos...</div>}
      
      {participanteData && tutoresAsignaciones.length > 0 && !loading && (
        <div className="detail-info-cont">
          <div className="info-card">
            <div className="info-header">
              <div className="info-user">
                <h3>{participanteData.nombre}</h3>
                <p>Cantidad de tutores registrados: {participanteData.tutores}</p>
                <p>Cantidad de académicos registrados: {participanteData.academicos}</p>
              </div>
              <div className="status-badge">
                {participanteData.areas.map((area, index) => (
                  <span key={index} className="status-complete area-badge">{area}</span>
                ))}
              </div>
            </div>
            
            <div className="info-table">
              <div className="table-header">
                <div className="col-nombre">NOMBRE DEL TUTOR</div>
                <div className="col-ci">CI TUTOR</div>
                <div className="col-tipo">TIPO TUTOR</div>
                <div className="col-area">SELECCION AREA</div>
              </div>
              
              <div className="table-body">
                {tutoresAsignaciones.map((tutor, index) => (
                  <div key={index} className="table-row">
                    <div className="col-nombre">{tutor.nombre}</div>
                    <div className="col-ci">{tutor.ci}</div>
                    <div className="col-tipo">{tutor.tipo}</div>
                    <div className="col-area">
                      {tutor.esTutorLegal ? (
                        <div className="no-corresponde status-chip pending">NO CORRESPONDE</div>
                      ) : (
                        <div className="area-selector-container">
                          <div 
                            className={`area-selector status-chip ${tutor.area ? 'complete' : 'generado'}`}
                            onClick={() => toggleDropdown(index)}
                          >
                            {tutor.area || "Seleccionar"}
                            <span className="dropdown-arrow">▼</span>
                          </div>
                          
                          {dropdownOpen && selectedIndex === index && (
                            <div className="area-dropdown">
                              {participanteData.areasData.map((area) => (
                                <div 
                                  key={area.idArea} 
                                  className="dropdown-item" 
                                  onClick={() => selectArea(area.idArea, area.nombreArea)}
                                >
                                  {area.nombreArea}
                                </div>
                              ))}
                              {participanteData.areasData.length > 1 && (
                                <div 
                                  className="dropdown-item"
                                  onClick={() => selectArea(0, participanteData.areasData.map(a => a.nombreArea).join(" y "))}
                                >
                                  {participanteData.areasData.map(a => a.nombreArea).join(" y ")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="upload-excel-container">
              <button 
                className="upload-excel-btn"
                onClick={handleSubmitAsignaciones}
                disabled={tutoresAsignaciones.some(t => !t.esTutorLegal && !t.area) || submitting}
              >
                {submitting ? 'Enviando...' : 'Asignar áreas a tutores'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Form;