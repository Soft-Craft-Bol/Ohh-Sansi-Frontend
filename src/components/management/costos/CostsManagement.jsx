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
import { FaCoins, FaSpinner, FaCalendarAlt } from "react-icons/fa";

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
        background: 'var(--light)',
        color: 'var(--dark)'
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

      if (!success) throw new Error(message);

      await Swal.fire({
        icon: 'success',
        title: '¡Precio actualizado!',
        text: message,
        timer: 3000,
        showConfirmButton: false,
        background: 'var(--light)',
        color: 'var(--dark)'
      });

      await fetchData();
      resetForm();
    } catch (error) {
      console.error(error);
      const backendMsg = error?.response?.data?.message || error?.message ||
        "Error al guardar el costo de la olimpiada. Intenta nuevamente.";

      await Swal.fire({
        icon: 'error',
        title: 'Ups... algo salió mal',
        text: backendMsg,
        showCloseButton: true,
        background: 'var(--light)',
        color: 'var(--dark)',
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
    <div className="costs-management-container">
      <div className="form-container">
        <div className="form-header">
          <FaCoins className="header-icon" />
          <h2>Gestión de Costos Olímpicos</h2>
          <p>Define los precios para cada período de las olimpiadas científicas</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={costsValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, errors, touched }) => (
            <Form className="cost-form">
              <div className="form-group">
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
              </div>

              <div className="form-group">
                <InputText
                  label="Costo en BOB"
                  name="precioOlimpiada"
                  decimal={true}
                  decimalPlaces={2}
                  step="0.01"
                  value={values.precioOlimpiada}
                  onChange={handleChange}
                  placeholder="Ej: 15.00"
                  error={touched.precioOlimpiada && errors.precioOlimpiada}
                  icon={FaCoins}
                />
              </div>

              <ButtonPrimary type="submit" className="cf-submit-btn">
                Registrar Costo
              </ButtonPrimary>
            </Form>
          )}
        </Formik>
      </div>

      <div className="costs-list-container">
        <div className="list-header">
          <h3>Costos Registrados</h3>
          <p>Lista de períodos con sus precios actuales</p>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <FaSpinner className="loading-spinner" />
            <p>Cargando períodos...</p>
          </div>
        ) : periods.length === 0 ? (
          <div className="empty-state">
            <FaCoins className="empty-icon" />
            <p>No hay períodos registrados aún</p>
          </div>
        ) : (
          <div className="costs-grid">
            {periods
              .sort((a, b) => a.nombreOlimpiada?.localeCompare(b.nombreOlimpiada))
              .map((periodo) => (
                <ManagementCard
                  key={periodo.idOlimpiada}
                  title={periodo.nombreOlimpiada}
                  status={periodo.estadoOlimpiada}
                  info={[
                    {
                      label: "Costo",
                      value: periodo.precioOlimpiada != null ?
                        `${periodo.precioOlimpiada} BOB` : "No definido",
                      highlight: true
                    },
                    {
                      label: "Estado",
                      value: periodo.estadoOlimpiada ? "Activo" : "Inactivo"
                    }
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