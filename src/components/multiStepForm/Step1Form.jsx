import React, { useState } from "react";
import "./Step1Form.css";

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
          {[
            { name: "nombre", label: "Nombre*", placeholder: "Nombre del participante" },
            { name: "apellido", label: "Apellido*", placeholder: "Apellido del participante" },
            { name: "institucion", label: "Colegio/Institución*", placeholder: "Nombre de la institución" },
            { name: "grado", label: "Grado/Nivel*", placeholder: "Seleccione el grado" },
            { name: "email", label: "Correo electrónico", placeholder: "correo@ejemplo.com", type: "email" },
            { name: "telefono", label: "Teléfono", placeholder: "Número de contacto", type: "tel" },
            { name: "documento", label: "Documento de identidad", placeholder: "Número de identificación" },
            { name: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
            { name: "contactoEmergencia", label: "Contacto de emergencia", placeholder: "Nombre del contacto" },
            { name: "telefonoEmergencia", label: "Teléfono de emergencia", placeholder: "Número de emergencia", type: "tel" },
          ].map((field) => (
            <div key={field.name} className="step1-card">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Step1Form;