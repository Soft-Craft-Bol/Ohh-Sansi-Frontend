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

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre de la categoría es obligatorio"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
});

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [levelsRes, areasRes] = await Promise.all([
        getNivelEscolar(),
        getAreas()
      ]);
      setLevels(levelsRes.data || []);
      setAreas((areasRes.data?.areas || []).filter(area => area.areaStatus));
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

  const toggleLevel = (levelId) => {
    const level = levels.find(l => l.idNivel === levelId);
    if (!level) return;

    setSelectedLevels(prev => 
      prev.some(l => l.idNivel === levelId) 
        ? prev.filter(l => l.idNivel !== levelId) 
        : [...prev, level]
    );
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (selectedAreas.length === 0 || selectedLevels.length === 0) {
      toast.error("Debe seleccionar al menos un área y un nivel");
      return;
    }

    try {
      const categoryData = {
        ...values,
        areas: selectedAreas.map(a => a.idArea),
        niveles: selectedLevels.map(l => l.idNivel)
      };

      const response = await createCategory(categoryData);
      setCategories([...categories, response.data]);
      toast.success("Categoría creada correctamente");
      resetForm();
      setSelectedAreas([]);
      setSelectedLevels([]);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error al crear la categoría");
    }
  };

  if (isLoading) {
    return <div className="loading-message">Cargando datos...</div>;
  }

  return (
    <div className="category-container">
      <h2>Gestión de Categorías</h2>
      <p>Administre las categorías para los participantes</p>

      <Formik
        initialValues={{
          nombre: "",
          descripcion: "",
          isActive: false
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <InputText
              label="Nombre de Categoría"
              name="nombre"
              placeholder="Ej: Categoría A"
            />
            
            <InputText
              label="Descripción"
              name="descripcion"
              placeholder="Breve descripción de la categoría"
            />

            <div className="selection-container">
              <label>Áreas disponibles:</label>
              <select onChange={(e) => toggleArea(parseInt(e.target.value))}>
                <option value="">Seleccione un área</option>
                {areas.map(area => (
                  <option key={area.idArea} value={area.idArea}>
                    {area.nombreArea} (Bs {area.precioArea.toFixed(2)})
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
              <label>Niveles disponibles:</label>
              <select onChange={(e) => toggleLevel(parseInt(e.target.value))}>
                <option value="">Seleccione un nivel</option>
                {levels.map(level => (
                  <option key={level.idNivel} value={level.idNivel}>
                    {level.nombreNivelEscolar}
                  </option>
                ))}
              </select>

              <div className="selected-items">
                <h4>Niveles seleccionados:</h4>
                {selectedLevels.length === 0 ? (
                  <p>No hay niveles seleccionados</p>
                ) : (
                  selectedLevels.map(level => (
                    <span key={level.idNivel} className="selected-item" onClick={() => toggleLevel(level.idNivel)}>
                      {level.nombreNivelEscolar}
                      <IoCloseOutline size={16} color="red" />
                    </span>
                  ))
                )}
              </div>
            </div>

            <Switch
              label="Categoría activa"
              checked={values.isActive}
              onChange={() => setFieldValue("isActive", !values.isActive)}
            />

            <ButtonPrimary type="submit">
              Crear Categoría
            </ButtonPrimary>
          </Form>
        )}
      </Formik>

      <h3>Categorías registradas</h3>
      {categories.length > 0 ? (
        <div className="categories-list">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h4>{category.nombre}</h4>
              <p>{category.descripcion}</p>
              <div className="category-details">
                <div>
                  <strong>Áreas:</strong>
                  {category.areas.map(area => (
                    <span key={area.idArea}>{area.nombreArea}</span>
                  ))}
                </div>
                <div>
                  <strong>Niveles:</strong>
                  {category.niveles.map(nivel => (
                    <span key={nivel.idNivel}>{nivel.nombreNivelEscolar}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay categorías registradas.</p>
      )}
    </div>
  );
};

export default CategoriesManagement;