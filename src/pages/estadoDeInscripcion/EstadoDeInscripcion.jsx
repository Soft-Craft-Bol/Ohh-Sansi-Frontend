import React, { useEffect } from 'react';
import "./EstadoDeInscripcion.css";
import Header from "../../components/header/Header";
import BuscadorCodigo from '../../components/buscadorCodigo/BuscadorCodigo';
import DetallesInscripcion from './components/DetallesInscripcion';
import useEstadoInscripcion from './hooks/useEstadoInscripcion';
import useInscripcionUtils from './hooks/useInscripcionUtils';
import { motion } from 'framer-motion';
const EstadoDeInscripcion = () => {
  const {
    documento,
    setDocumento,
    error,
    mostrarDetalles,
    datosInscripcion,
    cargando,
    resetEstado,
    handleSearch,
    handleKeyPress
  } = useEstadoInscripcion();

  const utils = useInscripcionUtils(datosInscripcion);
  useEffect(() => {
    resetEstado();
  }, []);

  return (
    <div className='estado-inscripcion'>
      <Header 
        title="Estado de Inscripción"
        description="Consulta el estado de tu inscripción"
      />
      <div className='top-container'>
        <BuscadorCodigo
          descripcion="Obtén información de la inscripción introduciendo el número de documento del participante"
          placeholder="Introduce el documento del participante"
          codigoIntroducidoTexto="Número de documento introducido:"
          codigoIntroducido={documento}
          onInputChange={(e) => setDocumento(e.target.value)}
          onKeyPress={handleKeyPress}
          onSearch={handleSearch}
          error={error}
          containerVariants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        />
      </div>
      
      {cargando && (
        <div className='page-padding text-center'>
          <p>Cargando información...</p>
        </div>
      )}
      
      {mostrarDetalles && datosInscripcion && (
        <DetallesInscripcion 
          datosInscripcion={datosInscripcion}
          utils={utils}
        />
      )}
    </div>
  );
};

export default EstadoDeInscripcion;