import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import Layout from "../Layout/Layout";

// Importaciones Lazy
const MainContent = lazy(() => import("../components/sidebar/LandingPage"));
const OrdenDePago = lazy(() => import("../pages/ordenDePago/OrdenDePago"));
const InscripcionIndividual = lazy(() => import("../components/multiStepForm/InscripcionIndividual"));
const ManagementPage = lazy(() => import("../pages/admin/Management"));
const NotFound404 = lazy(() => import("../pages/404NotFound/NotFound404").then(module => ({ default: module.NotFound404 })));
const EstadoDeInscripcion = lazy(() => import('../pages/estadoDeInscripcion/EstadoDeInscripcion'));
const LoginUser = lazy(() => import("../pages/login/LoginUser"));
const SubirBoleta = lazy(() => import("../pages/subirComprobante/SubirComprobante"));
const InscripcionExcel = lazy(
  () => import("../pages/inscripcion/InscripcionExcel")
);
const AdvancedImageScanner = lazy(() => import("../components/camScanner/AdvancedImageScanner"));
const ImageScanner = lazy(() => import("../components/camScanner/ImageScanner"));
import Comprobante from "../pages/subirComprobante/Comprobante";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route
        path="/login"
        element={<LoginUser />}
      />
      <Route
        path="/*"
        element={<NotFound404 />}
      />
      <Route
        path="/"
        element={
          <Layout>
            <MainContent />
        </Layout>
      }/>


      <Route path="/inscripcion-individual" element={
        <Layout>
            <InscripcionIndividual />
        </Layout>
      }/>

      <Route
        path="/inscripcion-masiva"
        element={
          <Layout>
            <InscripcionExcel />
          </Layout>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
              <ManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/orden-de-pago"
        element={
          <Layout>
            <OrdenDePago />
          </Layout>
        }
      />

      <Route
        path="/estado-de-inscripcion"
        element={
          <Layout>
            <EstadoDeInscripcion />
          </Layout>
        }
      />

      <Route
        path="/subir-boleta"
        element={
          <Layout>
            <Comprobante />
          </Layout>
        }
      />
      <Route
        path="/cam-scanner"
        element={
          <Layout>
            <AdvancedImageScanner />
          </Layout>
        }
      />

      <Route
        path="/image-scanner"
        element={
          <Layout>
            <Comprobante />
          </Layout>
        } 
      />
    </Routes>
    
  );
};

export default AppRoutes;
