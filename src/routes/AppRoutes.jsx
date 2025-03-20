import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../context/PrivateRoute';
import MainContent from '../components/sidebar/Main';
import Inicio from '../pages/home/Inicio';

const LoginUser = lazy(() => import('../pages/login/LoginUser'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginUser />} />

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
            <Inicio/>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;