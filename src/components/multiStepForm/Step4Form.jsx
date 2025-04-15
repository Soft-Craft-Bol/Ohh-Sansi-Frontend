import React, { useState, useEffect } from "react";
import "./Step4Form.css";
import BuscadorCodigo from "../buscadorCodigo/BuscadorCodigo";

const Step4Form = ({ formData, updateFormData, onNext, onPrev }) => {
  const [codigoIntroducido, setCodigoIntroducido] = useState("14382800");
  const [error, setError] = useState("");
  const [participanteData, setParticipanteData] = useState({
    nombre: "Alfredo Ernesto Torrico Garcia",
    tutores: 2,
    academicos: 1,
    tutoresData: [
      {
        nombre: "Delfino Suarez Gómez",
        ci: "3123123123123",
        tipo: "LEGAL",
        area: "NO CORRESPONDE"
      },
      {
        nombre: "Alberto Peredo Lopez",
        ci: "84516112",
        tipo: "ACADEMIDO",
        area: ""
      }
    ],
    areas: ["MATEMÁTICAS", "FÍSICA"]
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

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

  const handleSearch = () => {
    // Aquí iría la lógica real para buscar el código
    // Por ahora solo validamos que no esté vacío
    if (!codigoIntroducido.trim()) {
      setError("Por favor, introduce un código válido");
    } else {
      setError("");
      // Aquí se cargarían los datos del participante desde una API
    }
  };

  const toggleDropdown = (index) => {
    setSelectedIndex(index);
    setDropdownOpen(!dropdownOpen);
  };

  const selectArea = (area) => {
    // Aquí actualizarías el área seleccionada
    const updatedTutores = [...participanteData.tutoresData];
    updatedTutores[selectedIndex].area = area;
    
    setParticipanteData({
      ...participanteData,
      tutoresData: updatedTutores
    });
    
    setDropdownOpen(false);
  };

  return (
    <div >
      <h2>Asociar áreas a tutores</h2>
      
      <BuscadorCodigo
        descripcion="Introduce el carnet del participante para obtener los tutores."
        placeholder="Introduce el ci del participante"
        codigoIntroducidoTexto="Carnet introducido:"
        codigoIntroducido={codigoIntroducido}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSearch={handleSearch}
        error={error}
        containerVariants={containerVariants}
      />
      
      {codigoIntroducido && !error && (
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
                {participanteData.tutoresData.map((tutor, index) => (
                  <div key={index} className="table-row">
                    <div className="col-nombre">{tutor.nombre}</div>
                    <div className="col-ci">{tutor.ci}</div>
                    <div className="col-tipo">{tutor.tipo}</div>
                    <div className="col-area">
                      {tutor.area === "NO CORRESPONDE" ? (
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
                              <div className="dropdown-item" onClick={() => selectArea("Matemáticas")}>
                                Matemáticas
                              </div>
                              <div className="dropdown-item" onClick={() => selectArea("Física")}>
                                Física
                              </div>
                              <div className="dropdown-item" onClick={() => selectArea("Matemáticas y Física")}>
                                Matemáticas y Física
                              </div>
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
              <button className="upload-excel-btn">
                Asignat áreas a tutores
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Form;