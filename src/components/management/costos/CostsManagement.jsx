import React, { useState } from "react";
import * as Yup from "yup";
import "./CostsManagement.css";
import SelectInput from "../../selected/SelectInput";
import { Formik, Form } from "formik";
import InputText from "../../inputs/InputText";
import {ButtonPrimary} from "../../button/ButtonPrimary"

const CostsManagement = () => {
  const periodos = [ //static meanwhile
    { value: "2023", label: "Periodo 2023" },
    { value: "2024", label: "Periodo 2024" },
    { value: "2025", label: "Periodo 2025" },
  ];

  const costFormSchema = Yup.object({
    periodoId: Yup.string().required("Seleccione un período"),
    cost: Yup.number().positive("El costo debe ser mayor a 0").required("Costo es obligatorio"),
  });

  const initialValues = {
    periodoId: "",
    cost: 0,
  };

  const handleSubmit = (values) => {
    console.log("submit", values);
  };

  return (
    <div className="costs-container">
      <div className="costs-card">
        <div className="costs-card-header">
          <h2>Gestión de Periodos Olímpicos</h2>
          <p>Define los períodos de las olimpiadas y sus fechas.</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={costFormSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form className="costs-form">
              <div className="costs-form-group">
                <SelectInput
                  label="Período Olímpico"
                  name="periodoId"
                  options={periodos}
                  required
                />
                <InputText
                    name="cost"
                    label="Costo en BOB"
                    type="text"
                    required
                  />
              </div>
              <div>
              <ButtonPrimary
                type="submit"
                id="submit-costs"
                className="costs-btn-primary"
                buttonStyle="primary"
              >
                Guardar Período
              </ButtonPrimary>
              </div>
              
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CostsManagement;
