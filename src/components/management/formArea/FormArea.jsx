import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { 
  addArea, 
  getAreas, 
  deleteArea, 
  updateArea,
} from "../../../api/api";
import { areaValidationSchema } from "../../../schemas/areaValidation";
import "./FormArea.css";

const FormArea = () => {
  const [areas, setAreas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const response = await getAreas();
      setAreas(response.data?.areas || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Error al cargar las áreas existentes");
      setAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateShortName = (nombreArea) => {
    if (!nombreArea) return '';
    
    const words = nombreArea.split(' ').filter(word => word.length > 0);
    let shortName = '';
    
    if (words.length >= 2) {
      shortName = words[0].charAt(0) + words[1].charAt(0);
    } else if (words[0].length >= 2) {
      shortName = words[0].substring(0, 2);
    } else {
      shortName = words[0];
    }
    
    return shortName.toUpperCase();
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      // Eliminar espacios innecesarios y poner en formato adecuado
      const nombreLimpio = values.name.trim().replace(/\s+/g, ' ');
      const nombreCapitalizado = nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1).toLowerCase();
      
      const areaData = {
        nombreArea: nombreCapitalizado,
        precioArea: parseFloat(values.precioArea),
        nombreCortoArea: generateShortName(nombreCapitalizado),
        descripcionArea: values.description.trim(),
        areaStatus: values.isActive
      };
  
      if (editingId) {
        const response = await updateArea(editingId, areaData);
        setAreas(areas.map(area => 
          area.idArea === editingId ? response.data : area
        ));
        toast.success("Área actualizada con éxito");
        fetchAreas();
      } else {
        const response = await addArea(areaData);
        setAreas(prev => [...prev, response.data]);
        toast.success("Área registrada con éxito");
        fetchAreas();
      }
  
      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           (editingId ? "Error al actualizar el área" : "Error al registrar el área");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleDeleteArea = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta área?")) {
      try {
        await deleteArea(id);
        setAreas(areas.filter((area) => area.idArea !== id));
        toast.success("Área eliminada con éxito");
        if (editingId === id) setEditingId(null);
      } catch (error) {
        console.error("Error deleting area:", error);
        toast.error(error.response?.data?.message || "Error al eliminar el área");
      }
    }
  };

  const handleEditArea = (id) => {
    const areaToEdit = areas.find(area => area.idArea === id);
    if (areaToEdit) {
      setEditingId(id);
      document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const initialValues = {
    name: "",
    description: "",
    precioArea: "",
    isActive: true
  };

  if (editingId) {
    const areaToEdit = areas.find(area => area.idArea === editingId);
    if (areaToEdit) {
      initialValues.name = areaToEdit.nombreArea;
      initialValues.description = areaToEdit.descripcionArea;
      initialValues.precioArea = areaToEdit.precioArea;
      initialValues.isActive = areaToEdit.areaStatus;
    }
  }

  return (
    <div className="form-container">
      <h2>Áreas de Competencia</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={areaValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="form">
            <div>
              <InputText
                label="Nombre del área"
                name="name"
                type="text"
                required
                placeholder="Ej: Matemáticas"
                maxLength={50}
              />
              <p className="char-count">{formik.values.name.length}/50</p>
              {/* {formik.touched.name && formik.errors.name && (
                <p className="error">{formik.errors.name}</p>
              )} */}
            </div>

            <div>
              <InputText
                label="Precio del área"
                name="precioArea"
                type="number"
                required
                placeholder="Ej: 5.00"
                step="0.01"
                min="0"
              />
             {/*  {formik.touched.precioArea && formik.errors.precioArea && (
                <p className="error">{formik.errors.precioArea}</p>
              )} */}
            </div>

            <div>
              <label>Descripción</label>
              <textarea
                name="description"
                placeholder="Breve descripción del área"
                className="input"
                maxLength={500}
                required
                {...formik.getFieldProps("description")}
              />
              <p className="char-count">{formik.values.description.length}/500</p>
              {formik.touched.description && formik.errors.description && (
                <p className="error">{formik.errors.description}</p>
              )}
            </div>

            <div className="toggle-container">
              <label>
                Área activa
                <p className="toggle-info">
                  Desactivar si no está disponible para inscripción
                </p>
              </label>
              <input
                type="checkbox"
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
              />
            </div>

            <div className="form-actions">
              <ButtonPrimary
                type="submit"
                buttonStyle="primary"
                disabled={!formik.isValid || isSubmitting}
              >
                {editingId ? 'Actualizar área' : 'Añadir área'}
              </ButtonPrimary>
              
              {editingId && (
                <ButtonPrimary
                  type="button"
                  buttonStyle="secondary"
                  onClick={() => {
                    formik.resetForm();
                    setEditingId(null);
                  }}
                >
                  Cancelar edición
                </ButtonPrimary>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <div className="area-list">
        <h3>Áreas registradas</h3>
        {isLoading ? (
          <p>Cargando áreas...</p>
        ) : areas.length === 0 ? (
          <p>No hay áreas registradas aún.</p>
        ) : (
          <ul>
            {areas
              .sort((a, b) => a.nombreArea?.localeCompare(b.nombreArea))
              .map((area) => (
                <li key={area.idArea} className="area-item">
                  <div className="area-text">
                    <p className="area-name">{area.nombreArea}</p>
                    <p className="area-desc">{area.descripcionArea}</p>
                    <p className="area-price">
  Precio: {area.precioArea != null ? `Bs${Number(area.precioArea).toFixed(2)}` : 'No definido'}
</p>
                    <p className="area-short">Código: {area.nombreCortoArea}</p>
                  </div>
                  <div className="area-actions">
                    <span className={`status ${area.areaStatus ? "active" : "inactive"}`}>
                      {area.areaStatus ? "Activo" : "Inactivo"}
                    </span>
                    <button 
                      className="action-icon edit" 
                      onClick={() => handleEditArea(area.idArea)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-icon delete" 
                      onClick={() => handleDeleteArea(area.idArea)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FormArea;