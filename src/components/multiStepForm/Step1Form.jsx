import React, { useState } from "react";
import "./Step1Form.css"; // Importar el archivo CSS

const Step1Form = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    institucion: "",
    grado: "",
    email: "",
    telefono: "",
    documento: "",
    fechaNacimiento: "",
    contactoEmergencia: "",
    telefonoEmergencia: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert("Formulario enviado correctamente");
  };

  return (
    <div className="step1-container">
      <span className="step1-description">
        Ingrese los datos del participante (Paso 1 de 4)
      </span>
      <form onSubmit={handleSubmit}>
        <div className="step1-grid">
          <div className="step1-card">
            <label>Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del participante"
            />
          </div>
          <div className="step1-card">
            <label>Apellido*</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido del participante"
            />
          </div>
          <div className="step1-card">
            <label>Colegio/Institución*</label>
            <input
              type="text"
              name="institucion"
              value={formData.institucion}
              onChange={handleChange}
              placeholder="Nombre de la institución"
            />
          </div>
          <div className="step1-card">
            <label>Grado/Nivel*</label>
            <input
              type="text"
              name="grado"
              value={formData.grado}
              onChange={handleChange}
              placeholder="Seleccione el grado"
            />
          </div>
          <div className="step1-card">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="step1-card">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Número de contacto"
            />
          </div>
          <div className="step1-card">
            <label>Documento de identidad</label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="Número de identificación"
            />
          </div>
          <div className="step1-card">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </div>
          <div className="step1-card">
            <label>Contacto de emergencia</label>
            <input
              type="text"
              name="contactoEmergencia"
              value={formData.contactoEmergencia}
              onChange={handleChange}
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="step1-card">
            <label>Teléfono de emergencia</label>
            <input
              type="tel"
              name="telefonoEmergencia"
              value={formData.telefonoEmergencia}
              onChange={handleChange}
              placeholder="Número de emergencia"
            />
          </div>
        </div>
        <button type="submit">Continuar a áreas de competencia</button>
      </form>
    </div>
  );
};

export default Step1Form;