import { getCatalogoOlimpiada } from '../api/api';
import * as Yup from 'yup';
const response = await getCatalogoOlimpiada();
  const catalogo = response?.data || [];

  const gradosCatalogo = new Set(
    catalogo.flatMap(item => item.grados)
  );

  const areasCatalogo = new Set(
    catalogo.map(item => item.nombreArea.toLowerCase())
  );
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
    'Nombres de Participante': nombreSchema,

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
    
    'Nombre Tutor': nombreSchema,
    'Apellidos Tutor': nombreSchema,
    'Carnet tutor': CIschema,
    'Complemento tut': complementoSchema,
    'email tutor': emailSchema,
    'num Telefono': telfSchema,
});

const validarArea = (campo) =>
    Yup.string()
      .required('Debe estar inscrito en un área')
      .test(`${campo}-valido`, 'El área que intenta inscribirse no está habilitada para su grado, o está mal escrita', function (value) {
        return areasCatalogo.has(value?.trim().toLowerCase());
      });

export const excelRowSchemaAreas = Yup.object().shape({
  '1er Area': validarArea('1er Area'),
  'Grado': Yup.string()
      .required('El grado es obligatorio')
      .test('grado-existe', 'El grado no está habilitado o está mal escrito', value =>
        gradosCatalogo.has(value?.trim())
      ),
  '2do Area (si desea)': Yup.string()
      .notRequired()
      .test('area2-valida', 'El área que intenta inscribirse no está habilitada o está mal escrita', function (value) {
        if (!value || value.trim() === '') return true;
        return areasCatalogo.has(value?.trim().toLowerCase());
      }),
  'Nombre Profesor': nombreSchema,
  'Apellidos Profesor': nombreSchema,
  'Carnet Profesor': CIschema,
  'Complemento ci prof': complementoSchema,
  'email profesor': emailSchema,
  'telefono profesor': telfSchema,
  'Nombre Tutor': nombreSchema,
  

  // Campos de Profesor2: opcionales pero todos requeridos si alguno se llena
  'Nombre Profesor2': Yup.string()
    .notRequired()
    .test('completo-si-alguno', 'Completa todos los campos del Profesor2', function (value) {
      const { path, parent } = this;
      const otros = [
        parent['Apellidos Profesor2'],
        parent['Carnet profesor2'],
        parent['email profesor2'],
        parent['telefono profesor2'],
        parent['2do Area (si desea)'],
      ];
      const algunoLleno = [value, ...otros].some(v => !!v && String(v).trim() !== '');
      const todosLlenos = [value, ...otros].every(v => !!v && String(v).trim() !== '');
      return !algunoLleno || todosLlenos; // válido si todo está vacío, o todo está lleno
    }),
  '2do Area (si desea)': Yup.string()
        .notRequired(),
  'Apellidos Profesor2': Yup.string().notRequired(),
  'Carnet profesor2': Yup.string().notRequired(),
  'email profesor2': Yup.string().notRequired(),
  'telefono profesor2': Yup.string().notRequired(),
});
