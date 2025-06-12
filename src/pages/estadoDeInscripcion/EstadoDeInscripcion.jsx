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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleClear = () => {
    resetEstado(); 
  };
  

  return (
    <div className='estado-inscripcion'>
      <Header 
        title="Estado de Inscripción"
        description="Consulta el estado de tu inscripción"
      />
      
      <motion.div
        className='top-container'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <BuscadorCodigo
          descripcion="Obtén información de la inscripción introduciendo el número de documento del participante"
          placeholder="Introduce el documento del participante"
          codigoIntroducidoTexto="Número de documento introducido:"
          inputValue={documento}
          onInputChange={(e) => {
            const value = e.target.value;
            const soloNumeros = value.replace(/\D/g, '');
            if (soloNumeros.length <= 9) {
              setDocumento(soloNumeros);
            }
          }}
          onKeyPress={handleKeyPress}
          onSearch={handleSearch}
          onClear={handleClear}
          error={error}
          containerVariants={containerVariants}
        />
      </motion.div>

      {cargando && (
        <motion.div
          className='page-padding text-center'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <p>Cargando información...</p>
        </motion.div>
      )}
      
      {mostrarDetalles && datosInscripcion && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <DetallesInscripcion 
            datosInscripcion={datosInscripcion}
            utils={utils}
          />
        </motion.div>
      )}
    </div>
  );
};

export default EstadoDeInscripcion;