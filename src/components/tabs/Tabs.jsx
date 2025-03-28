import React, { useState } from "react";
import InscriptionPeriods from "../management/fechas/InscriptionPeriods";
import CategoriesManagement from "../management/categories/CategoriesManegement";
import "./Tabs.css";

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("categories");
  
    return (
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categorías
          </button>
          <button
            className={`tab-button ${activeTab === "periods" ? "active" : ""}`}
            onClick={() => setActiveTab("periods")}
          >
            Períodos de Inscripción
          </button>
        </div>
  
        <div className="tabs-content">
          {activeTab === "categories" && <CategoriesManagement />}
          {activeTab === "periods" && <InscriptionPeriods />}
        </div>
      </div>
    );
  };
  
  export default Tabs;