import * as Yup from 'yup';

const inscripcionValidate = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  
  apellido: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  
  documento: Yup.string()
    .required('Documento es requerido')
    .matches(/^\d+$/, 'Solo números')
    .min(6, 'Mínimo 6 dígitos')
    .max(8, 'Máximo 8 dígitos'),
  
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
    .test('valid-domain', 'Dominio no permitido', (value) => {
      if (!value) return true;
      const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'edu.pe'];
      const [, domain] = value.split('@');
      return validDomains.some(d => domain?.endsWith(d));
    }),
  
  telefono: Yup.string()
    .required('Teléfono es requerido')
    .matches(/^\d{8}$/, 'Debe tener 8 dígitos'),
  
  fechaNacimiento: Yup.date()
    .required('Fecha de nacimiento es requerida')
    .min(new Date(2007, 0, 1), 'Mínimo año 2007')
    .max(new Date(2020, 11, 31), 'Máximo año 2020')
});

export default inscripcionValidate;