import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../context/PrivateRoute';
import MainContent from '../components/sidebar/Main';
import Inicio from '../pages/home/Inicio';
import Layout from '../Layout/Layout';
import MultiStepForm from '../components/multiStepForm/MultiStepForm';
import ManagementPage from '../pages/admin/Management';
import FormArea from "../components/management/formArea/FormArea";
import { NotFound404 } from '../pages/404NotFound/NotFound404';


const LoginUser = lazy(() => import('../pages/login/LoginUser'));
//const Formulario = lazy(() => import('../components/formulario/Formulario'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginUser />} />
      <Route path="/*" element={<NotFound404/>} />
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

    <Route
      path="/registro-materias"
      element={
        <PrivateRoute>
          <Layout>
            <FormArea />
          </Layout>
        </PrivateRoute>
      }
    />

    </Routes>
  );
};

export default AppRoutes;