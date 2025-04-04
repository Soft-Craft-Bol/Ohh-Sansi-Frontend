import * as Yup from 'yup';

const inscripcionValidate = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  apellido: Yup.string()
    .required('El apellido es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)

    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  institucion: Yup.string()
    .required('Institución es requerida'),
  
  grado: Yup.string()
    .required('Grado es requerido'),
  
  email: Yup.string()
    .email('Correo electrónico inválido')
    .test('valid-domain', 'Dominio no permitido', (value) => {
      if (!value) return true;
      const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'edu.pe'];
      const [, domain] = value.split('@');
      return validDomains.some(d => domain?.endsWith(d));
    }),
  
  telefono: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]+$/, 'El teléfono debe contener solo números')
    .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)
    .max(8, 'El teléfono no puede tener más de 8 dígitos'),
  documento: Yup.string()
    .required('El documento de identidad es requerido')
    .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)
    .matches(/^[a-zA-Z0-9]+$/, 'El documento solo puede contener letras y números')
    .min(5, 'El documento debe tener al menos 5 caracteres')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
  fechaNacimiento: Yup.date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 5)), 'Debe tener al menos 5 años')
    .min(new Date('2005-01-01'), 'La fecha de nacimiento no puede ser anterior a 2005'),
});

export default inscripcionValidate;