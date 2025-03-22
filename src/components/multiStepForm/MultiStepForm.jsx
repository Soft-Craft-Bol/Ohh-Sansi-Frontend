import React, { useState } from "react";
import StepIndicator from "./StepIndicator";
import StepForm from "./StepForm";
import "./MultiStepForm.css";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { label: "Información básica" },
    { label: "Áreas de competencia" },
    { label: "Tutores" },
    { label: "Pago" },
  ];

  const stepForms = [
    {
      title: "Información del Participante",
      fields: [
        { type: "text", placeholder: "Nombre", name: "nombre", required: true },
        { type: "text", placeholder: "Apellido", name: "apellido", required: true },
        { type: "text", placeholder: "Colegio/Institución", name: "colegio", required: true },
        { type: "text", placeholder: "Grado/Nivel", name: "grado", required: true },
        { type: "email", placeholder: "Correo electrónico", name: "correo", required: true },
        { type: "tel", placeholder: "Teléfono", name: "telefono" },
      ],
    },
    {
      title: "Áreas de Competencia",
      fields: [
        { type: "text", placeholder: "Área 1", name: "area1" },
        { type: "text", placeholder: "Área 2", name: "area2" },
      ],
    },
    {
      title: "Tutores",
      fields: [
        { type: "text", placeholder: "Nombre del tutor", name: "tutorNombre", required: true },
        { type: "email", placeholder: "Correo del tutor", name: "tutorCorreo" },
      ],
    },
    {
      title: "Pago",
      fields: [
        { type: "text", placeholder: "Método de pago", name: "metodoPago", required: true },
        { type: "text", placeholder: "Titular de la tarjeta", name: "titularTarjeta" },
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario completado");
  };

  return (
    <div className="multi-step-container">
      <h1>Nueva inscripción</h1>
      <StepIndicator steps={steps} currentStep={currentStep} />
      <form onSubmit={handleSubmit} className="form-content">
        <StepForm
          title={stepForms[currentStep - 1].title}
          fields={stepForms[currentStep - 1].fields}
          onNext={handleNext}
          onPrev={currentStep > 1 ? handlePrev : null}
          isLastStep={currentStep === steps.length}
        />
      </form>
    </div>
  );
};

export default MultiStepForm;