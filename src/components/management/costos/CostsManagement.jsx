import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import Table from "../../table/Table"; // Asegúrate de que este componente esté bien configurado
import "./CostsManagement.css";
import { FaEdit } from "react-icons/fa";

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

      {activeTab === "register" && (
        <div className="costs-card">
          <div className="costs-card-header">
            <h2>Gestión de Costos por Área</h2>
            <p>Administre los costos de inscripción para cada área</p>
          </div>
          <div className="costs-card-content">
            <form onSubmit={formik.handleSubmit} className="costs-form">
              {/* Formulario de creación o edición */}
              <div className="costs-form-group">
                <label htmlFor="areaId">Área de competencia*</label>
                <select
                  id="areaId"
                  name="areaId"
                  value={formik.values.areaId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="0">Seleccione un área</option>
                  <option value="1">Área 1</option>
                  <option value="2">Área 2</option>
                </select>
                {formik.touched.areaId && formik.errors.areaId && (
                  <div className="costs-error">{formik.errors.areaId}</div>
                )}
              </div>

              <div className="costs-form-group">
                <label htmlFor="cost">Costo (en bolivianos)*</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  placeholder="Ej: 50 para Bs 50.00"
                  value={formik.values.cost}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.cost && formik.errors.cost && (
                  <div className="costs-error">{formik.errors.cost}</div>
                )}
              </div>


              <div className="costs-form-actions">
                {editingId !== null && (
                  <button type="button" onClick={handleCancelEdit} className="btn-outline">
                    Cancelar
                  </button>
                )}
                <button type="submit" className="costs-btn-primary">
                  {editingId !== null ? "Actualizar costo" : "Añadir costo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "table" && (
        <div className="costs-table">
          <Table data={data} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default CostsManagement;
