import * as Yup from "yup";

const GestionValidate = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .required("El nombre del período es obligatorio"),

  fechaInicioInscripcion: Yup.date()
    .required("La fecha de inicio de inscripción es obligatoria"),

  fechaFinInscripcion: Yup.date()
    .required("La fecha de fin de inscripción es obligatoria")
    .min(Yup.ref("fechaInicioInscripcion"), "Debe ser después de la fecha de inicio"),

  fechaInicioOlimpiadas: Yup.date()
    .required("La fecha de inicio de olimpiadas es obligatoria")
    .min(Yup.ref("fechaFinInscripcion"), "Debe ser después de la fecha de inscripción"),

  fechaFinOlimpiadas: Yup.date()
    .required("La fecha de fin de olimpiadas es obligatoria")
    .min(Yup.ref("fechaInicioOlimpiadas"), "Debe ser después del inicio de las olimpiadas"),

  fechaResultados: Yup.date()
    .required("La fecha de publicación de resultados es obligatoria")
    .min(Yup.ref("fechaFinOlimpiadas"), "Debe ser después del fin de las olimpiadas"),

  fechaPremiacion: Yup.date()
    .required("La fecha de premiación es obligatoria")
    .min(Yup.ref("fechaResultados"), "Debe ser después de la publicación de resultados"),
});

export default GestionValidate;
