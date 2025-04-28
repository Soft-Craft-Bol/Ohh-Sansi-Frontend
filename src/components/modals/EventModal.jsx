import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./EventModal.css";
import getEventValidationSchema, { EVENT_ORDER } from "../../schemas/EventValidationSchema";

const EVENTOS_VALIDOS = [
  "Pre-Inscripciones",
  "Inscripciones",
  "Fase Previa",
  "Fase-Clasificatoria",
  "Fase-Final",
  "Resultados",
  "Premiación"
];

const EventModal = ({ periodo, onClose, onSave, eventosExistentes = [] }) => {
  const eventosRegistrados = eventosExistentes.map(ev => ev.nombreEvento || ev.titulo);

  const eventosDisponibles = EVENTOS_VALIDOS.filter(evento => 
    !eventosRegistrados.includes(evento)
  );

  const siguienteEvento = () => {
    const registradosOrdenados = eventosRegistrados
      .filter(name => EVENT_ORDER[name])
      .sort((a, b) => EVENT_ORDER[a] - EVENT_ORDER[b]);

    const siguienteOrden = registradosOrdenados.length > 0
      ? EVENT_ORDER[registradosOrdenados[registradosOrdenados.length - 1]] + 1
      : 1;

    return Object.keys(EVENT_ORDER).find(k => EVENT_ORDER[k] === siguienteOrden) || "";
  };

  const nextExpected = siguienteEvento();

  return (
    <div className="em-backdrop">
      <div className="em-container">
        <h3>Agregar evento</h3>
        <p className="next-expected">Próximo evento sugerido: <strong>{nextExpected || 'Ninguno'}</strong></p>

        <Formik
          initialValues={{
            nombre: "",
            fechaInicio: `${periodo}`,
            fechaFin: `${periodo}`,
            publico: false

          }}
          validationSchema={getEventValidationSchema(eventosExistentes, periodo)}
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
                {eventosDisponibles.map(evento => (
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
                      setFieldValue("fechaInicio", fechaSeleccionada);
                    }}
                  />
                  <ErrorMessage name="fechaInicio" component="div" className="error-message" />
                </div>
                <div>
                  <label>Fecha fin</label>
                  <Field
                    type="date"
                    name="fechaFin"
                    min={values.fechaInicio || `${periodo}-01-01`}
                    max={`${periodo}-12-31`}
                    onChange={(e) => {
                      const fechaSeleccionada = e.target.value;
                      setFieldValue("fechaFin", fechaSeleccionada);
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
