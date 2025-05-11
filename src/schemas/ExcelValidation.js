import * as Yup from 'yup';
const nombreSchema = Yup.string()
    .required('el Nombre es requerido')
    .min(2, 'Debe tener al menos 2 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'Solo puede contener letras y espacios');

const CIschema = Yup.string()
    .required('El documento de identidad es requerido')
    .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)
    .matches(/^[0-9]+$/, 'El documento solo puede contener números')
    .min(5, 'El documento debe tener al menos 5 caracteres')
    .max(9,'El documento debe tener al menos 9 caracteres' );

const complementoSchema= Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Solo caracteres alfanuméricos permitidos')
    .min(2, 'Mínimo 2 caracteres')
    .max(2, 'Máximo 2 caracteres');

const telfSchema= Yup.string()
        .required('El teléfono es requerido')
        .matches(/^[0-9]+$/, 'El teléfono debe contener solo números')
        .test('no-espacios', 'El nombre no puede contener solo espacios', (value) => value && value.trim().length > 0)
        .min(5, 'El documento debe tener al menos 7 caracteres');

const emailSchema= Yup.string()
        .email('Correo electrónico inválido')  
        .required('El correo electrónico es requerido');

const excelRowSchema = Yup.object().shape({
    'Nombres': nombreSchema,

    'Apellido Paterno': Yup.string()
        .min(2, 'Debe tener al menos 2 caracteres')
        .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'Solo puede contener letras y espacios'),

    'Apellido Materno': Yup.string()
        .min(2, 'Debe tener al menos 2 caracteres')
        .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'Solo puede contener letras y espacios'),

    'FechaNacimiento': Yup.date()
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
        }),

    'Correo': emailSchema,
    'Carnet Identidad': CIschema,
    'ComplementoCi': complementoSchema,
    
    'NombreTutor': nombreSchema,
    'Apellidos Tutor': nombreSchema,
    'Carnet tutor': CIschema,
    'Complemento tut': complementoSchema,
    'email tutor': emailSchema,
    'num Telefono': telfSchema,

    'Nombre Tutor': nombreSchema,
});
export default excelRowSchema;