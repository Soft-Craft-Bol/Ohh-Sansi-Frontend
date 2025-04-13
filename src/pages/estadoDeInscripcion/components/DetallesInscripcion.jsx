import React from 'react';
import PropTypes from 'prop-types';
import TablaInscripcion from './TablaInscripcion';

const DetallesInscripcion = ({ 
  datosInscripcion,
  utils
}) => {
  const { 
    getNombreCompleto, 
    getNombresAreas, 
    getNombresTutores, 
    getCodigoUnico, 
    inscripcionCompletada, 
    getFechaActual 
  } = utils;

  return (
    <div className='detail-info-cont page-padding'>
      <h2>Detalles del estado de inscripción</h2>
      
      <div className="info-card">
        <div className="info-header">
          <div className="info-user">
            <h3>Nombre: {getNombreCompleto()}</h3>
            <p>Última actualización: {getFechaActual()}</p>
          </div>
          <div className="status-badge">
            <span className={inscripcionCompletada() ? "status-complete" : "status-pending"}>
              {inscripcionCompletada() ? "Inscripción completada" : "Inscripción en proceso"}
            </span>
          </div>
        </div>
        
        <TablaInscripcion 
          datosInscripcion={datosInscripcion}
          getNombreCompleto={getNombreCompleto}
          getNombresAreas={getNombresAreas}
          getNombresTutores={getNombresTutores}
          getCodigoUnico={getCodigoUnico}
        />
      </div>
    </div>
  );
};

DetallesInscripcion.propTypes = {
  datosInscripcion: PropTypes.object.isRequired,
  utils: PropTypes.shape({
    getNombreCompleto: PropTypes.func.isRequired,
    getNombresAreas: PropTypes.func.isRequired,
    getNombresTutores: PropTypes.func.isRequired,
    getCodigoUnico: PropTypes.func.isRequired,
    inscripcionCompletada: PropTypes.func.isRequired,
    getFechaActual: PropTypes.func.isRequired
  }).isRequired
};

export default DetallesInscripcion;