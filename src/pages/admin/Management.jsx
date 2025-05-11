import React from "react";
import Tabs from "../../components/tabs/Tabs";
import FormArea from "../../components/management/formArea/FormArea";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import CostsManagement from "../../components/management/costos/CostsManagement";
import PeriodosManagement from "../../components/management/period/PeriodsManagement";
import Header from "../../components/header/Header";
import "./Management.css";
import { 
  CalendarCheck,
  BookOpen,
  FlaskConical,
  TestTube2,
  Calculator
} from 'lucide-react';
import CatalogoMangament from "../../components/management/catalogo/CatalogoManagement";


const ManagementPage = () => {
  const tabs = [
    { 
      id: "olimpiadas", 
      icon: <CalendarCheck className="tab-icon" />, 
      label: "Periodos",
      description: "Gestiona fechas y periodos de las olimpiadas"
    },
    { 
      id: "catalogo", 
      icon: <BookOpen className="tab-icon" />, 
      label: "Catálogos",
      description: "Administra los catálogos disponibles"
    },
    { 
      id: "areas", 
      icon: <FlaskConical className="tab-icon" />, 
      label: "Áreas",
      description: "Gestiona las áreas científicas"
    },
    { 
      id: "categories", 
      icon: <TestTube2 className="tab-icon" />, 
      label: "Categorías",
      description: "Administra niveles y categorías"
    },
    { 
      id: "costs", 
      icon: <Calculator className="tab-icon" />, 
      label: "Costos",
      description: "Configura los costos de inscripción"
    }
  ];

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "areas":
        return <FormArea />;
      case "categories":
        return <CategoriesManagement />;
      case "olimpiadas":
        return <PeriodosManagement />;
      case "costs":
        return <CostsManagement />;
      case "catalogo":
        return <CatalogoMangament />;
      default:
        return null;
    }
  };

  return (
    <div className="management-page">
      <div className="management-background">
        <div className="science-particles"></div>
      </div>
      
      <Header
        title="Panel de Administración"
        description="Gestiona todos los aspectos de las Olimpiadas Científicas ohSansi"
        withDecoration={true}
      />
      
      <div className="management-content">
        <Tabs 
          tabs={tabs} 
          renderTabContent={renderTabContent} 
          variant="science"
        />
      </div>
    </div>
  );
};

export default ManagementPage;