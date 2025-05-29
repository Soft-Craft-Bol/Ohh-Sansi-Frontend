import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import olimpiadaValidationSchema from "../../../schemas/olimpiadaValidate";
import { getOlimpiadas, saveOlimpiada, updateOlimpiada } from  "../../../api/api";
import "./OlimpiadaManagement.css";
import ManagementCard from "../../cards/ManagementCard";
import { 
  FaCalendarAlt, 
  FaCoins, 
  FaSpinner, 
  FaTimes, 
  FaPlus,
  FaEdit,
  FaChevronUp,
  FaChevronDown
} from "react-icons/fa";

const OlimpiadaManagement = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      });
      setOlimpiadas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewOlimpiada = () => {
    setEditMode(false);
    setCurrentOlimpiada(null);
    setShowForm(true);
  };

  const handleEdit = (olimpiada) => {
    const olimpiadaToEdit = {
      ...olimpiada,
    };
    
    setEditMode(true);
    setCurrentOlimpiada(olimpiadaToEdit);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentOlimpiada(null);
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);
      let response;
      
      if (editMode && currentOlimpiada) {
        const updateData = {
          ...values,
          idOlimpiada: currentOlimpiada.idOlimpiada,
        };
        response = await updateOlimpiada(updateData);
      } else {
        response = await saveOlimpiada(values);
      }

      if (response.data && (response.data.idOlimpiada || response.data.message)) {
        const successMessage = response.data.message || 
          (editMode 
            ? "Olimpiada actualizada exitosamente!" 
            : "Olimpiada creada exitosamente!");

        await Swal.fire({
          icon: 'success',
          title: '¡Operación exitosa!',
          text: successMessage,
          timer: 3000,
          showConfirmButton: false,
        });

        await fetchData();
        resetForm();
        handleCancelForm();
        return;
      }

      throw new Error("La respuesta del servidor no tiene el formato esperado");
      
    } catch (error) {
      console.error(error);

      let errorMessage = "Ocurrió un error al procesar la solicitud";
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        showCloseButton: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitialValues = () => {
    if (editMode && currentOlimpiada) {
      return currentOlimpiada;
    }
    return initialValues;
  };

  return (
    <div className="om-container">
      {/* Header Principal */}
      <div className="om-header">
        <div className="om-header-content">
          <FaCalendarAlt className="om-header-icon" />
          <div className="om-header-text">
            <h1>Gestión de Olimpiadas</h1>
            <p>Administra las olimpiadas científicas y sus configuraciones</p>
          </div>
        </div>
        
        <button 
          className="om-create-btn"
          onClick={handleNewOlimpiada}
          disabled={isLoading}
        >
          <FaPlus />
          Nueva Olimpiada
        </button>
      </div>

      {/* Formulario Colapsable */}
      {showForm && (
        <div className="om-form-overlay">
          <div className="om-form-container">
            <div className="om-form-header">
              <div className="om-form-header-content">
                {editMode ? <FaEdit className="om-form-icon" /> : <FaPlus className="om-form-icon" />}
                <div>
                  <h2>{editMode ? 'Editar Olimpiada' : 'Nueva Olimpiada'}</h2>
                  <p>
                    {editMode 
                      ? `Modificando: ${currentOlimpiada?.nombreOlimpiada || ''}`
                      : 'Define los datos básicos de la olimpiada científica'
                    }
                  </p>
                </div>
              </div>
              
              <button 
                type="button" 
                className="om-close-btn"
                onClick={handleCancelForm}
                title="Cerrar formulario"
              >
                <FaTimes />
              </button>
            </div>

            <Formik
              initialValues={getInitialValues()}
              validationSchema={olimpiadaValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
              key={editMode ? currentOlimpiada?.idOlimpiada : 'new'}
            >
              {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => (
                <Form className="om-form">
                  <div className="om-form-grid">
                    <div className="om-form-group">
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

                    <div className="om-form-group">
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

                    <div className="om-form-group">
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
                  </div>

                  <div className="om-form-actions">
                    <button 
                      type="button" 
                      className="om-cancel-btn"
                      onClick={handleCancelForm}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <ButtonPrimary 
                      type="submit" 
                      className="om-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="om-spinner" />
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
        </div>
      )}

      {/* Lista de Olimpiadas */}
      <div className="om-list-container">
        {isLoading ? (
          <div className="om-loading-state">
            <FaSpinner className="om-loading-spinner" />
            <p>Cargando olimpiadas...</p>
          </div>
        ) : olimpiadas.length === 0 ? (
          <div className="om-empty-state">
            <FaCalendarAlt className="om-empty-icon" />
            <h3>No hay olimpiadas registradas</h3>
            <p>Comienza creando tu primera olimpiada científica</p>
            <button 
              className="om-empty-create-btn"
              onClick={handleNewOlimpiada}
            >
              <FaPlus />
              Crear Primera Olimpiada
            </button>
          </div>
        ) : (
          <>
            <div className="om-list-header">
              <h2>Olimpiadas Registradas ({olimpiadas.length})</h2>
              <p>Lista de olimpiadas con sus períodos y precios</p>
            </div>
            
            <div className="om-olimpiadas-grid">
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
                      }
                    ]}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OlimpiadaManagement;