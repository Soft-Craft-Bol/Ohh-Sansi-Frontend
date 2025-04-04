import React from "react";
import Tabs from "../../components/tabs/Tabs";
import FormArea from "../../components/management/formArea/FormArea";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import InscriptionPeriods from "../../components/management/fechas/InscriptionPeriods";
import CostsManagement from "../../components/management/costos/CostsManagement";
import GestionPeriod from "../../components/management/gestion/GestionPeriod";
import "./Management.css";

const ManagementPage = () => {
  const tabs = [
    { id: "periods", label: "⏳ Periodos" },        
    { id: "categories", label: "🗂 Categorías" },  
    { id: "areas", label: "📍 Áreas" },           
    { id: "costs", label: "💵 Costos" },          
    { id: "payments", label: "💳 Pagos" }        
];


  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "areas":
        return <FormArea />;
      case "categories":
        return <CategoriesManagement />;
      case "periods":
        return <GestionPeriod />;
        case "costs":
          return <CostsManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="management-page">
      <header className="management-header">
        <h1>Administración</h1>
        <p>Gestiona las areas, niveles/categorías, fechas de inscripcion y costos de inscripción</p>
      </header>
      <Tabs tabs={tabs} renderTabContent={renderTabContent} />

    </div>
  );
};

export default ManagementPage;
