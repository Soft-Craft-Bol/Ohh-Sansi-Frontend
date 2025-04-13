import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { getGrados, createCategory, getGradosCategorias } from "../../../api/api";
import { toast } from "sonner";
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
      console.log("GradosCategorias", gradocategoriasRes.data);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="category-container">
      <h2>Crear Categoría</h2>
      <p>Administre las categorías para los participantes</p>

      <Formik
        initialValues={{
          nombreCategoria: "",
          grados: [],
        }}
        validationSchema={CategoriesValidate}
        onSubmit={async (values, { resetForm }) => {
          try {
            const response = await createCategory(values);
            setGradosCategorias(prev => [...prev, response.data]);
            toast.success("Categoría creada correctamente");
            resetForm({
              values: {
                nombreCategoria: "",
                grados: [],
              }
            });
          } catch (error) {
            console.error("Error creating:", error);
            toast.error("Error al crear la categoría");
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
                placeholder="Ej: GUACAMAYO (máx 30 caracteres)"
                error={touched.nombreCategoria && errors.nombreCategoria}
                maxLength={30}
                required
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
                        <IoCloseOutline size={16} color="red" />
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

      <h2>Categorías registradas</h2>
      {gradosCategorias.length > 0 ? (
        <div className="categories-list">
          {gradosCategorias.map((item, index) => (
            <ManagementCard
              key={index}
              title={`Categoría: ${item.nombreCategoria}`}
              info={[
                {
                  label: "ID Categoría",
                  value: item.grados
                    ? item.grados
                      .map((id) => {
                        const grado = grados.find((g) => g.idGrado === id);
                        return grado ? grado.nombreGrado : `Grado ${id}`;
                      })
                      .join(", ")
                    : "—",
                }
              ]}
            />
          ))}
        </div>
      ) : (
        <p>No hay categorías registradas.</p>
      )}
    </div>
  );
};

export default CategoriesManagement;
