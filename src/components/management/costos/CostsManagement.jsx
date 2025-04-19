import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
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
    } catch (error) {
      console.error("Error fetching olimpiadas:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los períodos olímpicos',
      });
      
      setPeriods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await savePrecioOlimpiada(values);
      const success = response?.data?.success;
      const message = response?.data?.message || "Costo registrado exitosamente!";
  
      if (!success) {
        throw new Error(message); 
      }
  
      Swal.fire({
        icon: 'success',
        title: '¡Precio actualizado!',
        text: message,
        timer: 3000,
        showConfirmButton: false
      });
  
      await fetchData();
      resetForm();
    } catch (error) {
      console.error(error);
      const backendMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Error al guardar el costo de la olimpiada. Intenta nuevamente.";
  
      Swal.fire({
        icon: 'error',
        title: 'Ups... algo salió mal',
        text: backendMsg,
        showCloseButton: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        }
      });
    }
  };
  

  return (
    <div className="costs-container-wrapper page-padding">
      <div className="costs-form">
        <h2>Gestión de Períodos Olímpicos</h2>
        <p>Define los períodos de las olimpiadas y sus precios.</p>

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
      </div>
      <div className="costs-list">
        <h3>Costos registrados</h3>
        {isLoading ? (
          <p>Cargando períodos...</p>
        ) : periods.length === 0 ? (
          <p>No hay períodos registrados aún.</p>
        ) : (
          <div className="costs-card-list">
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

    </div>
  );
};

export default CostsManagement;
