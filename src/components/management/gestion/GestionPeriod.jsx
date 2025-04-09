import React from "react";
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import GestionValidate from "../../../schemas/GestionValidation";
import "./GestionPeriod.css";

const initialValues = {
  name: "",
  fechaInicioInscripcion: "",
  fechaFinInscripcion: "",
  fechaInicioOlimpiadas: "",
  fechaFinOlimpiadas: "",
  fechaResultados: "",
  fechaPremiacion: "",
};

const handleSubmit = (values) => {
  console.log("Form Submitted:", values);
};

const GestionPeriod = () => {
  return (
    <div className="gestion-period">
      <h2 className="gestion-title">Gestión de Periodos Olímpicos</h2>
      <p className="gestion-subtitle">
        Define los períodos de las olimpiadas y sus fechas.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={GestionValidate}
        onSubmit={handleSubmit}
      >
        {({ handleChange, values, errors, touched }) => (
          <Form className="gestion-form">
            <div className="form-grid">
              <InputText
                label="Nombre del Período"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Ej: Olimpiada 2025"
                required
                error={touched.name && errors.name}
              />
            </div>
            <div className="form-grid">
              <InputText
                label="Fecha de Inicio de Inscripción"
                name="fechaInicioInscripcion"
                type="date"
                value={values.fechaInicioInscripcion}
                onChange={handleChange}
                required
                error={touched.fechaInicioInscripcion && errors.fechaInicioInscripcion}
              />
              <InputText
                label="Fecha de Fin de Inscripción"
                name="fechaFinInscripcion"
                type="date"
                value={values.fechaFinInscripcion}
                onChange={handleChange}
                required
                error={touched.fechaFinInscripcion && errors.fechaFinInscripcion}
              />
              <InputText
                label="Fecha de Inicio de Olimpiadas"
                name="fechaInicioOlimpiadas"
                type="date"
                value={values.fechaInicioOlimpiadas}
                onChange={handleChange}
                required
                error={touched.fechaInicioOlimpiadas && errors.fechaInicioOlimpiadas}
              />
              <InputText
                label="Fecha de Fin de Olimpiadas"
                name="fechaFinOlimpiadas"
                type="date"
                value={values.fechaFinOlimpiadas}
                onChange={handleChange}
                required
                error={touched.fechaFinOlimpiadas && errors.fechaFinOlimpiadas}
              />
              <InputText
                label="Fecha de Resultados"
                name="fechaResultados"
                type="date"
                value={values.fechaResultados}
                onChange={handleChange}
                required
                error={touched.fechaResultados && errors.fechaResultados}
              />
              <InputText
                label="Fecha de Premiación"
                name="fechaPremiacion"
                type="date"
                value={values.fechaPremiacion}
                onChange={handleChange}
                required
                error={touched.fechaPremiacion && errors.fechaPremiacion}
              />
            </div>

            <div >
              <ButtonPrimary type="submit" className="btn-submit-azul-period">Registrar Periodo</ButtonPrimary>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GestionPeriod;
