import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import GestionValidate from "../../../schemas/GestionValidation";
import ManagementCard from "../../cards/ManagementCard";
import { getFechas, upsertFechas } from "../../../api/api";
import { toast } from "sonner";
import "./GestionPeriod.css";
import StatusBadge from "../../badges/StatusBadge";

const initialValues = {
  nombrePeriodoInscripcion: "",
  fechaInicioInscripcion: "",
  fechaFinInscripcion: "",
  fechaInicioOlimpiadas: "",
  fechaFinOlimpiadas: "",
  fechaResultados: "",
  fechaPremiacion: "",
};

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

      <Formik
        initialValues={initialValues}
        validationSchema={GestionValidate}
        onSubmit={handleSubmit}
        validateOnBlur={true}
        validateOnChange={false} 
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form className="gestion-form">
            <div className="form-grid">
              <InputText
                label="Nombre del Período"
                name="name"
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
            </div>
          </Form>
        )}
      </Formik>

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
    </div>
  );
};

export default GestionPeriod;
