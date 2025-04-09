import * as Yup from "yup";

const costsValidationSchema = Yup.object().shape({
  periodId: Yup.string()
    .required("El período es obligatorio"),
  cost: Yup.number()
    .positive("El costo debe ser mayor a 0")
    .required("El costo es obligatorio"),
});

export default costsValidationSchema;
