import * as Yup from "yup";

const currentYear = new Date().getFullYear();
const minDate = new Date(2000, 0, 1); 
const maxDate = new Date(currentYear, 11, 31);

const dateWithinRange = (label) => 
  Yup.date()  
      .min(minDate, `${label} debe ser después del 01/01/2000`)
      .max(maxDate, `${label} debe ser antes del 31/12/${currentYear}`);

const GestionValidate = Yup.object().shape({
  nombrePeriodoInscripcion: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .required("El nombre del período es obligatorio"),

  fechaInicioInscripcion: dateWithinRange("La fecha de inicio de inscripción")
    .required("La fecha de inicio de inscripción es obligatoria"),

  fechaFinInscripcion: dateWithinRange("La fecha de fin de inscripción")
    .required("La fecha de fin de inscripción es obligatoria")
    .min(Yup.ref("fechaInicioInscripcion"), "Debe ser después de la fecha de inicio"),

  fechaInicioOlimpiadas: dateWithinRange("La fecha de inicio de olimpiadas")
    .required("La fecha de inicio de olimpiadas es obligatoria")
    .min(Yup.ref("fechaFinInscripcion"), "Debe ser después de la fecha de inscripción"),

  fechaFinOlimpiadas: dateWithinRange("La fecha de fin de olimpiadas")
    .required("La fecha de fin de olimpiadas es obligatoria")
    .min(Yup.ref("fechaInicioOlimpiadas"), "Debe ser después del inicio de las olimpiadas"),

  fechaResultados: dateWithinRange("La fecha de publicación de resultados")
    .required("La fecha de publicación de resultados es obligatoria")
    .min(Yup.ref("fechaFinOlimpiadas"), "Debe ser después del fin de las olimpiadas"),

  fechaPremiacion: dateWithinRange("La fecha de premiación")
    .required("La fecha de premiación es obligatoria")
    .min(Yup.ref("fechaResultados"), "Debe ser después de la publicación de resultados"),
});

export default GestionValidate;
