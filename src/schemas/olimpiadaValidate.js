import * as Yup from "yup";

const olimpiadaValidationSchema = Yup.object().shape({
  anio:Yup.number()
    .integer("El año debe ser un número entero")
    .required("El año es obligatorio")
    .typeError("El año debe ser un número")
    .min(new Date().getFullYear(), "El año no puede ser menor al actual")
    .max(2070, "El año no puede ser mayor a 2070"),
  nombreOlimpiada: Yup.string()
    .required("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  precioOlimpiada: Yup.number()
    .typeError('Debe ser un número válido')
    .required('Ingrese el costo')
    .min(0.01, 'Debe ser mayor a 0')
    .max(999.99, 'El precio no puede ser mayor a 999.99'),
});

export default olimpiadaValidationSchema;
