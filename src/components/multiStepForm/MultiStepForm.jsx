import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "./StepIndicator";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";
import Step4Form from "./Step4Form";
import { inscripcionEstudiante, sendEmail } from "../../api/api";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { toast } from "sonner";
import "./MultiStepForm.css";

const MultiStepForm = () => {
  const navigate = useNavigate();
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
    asignaciones: {},
    costoTotal: 0
  });

  const setIsStepValid = (isValid) => {
    
  }

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
      const dataToSend = {
        participante: {
          ...formData.participante,
          idDepartamento: Number(formData.participante.idDepartamento),
          idMunicipio: Number(formData.participante.idMunicipio),
          idColegio: Number(formData.participante.idColegio),
          idNivelGradoEscolar: Number(formData.participante.idNivelGradoEscolar)
        },
        areasCompetenciaEstudiante: formData.areasCompetenciaEstudiante.map(a => ({
          idArea: a.idArea,
          idTutor: formData.asignaciones[a.idArea]?.carnetIdentidadTutor
        })),
        tutores: formData.tutores,
        costoTotal: formData.costoTotal
      };

      // Validación de áreas seleccionadas
      if (dataToSend.areasCompetenciaEstudiante.length === 0) {
        toast.error("Debe seleccionar al menos un área");
        setCurrentStep(2);
        return;
      }

      // Validación de tutores asignados
      const areasSinTutor = dataToSend.areasCompetenciaEstudiante.filter(a => !a.idTutor);
      if (areasSinTutor.length > 0) {
        toast.error("Todas las áreas deben tener un tutor asignado");
        setCurrentStep(4);
        return;
      }

      // Mostrar datos en consola antes de enviar
      console.log("Datos a enviar:", {
        ...dataToSend,
        // Mostrar información más legible
        participante: {
          ...dataToSend.participante,
          nombreCompleto: `${dataToSend.participante.nombreParticipante} ${dataToSend.participante.apellidoPaterno} ${dataToSend.participante.apellidoMaterno}`
        },
        areasConNombres: formData.areasCompetenciaEstudiante.map(a => {
          const areaInfo = formData.areasInfo?.find(ai => ai.idArea === a.idArea);
          const tutorAsignado = formData.asignaciones[a.idArea];
          return {
            nombreArea: areaInfo?.nombreArea,
            precio: areaInfo?.precioArea,
            tutor: tutorAsignado ? `${tutorAsignado.nombresTutor} ${tutorAsignado.apellidosTutor}` : null
          };
        }),
        tutoresDetallados: formData.tutores.map(t => ({
          nombreCompleto: `${t.nombresTutor} ${t.apellidosTutor}`,
          tipo: t.tipoTutorNombre,
          documento: t.carnetIdentidadTutor
        }))
      });

      const response = await inscripcionEstudiante(dataToSend);
      console.log("Registro exitoso:", response);
      toast.success("Inscripción completada con éxito");

      const emailsTutores = formData.tutores
        .filter(t => dataToSend.areasCompetenciaEstudiante.some(a => a.idTutor === t.carnetIdentidadTutor))
        .map(t => t.emailTutor); // Asegúrate de que el campo sea correcto

      console.log("Correos a enviar:", emailsTutores);

      // Enviar email a cada tutor
      for (const email of emailsTutores) {
        if (email) {
          await sendEmail({ to: email });
          console.log(`Correo enviado a: ${email}`);
        }
      }

      navigate("/home");

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
                <p>Documento: {formData.participante.carnetIdentidadParticipante}</p>
              </div>

              <div className="summary-section">
                <h4>Áreas seleccionadas:</h4>
                <ul>
                  {formData.areasCompetenciaEstudiante.map((area, index) => {
                    const areaInfo = formData.areasInfo?.find(a => a.idArea === area.idArea);
                    const tutorAsignado = formData.asignaciones[area.idArea];
                    return (
                      <li key={index}>
                        {areaInfo?.nombreArea} - Bs {areaInfo?.precioArea.toFixed(2)}
                        {tutorAsignado && (
                          <span className="tutor-assigned">
                            (Tutor: {tutorAsignado.nombresTutor} {tutorAsignado.apellidosTutor})
                          </span>
                        )}
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
                Finalizar Inscripción
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