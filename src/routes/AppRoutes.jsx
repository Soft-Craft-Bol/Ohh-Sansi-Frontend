import React, { lazy} from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import Layout from "../Layout/Layout";

// Importaciones Lazy
const MainContent = lazy(() => import("../components/sidebar/Main"));
const OrdenDePago = lazy(() => import("../pages/ordenDePago/OrdenDePago"));
const MultiStepForm = lazy(() => import("../components/multiStepForm/MultiStepForm"));
const ManagementPage = lazy(() => import("../pages/admin/Management"));
const FormArea = lazy(() => import("../components/management/formArea/FormArea"));
const NotFound404 = lazy(() => import("../pages/404NotFound/NotFound404").then(module => ({ default: module.NotFound404 })));
const EstadoDeInscripcion = lazy(() => import('../pages/estadoDeInscripcion/EstadoDeInscripcion'));
const LoginUser = lazy(() => import("../pages/login/LoginUser"));
const InscripcionExcel = lazy(() => import('../pages/inscripcion/InscripcionExcel'));


const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginUser />} />
      <Route path="/*" element={<NotFound404 />} />
    

     
      <Route path="/" element={
        <Layout>
            <MainContent />
        </Layout>
      }/>


      <Route path="/form" element={
        <Layout>
            <MultiStepForm />
        </Layout>
      }/>

      <Route
        path="/register-excel"
        element={
          <Layout>
              <InscripcionExcel/>
          </Layout>
        }
      />

      <Route path="/management" element={
        <PrivateRoute>
          <Layout>
              <ManagementPage />
          </Layout>
        </PrivateRoute>
      }/>

      <Route path="/registro-materias" element={
        <Layout>
            <FormArea />
        </Layout>
      }/>

      <Route path="/orden-de-pago" element={
        <Layout>
            <OrdenDePago />
        </Layout>
      }/>

      <Route path="/estado-de-inscripcion" element={
        <Layout>
            <EstadoDeInscripcion />
        </Layout>
      }/>

      {/* Ruta de administración */}

    </Routes>
  );
};

export default AppRoutes;
