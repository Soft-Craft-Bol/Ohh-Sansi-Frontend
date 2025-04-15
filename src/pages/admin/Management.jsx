import React from "react";
import Tabs from "../../components/tabs/Tabs";
import FormArea from "../../components/management/formArea/FormArea";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import CostsManagement from "../../components/management/costos/CostsManagement";
import PeriodosManagement from "../../components/management/period/PeriodsManagement";
import Header from "../../components/header/Header";
import "./Management.css";
import { Trophy, Calendar, ListChecks, CoinsIcon, Banknote } from 'lucide-react';
import CatalogoMangament from "../../components/management/catalogo/CatalogoManagement";


const ManagementPage = () => {
  const tabs = [
    { id: "olimpiadas", icon: <Calendar />, label: " Periodos" },
    {id:"catalogo", icon: <Banknote />, label: " Catálogos"},
    { id: "areas", icon: <ListChecks />, label: " Áreas" },
    { id: "categories", icon: <Trophy />, label: "Categorías" },
    { id: "costs", icon: <CoinsIcon />, label: " Costos" }
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
      <Header
        title="Administración"
        description="Gestiona las áreas, niveles/categorías, fechas de inscripción y costos de inscripción"
      />
      <Tabs tabs={tabs} renderTabContent={renderTabContent} />
    </div>
  );
};

export default ManagementPage;
