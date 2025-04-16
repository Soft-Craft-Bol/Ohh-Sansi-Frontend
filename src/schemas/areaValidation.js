import * as Yup from "yup";
const normalizeString = (str) => {
  return str
    .trim()
    .normalize("NFD")         
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase();
};


export const areaValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre no puede tener más de 30 caracteres")
    .matches(/^[\p{L}\p{N}\s.]+$/u, "El nombre solo puede contener letras, números y espacios")
    .test("unique", "El área ya existe", function (value) {
      if (!value) return true; 
      const normalizedValue = normalizeString(value);
   
      const existingAreas =
        this.options.context && this.options.context.existingAreas
          ? this.options.context.existingAreas
          : [];
      if (
        existingAreas.some(
          (areaName) => normalizeString(areaName) === normalizedValue
        )
      ) {
        return this.createError({ message: "El área ya existe" });
      }
      return true;
    })
    .required("El nombre del área es obligatorio"),
  description: Yup.string()
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .matches(/^[\p{L}\p{N}\s.,()\-:;'"¡!¿?]+$/u, "La descripción contiene caracteres no válidos")
    .required("La descripción es obligatoria"),
});
