import React, { useState } from "react";
import StepIndicator from "./StepIndicator";
import StepForm from "./StepForm";
import Step1Form from "./Step1Form"; // Importar el componente del Paso 1
import Step2Form from "./Step2Form"; // Importar el componente del Paso 2
import Step3Form from "./Step3Form";

import "./MultiStepForm.css";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const setIsStepValid = (isValid) => {
    
  }

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
        return <Step1Form setIsStepValid={setIsStepValid} />;
      case 2:
        return <Step2Form setIsStepValid={setIsStepValid} />;
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
      <form onSubmit={handleSubmit}>
        <StepForm
          title={steps[currentStep - 1].label}
          onNext={handleNext}
          onPrev={currentStep > 1 ? handlePrev : null}
          isLastStep={currentStep === steps.length}
        >
          {getStepComponent(currentStep)}
        </StepForm>
      </form>
    </div>
  );
};

export default MultiStepForm;