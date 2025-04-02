import * as Yup from "yup";

export const areaValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres").
    matches(/^[a-zA-Z\s.]*$/, "El nombre solo puede contener letras y espacios")
    .required("El nombre del área es obligatorio"),
  precioArea: Yup.number()
    .min(0, "El precio no puede ser negativo")
    .required("El precio es obligatorio"),
  description: Yup.string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .matches(/^[a-zA-Z\s.]*$/, "La descripción solo puede contener letras y espacios")
    .required("La descripción es obligatoria"),
  isActive: Yup.boolean().required("El estado es obligatorio")
});