import * as Yup from "yup";

const currentYear = new Date().getFullYear();
const maxDate = new Date(currentYear, 11, 31);

const dateWithinRange = (label = null) => {
  let schema = Yup.date()
    .required(`${label} es obligatoria`)
    .max(maxDate, `${label} debe ser antes del 31/12/${currentYear}`);
  return schema;
};

const EventValidationSchema = Yup.object().shape({
  nombre: Yup.string()
    .oneOf([
      "Pre-Inscripciones",
      "Inscripciones",
      "Fase Previa",
      "Fase-Clasificatoria",
      "Fase-Final",
      "Resultados",
      "Premiación"
    ], "Selecciona un evento válido")
    .required("El nombre del evento es obligatorio"),

  fechaInicio: dateWithinRange("La fecha de inicio"),
  fechaFin: dateWithinRange("La fecha de fin", "fechaInicio"),
});

export default EventValidationSchema;
