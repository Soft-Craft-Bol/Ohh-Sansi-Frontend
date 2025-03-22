import React, { useState } from "react";
import "./MultiStepForm.css";

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario completado");
  };

  // Calcula el ancho de la línea pintada en función del paso actual
  const progressWidth = ((currentStep - 1) / 3) * 100;

  return (
    <div className="multi-step-container">
        <h1>Nueva inscripción</h1>
      <div className="steps-indicator" style={{ "--progress-width": `${progressWidth}%` }}>
        <div className={`step ${currentStep >= 1 ? "completed" : ""} ${currentStep === 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-text">Información básica</span>
        </div>
        <div className={`step ${currentStep >= 2 ? "completed" : ""} ${currentStep === 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-text">Áreas de competencia</span>
        </div>
        <div className={`step ${currentStep >= 3 ? "completed" : ""} ${currentStep === 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-text">Tutores</span>
        </div>
        <div className={`step ${currentStep >= 4 ? "completed" : ""} ${currentStep === 4 ? "active" : ""}`}>
          <span className="step-number">4</span>
          <span className="step-text">Pago</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Información del Participante</h2>
            <div className="fields-container">
              <input type="text" placeholder="Nombre" name="nombre" required />
              <input type="text" placeholder="Apellido" name="apellido" required />
              <input type="text" placeholder="Colegio/Institución" name="colegio" required />
              <input type="text" placeholder="Grado/Nivel" name="grado" required />
              <input type="email" placeholder="Correo electrónico" name="correo" required />
              <input type="tel" placeholder="Teléfono" name="telefono" />
            </div>
            <div className="buttons-container">
              <button type="button" onClick={handleNext}>Siguiente</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <h2>Áreas de Competencia</h2>
            <div className="fields-container">
              <input type="text" placeholder="Área 1" name="area1" />
              <input type="text" placeholder="Área 2" name="area2" />
            </div>
            <div className="buttons-container">
              <button type="button" onClick={handlePrev}>Anterior</button>
              <button type="button" onClick={handleNext}>Siguiente</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <h2>Tutores</h2>
            <div className="fields-container">
              <input type="text" placeholder="Nombre del tutor" name="tutorNombre" required />
              <input type="email" placeholder="Correo del tutor" name="tutorCorreo" />
            </div>
            <div className="buttons-container">
              <button type="button" onClick={handlePrev}>Anterior</button>
              <button type="button" onClick={handleNext}>Siguiente</button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content">
            <h2>Pago</h2>
            <div className="fields-container">
              <input type="text" placeholder="Método de pago" name="metodoPago" required />
              <input type="text" placeholder="Titular de la tarjeta" name="titularTarjeta" />
            </div>
            <div className="buttons-container">
              <button type="button" onClick={handlePrev}>Anterior</button>
              <button type="submit">Finalizar</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default MultiStepForm;