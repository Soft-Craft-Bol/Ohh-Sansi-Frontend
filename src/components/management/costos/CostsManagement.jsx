import React, { useState } from "react";
import { Form, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import InputText from "../../inputs/InputText";
import "./CostsManagement.css";
import { FaEdit } from "react-icons/fa";
import SelectInput from "../../selected/SelectInput";

const costFormSchema = Yup.object({
  areaId: Yup.number().positive("Seleccione un área").required("Área es obligatoria"),
  categoryId: Yup.number().positive("Seleccione una categoría").required("Categoría es obligatoria"),
  cost: Yup.number().positive("El costo debe ser mayor a 0").required("Costo es obligatorio"),
  validFrom: Yup.string().required("Fecha requerida"),
  validTo: Yup.string().optional(),
});

const CostsManagement = () => {
  const [costs, setCosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("register");

  const formik = useFormik({
    initialValues: {
      areaId: 0,
      categoryId: 0,
      cost: 0,
      validFrom: new Date().toISOString().split("T")[0],
      validTo: "",
    },
    validationSchema: costFormSchema,
    onSubmit: (values) => {
      if (editingId !== null) {
        handleUpdate(values);
      } else {
        handleCreate(values);
      }
    },
  });

  const handleCreate = (values) => {
    const newCost = {
      id: costs.length + 1,
      areaId: values.areaId,
      categoryId: values.categoryId,
      cost: values.cost,
      validFrom: values.validFrom,
      validTo: values.validTo,
    };

    setCosts([...costs, newCost]);
    toast.success("Costo creado exitosamente!");
  };

  const handleUpdate = (values) => {
    const updatedCosts = costs.map((cost) =>
      cost.id === editingId ? { ...cost, ...values } : cost
    );
    setCosts(updatedCosts);
    toast.success("Costo actualizado exitosamente!");
  };

  const handleEdit = (cost) => {
    formik.setValues({
      areaId: cost.areaId,
      cost: cost.cost,
    });
    setEditingId(cost.id);
    setActiveTab("register");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    formik.resetForm();
  };

  const columns = [
    { field: "areaId", label: "Área" },
    { field: "cost", label: "Costo" },
    { field: "actions", label: "Acciones" },
  ];

  const data = costs.map((cost) => ({
    ...cost,
    actions: (
      <button onClick={() => handleEdit(cost)} className="btn-edit">
        <FaEdit />
      </button>
    ),
  }));

  return (
    <div className="costs-container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Registrar Costo
        </button>
        <button
          className={`tab-button ${activeTab === "table" ? "active" : ""}`}
          onClick={() => setActiveTab("table")}
        >
          Ver Tabla de Costos
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={areaValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="form">
            <div>
              <label>Descripción</label>
              <textarea
                name="description"
                placeholder="Breve descripción del área"
                className="input"
                maxLength={500}
                required
                {...formik.getFieldProps("description")}
              />
              <p className="char-count">{formik.values.description.length}/500</p>
              {formik.touched.description && formik.errors.description && (
                <p className="error">{formik.errors.description}</p>
              )}
            </div>

            <div className="toggle-container">
              <label>
                Área activa
                <p className="toggle-info">
                  Desactivar si no está disponible para inscripción
                </p>
              </label>
              <input
                type="checkbox"
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
              />
            </div>

            <div className="form-actions">
              <ButtonPrimary
                type="submit"
                buttonStyle="primary"
                disabled={!formik.isValid || isSubmitting}
              >
                {editingId ? 'Actualizar área' : 'Añadir área'}
              </ButtonPrimary>
              
              {editingId && (
                <ButtonPrimary
                  type="button"
                  buttonStyle="secondary"
                  onClick={() => {
                    formik.resetForm();
                    setEditingId(null);
                  }}
                >
                  Cancelar edición
                </ButtonPrimary>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CostsManagement;
