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

  const [errors, setErrors] = useState({});

  // Función para validar correo electrónico
  const validateEmail = (email) => {
    // Lista de dominios comunes y válidos
    const validDomains = [
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 
      'icloud.com', 'protonmail.com', 'edu.pe', 'unmsm.edu.pe', 
      'pucp.edu.pe', 'uni.pe'
    ];

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonTypos = {
      'gmai.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'hotmai.com': 'hotmail.com',
      'hotmial.com': 'hotmail.com',
      'outloo.com': 'outlook.com',
      'outlok.com': 'outlook.com',
      'yaho.com': 'yahoo.com',
      'yahooo.com': 'yahoo.com'
    };

    // Validaciones
    if (!email) return null; // No mostrar error si está vacío
    if (!emailRegex.test(email)) {
      return "Formato de correo inválido";
    }

    const [, domain] = email.split('@');
    
    // Corrección de dominios con typos
    if (commonTypos[domain]) {
      return `¿Quisiste decir ${email.replace(domain, commonTypos[domain])}?`;
    }

    // Validación de dominios
    if (!validDomains.includes(domain)) {
      return "Dominio de correo no reconocido";
    }

    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación específica para email
    if (name === 'email') {
      const emailError = validateEmail(value);
      setErrors(prev => ({
        ...prev,
        email: emailError
      }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación final antes de enviar
    const newErrors = {};
    
    // Validar campos obligatorios
    const requiredFields = ['nombre', 'apellido', 'institucion', 'grado'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    // Validar email si está presente
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    // Si hay errores, no enviar el formulario
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Envío del formulario
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
            { name: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" }
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
              {errors[field.name] && (
                <span className="error-message">{errors[field.name]}</span>
              )}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Step1Form;