import * as Yup from 'yup';

const GradosValidate = Yup.object().shape({
      idArea: Yup.string()
        .required("Debe seleccionar un área"),
      nivelesEscolares: Yup.array()
        .min(1, "Debe seleccionar al menos un grado")
        .required("Debe seleccionar al menos un grado"),
});

export default GradosValidate;
    