import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../inputs/InputText";
import Switch from "../../switch/Switch";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import { getNivelEscolar, getAreas, createCategory } from "../../../api/api";
import { toast } from "sonner";
import { IoCloseOutline } from "react-icons/io5";
import "./CategoriesManagement.css";
import SwitchTabs from "../../switch/SwitchTabs";

// Esquema de validación unificado
const unifiedSchema = Yup.object().shape({
  flag: Yup.number().required(),
  codCategory: Yup.string().when('flag', {
    is: 2, // Categoría
    then: Yup.string().required("El código de categoría es obligatorio"),
    otherwise: Yup.string().notRequired()
  }),
  descripcion: Yup.string().when('flag', {
    is: 2, // Categoría
    then: Yup.string().required("La descripción es obligatoria"),
    otherwise: Yup.string().notRequired()
  }),
  idArea: Yup.array().min(1, "Debe seleccionar al menos un área"),
  grado: Yup.array().min(1, "Debe seleccionar al menos un grado"),
  status: Yup.boolean()
});

const CategoriesManagement = () => {
  const [data, setData] = useState([]); // Datos combinados
  const [nivelesEscolares, setNivelesEscolares] = useState([]); // Cambiado de levels a nivelesEscolares
  const [areas, setAreas] = useState([]); // Todas las áreas sin filtrar
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
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
      setAreas(areasRes.data?.areas || []); // Mostrar todas las áreas sin filtrar
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArea = (areaId) => {
    const area = areas.find(a => a.idArea === areaId);
    if (!area) return;

    setSelectedAreas(prev => 
      prev.some(a => a.idArea === areaId) 
        ? prev.filter(a => a.idArea !== areaId) 
        : [...prev, area]
    );
  };

  const toggleGrade = (nivelId) => {
    setSelectedGrades(prev => 
      prev.includes(nivelId) 
        ? prev.filter(id => id !== nivelId) 
        : [...prev, nivelId]
    );
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        flag: activeTab === "categorias" ? 2 : 1,
        codCategory: activeTab === "categorias" ? values.codCategory : "",
        descripcion: activeTab === "categorias" ? values.descripcion : "",
        idArea: selectedAreas.map(a => a.idArea),
        grado: selectedGrades,
        status: values.status
      };

      const response = await createCategory(payload);
      setData([...data, response.data]);
      toast.success(activeTab === "categorias" ? "Categoría creada correctamente" : "Nivel creado correctamente");
      resetForm();
      setSelectedAreas([]);
      setSelectedGrades([]);
    } catch (error) {
      console.error("Error creating:", error);
      toast.error(`Error al crear ${activeTab === "categorias" ? "la categoría" : "el nivel"}`);
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
        onChange={setActiveTab}
      />

      <Formik
        initialValues={{
          codCategory: "",
          descripcion: "",
          status: true
        }}
        validationSchema={unifiedSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {activeTab === "categorias" && (
              <>
                <InputText
                  label="Código de Categoría"
                  name="codCategory"
                  placeholder="Ej: Guacamayo"
                />
                
                <InputText
                  label="Descripción"
                  name="descripcion"
                  placeholder="Breve descripción de la categoría"
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
                {selectedAreas.length === 0 ? (
                  <p>No hay áreas seleccionadas</p>
                ) : (
                  selectedAreas.map(area => (
                    <span key={area.idArea} className="selected-item" onClick={() => toggleArea(area.idArea)}>
                      {area.nombreArea}
                      <IoCloseOutline size={16} color="red" />
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="selection-container">
              <label>Niveles escolares:</label>
              <select 
                onChange={(e) => toggleGrade(parseInt(e.target.value))}
                value=""
              >
                <option value="">Seleccione un nivel escolar</option>
                {nivelesEscolares.map(nivel => (
                  <option key={nivel.idNivel} value={nivel.idNivel}>
                    {nivel.nombreNivelEscolar}
                  </option>
                ))}
              </select>

              <div className="selected-items">
                <h4>Niveles seleccionados:</h4>
                {selectedGrades.length === 0 ? (
                  <p>No hay niveles seleccionados</p>
                ) : (
                  selectedGrades.map(gradeId => {
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
            </div>

            <Switch
              label={activeTab === "categorias" ? "Categoría activa" : "Nivel activo"}
              checked={values.status}
              onChange={() => setFieldValue("status", !values.status)}
            />

            <ButtonPrimary type="submit">
              {activeTab === "categorias" ? "Crear Categoría" : "Crear Nivel"}
            </ButtonPrimary>
          </Form>
        )}
      </Formik>

      <h3>{activeTab === "categorias" ? "Categorías" : "Niveles"} registrados</h3>
      {data.filter(item => item.flag === (activeTab === "categorias" ? 2 : 1)).length > 0 ? (
        <div className="categories-list">
          {data
            .filter(item => item.flag === (activeTab === "categorias" ? 2 : 1))
            .map(item => (
              <div key={item.id} className="category-card">
                {activeTab === "categorias" ? (
                  <>
                    <h4>{item.codCategory}</h4>
                    <p>{item.descripcion}</p>
                  </>
                ) : (
                  <h4>Nivel</h4>
                )}
                <div className="category-details">
                  <div>
                    <strong>Áreas:</strong>
                    {item.idArea.map(id => {
                      const area = areas.find(a => a.idArea === id);
                      return area ? <span key={id}>{area.nombreArea}</span> : null;
                    })}
                  </div>
                  <div>
                    <strong>Niveles:</strong>
                    {item.grado.map(gradeId => {
                      const nivel = nivelesEscolares.find(n => n.idNivel === gradeId);
                      return (
                        <span key={gradeId}>
                          {nivel?.nombreNivelEscolar || `Nivel ${gradeId}`}
                        </span>
                      );
                    })}
                  </div>
                  <div>
                    <strong>Estado:</strong>
                    <span>{item.status ? "Activo" : "Inactivo"}</span>
                  </div>
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