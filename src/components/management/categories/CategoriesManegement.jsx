import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputText from "../../inputs/InputText";
import Switch from "../../switch/Switch";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import CategoryCard from "../../cards/CategoryCard";
import "./CategoriesManagement.css";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isCategoryView, setIsCategoryView] = useState(true);

  const toggleView = () => {
    setIsCategoryView(!isCategoryView);
  };

  return (
    <div id="category" className="category-container">
      <div className="view-toggle-container">
        <h2>Gestión de Niveles y Categorías</h2>
        <Switch
          label={isCategoryView ? "Modo Categorías" : "Modo Niveles"}
          checked={isCategoryView}
          onChange={toggleView}
          className="view-toggle"
        />
      </div>
      <p>Administre los {isCategoryView ? "categorías" : "niveles"} para los participantes</p>

      <Formik
        initialValues={{
          name: "",
          description: "",
          grade: "",
          isActive: false,
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(`El nombre de la ${isCategoryView ? 'categoría' : 'nivel'} es obligatorio`),
          description: Yup.string().required("La descripción es obligatoria"),
          grade: Yup.string().required("El grado/nivel es obligatorio"),
        })}
        onSubmit={(values, { resetForm }) => {
          const newItem = {
            id: (isCategoryView ? categories.length : levels.length) + 1,
            ...values,
          };

          if (isCategoryView) {
            setCategories([...categories, newItem]);
          } else {
            setLevels([...levels, newItem]);
          }
          resetForm();
        }}
        key={isCategoryView ? "category-form" : "level-form"} // Forzar reinicio al cambiar
      >
        {({ values, setFieldValue }) => (
          <Form>
            <InputText 
              label={isCategoryView ? "Nombre de Categoría" : "Nombre de Nivel"} 
              type="text" 
              name="name" 
              placeholder={isCategoryView ? "Ej: Categoría A" : "Ej: Nivel 1"} 
            />
            <InputText 
              label="Descripción" 
              type="text" 
              name="description" 
              placeholder={`Breve descripción del ${isCategoryView ? 'categoría' : 'nivel'}`} 
            />
            <InputText 
              label="Grado/Nivel*" 
              type="text" 
              name="grade" 
              placeholder="Ej: 3ro Secundaria" 
            />

            <Switch
              label={`${isCategoryView ? 'Categoría' : 'Nivel'} activo`}
              checked={values.isActive}
              onChange={() => setFieldValue("isActive", !values.isActive)}
            />

            <ButtonPrimary className="btn-submit" type="submit">
              Añadir {isCategoryView ? 'categoría' : 'nivel'}
            </ButtonPrimary>
          </Form>
        )}
      </Formik>

      <h3>{isCategoryView ? "Categorías" : "Niveles"} registrados</h3>
      {(isCategoryView ? categories : levels).length > 0 ? (
        (isCategoryView ? categories : levels).map((item) => (
          <CategoryCard 
            key={item.id} 
            category={item} 
            type={isCategoryView ? "category" : "level"}
            onDelete={() => {
              if (isCategoryView) {
                setCategories(categories.filter((c) => c.id !== item.id));
              } else {
                setLevels(levels.filter((l) => l.id !== item.id));
              }
            }} 
          />
        ))
      ) : (
        <p>No hay {isCategoryView ? "categorías" : "niveles"} registrados.</p>
      )}
    </div>
  );
};

export default CategoriesManagement;