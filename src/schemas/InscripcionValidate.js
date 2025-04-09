import * as Yup from 'yup';

const inscripcionValidate = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios permitidos')
    .test('no-espacios', 'No puede contener solo espacios', value => value && value.trim().length > 0)
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),

  apellido: Yup.string()
    .required('El apellido es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios permitidos')
    .test('no-espacios', 'No puede contener solo espacios', value => value && value.trim().length > 0)
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),

  documento: Yup.string()
    .required('Documento de identidad requerido')
    .matches(/^[a-zA-Z0-9]+$/, 'Solo caracteres alfanuméricos permitidos')
    .min(6, 'Mínimo 6 caracteres')
    .max(10, 'Máximo 10 caracteres'),

  telefono: Yup.string()
    .matches(/^\d+$/, "Solo se permiten números")
    .min(7, "Debe tener al menos 7 dígitos")
    .max(8, "No debe tener más de 8 dígitos")
    .required("Este campo es obligatorio"),
  

  fechaNacimiento: Yup.date()
      .required("Este campo es obligatorio")
      .test(
        "edad-valida",
        "La edad debe estar entre 4 y 20 años",
        function (value) {
          if (!value) return false;
          const hoy = new Date();
          const fechaNacimiento = new Date(value);
          const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
          const m = hoy.getMonth() - fechaNacimiento.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            return edad - 1 >= 4 && edad - 1 <= 20;
          }
          return edad >= 4 && edad <= 20;
        }
      ),

  departamento: Yup.string()
    .required('Departamento es requerido'),

  municipio: Yup.string()
    .required('Municipio es requerido'),

  institucion: Yup.string()
    .required('Institución es requerida'),

  grado: Yup.string()
    .required('Grado es requerido'),

  email: Yup.string()
    .required('Email es requerido')
    .email('Formato de email inválido')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Debe ser un email válido'
    )
});

export default inscripcionValidate;