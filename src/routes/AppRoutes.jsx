import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import MainContent from "../components/sidebar/Main";
import Inicio from "../pages/home/Inicio";
import Layout from "../Layout/Layout";
import OrdenDePago from "../pages/ordenDePago/OrdenDePago";
import MultiStepForm from "../components/multiStepForm/MultiStepForm";
import ManagementPage from "../pages/admin/Management";
import FormArea from "../components/management/formArea/FormArea";
import { NotFound404 } from "../pages/404NotFound/NotFound404";
import Step1Form from "../components/multiStepForm/Step1Form";
import Step2Form from "../components/multiStepForm/Step2Form";
import Step3Form from "../components/multiStepForm/Step3Form";
import Step4Form from "../components/multiStepForm/Step4Form";
import Step5Form from "../components/multiStepForm/Step5Form";
import EstadoDeInscripcion from '../pages/estadoDeInscripcion/EstadoDeInscripcion';


const LoginUser = lazy(() => import("../pages/login/LoginUser"));
//const Formulario = lazy(() => import('../components/formulario/Formulario'));
import InscripcionExcel from '../pages/inscripcion/InscripcionExcel';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginUser />} />
      <Route path="/*" element={<NotFound404 />} />
      {/*<Route path="/formulario" element= {<Layout><Formulario /></Layout>} />*/}

      {/* Ruta raíz protegida */}
      <Route path="/" element={<PrivateRoute><Layout><MainContent /></Layout></PrivateRoute>}/>


      {/* Otras rutas protegidas */}
      <Route
        path="/home"
        element={<PrivateRoute><Layout><MainContent /></Layout></PrivateRoute>}
      />
      <Route
        path="/inicio"
        element={<PrivateRoute><Layout><Inicio /></Layout></PrivateRoute>}
      />

      <Route
        path="/form"
        element={<PrivateRoute><Layout><MultiStepForm /></Layout></PrivateRoute>}
      />

      <Route
        path="/register-excel"
        element={<PrivateRoute><Layout> <InscripcionExcel/> </Layout></PrivateRoute>}
      />

      <Route
        path="/management"
        element={<PrivateRoute><Layout><ManagementPage /></Layout></PrivateRoute>}
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
      <Route
        path="/orden-de-pago"
        element={
          <PrivateRoute>
            <Layout>
              <OrdenDePago />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/estado-de-inscripcion"
        element={
          <PrivateRoute>
            <Layout>
              <EstadoDeInscripcion />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="/step1" element= {<PrivateRoute><Layout><Step1Form/></Layout></PrivateRoute>}/>
      <Route path="/step2" element= {<PrivateRoute><Layout><Step2Form/></Layout></PrivateRoute>}/>
      <Route path="/step3" element= {<PrivateRoute><Layout><Step3Form/></Layout></PrivateRoute>}/>
      <Route path="/step4" element= {<PrivateRoute><Layout><Step4Form/></Layout></PrivateRoute>}/>
      <Route path="/step5" element= {<PrivateRoute><Layout><Step5Form/></Layout></PrivateRoute>}/>

      {/* Ruta de error 404 */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};

export default AppRoutes;
