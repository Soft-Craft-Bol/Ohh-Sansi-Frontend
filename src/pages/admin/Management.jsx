import React from "react";
import Tabs from "../../components/tabs/Tabs";
import FormArea from "../../components/management/formArea/FormArea";
import CategoriesManagement from "../../components/management/categories/CategoriesManagement";
import InscriptionPeriods from "../../components/management/fechas/InscriptionPeriods";
import "./Management.css";
import Header from "../../components/header/Header";
import CostsManagement from "../../components/management/costos/CostsManagement";
const ManagementPage = () => {
  const tabList = [
    { name: "areas", label: "Áreas" },
    { name: "categories", label: "Categorías" },
    { name: "periods", label: "Períodos de Inscripción" },
    { name: "cost", label: "Costo por Período"}
  ];

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "areas":
        return <FormArea />;
      case "categories":
        return <CategoriesManagement />;
      case "periods":
        return <InscriptionPeriods />;
      case "cost":
        return <CostsManagement />;
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
      <Tabs tabList={tabList} renderTabContent={renderTabContent} />
    </div>
  );
};

export default ManagementPage;
