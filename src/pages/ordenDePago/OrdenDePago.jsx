import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import "./OrdenDePago.css";
import Header from "../../components/header/Header";
import OrdenPagoDetalle from "../../components/ordenPagoDetalle/OrdenPagoDetalle";
import useOrdenPago from '../../hooks/ordenPago/useOrdenPago';
import BuscadorCodigo from '../../components/buscadorCodigo/BuscadorCodigo';

const OrdenDePago = () => {
  const {
    inputValue,
    setInputValue,
    codigoIntroducido,
    ordenData,
    ordenExel,
    mostrarDetalle,
    ordenGenerada,
    error,
    isLoading,
    handleSearch,
    handleKeyPress,
    handleGenerarOrden
  } = useOrdenPago();
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: 'Error',
        text: error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6'
      });
    }
  }, [error]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const renderInfoSection = () => {
    let areas,participante,tutores,olimpiadas,totalParticipantes,
    totalAreas,primerTutor,nombreResponsable,correoResponsable, costoPorArea, totalAPagar;
    if(ordenExel){
      participante = 'Participantes registrados por Excel'
      totalParticipantes = ordenExel.Responsable?.cantPaticipantes
      totalAreas = ordenExel.Responsable?.cantAreas
      nombreResponsable = `${ordenExel.Responsable.nombreTut || ""} ${ordenExel.Responsable.apellidoTut || ""}`.trim()
      correoResponsable = ordenExel.Responsable.correoTut
      costoPorArea = ordenExel.olimpiadas?.olimpiada?.precioOlimpiada || 0;
      totalAPagar = totalAreas * costoPorArea;

    }else{
      if (!ordenData) return null;
      const participantes = ordenData.participantes || [];
      tutores = ordenData.tutores || [];
      olimpiadas = ordenData.olimpiada || [];
      areas = ordenData.areas || [];

      totalParticipantes = participantes.length;
      totalAreas = areas.length;

      primerTutor = tutores.length > 0 ? tutores[0] : null;
      nombreResponsable = primerTutor
        ? `${primerTutor.nombres_tutor || ""} ${primerTutor.apellidos_tutor || ""}`.trim()
        : "No disponible";
      correoResponsable = primerTutor?.email_tutor || "No disponible";

      costoPorArea = olimpiadas?.olimpiada?.precioOlimpiada || 0;
      totalAPagar = totalAreas * costoPorArea;
    }
    
    return (
      <motion.div className="info-box" variants={containerVariants} initial="hidden" animate="visible">
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

  const showSuccessMessage = () => {
    Swal.fire({
      title: '¡Éxito!',
      text: 'Orden de pago generada correctamente',
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#3085d6'
    });
  };
  const handleGenerarOrdenWithFeedback = async () => {
    Swal.fire({
      title: 'Generando orden...',
      text: 'Por favor espere mientras se procesa la solicitud',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await handleGenerarOrden();
      Swal.close();
      if (!error) {
        showSuccessMessage();
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al generar la orden de pago',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6'
      });
    }
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
          /*  codigoIntroducido={codigoIntroducido} */
          inputValue={inputValue} // Pasando inputValue al componente
          onInputChange={(e) => {
            const value = e.target.value;
            if (value.length <= 6) {
              setInputValue(value);
            }
          }}
          onKeyPress={handleKeyPress}
          onSearch={handleSearch}
          error={null}
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
        {(ordenData || ordenExel) && !mostrarDetalle && (
          <motion.div
            className="boton-generar"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={handleGenerarOrdenWithFeedback}
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
            nit_tutor={
              ordenExel 
                ? (ordenExel.Responsable?.ciTut || '000000000')
                : (ordenData?.tutores?.[0]?.carnet_identidad_tutor || '000000000')
            }
          />
        </motion.div>
      )}
    </div>
  );
};

export default OrdenDePago;