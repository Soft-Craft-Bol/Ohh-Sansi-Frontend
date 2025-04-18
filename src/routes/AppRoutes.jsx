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
      <Route path="/" element={<Layout><MainContent /></Layout>}/>


      {/* Otras rutas protegidas */}
      <Route
        path="/home"
        element={<Layout><MainContent /></Layout>}
      />
      <Route
        path="/inicio"
        element={<Layout><Inicio /></Layout>}
      />

      <Route
        path="/form"
        element={<Layout><MultiStepForm /></Layout>}
      />

      <Route
        path="/register-excel"
        element={<Layout> <InscripcionExcel/> </Layout>}
      />

      <Route
        path="/management"
        element={<PrivateRoute><Layout><ManagementPage /></Layout></PrivateRoute>}
      />

      <Route
        path="/registro-materias"
        element={
          
            <Layout>
              <FormArea />
            </Layout>
          
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
      <Route path="/step1" element= {<Layout><Step1Form/></Layout>}/>
      <Route path="/step2" element= {<Layout><Step2Form/></Layout>}/>
      <Route path="/step3" element= {<Layout><Step3Form/></Layout>}/>
      <Route path="/step4" element= {<Layout><Step4Form/></Layout>}/>
      <Route path="/step5" element= {<Layout><Step5Form/></Layout>}/>

      
    </Routes>
  );
};

export default AppRoutes;
