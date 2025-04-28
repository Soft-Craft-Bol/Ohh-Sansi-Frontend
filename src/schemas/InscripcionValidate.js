import * as Yup from 'yup';

const inscripcionValidate = Yup.object().shape({
  documento: Yup.string()
    .required('El documento de identidad es requerido')
    .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)
    .matches(/^[0-9]+$/, 'El documento solo puede contener números')
    .min(5, 'El documento debe tener al menos 5 caracteres')
    .max(9,'El documento debe tener al menos 9 caracteres' ),
  complemento: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Solo caracteres alfanuméricos permitidos')
    .min(2, 'Mínimo 2 caracteres')
    .max(2, 'Máximo 2 caracteres'),  
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
  telefono: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]+$/, 'El teléfono debe contener solo números')
    .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)
    .min(5, 'El documento debe tener al menos 7 caracteres'),  
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
    .email('Correo electrónico inválido')  
    .required('El correo electrónico es requerido')  
});

export default inscripcionValidate;