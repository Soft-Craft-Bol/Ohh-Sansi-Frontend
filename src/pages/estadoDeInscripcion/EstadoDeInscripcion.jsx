import React, { useState, useEffect } from 'react';
import "./EstadoDeInscripcion.css";
import Header from "../../components/header/Header";
import BuscadorCodigo from '../../components/buscadorCodigo/BuscadorCodigo';
import { getEstadoInscripcion } from '../../api/api';

const EstadoDeInscripcion = () => {
  const [documento, setDocumento] = useState(''); // Valor predeterminado vacío
  const [error, setError] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [datosInscripcion, setDatosInscripcion] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSearch = async () => {
    if (!documento) {
      setError('Por favor, introduce un número de documento válido.');
      return;
    }
    
    setCargando(true);
    setError('');
    
    try {
      console.log('Buscando información para el documento:', documento);
      const response = await getEstadoInscripcion(documento);
      console.log('Respuesta recibida:', response.data);
      setDatosInscripcion(response.data);
      setMostrarDetalles(true);
    } catch (err) {
      console.error('Error al obtener datos de inscripción:', err);
      setError('No se pudo obtener la información. Verifica el número de documento.');
      setMostrarDetalles(false);
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    setDocumento('');
    setMostrarDetalles(false);
    setDatosInscripcion(null);
    setError('');
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const getNombreCompleto = () => {
    if (!datosInscripcion || !datosInscripcion.registroDatosParticipante || !datosInscripcion.registroDatosParticipante.participante) {
      return 'No disponible';
    }
    
    const { nombreParticipante, apellidoPaterno, apellidoMaterno } = datosInscripcion.registroDatosParticipante.participante;
    return `${nombreParticipante} ${apellidoPaterno} ${apellidoMaterno}`;
  };
  const getNombresAreas = () => {
    if (!datosInscripcion || !datosInscripcion.registroAreas) {
      return 'No disponible';
    }
    
    const { areas } = datosInscripcion.registroAreas;
    if (Array.isArray(areas)) {
      return areas.map(area => area.nombreArea).join(', ');
    } else {
      return typeof areas === 'string' ? areas : 'No disponible';
    }
  };
  const getNombresTutores = () => {
    if (!datosInscripcion || !datosInscripcion.registroDatosTutor) {
      return 'No disponible';
    }
    
    const { tutores } = datosInscripcion.registroDatosTutor;
    
    if (Array.isArray(tutores)) {
      return tutores.map(tutor => `${tutor.nombresTutor} ${tutor.apellidosTutor}`).join(', ');
    } else {
      return typeof tutores === 'string' ? tutores : 'No disponible';
    }
  };
  const getCodigoUnico = () => {
    if (!datosInscripcion || !datosInscripcion.registroOrdenPago) {
      return 'No disponible';
    }
    
    return datosInscripcion.registroOrdenPago.codigoUnico || 'No generado';
  };
  const inscripcionCompletada = () => {
    if (!datosInscripcion) return false;
    
    const etapas = [
      datosInscripcion.registroDatosParticipante?.estado === 'Completado',
      datosInscripcion.registroAreas?.estado === 'Completado',
      datosInscripcion.registroDatosTutor?.estado === 'Completado',
      datosInscripcion.registroOrdenPago?.estado === 'Generado' || datosInscripcion.registroOrdenPago?.estado === 'Completado'
    ];
    
    return etapas.every(etapa => etapa === true);
  };
  const getFechaActual = () => {
    const fecha = new Date();
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

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
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadoDeInscripcion;