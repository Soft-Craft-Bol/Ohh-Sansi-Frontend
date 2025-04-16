import * as Yup from 'yup';

const registerTutorValidationSchema = Yup.object().shape({
  idTipoTutor: Yup.number().required('El tipo de tutor es requerido'),
  nombresTutor: Yup.string()
    .min(3, 'Debe tener al menos 3 caracteres')
    .required('Los nombres son requeridos'),
  apellidosTutor: Yup.string()
    .min(3, 'Debe tener al menos 3 caracteres')
    .required('Los apellidos son requeridos'),
  emailTutor: Yup.string()
    .email('Ingrese un email válido')
    .required('El email es requerido'),
  telefono: Yup.string()
    .min(7, 'Debe tener al menos 7 números')
    .matches(/^[0-9]+$/, 'Solo números permitidos')
    .required('El teléfono es requerido'),
  carnetIdentidadTutor: Yup.string()
    .min(6, 'Debe tener al menos 6 números')
    .matches(/^[0-9]+$/, 'Solo números permitidos')
    .required('El documento es requerido'),
  complementoCiTutor: Yup.string()
    .min(2, 'Debe tener 2 caracteres')
});

export default registerTutorValidationSchema;