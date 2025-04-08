import React from "react";
import Tabs from "../../components/tabs/Tabs";
import GestionPeriod from "../../components/management/gestion/GestionPeriod";
import FormArea from "../../components/management/formArea/FormArea";
import GradosManagement from "../../components/management/grados/GradosManagement";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import CostsManagement from "../../components/management/costos/CostsManagement";

import "./Management.css";
import { Trophy, Calendar, ListChecks,CoinsIcon, Banknote } from 'lucide-react';


const ManagementPage = () => {
  const tabs = [
    { id: "periods", icon:<Calendar/>,label: " Periodos" },        
    { id: "areas",icon:<ListChecks/>, label: " Áreas" },
    {id: "grados", icon:<ListChecks/>, label: " Grados" }, 
    {id: "categories", icon: <Trophy />, label: "Categorías" },          
    { id: "costs", icon:<CoinsIcon/>, label: " Costos" },          
    { id: "payments", icon:<Banknote/>,label: " Pagos" }        
];


  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "areas":
        return <FormArea />;
      case "grados":
        return <GradosManagement />;
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
