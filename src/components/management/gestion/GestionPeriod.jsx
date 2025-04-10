<<<<<<< HEAD
import React from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> 84d4d2cb383d1665a6f146b6369dcca706449a3c
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import GestionValidate from "../../../schemas/GestionValidation";
<<<<<<< HEAD
import "./GestionPeriod.css";

const initialValues = {
  name: "",
=======
import ManagementCard from "../../cards/ManagementCard";
import { getFechas, upsertFechas } from "../../../api/api";
import { toast } from "sonner";
import "./GestionPeriod.css";
import StatusBadge from "../../badges/StatusBadge";

const initialValues = {
  nombrePeriodoInscripcion: "",
>>>>>>> 84d4d2cb383d1665a6f146b6369dcca706449a3c
  fechaInicioInscripcion: "",
  fechaFinInscripcion: "",
  fechaInicioOlimpiadas: "",
  fechaFinOlimpiadas: "",
  fechaResultados: "",
  fechaPremiacion: "",
};

<<<<<<< HEAD
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
=======
const GestionPeriod = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [periodos, setPeriodos] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getFechas();
      console.log("Periodos:", response.data);
      setPeriodos(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      nombrePeriodoInscripcion: values.name,
      fechaInicioInscripcion: values.fechaInicioInscripcion,
      fechaFinInscripcion: values.fechaFinInscripcion,
      fechaInicioOlimpiadas: values.fechaInicioOlimpiadas,
      fechaFinOlimpiadas: values.fechaFinOlimpiadas,
      fechaResultados: values.fechaResultados,
      fechaPremiacion: values.fechaPremiacion,
      precioPeriodo: null 
    };
  
    try {
      setIsLoading(true);
      const response = await upsertFechas(payload);
      toast.success("Periodo registrado correctamente");
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error al registrar el periodo:", error);
      toast.error("Error al registrar el periodo");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="gestion-period">
      <h2 className="gestion-title">Gestión de Periodos Olímpicos</h2>
      <p className="gestion-subtitle">Define los períodos de las olimpiadas y sus fechas.</p>
>>>>>>> 84d4d2cb383d1665a6f146b6369dcca706449a3c

      <Formik
        initialValues={initialValues}
        validationSchema={GestionValidate}
        onSubmit={handleSubmit}
<<<<<<< HEAD
      >
        {({ handleChange, values, errors, touched }) => (
=======
        validateOnBlur={true}
        validateOnChange={false} 
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
>>>>>>> 84d4d2cb383d1665a6f146b6369dcca706449a3c
          <Form className="gestion-form">
            <div className="form-grid">
              <InputText
                label="Nombre del Período"
                name="name"
<<<<<<< HEAD
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
=======
                value={values.nombrePeriodoInscripcion}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Olimpiada 2025"
                required
                error={touched.nombrePeriodoInscripcion && errors.nombrePeriodoInscripcion}
              />
            </div>

            <div className="form-grid">
              {[
                ["fechaInicioInscripcion", "Fecha de Inicio de Inscripción"],
                ["fechaFinInscripcion", "Fecha de Fin de Inscripción"],
                ["fechaInicioOlimpiadas", "Fecha de Inicio de Olimpiadas"],
                ["fechaFinOlimpiadas", "Fecha de Fin de Olimpiadas"],
                ["fechaResultados", "Fecha de Resultados"],
                ["fechaPremiacion", "Fecha de Premiación"],
              ].map(([name, label]) => (
                <InputText
                  key={name}
                  label={label}
                  name={name}
                  type="date"
                  value={values[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={touched[name] && errors[name]}
                />
              ))}
            </div>

            <div>
              <ButtonPrimary type="submit" className="btn-submit-azul-period" disabled={isLoading}>
                Registrar Periodo
              </ButtonPrimary>
>>>>>>> 84d4d2cb383d1665a6f146b6369dcca706449a3c
            </div>
          </Form>
        )}
      </Formik>
<<<<<<< HEAD
=======

      <div className="gestion-list">
        <h2>Periodos Registrados</h2>
        {periodos.length > 0 ? (
          <div className="categories-list">
            {periodos.map((item, index) => {
              const isActive = item.estado === "ACTIVO";
              return (
                <ManagementCard
                  key={index}
                  title={`${item.nombrePeriodoInscripcion}`}
                  extraContent={<StatusBadge isActive={isActive} />}
                  info={[
                    {
                      label: "Inscripciones",
                      value: `${item.fechaInicioInscripcion} al ${item.fechaFinInscripcion}`,
                    },
                    {
                      label: "Olimpiada",
                      value: `${item.fechaInicioOlimpiadas} al ${item.fechaFinOlimpiadas}`,
                    },
                    {
                      label: "Resultados",
                      value: item.fechaResultados,
                    },
                    {
                      label: "Premiación",
                      value: item.fechaPremiacion,
                    },
                  ]}
                />
              );
            })}
          </div>
        ) : (
          <p>No hay periodos registrados.</p>
        )}
      </div>
>>>>>>> 84d4d2cb383d1665a6f146b6369dcca706449a3c
    </div>
  );
};

export default GestionPeriod;
