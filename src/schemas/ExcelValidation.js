import * as Yup from 'yup';
const nombreSchema = Yup.string()
    .required('el Nombre es requerido')
    .min(2, 'Debe tener al menos 2 caracteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'Solo puede contener letras y espacios');

const CIschema = Yup.string()
    .required('El documento de identidad es requerido')
    .test('no-espacios', 'No puede contener solo espacios', (value) => value && value.trim().length > 0)
    .matches(/^[0-9]+$/, 'El documento solo puede contener números')
    .min(5, 'El documento debe tener al menos 5 caracteres')
    .max(9,'El documento debe tener máximo 9 caracteres' );

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

export const excelRowSchemaDatos = Yup.object().shape({
    'Nombres': nombreSchema,

    'Apellido Paterno': Yup.string()
        .min(2, 'Debe tener al menos 2 caracteres')
        .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'Solo puede contener letras y espacios'),

    'Apellido Materno': Yup.string()
        .min(2, 'Debe tener al menos 2 caracteres')
        .matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, 'Solo puede contener letras y espacios'),

    'FechaNacimiento': Yup.mixed()
        .required("La fecha de nacimiento es obligatoria")
        .test(
            "edad-valida",
            "El participante debe tener entre 4 y 20 años",
            function(value) {
                if (!value) return false;
                
                let fechaNacimiento;
                
                // Si es número (formato serial de Excel)
                if (typeof value === 'number') {
                    const utc_days = Math.floor(value - 25569);
                    const utc_value = utc_days * 86400;
                    fechaNacimiento = new Date(utc_value * 1000);
                } 
                // Si es string (formato de texto)
                else if (typeof value === 'string') {
                    // Intentar parsear diferentes formatos de fecha
                    fechaNacimiento = new Date(value);
                    if (isNaN(fechaNacimiento.getTime())) {
                        return false;
                    }
                }
                // Si ya es un objeto Date
                else if (value instanceof Date) {
                    fechaNacimiento = value;
                } else {
                    return false;
                }

                const hoy = new Date();
                let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                const mes = hoy.getMonth() - fechaNacimiento.getMonth();
                
                if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                    edad--;
                }
                
                return edad >= 4 && edad <= 20;
            }
        ),

    'Correo': emailSchema,
    'Carnet Identidad': CIschema,
    'ComplementoCi': complementoSchema,
    
    'Apellidos Tutor': nombreSchema,
    'Carnet tutor': CIschema,
    'Complemento tut': complementoSchema,
    'email tutor': emailSchema,
    'num Telefono': telfSchema,

    'Nombre Tutor': nombreSchema,
});

export const excelRowSchemaAreas = Yup.object().shape({
    'Apellidos Tutor': nombreSchema,
    'Carnet tutor': CIschema,
    'Complemento tut': complementoSchema,
    'email tutor': emailSchema,
    'telefono': telfSchema,
    'Nombre Tutor': nombreSchema,
});