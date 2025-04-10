import React from "react";
import Tabs from "../../components/tabs/Tabs";
import GestionPeriod from "../../components/management/gestion/GestionPeriod";
import FormArea from "../../components/management/formArea/FormArea";
import GradosManagement from "../../components/management/grados/GradosManagement";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import CostsManagement from "../../components/management/costos/CostsManagement";
import PeriodPanel from "../../components/management/period/PeriodPanel";
import Header from "../../components/header/Header";
import "./Management.css";
import { Trophy, Calendar, ListChecks, CoinsIcon, Banknote } from 'lucide-react';
import PeriodosManagement from "../../components/management/period/PeriodsManagement";


const ManagementPage = () => {
  const tabs = [
    { id: "periods", icon: <Calendar />, label: " Periodos" },
    { id: "areas", icon: <ListChecks />, label: " Áreas" },
    { id: "grados", icon: <ListChecks />, label: " Grados" },
    { id: "categories", icon: <Trophy />, label: "Categorías" },
    { id: "costs", icon: <CoinsIcon />, label: " Costos" },
    { id: "payments", icon: <Banknote />, label: " Pagos" }
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
case "payments":
        return <PeriodosManagement />;
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
