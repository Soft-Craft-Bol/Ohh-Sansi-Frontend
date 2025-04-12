import React, { useState } from 'react';
import "./EstadoDeInscripcion.css";
import Header from "../../components/header/Header";
import BuscadorCodigo from '../../components/buscadorCodigo/BuscadorCodigo';

const EstadoDeInscripcion = () => {
  const [documento, setDocumento] = useState('14382800');
  const [error, setError] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(true);

  const handleSearch = () => {
    if (!documento) {
      setError('Por favor, introduce un número de documento válido.');
      return;
    }
    setError('');
    console.log(`Buscando información para el documento: ${documento}`);
    setMostrarDetalles(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='estado-inscripcion'>
      <Header 
        title="Estado de Inscripción"
        description="Consulta el estado de tu inscripción"
      />
      <div className='top-container'>
        <h2>Estado de la inscripción</h2>
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
      
      {mostrarDetalles && (
        <div className='detail-info-cont page-padding'>
          <h2>Detalles del estado de inscripcion</h2>
          
          <div className="info-card">
            <div className="info-header">
              <div className="info-user">
                <h3>Nombre: Alfredo Ernesto Torrico Garcia</h3>
                <p>Ultima actualización: 27 de marzo de 2025, 19:35</p>
              </div>
              <div className="status-badge">
                <span className="status-complete">Inscripción completada</span>
              </div>
            </div>
            
            <div className="info-table">
              <div className="table-header">
                <div className="col-etapa">ETAPA</div>
                <div className="col-estado">ESTADO</div>
                <div className="col-fecha">FECHA DE REGISTRO</div>
                <div className="col-comentarios">COMENTARIOS</div>
                <div className="col-acciones">ACCIONES</div>
              </div>
              
              <div className="table-row">
                <div className="col-etapa">Registro de datos del participante</div>
                <div className="col-estado"><span className="status-chip complete">✓ Completado</span></div>
                <div className="col-fecha">24/03/2025 15:40</div>
                <div className="col-comentarios">Datos registrados correctamente</div>
                <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
              </div>
              
              <div className="table-row">
                <div className="col-etapa">Registro de áreas de competencia</div>
                <div className="col-estado"><span className="status-chip complete">✓ Completado</span></div>
                <div className="col-fecha">25/03/2025 19:58</div>
                <div className="col-comentarios">Datos registrados correctamente</div>
                <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
              </div>
              
              <div className="table-row">
                <div className="col-etapa">Registro de datos del tutor</div>
                <div className="col-estado"><span className="status-chip complete">✓ Completado</span></div>
                <div className="col-fecha">25/03/2025 8:37</div>
                <div className="col-comentarios">Tutor registrado correctamente</div>
                <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
              </div>
              
              <div className="table-row">
                <div className="col-etapa">Generacion de orden de pago</div>
                <div className="col-estado"><span className="status-chip generado">✓ Generado</span></div>
                <div className="col-fecha">29/03/2025 2:31</div>
                <div className="col-comentarios"></div>
                <div className="col-acciones"><a href="#" className="ver-detalles">Ver detalles</a></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadoDeInscripcion;