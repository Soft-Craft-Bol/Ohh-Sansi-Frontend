import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { getGrados, createCategory, getGradosCategorias } from "../../../api/api";
import Swal from "sweetalert2";
import { IoCloseOutline } from "react-icons/io5";
import "./CategoriesManagement.css";
import CategoriesValidate from "../../../schemas/CategoriesValidation";
import ManagementCard from "../../cards/ManagementCard";
import { ordenarGrados } from "../../../utils/GradesOrder";

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
      setGrados(Array.isArray(gradosRes.data?.data) ? gradosRes.data.data : []);
      setGradosCategorias(Array.isArray(gradocategoriasRes.data) ? gradocategoriasRes.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener categorías'
      });
    } finally {
      setIsLoading(false);
    }
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
              grados: [],
            }}
            validationSchema={CategoriesValidate}
            validateOnChange={false}
            validateOnBlur={true}
            context={{ existingCategories: gradosCategorias.map(c => c.nombreCategoria) }}
            onSubmit={async (values, { resetForm }) => {
              try {
                const response = await createCategory(values);
                setGradosCategorias(prev => [...prev, response.data]);
                Swal.fire({
                  icon: 'success',
                  title: '¡Éxito!',
                  text: 'Categoría creada correctamente',
                  timer: 2000,
                  showConfirmButton: false
                });
                resetForm({
                  values: {
                    nombreCategoria: "",
                    grados: [],
                  }
                });
                await fetchData();
              } catch (error) {
                console.error("Error creating:", error);
                const errorMessage = error.response?.data?.message ||
                  error.message || ("Error al registrar la categoría");
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage
                  });
              }
            }}
          >
            {({ values, setFieldValue, errors, touched }) => {

              const toggleGrade = (idGrado) => {
                const newGrades = values.grados.includes(idGrado)
                  ? values.grados.filter(id => id !== idGrado)
                  : [...values.grados, idGrado];

                setFieldValue("grados", newGrades);
              };

              const availableGrades = grados.filter(
                grado => !values.grados.includes(grado.idGrado)
              );

              return (
                <Form>
                  <InputText
                    label="Nombre de la Categoría"
                    name="nombreCategoria"
                    placeholder="Ej: GUACAMAYO"
                    error={touched.nombreCategoria && errors.nombreCategoria}
                    maxLength={30}
                    required
                    showCounter={true}
                  />

                  <div className="selection-container">
                    <label>Grados escolares:</label>
                    <select
                      onChange={(e) => {
                        const id = parseInt(e.target.value);
                        if (id) toggleGrade(id);
                      }}
                      value=""
                    >
                      <option value="">Seleccione un grado escolar</option>
                      {ordenarGrados(availableGrades).map(grado => (
                        <option key={grado.idGrado} value={grado.idGrado}>
                          {grado.nombreGrado}
                        </option>
                      ))}
                    </select>

                    <div className="selected-items">
                      <h4>Grados seleccionados:</h4>
                      {values.grados.length === 0 ? (
                        <p>No hay grados seleccionados</p>
                      ) : (
                        ordenarGrados(
                          grados.filter(n => values.grados.includes(n.idGrado))
                        ).map(grado => (
                          <span
                            key={grado.idGrado}
                            className="selected-item"
                            onClick={() => toggleGrade(grado.idGrado)}
                          >
                            {grado.nombreGrado}
                            <IoCloseOutline size={20} color="red" />
                          </span>
                        ))
                      )}
                    </div>

                    {errors.grados && touched.grados && (
                      <div className="error-message">{errors.grados}</div>
                    )}
                  </div>

                  <ButtonPrimary type="submit" disabled={isLoading}>
                    Crear Categoría
                  </ButtonPrimary>
                </Form>
              );
            }}
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
                info={[{
                  label: "Grados escolares",
                  value: item.grados && item.grados.length > 0
                    ? (() => {
                      const gradosAsignados = ordenarGrados(
                        grados.filter(g => item.grados.includes(g.idGrado))
                      );
                      if (gradosAsignados.length === 1) {
                        return gradosAsignados[0].nombreGrado;
                      }
                      return `${gradosAsignados[0].nombreGrado} - ${gradosAsignados[gradosAsignados.length - 1].nombreGrado}`;
                    })()
                    : "—"
                }]}
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
