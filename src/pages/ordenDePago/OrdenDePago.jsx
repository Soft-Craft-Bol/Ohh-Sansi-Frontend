import React from 'react';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, 
  };

  const renderInputSection = () => (
    <motion.div
      className="buscador-codigo"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
    </motion.div>
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
      <motion.div
        className="info-box"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="resumen">
          <h3>Resumen de la inscripción</h3>
          <p>Total de participantes: <span className="bold-blue">{totalParticipantes}</span></p>
          <p>Total áreas inscritas: <span className="bold-blue">{totalAreas}</span></p>
          <p>Nombre del responsable: <span className="bold-blue">{nombreResponsable}</span></p>
          <p>Correo del responsable: <span className="bold-blue">{correoResponsable}</span></p>
        </div>
        <div className="divider"></div>
        <div className="pago">
          <h3>Detalles del pago</h3>
          <p>Costo por área: <span className="bold-blue">{costoPorArea} bs.</span></p>
          <div className="total-container">
            <p className="total-pagar">Total a pagar: </p>
            <span className="big-bold-blue">{totalAPagar} bs.</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="orden-de-pago">
      <Header
        title="Generación de Orden de Pago"
        description="Necesitas la orden de pago para realizar el pago de la inscripción."
      />
      <motion.div
        className="top-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderInputSection()}
      </motion.div>
      <motion.div
        className="info-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderInfoSection()}
        {ordenData && !mostrarDetalle && (
          <div className="boton-generar">
            <button 
              onClick={handleGenerarOrden} 
              className="btn-generar"
              disabled={isLoading}
            >
              {isLoading ? 'Generando...' : 'Generar Orden de Pago'}
            </button>
          </div>
        )}
      </motion.div>
      {mostrarDetalle && ordenGenerada && (
        <motion.div
          className="orden-detail"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <OrdenPagoDetalle 
            data={ordenGenerada}
            nit_tutor={ordenData.tutores[0]?.carnet_identidad_tutor || '000000000' }
          />
        </motion.div>
      )}
    </div>
  );
};

export default OrdenDePago;