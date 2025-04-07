import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../inputs/InputText";
import Switch from "../../switch/Switch";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import PeriodCard from "../../cards/PeriodCard";
import { upsertFechas, getFechas } from "../../../api/api";
import { toast } from "sonner";
import "./InscriptionPeriods.css";

const InscriptionPeriods = () => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const minDate = "2000-01-01";
  const maxDate = `${currentYear}-12-31`;


  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const response = await getFechas();
      setPeriods(response.data.data || []);
    } catch (error) {
      console.error("Error fetching periods:", error);
      toast.error("Error al cargar los períodos de inscripción");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const newPeriod = {
        nombre: values.name,
        fechaInicioInscripcion: values.startDate,
        fechaFinInscripcion: values.endDate,
      };

      const response = await upsertFechas(newPeriod);
      setPeriods([...periods, response.data]);
      toast.success("Período de inscripción creado correctamente");

      resetForm();
    } catch (error) {
      console.error("Error creating period:", error);
      toast.error("Error al crear el período de inscripción");
    }
  };

  const deactivatePeriod = async (id) => {
    try {
      const updatedPeriods = periods.map((p) =>
        p.id === id ? { ...p, estado: false } : p
      );

      setPeriods(updatedPeriods);
      toast.success("Período desactivado correctamente");
    } catch (error) {
      console.error("Error deactivating period:", error);
      toast.error("Error al desactivar el período");
    }
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
      {loading ? (
        <p>Cargando períodos...</p>
      ) : periods.length > 0 ? (
        periods.map((period) => (
          <PeriodCard
            key={period.idPlazoInscripcion}
            period={{
              fechaInicioInscripcion: period.fechaInicioInscripcion,
              fechaFinInscripcion: period.fechaFinInscripcion,
              idPlazoInscripcion: period.idPlazoInscripcion,
              active:period.fechaPlazoInscripcionActivo, 
            }}
            onDeactivate={() => deactivatePeriod(period.idPlazoInscripcion)}
          />
        ))
      ) : (
        <p>No hay períodos registrados.</p>
      )}

    </div>
  );
};

export default InscriptionPeriods;
