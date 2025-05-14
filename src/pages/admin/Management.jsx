import React from "react";
import Tabs from "../../components/tabs/Tabs";
import FormArea from "../../components/management/formArea/FormArea";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import OlimpiadaManagement from "../../components/management/olimpiada/OlimpiadaManagement";
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
import OrderSummaryDashboard from "../../components/management/pagos/OrderSummaryDashboard";


const ManagementPage = () => {
  const tabs = [
    {
      id: "olimpiadas",
      icon: <Calculator className="tab-icon" />,
      label: "Olimpiadas",
      description: "Crea y gestiona las olimpiadas"
    },
    {
      id: "periodos",
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
      id: "pagos",
      icon: <Calculator className="tab-icon" />,
      label: "Pagos",
      description: "Gestiona los pagos de las olimpiadas"
    }
  ];

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "areas":
        return <FormArea />;
      case "categories":
        return <CategoriesManagement />;
      case "periodos":
        return <PeriodosManagement />;
      case "olimpiadas":
        return <OlimpiadaManagement />;
      case "catalogo":
        return <CatalogoMangament />;
      case "pagos":
        return <OrderSummaryDashboard />;
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