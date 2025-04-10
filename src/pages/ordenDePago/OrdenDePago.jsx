import React, { useState, useEffect } from 'react';
import "./OrdenDePago.css";
import Header from "../../components/header/Header";
import { FaSearch } from 'react-icons/fa';
import OrdenPagoDetalle from "../../components/ordenPagoDetalle/OrdenPagoDetalle";
import { getOrdenPagoDetailInfo, createOrdenPago } from "../../api/api";

const OrdenDePago = () => {
  const [inputValue, setInputValue] = useState("");
  const [codigoIntroducido, setCodigoIntroducido] = useState("");
  const [ordenData, setOrdenData] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setCodigoIntroducido(inputValue.trim());
      setInputValue("");
    }
  };

  useEffect(() => {
    const fetchOrdenData = async () => {
      if (codigoIntroducido) {
        try {
          const response = await getOrdenPagoDetailInfo(codigoIntroducido);
          setOrdenData(response.data);
          console.log("Datos recibidos:", response.data);
        } catch (error) {
          console.error("Error al obtener los datos de la orden de pago:", error);
          setOrdenData(null);
        }
      }
    };
    fetchOrdenData();
  }, [codigoIntroducido]);
    
  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleGenerarOrden = () => {
    setMostrarDetalle(true);
  };

  const renderInputSection = () => (
    <div className="buscador-codigo">
      <p>Genera la orden de pago referente a la inscripción, introduciendo el código</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Introduce el código"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
      </div>
      <div className="cont-cod-int">
        <p className="code-text">Código introducido: </p>
        <span className="codigo-introducido">{codigoIntroducido || "sin código"}</span>
      </div>
    </div>
  );

  const renderInfoSection = () => {
    if (!ordenData) return null;
  
    const participantes = ordenData.participantes || [];
    const areas = ordenData.areas || [];
    const tutores = ordenData.tutores || [];
  
    const totalParticipantes = participantes.length;
    const totalAreas = areas.length;
    console.log(areas.length);
  
    const primerTutor = tutores.length > 0 ? tutores[0] : null;
    const nombreResponsable = primerTutor
      ? `${primerTutor.nombres_tutor || ""} ${primerTutor.apellidos_tutor || ""}`.trim()
      : "No disponible";
    const correoResponsable = primerTutor?.email_tutor || "No disponible";
  
    const costoPorArea = 35;
    const totalInscripciones = costoPorArea;
    const totalAPagar = totalParticipantes * costoPorArea;
  
    return (
      <div className='info-box'>
        <div className='resumen'>
          <h3>Resumen de la inscripción</h3>
          <p>Total de participantes: <span className="bold-blue">{totalParticipantes}</span></p>
          <p>Total áreas inscritas: <span className="bold-blue">{totalAreas}</span></p>
          <p>Nombre del responsable de la inscripción: <span className="bold-blue">{nombreResponsable}</span></p>
          <p>Correo del responsable de la inscripción: <span className="bold-blue">{correoResponsable}</span></p>
        </div>
        <div className='divider'></div>
        <div className='pago'>
          <h3>Detalles del pago</h3>
          <p>Total inscripciones: <span className="bold-blue">{totalInscripciones} bs.</span></p>
          <p>Costo por área: <span className="bold-blue">{costoPorArea} bs.</span></p>
          <p className='total-pagar'>Total a pagar: </p>
          <span className="big-bold-blue">{totalAPagar} bs.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="orden-de-pago">
      <Header
        title="Generación de Orden de Pago"
        description="Genera la orden de pago para el participante previamente inscrito en la olimpiada, buscando con el código de inscripción brindado al finalizar el registro."
      />
      <div className="top-container">
        <h2>Generar orden de pago</h2>
        {renderInputSection()}
      </div>
      
      
      {ordenData && mostrarDetalle &&(
        <div className='orden-detail'>
          <OrdenPagoDetalle data={ordenData} />
        </div>
      )}
    </div>
  );
};

export default OrdenDePago;






{/* <div className='info-container'>
        {renderInfoSection()}
        {ordenData && (
          <div className='boton-generar'>
            <button onClick={handleGenerarOrden} className="btn-generar">
              Generar Orden de Pago
            </button>
          </div>
        )}
      </div> */}