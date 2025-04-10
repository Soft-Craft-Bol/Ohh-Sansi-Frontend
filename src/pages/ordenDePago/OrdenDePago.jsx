import React from 'react';
import "./OrdenDePago.css";
import Header from "../../components/header/Header";
import { FaSearch } from 'react-icons/fa';
import OrdenPagoDetalle from "../../components/ordenPagoDetalle/OrdenPagoDetalle";
import useOrdenPago from '../../hooks/ordenPago/useOrdenPago';

const OrdenDePago = () => {
  const {
    inputValue,
    setInputValue,
    codigoIntroducido,
    ordenData,
    mostrarDetalle,
    ordenGenerada,
    error,
    isLoading,
    handleSearch,
    handleKeyPress,
    handleGenerarOrden
  } = useOrdenPago();

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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
  const renderInfoSection = () => {
    if (!ordenData) return null;

    const participantes = ordenData.participantes || [];
    const areas = ordenData.areas || [];
    const tutores = ordenData.tutores || [];

    const totalParticipantes = participantes.length;
    const totalAreas = areas.length;

    const primerTutor = tutores.length > 0 ? tutores[0] : null;
    const nombreResponsable = primerTutor
      ? `${primerTutor.nombres_tutor || ""} ${primerTutor.apellidos_tutor || ""}`.trim()
      : "No disponible";
    const correoResponsable = primerTutor?.email_tutor || "No disponible";

    const costoPorArea = 35;
    const totalAPagar = totalAreas * costoPorArea;

    return (
      <div className='info-box'>
        <div className='resumen'>
          <h3>Resumen de la inscripción</h3>
          <p>Total de participantes: <span className="bold-blue">{totalParticipantes}</span></p>
          <p>Total áreas inscritas: <span className="bold-blue">{totalAreas}</span></p>
          <p>Nombre del responsable: <span className="bold-blue">{nombreResponsable}</span></p>
          <p>Correo del responsable: <span className="bold-blue">{correoResponsable}</span></p>
        </div>
        <div className='divider'></div>
        <div className='pago'>
          <h3>Detalles del pago</h3>
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
      <div className='info-container'>
        {renderInfoSection()}
        {ordenData && !mostrarDetalle && (
          <div className='boton-generar'>
            <button 
              onClick={handleGenerarOrden} 
              className="btn-generar"
              disabled={isLoading}
            >
              {isLoading ? 'Generando...' : 'Generar Orden de Pago'}
            </button>
          </div>
        )}
      </div>
      {mostrarDetalle && ordenGenerada && (
        <div className='orden-detail'>
          <OrdenPagoDetalle data={ordenGenerada} />
        </div>
      )}
    </div>
  );
};

export default OrdenDePago;