import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./EventModal.css";
import EventValidationSchema from "../../schemas/EventValidationSchema";

const EVENTOS_VALIDOS = [
  "Pre-Inscripciones",
  "Inscripciones",
  "Fase Previa",
  "Fase-Clasificatoria",
  "Fase-Final",
  "Resultados",
  "Premiación"
];

const EventModal = ({ periodo, onClose, onSave }) => {
  return (
    <div className="em-backdrop">
      <div className="em-container">
        <h3>Agregar evento</h3>
        <Formik
          initialValues={{
            nombre: "",
            fechaInicio: `${periodo}`,
            fechaFin: `${periodo}`,
            publico: false

          }}
          validationSchema={EventValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSave(values);
            setSubmitting(false); 
            onClose();
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <label>Nombre del evento</label>
              <Field as="select" name="nombre" className="em-select">
                <option value="">Seleccione un evento</option>
                {EVENTOS_VALIDOS.map(evento => (
                  <option key={evento} value={evento}>
                    {evento}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="nombre" component="div" className="error-message" />

              <div className="em-date-row">
                <div>
                  <label>Fecha inicio</label>
                  <Field
                    type="date"
                    name="fechaInicio"
                    min={`${periodo}-01-01`}
                    max={`${periodo}-12-31`}
                    onChange={(e) => {
                      const fechaSeleccionada = e.target.value;
                      if (fechaSeleccionada.startsWith(`${periodo}-`)) {
                        setFieldValue("fechaInicio", fechaSeleccionada);
                      } else {
                        setFieldValue("fechaInicio", `${periodo}-01-01`);
                      }
                    }}
                  />
                  <ErrorMessage name="fechaInicio" component="div" className="error-message" />
                </div>
                <div>
                  <label>Fecha fin</label>
                  <Field
                    type="date"
                    name="fechaFin"
                    min={`${periodo}-01-01`}
                    max={`${periodo}-12-31`}
                    onChange={(e) => {
                      const fechaSeleccionada = e.target.value;
                      if (fechaSeleccionada.startsWith(`${periodo}-`)) {
                        setFieldValue("fechaFin", fechaSeleccionada);
                      } else {
                        setFieldValue("fechaFin", `${periodo}-01-02`);
                      }
                    }}
                  />
                  <ErrorMessage name="fechaFin" component="div" className="error-message" />
                </div>
              </div>

              <div className="em-toggle">
                <span>Evento público</span>
                <label className="em-switch">
                  <Field type="checkbox" name="publico" />
                  <span className="em-slider round" />
                </label>
              </div>

              <div className="em-actions">
                <button type="button" onClick={onClose}>Cancelar</button>
                <button type="submit" className="em-primary" disabled={!values.nombre}>
                  Guardar evento
                </button>
              </div>
              
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EventModal;
