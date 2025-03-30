import * as Yup from 'yup';

const stepThreeSchema = Yup.object().shape({
  nombres: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  apellidos: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  telefono: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]+$/, 'El teléfono debe contener solo números'),
  
  correo: Yup.string()
    .required('El correo electrónico es requerido')
    .email('Ingrese un correo electrónico válido')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Ingrese un correo electrónico válido'
    ),
  
  tipoTutor: Yup.string()
    .required('Debe seleccionar un tipo de tutor')
    .notOneOf([''], 'Debe seleccionar un tipo de tutor válido'),
  
});

export default stepThreeSchema;