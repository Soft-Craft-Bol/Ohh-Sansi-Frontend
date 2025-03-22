
import * as Yup from 'yup';

const inscripcionSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  institucion: Yup.string()
    .required('La institución es requerida'),
  grado: Yup.string()
    .required('El grado es requerido'),
  email: Yup.string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es requerido'),
  telefono: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]+$/, 'El teléfono debe contener solo números'),
  documento: Yup.string()
    .required('El documento de identidad es requerido'),
  fechaNacimiento: Yup.date()
    .required('La fecha de nacimiento es requerida'),
  contactoEmergencia: Yup.string()
    .required('El contacto de emergencia es requerido'),
  telefonoEmergencia: Yup.string()
    .required('El teléfono de emergencia es requerido')
    .matches(/^[0-9]+$/, 'El teléfono de emergencia debe contener solo números'),
});

export default inscripcionSchema;