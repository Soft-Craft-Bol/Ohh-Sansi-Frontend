import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import "./FormArea.css"; // Manteniendo el import de estilos
import { FaEdit, FaTrash } from "react-icons/fa";
import InputText from "../inputs/InputText";

const FormArea = () => {
  const [areas, setAreas] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      isActive: true,
    },
    validationSchema: Yup.object({
        name: Yup.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(150, "El nombre no puede tener más de 150 caracteres")
        .required("El nombre del área es obligatorio"),
        description: Yup.string()
        .max(500, "La descripción no puede tener más de 500 caracteres"),
    }),
    onSubmit: (values, { resetForm }) => {
      const isDuplicate = areas.some((area) => area.name === values.name);
      if (isDuplicate) {
        toast.error("El área ya existe");
        return;
      }
      
      const newArea = {
        id: Date.now(),
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        createdAt: new Date(),
      };

      setAreas([...areas, newArea]);
      toast.success("Área registrada con éxito");
      resetForm();
    },
  });

  return (
    <div className="form-container">
      <h2>Áreas de Competencia</h2>
      <form onSubmit={formik.handleSubmit} className="form">
        
        {/* Nombre del Área */}
        <div>
          <label>Nombre del área</label>
          <InputText
          label="Nombre del área"
          name="name"
          type="text"
          required
          placeholder="Ej: Matemáticas"
          maxLength={150}
         />

          <p className="char-count">
            {formik.values.name.length}/150
          </p>
          {formik.touched.name && formik.errors.name ? (
            <p className="error">{formik.errors.name}</p>
          ) : null}
        </div>

        {/* Descripción */}
        <div>
          <label>Descripción</label>
          <textarea
            name="description"
            placeholder="Breve descripción del área"
            className="input"
            maxLength={500}
            {...formik.getFieldProps("description")}
          />
          <p className="char-count">
            {formik.values.description.length}/500
          </p>

        {formik.touched.description && formik.errors.description ? (
        <p className="error">{formik.errors.description}</p>
        ) : null}

        </div>

        {/* Área Activa Toggle */}
        <div className="toggle-container">
          <label>
            Área activa
            <p className="toggle-info">Desactivar si no está disponible para inscripción</p>
          </label>
          <input
            type="checkbox"
            name="isActive"
            checked={formik.values.isActive}
            onChange={formik.handleChange}
          />
        </div>

        {/* Botón de Enviar */}
        <button type="submit" className="submit-btn" disabled={!formik.isValid || formik.isSubmitting}>
          Añadir área
        </button>
      </form>

      {/* Lista de Áreas Registradas */}
      <div className="area-list">
        <h3>Áreas registradas</h3>
        {areas.length === 0 ? (
          <p>No hay áreas registradas aún.</p>
        ) : (
          <ul>
            {[...areas]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((area) => (
              <li key={area.id} className="area-item">
                <div className="area-text">
                    <p className="area-name">{area.name}</p>
                    <p className="area-desc">{area.description}</p>
                </div>
                <div className="area-actions">
                    <span className={`status ${area.isActive ? "active" : "inactive"}`}>
                        {area.isActive ? "Activo" : "Inactivo"}
                    </span>
                    <FaEdit className="action-icon edit" title="Editar" />
                    <FaTrash className="action-icon delete" title="Eliminar" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FormArea;
