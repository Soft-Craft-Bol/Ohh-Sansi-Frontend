import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../../components/tabs/Tabs"; 
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";
import Step4Form from "./Step4Form";
import { toast } from "sonner";
import "./MultiStepForm.css";

const MultiStepForm = () => {
  const navigate = useNavigate();
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

  // Tabs setup
  const tabs = [
    { id: "step1", label: "Información básica", component: <Step1Form formData={formData} updateFormData={setFormData} /> },
    { id: "step2", label: "Áreas de competencia", component: <Step2Form formData={formData} updateFormData={setFormData} /> },
    { id: "step3", label: "Información de tutores", component: <Step3Form formData={formData} updateFormData={setFormData} /> },
    { id: "step4", label: "Asignación de tutor", component: <Step4Form formData={formData} updateFormData={setFormData} /> }
  ];

  // Handle the form submission after navigating through all the tabs
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

      // Perform validation and submission logic here...

      // After successful registration:
      toast.success("Inscripción completada con éxito");
      navigate("/home");

    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error("Error al completar la inscripción");
    }
  };

  // Function to handle content rendering for active tab
  const renderTabContent = (activeTab) => {
    const tab = tabs.find((tab) => tab.id === activeTab);
    return tab ? tab.component : null;
  };

  return (
    <div className="multi-step-container">
      <h1>Nueva inscripción</h1>
      <Tabs tabs={tabs} renderTabContent={renderTabContent} />
    </div>
  );
};

export default MultiStepForm;


