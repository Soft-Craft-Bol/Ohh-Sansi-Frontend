import React, { lazy, Suspense, useMemo } from "react";
import Tabs from "../../components/tabs/Tabs";
import Header from "../../components/header/Header";
import "./Management.css";

import {
  CalendarCheck,
  BookOpen,
  FlaskConical,
  TestTube2,
  Calculator
} from 'lucide-react';

const FormArea = lazy(() => import("../../components/management/formArea/FormArea"));
const CategoriesManagement = lazy(() => import("../../components/management/categories/CategoriesManagement"));
const OlimpiadaManagement = lazy(() => import("../../components/management/olimpiada/OlimpiadaManagement"));
const PeriodosManagement = lazy(() => import("../../components/management/period/PeriodsManagement"));
const CatalogoMangament = lazy(() => import("../../components/management/catalogo/CatalogoManagement"));
const OrderSummaryDashboard = lazy(() => import("../../components/management/pagos/OrderSummaryDashboard"));
const ReporteOrdenPago = lazy(() => import("../../components/management/pagos/ReporteOrdenPago"));

const ManagementPage = () => {
  const tabs = useMemo(() => [
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
      id: "reportepagos",
      icon: <Calculator className="tab-icon" />,
      label: "Reporte de Ordenes de Pagos",
      description: "Genera reportes de pagos"
    },{
      id: "ordenespagos",
      icon: <Calculator className="tab-icon" />,
      label: "Reporte de Pagos",
      description: "Generar reportes de estado de ordenes de pago"
    }
  ], []);

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
        case "ordenespagos":
        return <OrderSummaryDashboard />;
      case "reportepagos":
        return <ReporteOrdenPago />;
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
        <Suspense fallback={<div>Cargando...</div>}>
          <Tabs
            tabs={tabs}
            renderTabContent={renderTabContent}
            variant="science"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ManagementPage;
