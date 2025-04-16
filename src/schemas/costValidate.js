import * as Yup from "yup";

const costsValidationSchema = Yup.object().shape({
  idOlimpiada: Yup.string()
    .required("El período es obligatorio"),
  precioOlimpiada: Yup.number()
    .positive("El costo debe ser mayor a 0")
    .required("El costo es obligatorio"),
});

export default costsValidationSchema;
