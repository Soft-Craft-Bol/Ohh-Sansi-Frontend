import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const TablaInscripcion = ({ 
  datosInscripcion, 
  getNombreCompleto, 
  getNombresAreas, 
  getNombresTutores, 
  getCodigoUnico 
}) => {

  const mostrarDetalles = (titulo, contenido) => {
    Swal.fire({
      title: titulo,
      html: contenido,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  };

  return (
    <div className="info-table">
      <div className="table-header">
        <div className="col-etapa">ETAPA</div>
        <div className="col-estado">ESTADO</div>
        <div className="col-fecha">INFORMACIÓN</div>
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
          <div className="col-acciones">
            <a href="#" className="ver-detalles" onClick={() =>
              mostrarDetalles('Datos del Participante', `
                <strong>Nombre completo:</strong> ${getNombreCompleto()}<br/>
                <strong>Estado:</strong> ${datosInscripcion.registroDatosParticipante.estado}<br/>
                <strong>Comentarios:</strong> ${datosInscripcion.registroDatosParticipante.comentarios || 'Ninguno'}<br/>
                <strong>Fecha:</strong> ${datosInscripcion.registroDatosParticipante.fechaRegistro}
              `)
            }>Ver detalles</a>
          </div>
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
          <div className="col-acciones">
            <a href="#" className="ver-detalles" onClick={() =>
              mostrarDetalles('Áreas de competencia', `
                <strong>Áreas seleccionadas:</strong> ${getNombresAreas()}<br/>
                <strong>Estado:</strong> ${datosInscripcion.registroAreas.estado}<br/>
                <strong>Comentarios:</strong> ${datosInscripcion.registroAreas.comentarios || 'Ninguno'}<br/>
                <strong>Fecha:</strong> ${datosInscripcion.registroAreas.fechaRegistro}
              `)
            }>Ver detalles</a>
          </div>
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
          <div className="col-acciones">
            <a href="#" className="ver-detalles" onClick={() =>
              mostrarDetalles('Datos del Tutor', `
                <strong>Tutores registrados:</strong> ${getNombresTutores()}<br/>
                <strong>Estado:</strong> ${datosInscripcion.registroDatosTutor.estado}<br/>
                <strong>Comentarios:</strong> ${datosInscripcion.registroDatosTutor.comentarios || 'Ninguno'}<br/>
                <strong>Fecha:</strong> ${datosInscripcion.registroDatosTutor.fechaRegistro}
              `)
            }>Ver detalles</a>
          </div>
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
          <div className="col-acciones">
            <a href="#" className="ver-detalles" onClick={() =>
              mostrarDetalles('Orden de Pago', `
                <strong>Código Único:</strong> ${getCodigoUnico()}<br/>
                <strong>Estado:</strong> ${datosInscripcion.registroOrdenPago.estado}<br/>
                <strong>Comentarios:</strong> ${datosInscripcion.registroOrdenPago.comentarios || 'Ninguno'}<br/>
                <strong>Fecha:</strong> ${datosInscripcion.registroOrdenPago.fechaRegistro}
              `)
            }>Ver detalles</a>
          </div>
        </div>
      )}
      {datosInscripcion.comprobantePagoStatus && (
        <div className="table-row">
          <div className="col-etapa">Comprobante de pago</div>
          <div className="col-estado">
            <span className={`status-chip ${datosInscripcion.comprobantePagoStatus.estado === 'APROBADO' ? 'complete' : datosInscripcion.comprobantePagoStatus.estado === 'PENDIENTE' ? 'pending' : 'rejected'}`}>
              {datosInscripcion.comprobantePagoStatus.estado === 'APROBADO'
                ? '✓ Aprobado'
                : datosInscripcion.comprobantePagoStatus.estado === 'PENDIENTE'
                ? '⟳ Pendiente'
                : '✗ Rechazado'}
            </span>
          </div>
          <div className="col-fecha">
            {datosInscripcion.comprobantePagoStatus.comprobantePago
              ? `Monto: Bs ${datosInscripcion.comprobantePagoStatus.comprobantePago.montoPagado}`
              : 'No disponible'}
          </div>
          <div className="col-comentarios">
            {datosInscripcion.comprobantePagoStatus.comentarios || 'Sin comentarios'}
          </div>
          <div className="col-acciones">
            <a
              href="#"
              className="ver-detalles"
              onClick={() =>
                mostrarDetalles(
                  'Comprobante de Pago',
                  `
                  <strong>Estado:</strong> ${datosInscripcion.comprobantePagoStatus.estado}<br/>
                  <strong>Comentarios:</strong> ${datosInscripcion.comprobantePagoStatus.comentarios || 'Ninguno'}<br/>
                  <strong>Fecha de registro:</strong> ${datosInscripcion.comprobantePagoStatus.fechaRegistro || 'No disponible'}<br/>
                  <strong>Monto pagado:</strong> Bs ${datosInscripcion.comprobantePagoStatus.comprobantePago?.montoPagado || 'No disponible'}<br/>
                  <strong>Nombre receptor:</strong> ${datosInscripcion.comprobantePagoStatus.comprobantePago?.nombreReceptor || 'No disponible'}<br/>
                  <strong>Notas adicionales:</strong> ${datosInscripcion.comprobantePagoStatus.comprobantePago?.notasAdicionales || 'No disponible'}<br/>
                  <strong>Imagen:</strong> ${
                    datosInscripcion.comprobantePagoStatus.comprobantePago?.imagenComprobante
                      ? `<br/><img src="${datosInscripcion.comprobantePagoStatus.comprobantePago.imagenComprobante}" alt="Comprobante" style="max-width:300px;max-height:200px;" />`
                      : 'No disponible'
                  }
                  `
                )
              }
            >
              Ver detalles
            </a>
          </div>
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
