import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useMemo } from 'react';
import './CatalogModal.css';
import { formatGrades, formatGrados, formatGradosParaSelect } from '../../../utils/GradesOrder';

const CatalogModal = ({ areas, categories, onClose, onSubmit, isEditing, itemData }) => {

  // Obtener el idCategoria de una categoría dado su nombre
  const getCategoryIdByName = (categoryName, categoriesList) => {
    const category = categoriesList.find(cat => cat.nombreCategoria === categoryName);
    return category ? category.idCategoria : '';
  };

  const initialValues = useMemo(() => {
    if (isEditing && itemData) {
      const categoryId = getCategoryIdByName(itemData.nombreCategoria, categories);
      return {
        idArea: itemData.idArea || '',
        idCategoria: categoryId,
      };
    }
    return {
      idArea: '',
      idCategoria: '',
    };
  }, [isEditing, itemData, categories]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      idArea: Yup.string().required('Selecciona un área'),
      idCategoria: Yup.string().required('Selecciona una categoría'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  useEffect(() => {
    if (!isEditing) {
      formik.setTouched({});
      formik.setErrors({});
    }
  }, [isEditing]);

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
              {categories.map(cat => {
                const gradosFormateados = formatGrades(cat.grados || []);
                return (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombreCategoria} - {gradosFormateados}
                  </option>
                );
              })}
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