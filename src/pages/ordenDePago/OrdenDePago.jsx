import React from 'react';
import { motion } from 'framer-motion';
import "./OrdenDePago.css";
import Header from "../../components/header/Header";
import { FaSearch } from 'react-icons/fa';
import OrdenPagoDetalle from "../../components/ordenPagoDetalle/OrdenPagoDetalle";
import useOrdenPago from '../../hooks/ordenPago/useOrdenPago';
import BuscadorCodigo from '../../components/buscadorCodigo/BuscadorCodigo';

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

    const costoPorArea = ordenData.olimpiadas[0]?.precio_olimpiada || 'Error';
    console.log("Costo por área:", costoPorArea);
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
        <BuscadorCodigo
          descripcion="Genera la orden de pago referente a la inscripción, introduciendo el código"
          placeholder="Introduce el código"
          codigoIntroducidoTexto="Código introducido:"
          codigoIntroducido={inputValue}
          // onInputChange={(e) => setInputValue(e.target.value)}
          onInputChange={(e) => {
            const value = e.target.value;
            if (value.length <= 6) {
              setInputValue(value);
            }
          }}
          onKeyPress={handleKeyPress}
          onSearch={handleSearch}
          error={error}
          containerVariants={containerVariants}
        />
      </motion.div>
      <motion.div
        className="info-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderInfoSection()}
        {ordenData && !mostrarDetalle && (
          <motion.div
            className="boton-generar"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <button 
              onClick={handleGenerarOrden} 
              className="btn-generar"
              disabled={isLoading}
            >
              {isLoading ? 'Generando...' : 'Generar Orden de Pago'}
            </button>
        </motion.div>
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