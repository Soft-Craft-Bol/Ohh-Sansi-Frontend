import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import SelectInput from "../../selected/SelectInput";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import costsValidationSchema from "../../../schemas/costValidate";
import { getOlimpiadas, savePrecioOlimpiada } from "../../../api/api";
import "./CostsManagement.css";
import ManagementCard from "../../cards/ManagementCard";

const CostsManagement = () => {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialValues = {
    idOlimpiada: "",
    precioOlimpiada: "",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getOlimpiadas();
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setPeriods(data);
      console.log("Periodos cargados:", data);
    } catch (error) {
      console.error("Error fetching olimpiadas:", error);
      toast.error("Error al cargar los datos de las olimpiadas");
      setPeriods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log("Valores enviados:", values);

      const response = await savePrecioOlimpiada(values); // Ya están con los nombres correctos
      const message =
        response?.data?.message || "Costo registrado exitosamente!";

      toast.success(message);

      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving price:", error);
      toast.error("Error al registrar el costo.");
    }
  };

  return (
    <div className="costs-container">
      <div className="tabs">
        <h2 className="gestion-title">Gestión de Períodos Olímpicos</h2>
        <p className="gestion-subtitle">
          Define los períodos de las olimpiadas y sus precios.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={costsValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, values, errors, touched }) => (
          <Form className="form">
            <SelectInput
              label="Período Olímpico"
              name="idOlimpiada"
              options={periods.map((period) => ({
                value: period.idOlimpiada,
                label: period.nombreOlimpiada,
              }))}
              value={values.idOlimpiada}
              onChange={handleChange}
              error={touched.idOlimpiada && errors.idOlimpiada}
            />

            <InputText
              label="Costo en BOB"
              name="precioOlimpiada"
              type="number"
              value={values.precioOlimpiada}
              onChange={handleChange}
              placeholder="Ingrese el costo"
              error={touched.precioOlimpiada && errors.precioOlimpiada}
            />

            <ButtonPrimary type="submit" className="btn-submit-azul">
              Registrar Costo
            </ButtonPrimary>
          </Form>
        )}
      </Formik>

      <h3 className="costs-title">Costos registrados</h3>
      {isLoading ? (
        <p>Cargando períodos...</p>
      ) : periods.length === 0 ? (
        <p>No hay períodos registrados aún.</p>
      ) : (
        <div className="card-list">
          {periods
            .sort((a, b) =>
              a.nombreOlimpiada?.localeCompare(b.nombreOlimpiada)
            )
            .map((periodo) => (
              <ManagementCard
                key={periodo.idOlimpiada}
                title={periodo.nombreOlimpiada}
                info={[
                  {
                    label: "Estado",
                    value: periodo.estadoOlimpiada ? "Activo" : "Inactivo",
                  },
                  {
                    label: "Costo (BOB)",
                    value:
                      periodo.precioOlimpiada != null
                        ? `${periodo.precioOlimpiada} BOB`
                        : "—",
                  },
                ]}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CostsManagement;
