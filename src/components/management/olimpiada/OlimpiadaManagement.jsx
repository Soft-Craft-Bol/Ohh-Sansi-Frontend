import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import olimpiadaValidationSchema from "../../../schemas/olimpiadaValidate";
import { getOlimpiadas, saveOlimpiada } from "../../../api/api";
import "./OlimpiadaManagement.css";
import ManagementCard from "../../cards/ManagementCard";
import { FaCalendarAlt, FaCoins, FaSpinner } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const OlimpiadaManagement = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentOlimpiada, setCurrentOlimpiada] = useState(null);

  const initialValues = {
    anio: new Date().getFullYear(),
    nombreOlimpiada: "",
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
      setOlimpiadas(data);
    } catch (error) {
      console.error("Error fetching olimpiadas:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar las olimpiadas',
        background: 'var(--light)',
        color: 'var(--dark)'
      });
      setOlimpiadas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (olimpiada) => {
    setEditMode(true);
    setCurrentOlimpiada(olimpiada);
  };


  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await saveOlimpiada(values);

      if (response.data?.status === "success") {
        const message = response.data?.message ||
          (editMode ? "Olimpiada actualizada exitosamente!" : "Olimpiada creada exitosamente!");

        await Swal.fire({
          icon: 'success',
          title: '¡Operación exitosa!',
          text: message,
          timer: 3000,
          showConfirmButton: false,
          background: 'var(--light)',
          color: 'var(--dark)'
        });

        await fetchData();
        resetForm();
        setEditMode(false);
        setCurrentOlimpiada(null);
        return;
      }
      throw new Error(response.data?.message || "Error desconocido");
    } catch (error) {
      console.error(error);

      const errorMessage = 
      error?.response?.data?.message ||error?.response?.data?.Error?.Error || error?.message ||"Error al procesar la solicitud. Intenta nuevamente.";

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
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
    <div className="olimpiada-management-container">
      <div className="form-container">
        <div className="form-header">
          <FaCalendarAlt className="header-icon" />
          <h2>{editMode ? 'Editar Olimpiada' : 'Crear Nueva Olimpiada'}</h2>
          <p>Define los datos básicos de la olimpiada científica</p>
        </div>

        <Formik
          initialValues={editMode ? currentOlimpiada : initialValues}
          validationSchema={olimpiadaValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, handleChange, errors, touched }) => (
            <Form className="olimpiada-form">
              <div className="form-group">
                <InputText
                  label="Año de la olimpiada"
                  name="anio"
                  type="number"
                  value={values.anio}
                  onChange={handleChange}
                  required
                  maxLength={5}
                  min={new Date().getFullYear()}
                  error={touched.anio && errors.anio}

                />
              </div>

              <div className="form-group">
                <InputText
                  label="Nombre de la olimpiada"
                  name="nombreOlimpiada"
                  value={values.nombreOlimpiada}
                  onChange={handleChange}
                  maxLength={50}
                  onlyLettersCapital
                  required
                  placeholder="Ej: OLIMPIADA CIENTIFICA 2025"
                  error={touched.nombreOlimpiada && errors.nombreOlimpiada}
                />
              </div>

              <div className="form-group">
                <InputText
                  label="Precio  (BOB)"
                  name="precioOlimpiada"
                  decimal={true}
                  decimalPlaces={2}
                  step="1.00"
                  value={values.precioOlimpiada}
                  onChange={handleChange}
                  placeholder="Ej: 100.00"
                  maxLength={6}
                  required
                  error={touched.precioOlimpiada && errors.precioOlimpiada}
                  icon={FaCoins}
                />
              </div>

              <div className="form-actions">
                <ButtonPrimary type="submit" className="register-btn">
                  {editMode ? 'Actualizar Olimpiada' : 'Crear Olimpiada'}
                </ButtonPrimary>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="olimpiadas-list-container">
        <div className="list-header">
          <h3>Olimpiadas Registradas</h3>
          <p>Lista de olimpiadas con sus períodos y precios</p>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <FaSpinner className="loading-spinner" />
            <p>Cargando olimpiadas...</p>
          </div>
        ) : olimpiadas.length === 0 ? (
          <div className="empty-state">
            <FaCalendarAlt className="empty-icon" />
            <p>No hay olimpiadas registradas aún</p>
          </div>
        ) : (
          <div className="olimpiadas-grid">
            {olimpiadas
              .sort((a, b) => b.anio - a.anio)
              .map((olimpiada) => (
                <ManagementCard
                  key={olimpiada.idOlimpiada}
                  title={olimpiada.nombreOlimpiada}
                  status={olimpiada.nombreEstado}
                  onEdit={() => handleEdit(olimpiada)}
                  editable={olimpiada.nombreEstado === 'PLANIFICACION'}
                  info={[
                    {
                      label: "Año",
                      value: olimpiada.anio,
                      highlight: true
                    },
                    {
                      label: "Precio base",
                      value: olimpiada.precioOlimpiada != null ?
                        `${olimpiada.precioOlimpiada} BOB` : "No definido"
                    },
                    {
                      label: "Estado",
                      value: olimpiada.nombreEstado
                    },
                    {
                      label: "Períodos",
                      value: olimpiada.periodos?.length || 0
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

export default OlimpiadaManagement;