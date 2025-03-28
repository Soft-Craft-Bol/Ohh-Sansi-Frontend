import React from "react";
import Tabs from "../../components/tabs/Tabs";
import "./Management.css";

const ManagementPage = () => {
  return (
    <div className="management-page">
      <header className="management-header">
        <h1>Administración</h1>
        <p>Gestiona los niveles, categorías y períodos de inscripción</p>
      </header>
      <Tabs />
    </div>
  );
};

export default ManagementPage;
