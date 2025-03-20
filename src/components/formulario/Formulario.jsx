import React from 'react';
import './Formulario.css';

const Formulario = () => {
  return (
    <div className="formulario-container">
      <h1>Nueva Inscripción</h1>
      <div className="seccion">
        <h2>Información básica</h2>
        <ul>
          <li>Áreas de competencia</li>
          <li>Información del Tutor</li>
          <li>Asignación del tutor</li>
          <li>Pago</li>
        </ul>
      </div>

      <div className="seccion">
        <h2>Información del Participante</h2>
        <p>Ingrese los datos del participante (Paso 1 de 5)</p>

        <div className="campo-doble">
          <div className="campo">
            <label>Nombre*</label>
            <input type="text" placeholder="Nombre del participante" />
          </div>
          <div className="campo">
            <label>Apellido*</label>
            <input type="text" placeholder="Apellido del participante" />
          </div>
        </div>

        <div className="campo">
          <label>Colegio/Institución*</label>
          <input type="text" placeholder="Nombre de la institución" />
        </div>
        <div className="campo">
          <label>Grado/Nivel*</label>
          <input type="text" placeholder="Seleccione el grado" />
        </div>

        <div className="campo">
          <label>Correo electrónico</label>
          <input type="email" placeholder="correo@ejemplo.com" />
        </div>
        <div className="campo">
          <label>Teléfono</label>
          <input type="tel" placeholder="Número de contacto" />
        </div>

        <div className="campo">
          <label>Documento de identidad</label>
          <input type="text" placeholder="Número de identificación" />
        </div>
        <div className="campo">
          <label>Fecha de nacimiento</label>
          <input type="date" placeholder="dd/mm/aaaa" />
        </div>

        <div className="campo">
          <label>Contacto de emergencia</label>
          <input type="text" placeholder="Nombre del contacto" />
        </div>
        <div className="campo">
          <label>Teléfono de emergencia</label>
          <input type="tel" placeholder="Número de emergencia" />
        </div>

        <button type="button">Continuar a áreas de competencia</button>
      </div>
    </div>
  );
};

export default Formulario;