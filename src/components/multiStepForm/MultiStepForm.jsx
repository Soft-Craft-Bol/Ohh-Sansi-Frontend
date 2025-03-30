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
    tutores: [],
    costoTotal: 0
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

  const handleSubmit = async () => {
    try {
      // Preparar datos para enviar
      const dataToSend = {
        participante: {
          ...formData.participante,
          idDepartamento: Number(formData.participante.idDepartamento),
          idMunicipio: Number(formData.participante.idMunicipio),
          idColegio: Number(formData.participante.idColegio),
          idNivelGradoEscolar: Number(formData.participante.idNivelGradoEscolar)
        },
        areasCompetenciaEstudiante: formData.areasCompetenciaEstudiante,
        tutores: formData.tutores,
        costoTotal: formData.costoTotal
      };

      // Validación adicional antes de enviar
      if (dataToSend.areasCompetenciaEstudiante.length === 0) {
        toast.error("Debe seleccionar al menos un área");
        setCurrentStep(2); // Redirigir al paso de áreas
        return;
      }

      const response = await inscripcionEstudiante(dataToSend);
      console.log("Registro exitoso:", response);
      toast.success("Inscripción completada con éxito");
      
      // Aquí podrías redirigir a una página de confirmación
      // navigate('/confirmacion');
      
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error("Error al completar la inscripción");
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
              <div className="summary-section">
                <h4>Información del participante:</h4>
                <p>Nombre: {formData.participante.nombreParticipante} {formData.participante.apellidoPaterno} {formData.participante.apellidoMaterno}</p>
                <p>Email: {formData.participante.correoElectronicoParticipante}</p>
              </div>
              
              <div className="summary-section">
                <h4>Áreas seleccionadas:</h4>
                <ul>
                  {formData.areasCompetenciaEstudiante.map((area, index) => {
                    const areaInfo = formData.areasInfo?.find(a => a.idArea === area.idArea);
                    return (
                      <li key={index}>
                        {areaInfo?.nombreArea} - Bs {areaInfo?.precioArea.toFixed(2)}
                      </li>
                    );
                  })}
                </ul>
                <p className="total">Total a pagar: Bs {formData.costoTotal?.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="step5-actions">
              <ButtonPrimary 
                type="button" 
                buttonStyle="secondary"
                onClick={handlePrev}
                className="mr-2"
              >
                Anterior
              </ButtonPrimary>
              <ButtonPrimary 
                type="button" 
                buttonStyle="primary" 
                onClick={handleSubmit}
              >
                Confirmar y Pagar
              </ButtonPrimary>
            </div>
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