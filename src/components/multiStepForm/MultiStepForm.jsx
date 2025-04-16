import React, { useState } from "react";
import Tabs from "../../components/tabs/Tabs";  
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";
import Step4Form from "./Step4Form";
import "./MultiStepForm.css";

const MultiStepForm = () => {
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

  const [activeTab, setActiveTab] = useState("step1");
  const [participanteCI, setParticipanteCI] = useState(null);

  // Función para manejar el registro exitoso del participante
  const handleParticipanteRegistrado = (ci) => {
    setParticipanteCI(ci);
    setActiveTab("step2");
  };

  // Tabs setup
  const tabs = [
    { 
      id: "step1", 
      label: "Información básica", 
      component: <Step1Form 
        formData={formData} 
        updateFormData={setFormData} 
        onRegistroExitoso={handleParticipanteRegistrado} 
      /> 
    },
    { 
      id: "step2", 
      label: "Áreas de competencia", 
      component: <Step2Form 
        formData={formData} 
        updateFormData={setFormData} 
        participanteCI={participanteCI} 
      /> 
    },
    { id: "step3", label: "Información de tutores", component: <Step3Form formData={formData} updateFormData={setFormData} /> },
    { id: "step4", label: "Asignación de tutor", component: <Step4Form formData={formData} updateFormData={setFormData} /> }
  ];

  const renderTabContent = (activeTab) => {
    const tab = tabs.find((tab) => tab.id === activeTab);
    return tab ? tab.component : null;
  };

  return (
    <div className="multi-step-container">
      <h1>Nueva inscripción</h1>
      <Tabs 
        tabs={tabs} 
        renderTabContent={renderTabContent} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default MultiStepForm;