import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../inputs/InputText";
import Switch from "../../switch/Switch";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { getNivelEscolar, getAreas, createCategory, getCategories } from "../../../api/api";
import { toast } from "sonner";
import { IoCloseOutline } from "react-icons/io5";
import "./CategoriesManagement.css";
import SwitchTabs from "../../switch/SwitchTabs";

// Esquema de validación unificado
const unifiedSchema = Yup.object().shape({
  flag: Yup.number().required(),
  codCategory: Yup.string()
    .when("flag", {
      is: 1,
      then: (schema) => schema
        .required("El código de categoría es obligatorio")
        .max(10, "El código no puede exceder 10 caracteres"),
      otherwise: (schema) => schema.notRequired(),
    }),
  descripcion: Yup.string()
    .when("flag", {
      is: 1, // Cambiado a 1 para categorías
      then: (schema) => schema.required("La descripción es obligatoria")
        .matches(/^[a-zA-Z0-9\s.]*$/, "La descripción solo puede contener letras numeros y espacios"),
      otherwise: (schema) => schema.notRequired(),
    }),
  idArea: Yup.array()
    .min(1, "Debe seleccionar al menos un área")
    .required("Debe seleccionar al menos un área"),
  nivelesEscolares: Yup.array()
    .min(1, "Debe seleccionar al menos un grado")
    .required("Debe seleccionar al menos un grado"),
  status: Yup.boolean().required(),
});

const CategoriesManagement = () => {
  const [data, setData] = useState([]);
  const [nivelesEscolares, setNivelesEscolares] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categorias");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [nivelesRes, areasRes] = await Promise.all([
        getNivelEscolar(),
        getAreas()
      ]);
      setNivelesEscolares(nivelesRes.data || []);
      setAreas(areasRes.data?.areas || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getCategories();
      setData(response.data.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      toast.error("Error al cargar las categorías");
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return <div className="loading-message">Cargando datos...</div>;
  }

  const tabs = [
    { label: "Categorías", value: "categorias" },
    { label: "Niveles", value: "niveles" }
  ];

  return (
    <div className="category-container">
      <h2>Gestión de Categorías y Niveles</h2>
      <p>Administre las categorías y niveles para los participantes</p>

      <SwitchTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
        }}
      />

      <Formik
        initialValues={{
          flag: activeTab === "categorias" ? 1 : 2, // 1 para categorías, 2 para niveles
          codCategory: "",
          descripcion: "",
          idArea: [],
          nivelesEscolares: [],
          status: true
        }}
        validationSchema={unifiedSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log('Datos a enviar:', values);
          try {
            const response = await createCategory(values);
            setData(prev => [...prev, response.data]);
            toast.success(activeTab === "categorias" ? "Categoría creada correctamente" : "Nivel creado correctamente");
            resetForm({
              values: {
                flag: activeTab === "categorias" ? 1 : 2,
                codCategory: "",
                descripcion: "",
                idArea: [],
                nivelesEscolares: [],
                status: true
              }
            });
          } catch (error) {
            console.error("Error creating:", error);
            toast.error(`Error al crear ${activeTab === "categorias" ? "la categoría" : "el nivel"}`);
          }
        }}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors, touched }) => {
          // Manejar selección de áreas
          const toggleArea = (areaId) => {
            const area = areas.find(a => a.idArea === areaId);
            if (!area) return;

            const newAreas = values.idArea.includes(areaId)
              ? values.idArea.filter(id => id !== areaId)
              : [...values.idArea, areaId];

            setFieldValue("idArea", newAreas);
          };

          // Manejar selección de grados
          const toggleGrade = (nivelId) => {
            const newGrades = values.nivelesEscolares.includes(nivelId)
              ? values.nivelesEscolares.filter(id => id !== nivelId)
              : [...values.nivelesEscolares, nivelId];

            setFieldValue("nivelesEscolares", newGrades);
          };

          return (
            <Form>
              {activeTab === "categorias" && (
                <>
                  <InputText
                    label="Nombre de la Categoría"
                    name="codCategory"
                    placeholder="Ej: GUACAMAYO (máx 10 caracteres)"
                    error={touched.codCategory && errors.codCategory}
                    maxLength={10}
                    required
                  />

                  <InputText
                    label="Descripción"
                    name="descripcion"
                    placeholder="Breve descripción de la categoría"
                    error={touched.descripcion && errors.descripcion}
                    required
                  />
                </>
              )}

              <div className="selection-container">
                <label>Áreas disponibles:</label>
                <select
                  onChange={(e) => toggleArea(parseInt(e.target.value))}
                  value=""
                >
                  <option value="">Seleccione un área</option>
                  {areas.map(area => (
                    <option key={area.idArea} value={area.idArea}>
                      {area.nombreArea} (Bs {area.precioArea?.toFixed(2) || '0.00'})
                    </option>
                  ))}
                </select>

                <div className="selected-items">
                  <h4>Áreas seleccionadas:</h4>
                  {values.idArea.length === 0 ? (
                    <p>No hay áreas seleccionadas</p>
                  ) : (
                    values.idArea.map(areaId => {
                      const area = areas.find(a => a.idArea === areaId);
                      return area ? (
                        <span
                          key={area.idArea}
                          className="selected-item"
                          onClick={() => toggleArea(area.idArea)}
                        >
                          {area.nombreArea}
                          <IoCloseOutline size={16} color="red" />
                        </span>
                      ) : null;
                    })
                  )}
                </div>
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
                  {nivelesEscolares.map(nivel => (
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
                    values.nivelesEscolares.map(gradeId => {
                      const nivel = nivelesEscolares.find(n => n.idNivel === gradeId);
                      return (
                        <span
                          key={gradeId}
                          className="selected-item"
                          onClick={() => toggleGrade(gradeId)}
                        >
                          {nivel?.nombreNivelEscolar || `Nivel ${gradeId}`}
                          <IoCloseOutline size={16} color="red" />
                        </span>
                      );
                    })
                  )}
                </div>
                {errors.grado && touched.grado && (
                  <div className="error-message">{errors.grado}</div>
                )}
              </div>

              <Switch
                label={activeTab === "categorias" ? "Categoría activa" : "Nivel activo"}
                checked={values.status}
                onChange={() => setFieldValue("status", !values.status)}
              />

              <ButtonPrimary type="submit" disabled={isLoading}>
                {activeTab === "categorias" ? "Crear Categoría" : "Crear Nivel"}
              </ButtonPrimary>
            </Form>
          );
        }}
      </Formik>

      <h3>{activeTab === "categorias" ? "Categorías" : "Niveles"} registrados</h3>
      {data.length > 0 ? (
        <div className="categories-list">
          {data.map((item, index) => (
            <div key={index} className="category-card">
              <h4>
                {activeTab === "categorias" ? item.codigoCategoria : "Nivel"}
              </h4>
              <div className="category-details">
                <div>
                  <strong>Área:</strong>
                  {areas?.length > 0
                    ? (areas.find((a) => a.idArea === item.idArea)?.nombreArea ||
                      "Desconocida")
                    : "Cargando..."}
                </div>
                {/* <div>
                  <strong>Estado:</strong>
                  <span>{item?.status ? "Activo" : "Inactivo"}</span>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay {activeTab === "categorias" ? "categorías" : "niveles"} registrados.</p>
      )}
    </div>
  );
};

export default CategoriesManagement;