import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { getGrados, createCategory, getGradosCategorias } from "../../../api/api";
import Swal from "sweetalert2";
import "./CategoriesManagement.css";
import CategoriesValidate from "../../../schemas/CategoriesValidation";
import ManagementCard from "../../cards/ManagementCard";
import { GRADO_ORDEN } from "../../../utils/GradesOrder";

const CategoriesManagement = () => {
  const [grados, setGrados] = useState([]);
  const [gradosCategorias, setGradosCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [gradosRes, gradocategoriasRes] = await Promise.all([
        getGrados(),
        getGradosCategorias(),
      ]);
      setGrados(
        Array.isArray(gradosRes.data?.data) ? gradosRes.data.data : []
      );
      setGradosCategorias(
        Array.isArray(gradocategoriasRes.data) ? gradocategoriasRes.data : []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener categorías",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGradosSeleccionados = (gradoDesde, gradoHasta) => {
    const indexDesde = GRADO_ORDEN.indexOf(gradoDesde);
    const indexHasta = GRADO_ORDEN.indexOf(gradoHasta);

    if (indexDesde !== -1 && indexHasta !== -1 && indexDesde <= indexHasta) {
      return GRADO_ORDEN.slice(indexDesde, indexHasta + 1).map((gradoNombre) => {
        const grado = grados.find((g) => g.nombreGrado === gradoNombre);
        return grado ? grado.idGrado : null;
      }).filter((id) => id !== null);
    }
    return [];
  };

  return (
    <div className="category-container-wrapper page-padding">
      <div className="category-form">
        <h2>Crear Categoría</h2>
        <p>Cree categorías con sus grados escolares</p>
        {!isLoading && (
          <Formik
            initialValues={{
              nombreCategoria: "",
              gradoDesde: "",
              gradoHasta: "",
            }}
            validationSchema={CategoriesValidate}
            validateOnChange={false}
            validateOnBlur={true}
            onSubmit={async (values, { resetForm }) => {
              const gradosSeleccionados = getGradosSeleccionados(values.gradoDesde, values.gradoHasta);

              if (gradosSeleccionados.length === 0) {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Debe seleccionar un rango de grados válido.",
                });
                return;
              }

              try {
                await createCategory({
                  nombreCategoria: values.nombreCategoria,
                  grados: gradosSeleccionados,
                });

                Swal.fire({
                  icon: "success",
                  title: "Categoría creada",
                  text: "La categoría fue creada exitosamente.",
                });

                resetForm();
                await fetchData();
              } catch (error) {
                console.error("Error al crear la categoría:", error);

                const backendMessage =
                  error?.response?.data?.message ||
                  "Hubo un problema al crear la categoría.";

                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: backendMessage,
                });
              }
            }}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <InputText
                  label="Nombre de la Categoría"
                  name="nombreCategoria"
                  placeholder="Ej: GUACAMAYO"
                  error={touched.nombreCategoria && errors.nombreCategoria}
                  maxLength={30}
                  required
                  showCounter={true}
                  onlyLettersCapital={true}
                />

                <div className="selection-container">
                  <label>Grado Desde:</label>
                  <select
                    onChange={(e) => setFieldValue("gradoDesde", e.target.value)}
                    value={values.gradoDesde}
                  >
                    <option value="">Seleccione un grado</option>
                    {GRADO_ORDEN.map((grado, index) => (
                      <option key={index} value={grado}>
                        {grado}
                      </option>
                    ))}
                  </select>
                  {touched.gradoDesde && errors.gradoDesde && (
                    <div className="error-message">{errors.gradoDesde}</div>
                  )}
                </div>

                <div className="selection-container">
                  <label>Grado Hasta:</label>
                  <select
                    onChange={(e) => setFieldValue("gradoHasta", e.target.value)}
                    value={values.gradoHasta}
                  >
                    <option value="">Seleccione un grado</option>
                    {GRADO_ORDEN.map((grado, index) => (
                      <option key={index} value={grado}>
                        {grado}
                      </option>
                    ))}
                  </select>
                  {touched.gradoHasta && errors.gradoHasta && (
                    <div className="error-message">{errors.gradoHasta}</div>
                  )}
                </div>

                <ButtonPrimary type="submit" disabled={isLoading}>
                  Crear Categoría
                </ButtonPrimary>
              </Form>
            )}
          </Formik>

        )}
      </div>

      <div className="category-list">
        <h3>Categorías registradas</h3>
        {gradosCategorias.length > 0 ? (
          <div className="categories-card">
            {gradosCategorias.map((item, index) => (
              <ManagementCard
                key={index}
                title={`${item.nombreCategoria}`}
                info={[
                  {
                    label: "Grados escolares",
                    value:
                      item.grados && item.grados.length > 0
                        ? (() => {
                          const nombres = item.grados
                            .map((id) => grados.find((g) => g.idGrado === id)?.nombreGrado)
                            .filter(Boolean)
                            .sort((a, b) => GRADO_ORDEN.indexOf(a) - GRADO_ORDEN.indexOf(b));

                          if (nombres.length === 0) return "—";
                          if (nombres.length === 1) return nombres[0];
                          return `${nombres[0]} - ${nombres[nombres.length - 1]}`;
                        })()
                        : "—",
                  },
                ]}
              />
            ))}
          </div>
        ) : (
          <p>No hay categorías registradas.</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;
