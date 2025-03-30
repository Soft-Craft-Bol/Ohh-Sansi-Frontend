import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../inputs/InputText";
import Switch from "../../switch/Switch";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import PeriodCard from "../../cards/PeriodCard";
import "./InscriptionPeriods.css";

const InscriptionPeriods = () => {
  const [periods, setPeriods] = useState([]);

  const currentYear = new Date().getFullYear();
  const minDate = "2000-01-01";
  const maxDate = `${currentYear}-12-31`;

  const initialValues = {
    name: "",
    startDate: "",
    endDate: "",
    isActive: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    startDate: Yup.date().required("Fecha de inicio requerida"),
    endDate: Yup.date()
      .required("Fecha de finalización requerida")
      .min(Yup.ref("startDate"), "Debe ser posterior a la fecha de inicio"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const newPeriod = {
      id: periods.length + 1,
      name: values.name,
      startDate: values.startDate,
      endDate: values.endDate,
      active: values.isActive,
    };

    setPeriods([...periods, newPeriod]);
    resetForm();
  };

  const deactivatePeriod = (id) => {
    setPeriods(periods.map(p => p.id === id ? { ...p, active: false } : p));
  };

  return (
    <div id="inscripcion" className="inscripcion-container">
      <h2>Períodos de Inscripción</h2>
      <p>Configure los períodos de inscripción para las olimpiadas</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <InputText label="Nombre del período" name="name" required />

            <InputText
              label="Fecha de inicio"
              name="startDate"
              type="date"
              required
              min={minDate}
              max={maxDate}
            />

            <InputText
              label="Fecha de finalización"
              name="endDate"
              type="date"
              required
              min={minDate}
              max={maxDate}
            />
            <Switch
              label="Período activo"
              checked={values.isActive}
              onChange={() => setFieldValue("isActive", !values.isActive)}
            />

            <ButtonPrimary className="btn-submit" type="submit">Crear período</ButtonPrimary>
          </Form>
        )}
      </Formik>

      <h3>Períodos configurados</h3>
      {periods.map((period) => (
        <PeriodCard key={period.id} period={period} onDeactivate={deactivatePeriod} />
      ))}
    </div>
  );
};

export default InscriptionPeriods;
