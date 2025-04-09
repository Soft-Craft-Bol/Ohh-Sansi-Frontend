import * as Yup from "yup";

const CategoriesValidate = Yup.object().shape({
    codCategory: Yup.string()
        .required("El nombre de la categoría es obligatorio")
        .max(30, "El nombre de la categoría no puede exceder 30 caracteres"),
    idArea: Yup.string()
        .required("Debe seleccionar un área"),
    nivelesEscolares: Yup.array()
        .min(1, "Debe seleccionar al menos un grado")
        .required("Debe seleccionar al menos un grado"),
});

export default CategoriesValidate;