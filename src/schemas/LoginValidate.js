import * as Yup from 'yup';

export const validationSchema = Yup.object({
  correoUsuario: Yup.string().required('Correo electronico es requerido').email('Correo electronico no valido'),
  password: Yup.string().required('La contraseña es requerida'),
});

