import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect } from 'react';
import './CatalogModal.css';

const CatalogModal = ({ areas, categories, onClose, onSubmit, isEditing, itemData }) => {

  //POR QUE NO AGREGARON idCategoria dentro del Object en vez del nombreCategoria hdlgpt, toca mappear
  // Obtener el idCategoria de una categoría dado su nombre
  const getCategoryIdByName = (categoryName, categoriesList) => {
    const category = categoriesList.find(cat => cat.nombreCategoria === categoryName);
    return category ? category.idCategoria : '';
  };

  // si estamos en modo edición
  const initialCategoryId = isEditing && itemData
    ? getCategoryIdByName(itemData.nombreCategoria, categories)
    : '';

  const formik = useFormik({
    initialValues: {
      idArea: itemData?.idArea || '',
      idCategoria: initialCategoryId,
    },
    validationSchema: Yup.object({
      idArea: Yup.string().required('Selecciona un área'),
      idCategoria: Yup.string().required('Selecciona una categoría'),
    }),
    onSubmit: (values) => { 
      onSubmit(values);
    }
  });

  // Usamos useEffect para actualizar los valores de Formik cuando itemData cambie
  useEffect(() => {
    if (isEditing && itemData) {
      const categoryId = getCategoryIdByName(itemData.nombreCategoria, categories);
      formik.setValues({
        idArea: itemData.idArea || '',
        idCategoria: categoryId,
      });
      formik.setTouched({});
      formik.setErrors({});
    } else {
      formik.resetForm();
    }
  }, [isEditing, itemData, categories]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{isEditing ? "Editar Configuración" : "Agregar al Catálogo"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-modal-group">
            <label>Área</label>
            <select
              name="idArea"
              value={formik.values.idArea}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.idArea && formik.errors.idArea ? 'error' : ''}
            >
              <option value="">Seleccionar área</option>
              {areas.map(area => (
                <option key={area.idArea} value={area.idArea}>
                  {area.nombreArea}
                </option>
              ))}
            </select>
            {formik.touched.idArea && formik.errors.idArea && (
              <div className="error-message">{formik.errors.idArea}</div>
            )}
          </div>

          <div className="form-modal-group">
            <label>Categoría</label>
            <select
              name="idCategoria"
              value={formik.values.idCategoria}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.idCategoria && formik.errors.idCategoria ? 'error' : ''}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombreCategoria}
                </option>
              ))}
            </select>
            {formik.touched.idCategoria && formik.errors.idCategoria && (
              <div className="error-message">{formik.errors.idCategoria}</div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? "Guardar Cambios" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogModal;