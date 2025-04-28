import * as Yup from "yup";

const normalizeString = (str) => {
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase();
};

const CategoriesValidate = Yup.object().shape({
  nombreCategoria: Yup.string()
    .required("El nombre de la categoría es obligatorio")
    .min(3, "El nombre de la categoría debe tener al menos 3 caracteres")
    .max(30, "El nombre de la categoría no puede exceder 30 caracteres")
    .matches(/^[\p{L}\p{N}\s.,()\-_:;'"¡!¿?]+$/u, "El nombre no puede contener caracteres especiales")
    .test("unique", "La categoría ya existe", function (value) {
      if (!value) return true; 
      const normalizedValue = normalizeString(value);
      const existingCategories =
        this.options.context && this.options.context.existingCategories
          ? this.options.context.existingCategories
          : [];
      if (
        existingCategories.some(
          (categoriaNombre) => normalizeString(categoriaNombre) === normalizedValue
        )
      ) {
        return this.createError({ message: "La categoría ya existe" });
      }
      return true;
    }),
  
  gradoDesde: Yup.string().required("Debe seleccionar un grado desde"),
  gradoHasta: Yup.string().required("Debe seleccionar un grado hasta"),
});


export default CategoriesValidate;
