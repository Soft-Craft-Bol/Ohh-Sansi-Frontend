import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import {addArea, getAreas, updateArea} from "../../../api/api";
import { areaValidationSchema } from "../../../schemas/areaValidation";
import "./FormArea.css";
import InputTextarea from "../../inputs/InputTextArea";
import ManagementCard from "../../cards/ManagementCard";

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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar las áreas',
      });
      
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
        Swal.fire({
          icon: 'success',
          title: '¡Area guardada!',
          text: 'Area actualizada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchAreas();
      } else {
        const response = await addArea(areaData);
        setAreas(prev => [...prev, response.data]);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Área registrada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        fetchAreas();
      }
      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        (editingId ? "Error al actualizar el área" : "Error al registrar el área");

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
    } finally {
      setIsSubmitting(false);
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
    <div className="form-area-wrapper page-padding">
      <div className="form-container-area">
        <div className="tabs">
          <h2> Áreas de Competencia</h2>
          <p>Añada áreas de competencia</p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={areaValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          context={{ existingAreas: areas.map((area) => area.nombreArea) }}

        >
          {(formik) => (
            <Form >
              <div>
                <InputText
                  label="Nombre del área"
                  name="name"
                  type="text"
                  required
                  placeholder="Ej: Matemáticas"
                  maxLength={30}
                  showCounter={true}
                />
              </div>
              <div>
                <InputTextarea
                  label="Descripción del área"
                  name="description"
                  placeholder="Breve descripción del área"
                  maxLength={200}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.description}
                  error={formik.errors.description}
                  required
                />
              </div>


              <div>
                <ButtonPrimary
                  type="submit"
                  className="btn-submit-azul"
                  disabled={!formik.isValid || isSubmitting}
                >
                  {editingId ? 'Actualizar área' : 'Añadir área'}
                </ButtonPrimary>

              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="area-list">
        <h3>Áreas registradas</h3>
        {isLoading ? (
          <p>Cargando áreas...</p>
        ) : areas.length === 0 ? (
          <p>No hay áreas registradas aún.</p>
        ) : (
          <div className="card-list">
            {areas
              .sort((a, b) => a.nombreArea?.localeCompare(b.nombreArea))
              .map((area) => (
                <ManagementCard key={area.idArea}
                  title={area.nombreArea}
                  info={[
                    { label: "Descripción", value: area.descripcionArea || "—" },
                    {
                      label: "Código",
                      value: area.nombreCortoArea || "—",
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

export default FormArea;