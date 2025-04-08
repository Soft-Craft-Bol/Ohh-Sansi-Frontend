import React, { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import SelectInput from "../../selected/SelectInput";
import InputText from "../../inputs/InputText";
import { ButtonPrimary } from "../../button/ButtonPrimary";
import costsValidationSchema from "../../../schemas/costValidate";
import "./CostsManagement.css";

const periods = [
  { id: 1, label: "Olimpiada 2025" },
  { id: 2, label: "Olimpiada 2026" },
];

const CostsManagement = () => {
  const [costs, setCosts] = useState([]);
  const [activeTab, setActiveTab] = useState("register");

  const initialValues = {
    periodId: "",
    cost: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const newCost = {
      id: costs.length + 1,
      period: periods.find((p) => p.id === parseInt(values.periodId))?.label,
      cost: values.cost,
    };

    setCosts([...costs, newCost]);
    toast.success("Costo registrado exitosamente!");
    resetForm();
  };

  return (
    <div className="costs-container">
      <div className="tabs">
        <h2 className="gestion-title">Gestión de Periodos Olímpicos</h2>
        <p className="gestion-subtitle">
          Define los períodos de las olimpiadas y sus fechas.
        </p>
      </div>

      {activeTab === "register" && (
        <Formik
          initialValues={initialValues}
          validationSchema={costsValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, errors, touched }) => (
            <Form className="form">
              <SelectInput
                label="Período Olímpico"
                name="periodId"
                options={periods}
                value={values.periodId}
                onChange={handleChange}
                error={touched.periodId && errors.periodId}
              />

              <InputText
                label="Costo en BOB"
                name="cost"
                type="number"
                value={values.cost}
                onChange={handleChange}
                placeholder="Ingrese el costo"
                error={touched.cost && errors.cost}
              />

              <ButtonPrimary type="submit" className="btn-submit-azul">
                Registrar Costo
              </ButtonPrimary>
            </Form>
          )}
        </Formik>
      )}

      <h3 className="costs-title">Costos registrados</h3>
      <div className="costs-list">
        {costs.map((cost) => (
          <div key={cost.id} className="cost-card">
            <div className="cost-header">
              <strong >{cost.period}</strong>
              <span className="cost-amount">{cost.cost} BOB</span>
            </div>
            <p className="cost-id">ID: {cost.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CostsManagement;
