import React, { useState, lazy, Suspense, useMemo } from "react";
import {
  CalendarCheck,
  BookOpen,
  FlaskConical,
  TestTube2,
  Calculator,
  Menu,
  X,
  Sun,
  Moon,
  ChevronLeft,
  Settings,
  BarChart3,
  Home
} from 'lucide-react';
import "./Management.css";

const OlimpiadasDashboard = lazy(() => import("../../components/management/dashboard/OlimpiadasDashboard"));
const FormArea = lazy(() => import("../../components/management/formArea/FormArea"));
const CategoriesManagement = lazy(() => import("../../components/management/categories/CategoriesManagement"));
const OlimpiadaManagement = lazy(() => import("../../components/management/olimpiada/OlimpiadaManagement"));
const PeriodosManagement = lazy(() => import("../../components/management/period/PeriodsManagementSlider"));
const CatalogoMangament = lazy(() => import("../../components/management/catalogo/CatalogoManagement"));
const OrderSummaryDashboard = lazy(() => import("../../components/management/pagos/OrderSummaryDashboard"));
const ReporteOrdenPago = lazy(() => import("../../components/management/pagos/ReporteOrdenPago"));
const PaymentVerification = lazy(() => import("../../components/management/verificationpagos/PaymentVerification"));
const Inscritos = lazy(() => import("../../components/management/reporteinscritos/ListaInscritos"));
const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState("olimpiadas");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const menuItems = useMemo(() => [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      description: "Panel principal de administración"
    },
    {
      id: "olimpiadas",
      icon: Calculator,
      label: "Olimpiadas",
      description: "Crea y gestiona las olimpiadas"
    },
    {
      id: "periodos",
      icon: CalendarCheck,
      label: "Periodos",
      description: "Gestiona fechas y periodos"
    },
    {
      id: "catalogo",
      icon: BookOpen,
      label: "Catálogos",
      description: "Administra los catálogos"
    },
    {
      id: "areas",
      icon: FlaskConical,
      label: "Áreas",
      description: "Gestiona las áreas científicas"
    },
    {
      id: "categories",
      icon: TestTube2,
      label: "Categorías",
      description: "Administra niveles y categorías"
    },
    {
      id: "reportepagos",
      icon: BarChart3,
      label: "Reporte de Ordenes",
      description: "Genera reportes de pagos"
    },
    {
      id: "ordenespagos",
      icon: Settings,
      label: "Estado de Pagos",
      description: "Estado de ordenes de pago"
    },
    {
      id: "verificationpagos",
      icon: X,
      label: "Verificación de Pagos",
      description: "Verifica los pagos realizados"
    },
    {
      id: "inscritos",
      icon: Settings,
      label: "Lista de Inscritos",
      description: "Lista de inscritos por olimpiada"
    }
  ], []);

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case "dashboard":
        return <OlimpiadasDashboard />;
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
      case "verificationpagos":
        return <PaymentVerification />;
      case "inscritos":
        return <Inscritos />;
      default:
        return (
          <div className="admin-dashboard-content">
            <h2>Selecciona una opción</h2>
            <p>Elige una sección del menú para comenzar</p>
          </div>
        );
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('admin-dark-mode', !darkMode);
  };

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const currentItem = menuItems.find(item => item.id === activeTab);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    document.body.classList.toggle('admin-dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`admin-container ${darkMode ? 'admin-dark' : ''}`}>
      {/* Sidebar Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-expanded' : 'admin-sidebar-collapsed'} ${isMobile ? 'admin-sidebar-mobile' : ''}`}>
        {/* Sidebar Header */}
        <div className="admin-sidebar-header">
          {sidebarOpen && (
            <div className="admin-sidebar-title-container">
              <h1 className="admin-sidebar-title">Admin Panel</h1>
              <p className="admin-sidebar-subtitle">Olimpiadas Científicas</p>
            </div>
          )}
          <button
            className="admin-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`admin-sidebar-item ${activeTab === item.id ? 'admin-sidebar-item-active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
                title={!sidebarOpen ? item.label : ''}
              >
                <IconComponent className="admin-sidebar-item-icon" size={20} />
                {sidebarOpen && (
                  <div className="admin-sidebar-item-content">
                    <span className="admin-sidebar-item-label">{item.label}</span>
                    <span className="admin-sidebar-item-description">{item.description}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <button
            className="admin-dark-mode-toggle"
            onClick={toggleDarkMode}
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && (
              <span className="admin-dark-mode-label">
                {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            {!sidebarOpen && (
              <button
                className="admin-mobile-menu-toggle"
                onClick={toggleSidebar}
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
            )}
            <div className="admin-header-title-container">
              <h1 className="admin-header-title">
                {currentItem ? currentItem.label : 'Panel de Administración'}
              </h1>
              <p className="admin-header-description">
                {currentItem ? currentItem.description : 'Gestiona todos los aspectos de las Olimpiadas Científicas'}
              </p>
            </div>
          </div>
          <div className="admin-header-right">
            <button
              className="admin-header-dark-toggle"
              onClick={toggleDarkMode}
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>        {/* Content Area */}
        <main className="admin-content">
            <Suspense fallback={
              <div className="admin-loading">
                <div className="admin-loading-spinner"></div>
                <p>Cargando...</p>
              </div>
            }>
              {renderTabContent(activeTab)}
            </Suspense>
        </main>
      </div>
    </div>
  );
};

export default ManagementPage;