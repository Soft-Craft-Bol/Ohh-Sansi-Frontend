import * as Yup from "yup";

const costsValidationSchema = Yup.object().shape({
  idOlimpiada: Yup.string()
    .required("El período es obligatorio"),
  precioOlimpiada: Yup.number()
    .typeError('Debe ser un número válido')
    .required('Ingrese el costo')
    .min(0.01, 'Debe ser mayor a 0')
    .max(999.99, 'El precio no puede ser mayor a 999.99'),
});

export default costsValidationSchema;
