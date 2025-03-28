import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../context/PrivateRoute';
import MainContent from '../components/sidebar/Main';
import Inicio from '../pages/home/Inicio';
import Layout from '../Layout/Layout';
import MultiStepForm from '../components/multiStepForm/MultiStepForm';
import InscriptionPeriods from '../components/management/fechas/InscriptionPeriods';
import CategoriesManagement from '../components/management/categories/CategoriesManegement';
import ManagementPage from '../pages/admin/Management';

const LoginUser = lazy(() => import('../pages/login/LoginUser'));
//const Formulario = lazy(() => import('../components/formulario/Formulario'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginUser />} />
      {/*<Route path="/formulario" element= {<Layout><Formulario /></Layout>} />*/}

      {/* Ruta raíz protegida */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainContent />
          </PrivateRoute>
        }
      />

      {/* Otras rutas protegidas */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Layout>
              <MainContent />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inicio"
        element={
          <PrivateRoute>
            <Layout>
              <Inicio />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/form"
        element={
          <PrivateRoute>
            <Layout>
              <MultiStepForm />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/management"
        element={
          <PrivateRoute>
            <Layout>
              <ManagementPage />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>

  );
};

export default AppRoutes;