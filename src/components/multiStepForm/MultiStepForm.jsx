import React, { useState } from "react";
import StepIndicator from "./StepIndicator";
import StepForm from "./StepForm";
import Step1Form from "./Step1Form"; // Importar el componente del Paso 1
import Step2Form from "./Step2Form"; // Importar el componente del Paso 2
import Step3Form from "./Step3Form";

import "./MultiStepForm.css";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { label: "Información básica" },
    { label: "Áreas de competencia" },
    { label: "Tutores" },
    { label: "Pago" },
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

  const getStepComponent = (step) => {
    switch (step) {
      case 1:
        return <Step1Form />;
      case 2:
        return <Step2Form />;
      case 3:
        return <Step3Form />;
      case 4:
        return <div>Formulario de Pago (Paso 4)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="multi-step-container">
      <h1>Nueva inscripción</h1>
      <StepIndicator steps={steps} currentStep={currentStep} />
      <form onSubmit={handleSubmit} className="form-content">
        <StepForm
          title={steps[currentStep - 1].label}
          onNext={handleNext}
          onPrev={currentStep > 1 ? handlePrev : null}
          isLastStep={currentStep === steps.length}
        >
          {getStepComponent(currentStep)} {/* Pasar el componente correspondiente */}
        </StepForm>
      </form>
    </div>
  );
};

export default MultiStepForm;