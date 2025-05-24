import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import olimpiadaValidationSchema from "../../../schemas/olimpiadaValidate";
import { getOlimpiadas, saveOlimpiada, updateOlimpiada } from "../../../api/api";
import "./OlimpiadaManagement.css";
import ManagementCard from "../../cards/ManagementCard";
import { FaCalendarAlt, FaCoins, FaSpinner, FaTimes } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import formatDate from "../../../utils/formatDate";

const OlimpiadaManagement = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentOlimpiada, setCurrentOlimpiada] = useState(null);

  const initialValues = {
    anio: new Date().getFullYear(),
    nombreOlimpiada: "",
    precioOlimpiada: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
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
    // Convertir las fechas de string a objetos Date para el DatePicker
    const olimpiadaToEdit = {
      ...olimpiada,
      fechaInicio: olimpiada.fechaInicio ? new Date(olimpiada.fechaInicio) : new Date(),
      fechaFin: olimpiada.fechaFin ? new Date(olimpiada.fechaFin) : new Date(),
    };
    
    setEditMode(true);
    setCurrentOlimpiada(olimpiadaToEdit);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentOlimpiada(null);
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);
      let response;
      
      if (editMode && currentOlimpiada) {
        // Modo edición - usar updateOlimpiada
        const updateData = {
          ...values,
          idOlimpiada: currentOlimpiada.idOlimpiada, // Incluir el ID para la actualización
        };
        response = await updateOlimpiada(updateData);
      } else {
        // Modo creación - usar saveOlimpiada
        response = await saveOlimpiada(values);
      }

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
        handleCancelEdit(); // Limpiar el modo de edición
        return;
      }
      throw new Error(response.data?.message || "Error desconocido");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error?.response?.data?.message || 
        error?.response?.data?.Error?.Error || 
        error?.message || 
        `Error al ${editMode ? 'actualizar' : 'crear'} la olimpiada. Intenta nuevamente.`;

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
    } finally {
      setSubmitting(false);
    }
  };

  // Función para obtener los valores iniciales del formulario
  const getInitialValues = () => {
    if (editMode && currentOlimpiada) {
      return currentOlimpiada;
    }
    return initialValues;
  };

  return (
    <div className="olimpiada-management-container">
      <div className="form-container">
        <div className="form-header">
          <FaCalendarAlt className="header-icon" />
          <div className="header-content">
            <h2>{editMode ? 'Editar Olimpiada' : 'Crear Nueva Olimpiada'}</h2>
            <p>
              {editMode 
                ? `Modificando: ${currentOlimpiada?.nombreOlimpiada || ''}`
                : 'Define los datos básicos de la olimpiada científica'
              }
            </p>
          </div>
          {editMode && (
            <button 
              type="button" 
              className="cancel-edit-btn"
              onClick={handleCancelEdit}
              title="Cancelar edición"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={olimpiadaValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
          key={editMode ? currentOlimpiada?.idOlimpiada : 'new'}
        >
          {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => (
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
                  disabled={editMode} 
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
                  label="Precio (BOB)"
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

              <div className="form-group date-picker-group">
                <div className="date-picker-row">
                  <div className="date-picker-container">
                    <label>Fecha Inicio:</label>
                    <DatePicker
                      selected={values.fechaInicio}
                      onChange={(date) => setFieldValue("fechaInicio", date)}
                      dateFormat="dd/MM/yyyy"
                      locale={es}
                      className="date-picker-input"
                      minDate={editMode ? null : new Date()} // En edición permitir fechas pasadas
                    />
                    {touched.fechaInicio && errors.fechaInicio && (
                      <div className="error-message">{errors.fechaInicio}</div>
                    )}
                  </div>
                  <div className="date-picker-container">
                    <label>Fecha Fin:</label>
                    <DatePicker
                      selected={values.fechaFin}
                      onChange={(date) => setFieldValue("fechaFin", date)}
                      dateFormat="dd/MM/yyyy"
                      locale={es}
                      className="date-picker-input"
                      minDate={values.fechaInicio}
                    />
                    {touched.fechaFin && errors.fechaFin && (
                      <div className="error-message">{errors.fechaFin}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                {editMode && (
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                )}
                <ButtonPrimary 
                  type="submit" 
                  className="register-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" />
                      {editMode ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    editMode ? 'Actualizar Olimpiada' : 'Crear Olimpiada'
                  )}
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
                  isEditing={editMode && currentOlimpiada?.idOlimpiada === olimpiada.idOlimpiada}
                  info={[
                    {
                      label: "Año",
                      value: olimpiada.anio,
                      highlight: true
                    },
                    {
                      label: "Precio ",
                      value: olimpiada.precioOlimpiada != null ?
                        `${olimpiada.precioOlimpiada} BOB` : "No definido"
                    },
                    {
                      label: "Estado",
                      value: olimpiada.nombreEstado
                    },
                    {
                      label: "Fecha Inicio",
                      value: formatDate(olimpiada.fechaInicio) || "No definida"
                    },
                    {
                      label: "Fecha Fin",
                      value: formatDate(olimpiada.fechaFin) || "No definida"
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