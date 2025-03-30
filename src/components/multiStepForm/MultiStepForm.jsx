import React, { useState } from "react";
import StepIndicator from "./StepIndicator";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form"; 
import Step3Form from "./Step3Form";
import Step4Form from "./Step4Form";
import { inscripcionEstudiante } from "../../api/api";
import "./MultiStepForm.css";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    participante: {
      idDepartamento: null,
      idMunicipio: null,
      idColegio: null,
      idNivelGradoEscolar: null,
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombreParticipante: "",
      fechaNacimiento: "",
      correoElectronicoParticipante: "",
      carnetIdentidadParticipante: null
    },
    areasCompetenciaEstudiante: [],
    tutores: []
  });

  const steps = [
    { label: "Información básica" },
    { label: "Áreas de competencia" },
    { label: "Información de tutores" },
    { label: "Asignación de tutor" },
    { label: "Pago" },
  ];

  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // En el handleSubmit del MultiStepForm
const handleSubmit = async () => {
    try {
      // Asegurarse de que los IDs sean números
      const dataToSend = {
        ...formData,
        participante: {
          ...formData.participante,
          idDepartamento: formData.participante.idDepartamento ? parseInt(formData.participante.idDepartamento) : null,
          idMunicipio: formData.participante.idMunicipio ? parseInt(formData.participante.idMunicipio) : null,
          idColegio: formData.participante.idColegio ? parseInt(formData.participante.idColegio) : null,
          idNivelGradoEscolar: formData.participante.idNivelGradoEscolar ? parseInt(formData.participante.idNivelGradoEscolar) : null
        }
      };
      
      const response = await inscripcionEstudiante(dataToSend);
      console.log("Registro exitoso:", response);
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  const getStepComponent = (step) => {
    const commonProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onPrev: handlePrev
    };

    switch (step) {
      case 1:
        return <Step1Form {...commonProps} />;
      case 2:
        return <Step2Form {...commonProps} />;
      case 3:
        return <Step3Form {...commonProps} />;
      case 4:
        return <Step4Form {...commonProps} />;
      case 5:
        return (
          <div className="step5-container">
            <h3>Resumen y Pago</h3>
            <div className="summary-container">
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
            <button 
              type="button" 
              className="btn-general primary" 
              onClick={handleSubmit}
            >
              Finalizar Registro
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="multi-step-container">
      <h1>Nueva inscripción</h1>
      <StepIndicator steps={steps} currentStep={currentStep} />
      {getStepComponent(currentStep)}
    </div>
  );
};

export default MultiStepForm;