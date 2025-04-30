import React, { useState } from "react";
import Tabs from "../tabs/Tabs";  
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";
import Step4Form from "./Step4Form";
import "./InscripcionIndividual.css";
import {User, Award, Users, ClipboardCheck} from "lucide-react"
import Header from "../header/Header";

const InscripcionIndividual = () => {
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
  const [shouldSearchParticipante, setShouldSearchParticipante] = useState(false);
  const [autoNavigate, setAutoNavigate] = useState(false);

  const handleParticipanteRegistrado = (ci) => {
    setParticipanteCI(ci);
    setShouldSearchParticipante(true); // Activar la búsqueda automática
    setActiveTab("step2");
  };

  const handleParticipanteExistente = (ci) => {
    setParticipanteCI(ci);
    setShouldSearchParticipante(true); // Activar la búsqueda automática
    setActiveTab("step2");
  };

  const handleAutoNavigate = (nextStep) => {
    setActiveTab(nextStep);
    setAutoNavigate(true);
  };


  // Tabs setup
  const tabs = [
    { 
      id: "step1", 
      label: "Información básica",
      icon: <User size={20} />,
      component: <Step1Form 
        formData={formData} 
        updateFormData={setFormData} 
        onRegistroExitoso={handleParticipanteRegistrado}
        onParticipanteExistente={handleParticipanteExistente}
        onComplete={() => handleAutoNavigate("step2")}
      /> 
    },
    { 
      id: "step2", 
      label: "Áreas de competencia",
      icon: <Award size={20} />,
      component: <Step2Form 
        formData={formData} 
        updateFormData={setFormData} 
        participanteCI={participanteCI}
        shouldSearch={shouldSearchParticipante}
        onSearchComplete={() => setShouldSearchParticipante(false)}
        onComplete={() => handleAutoNavigate("step3")}
        autoNavigate={autoNavigate}
      /> 
    },
    { 
      id: "step3",
      label: "Información de tutores",
      icon: <Users size={20} />,
      component: <Step3Form formData={formData} updateFormData={setFormData} />
    },
    { 
      id: "step4",
      label: "Asignación de tutor",
      icon: <ClipboardCheck size={20} />,
      component: <Step4Form formData={formData} updateFormData={setFormData} />
    }
  ];

  const renderTabContent = (activeTab) => {
    const tab = tabs.find((tab) => tab.id === activeTab);
    return tab ? tab.component : null;
  };

  return (
    <div className="multi-step-container">
      <Header title="Inscripción Individual" description="Registro de participante" />
      <Tabs 
        tabs={tabs} 
        renderTabContent={renderTabContent} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default InscripcionIndividual;