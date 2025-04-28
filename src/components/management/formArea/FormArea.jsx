import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { addArea, getAreas } from "../../../api/api";
import { areaValidationSchema } from "../../../schemas/areaValidation";
import "./FormArea.css";
import InputTextarea from "../../inputs/InputTextArea";
import ManagementCard from "../../cards/ManagementCard";

const FormArea = () => {
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const response = await getAreas();
      setAreas(response.data?.areas || []);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las áreas",
      });
      setAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, " "); 
  };

  const generateShortName = (nombreArea) => {
    if (!nombreArea) return "";
    const words = nombreArea.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0].substring(0, 2).toUpperCase();
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const nombreLimpio = values.name.trim().replace(/\s+/g, " ");
      const nombreCapitalizado = nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1).toLowerCase();
      const nombreNormalizado = normalizarTexto(nombreCapitalizado);

      const existeSimilar = areas.some((area) => {
        const areaNormalizada = normalizarTexto(area.nombreArea);
        return areaNormalizada === nombreNormalizado;
      });

      if (existeSimilar) {
        Swal.fire({
          icon: "error",
          title: "Nombre duplicado",
          text: "Ya existe un área con un nombre similar. Intenta con otro nombre.",
        });
        setIsSubmitting(false);
        return;
      }

      const nuevaArea = {
        nombreArea: nombreCapitalizado,
        nombreCortoArea: generateShortName(nombreCapitalizado),
        descripcionArea: values.description.trim(),
      };

      const response = await addArea(nuevaArea);
      setAreas(prev => [...prev, response.data]);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Área registrada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        fetchAreas();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message ||
        error.message || "Error al registrar el área";

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues = {
    name: "",
    description: "",
  };

  return (
    <div className="form-area-wrapper page-padding">
      <div className="form-container-area">
        <div className="tabs">
          <h2>Áreas de Competencia</h2>
          <p>Añada nuevas áreas de competencia</p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={areaValidationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <InputText
                label="Nombre del área"
                name="name"
                type="text"
                required
                placeholder="Ej: Matemáticas"
                maxLength={30}
                showCounter={true}
              />
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
              <ButtonPrimary
                type="submit"
                className="btn-submit-azul"
                disabled={!formik.isValid || isSubmitting}
              >
                Añadir área
              </ButtonPrimary>
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
            {areas.map((area) => (
              <ManagementCard
                key={area.idArea}
                title={area.nombreArea}
                info={[
                  {
                    label: "Descripción",
                    value: area.descripcionArea || "—",
                  },
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
