import * as Yup from "yup";

const minYear = 2020; 
const currentYear = new Date().getFullYear();
const minDate = new Date(minYear, 0, 1);
const maxDate = new Date(currentYear, 11, 31);

const dateWithinRange = (label, minRef = null) => {
  let schema = Yup.date()
    .required(`${label} es obligatoria`)
    .min(minDate, `${label} debe ser después del 01/01/${minYear}`)
    .max(maxDate, `${label} debe ser antes del 31/12/${currentYear}`);

  if (minRef) {
    schema = schema.min(Yup.ref(minRef), `${label} debe ser después de ${minRef}`);
  }

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
