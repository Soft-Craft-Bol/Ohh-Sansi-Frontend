import * as Yup from "yup";

const CategoriesValidate = Yup.object().shape({
    nombreCategoria: Yup.string()
        .required("El nombre de la categoría es obligatorio")
        .max(30, "El nombre de la categoría no puede exceder 30 caracteres"),
    grados: Yup.array()
        .min(1, "Debe seleccionar al menos un grado")
        .required("Debe seleccionar al menos un grado"),
});

export default CategoriesValidate;