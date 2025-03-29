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

  return (
    <div id="category" className="category-container">
      <h2>Gestión de Niveles y Categorías</h2>
      <p>Administre los niveles y categorías para los participantes</p>

      <Formik
        initialValues={{
          name: "",
          description: "",
          grade: "",
          isActive: false,
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("El nombre es obligatorio"),
          description: Yup.string().required("La descripción es obligatoria"),
          grade: Yup.string().required("El grado/nivel es obligatorio"),
        })}
        onSubmit={(values, { resetForm }) => {
          const newCategory = {
            id: categories.length + 1,
            ...values,
          };

          setCategories([...categories, newCategory]);
          resetForm();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <InputText label="Nombre de la categoría" type="text" name="name" placeholder="Ej: Nivel 1" />
            <InputText label="Descripción" type="text" name="description" placeholder="Breve descripción de la categoría" />
            <InputText label="Grado/Nivel*" type="text" name="grade" placeholder="Ej: 3ro Secundaria" />

            <Switch
              label="Categoría activa"
              checked={values.isActive}
              onChange={() => setFieldValue("isActive", !values.isActive)}
            />

            <ButtonPrimary className="btn-submit" type="submit">
              Añadir categoría
            </ButtonPrimary>
          </Form>
        )}
      </Formik>

      <h3>Categorías registradas</h3>
      {categories.length > 0 ? (
        categories.map((category) => (
          <CategoryCard key={category.id} category={category} onDelete={() => setCategories(categories.filter((c) => c.id !== category.id))} />
        ))
      ) : (
        <p>No hay categorías registradas.</p>
      )}
    </div>
  );
};

export default CategoriesManagement;
