import React from "react";
import Tabs from "../../components/tabs/Tabs";
import FormArea from "../../components/management/formArea/FormArea";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import InscriptionPeriods from "../../components/management/fechas/InscriptionPeriods";
import "./Management.css";

const ManagementPage = () => {
  const tabList = [
    { name: "areas", label: "Áreas" },
    { name: "categories", label: "Categorías" },
    { name: "periods", label: "Períodos de Inscripción" },
  ];

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "areas":
        return <FormArea />;
      case "categories":
        return <CategoriesManagement />;
      case "periods":
        return <InscriptionPeriods />;
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
      <Tabs tabList={tabList} renderTabContent={renderTabContent} />
    </div>
  );
};

export default ManagementPage;
