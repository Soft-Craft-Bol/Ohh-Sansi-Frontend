import React from 'react';
import PropTypes from 'prop-types';

const TablaInscripcion = ({ 
  datosInscripcion, 
  getNombreCompleto, 
  getNombresAreas, 
  getNombresTutores, 
  getCodigoUnico 
}) => {
  return (
    <div className="info-table">
      <div className="table-header">
        <div className="col-etapa">ETAPA</div>
        <div className="col-estado">ESTADO</div>
        <div className="col-fecha">DATOS</div>
        <div className="col-comentarios">COMENTARIOS</div>
        <div className="col-acciones">ACCIONES</div>
      </div>
      
      {datosInscripcion.registroDatosParticipante && (
        <div className="table-row">
          <div className="col-etapa">Registro de datos del participante</div>
          <div className="col-estado">
            <span className={`status-chip ${datosInscripcion.registroDatosParticipante.estado === 'Completado' ? 'complete' : 'pending'}`}>
              {datosInscripcion.registroDatosParticipante.estado === 'Completado' ? '✓ Completado' : '⟳ Pendiente'}
            </span>
          </div>
          <div className="col-fecha">{getNombreCompleto()}</div>
          <div className="col-comentarios">{datosInscripcion.registroDatosParticipante.comentarios || 'Sin comentarios'}</div>
          <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
        </div>
      )}
      
      {datosInscripcion.registroAreas && (
        <div className="table-row">
          <div className="col-etapa">Registro de áreas de competencia</div>
          <div className="col-estado">
            <span className={`status-chip ${datosInscripcion.registroAreas.estado === 'Completado' ? 'complete' : 'pending'}`}>
              {datosInscripcion.registroAreas.estado === 'Completado' ? '✓ Completado' : '⟳ Pendiente'}
            </span>
          </div>
          <div className="col-fecha">{getNombresAreas()}</div>
          <div className="col-comentarios">{datosInscripcion.registroAreas.comentarios || 'Sin comentarios'}</div>
          <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
        </div>
      )}
      
      {datosInscripcion.registroDatosTutor && (
        <div className="table-row">
          <div className="col-etapa">Registro de datos del tutor</div>
          <div className="col-estado">
            <span className={`status-chip ${datosInscripcion.registroDatosTutor.estado === 'Completado' ? 'complete' : 'pending'}`}>
              {datosInscripcion.registroDatosTutor.estado === 'Completado' ? '✓ Completado' : '⟳ Pendiente'}
            </span>
          </div>
          <div className="col-fecha">{getNombresTutores()}</div>
          <div className="col-comentarios">{datosInscripcion.registroDatosTutor.comentarios || 'Sin comentarios'}</div>
          <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
        </div>
      )}
      
      {datosInscripcion.registroOrdenPago && (
        <div className="table-row">
          <div className="col-etapa">Generación de orden de pago</div>
          <div className="col-estado">
            <span className={`status-chip ${datosInscripcion.registroOrdenPago.estado === 'Generado' ? 'generado' : datosInscripcion.registroOrdenPago.estado === 'Completado' ? 'complete' : 'pending'}`}>
              {datosInscripcion.registroOrdenPago.estado === 'Generado' ? '✓ Generado' : 
               datosInscripcion.registroOrdenPago.estado === 'Completado' ? '✓ Completado' : '⟳ Pendiente'}
            </span>
          </div>
          <div className="col-fecha">{getCodigoUnico()}</div>
          <div className="col-comentarios">{datosInscripcion.registroOrdenPago.comentarios || 'Sin comentarios'}</div>
          <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
        </div>
      )}
    </div>
  );
};

TablaInscripcion.propTypes = {
  datosInscripcion: PropTypes.object.isRequired,
  getNombreCompleto: PropTypes.func.isRequired,
  getNombresAreas: PropTypes.func.isRequired,
  getNombresTutores: PropTypes.func.isRequired,
  getCodigoUnico: PropTypes.func.isRequired
};

export default TablaInscripcion;