import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { getNivelEscolar, getAreas, createCategory, getAreasCategorias } from "../../../api/api";
import { toast } from "sonner";
import { IoCloseOutline } from "react-icons/io5";
import "./CategoriesManagement.css";
import CategoriesValidate from "../../../schemas/CategoriesValidation";
import ManagementCard from "../../cards/ManagementCard";
import { ordenarGrados } from "../../../utils/GradesOrder";


const CategoriesManagement = () => {
  const [data, setData] = useState([]);
  const [nivelesEscolares, setNivelesEscolares] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [nivelesRes, areasRes, categoriasRes] = await Promise.all([
        getNivelEscolar(),
        getAreas(),
        getAreasCategorias()
      ]);
      setNivelesEscolares(nivelesRes.data || []);
      setAreas(areasRes.data?.areas || []);
      console.log("Categorías:", categoriasRes.data);
      setData(categoriasRes.data?.areasCategorias || []);
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
          codCategory: "",
          idArea: "",
          nivelesEscolares: [],
        }}
        validationSchema={CategoriesValidate}
        onSubmit={async (values, { resetForm }) => {
          console.log('Datos a enviar:', values);
          try {
            const response = await createCategory(values);
            setData(prev => [...prev, response.data]);
            toast.success("Categoría creada correctamente");
            resetForm({
              values: {
                codCategory: "",
                idArea: "",
                nivelesEscolares: [],
              }
            });
          } catch (error) {
            console.error("Error creating:", error);
            toast.error("Error al crear la categoría");
          }
        }}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors, touched }) => {

          // Manejar selección de grados
          const toggleGrade = (nivelId) => {
            const newGrades = values.nivelesEscolares.includes(nivelId)
              ? values.nivelesEscolares.filter(id => id !== nivelId)
              : [...values.nivelesEscolares, nivelId];

            setFieldValue("nivelesEscolares", newGrades);
          };

          return (
            <Form>
              <InputText
                label="Nombre de la Categoría"
                name="codCategory"
                placeholder="Ej: GUACAMAYO (máx 30 caracteres)"
                error={touched.codCategory && errors.codCategory}
                maxLength={30}
                required
              />

              <div className="selection-container">
                <label>Áreas disponibles:</label>
                <select
                  onChange={(e) => setFieldValue("idArea", parseInt(e.target.value))}
                  value={values.idArea}
                >
                  <option value="">Seleccione un área</option>
                  {areas.map(area => (
                    <option key={area.idArea} value={area.idArea}>
                      {area.nombreArea}
                    </option>
                  ))}
                </select>
                {errors.idArea && touched.idArea && (
                  <div className="error-message">{errors.idArea}</div>
                )}
              </div>

              <div className="selection-container">
                <label>Grados escolares:</label>
                <select
                  onChange={(e) => toggleGrade(parseInt(e.target.value))}
                  value=""
                >
                  <option value="">Seleccione un grado escolar</option>
                  {ordenarGrados(nivelesEscolares).map(nivel => (
                    <option key={nivel.idNivel} value={nivel.idNivel}>
                      {nivel.nombreNivelEscolar}
                    </option>
                  ))}
                </select>

                <div className="selected-items">
                  <h4>Grados seleccionados:</h4>
                  {values.nivelesEscolares.length === 0 ? (
                    <p>No hay grados seleccionados</p>
                  ) : (
                    ordenarGrados(
                      nivelesEscolares.filter(n => values.nivelesEscolares.includes(n.idNivel))
                    ).map(nivel => (
                      <span
                        key={nivel.idNivel}
                        className="selected-item"
                        onClick={() => toggleGrade(nivel.idNivel)}
                      >
                        {nivel.nombreNivelEscolar}
                        <IoCloseOutline size={16} color="red" />
                      </span>
                    ))
                  )}
                </div>

                {errors.nivelesEscolares && touched.nivelesEscolares && (
                  <div className="error-message">{errors.nivelesEscolares}</div>
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
      {data.length > 0 ? (
        <div className="categories-list">
          {data.map((item, index) => (
            <ManagementCard
              key={index}
              title={`Categoría: ${item.codigoCategoria}`}
              info={[
                { label: "Área", value: item.nombreArea },
                { label: "Nombre corto", value: item.nombreCortoArea },
                { label: "Descripción", value: item.descripcionArea },
                { label: "Grados", value: item.codigoNivel || "Ninguno" }
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