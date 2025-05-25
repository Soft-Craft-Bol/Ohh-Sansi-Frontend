import * as yup from 'yup';

export const PERIOD_TYPES = {
    INSCRIPCION: {
        label: "Inscripciones Formales",
        defaultName: "Inscripciones Formales"
    },
    AMPLIACION: {
        label: "Ampliación de Inscripciones",
        defaultName: "Ampliación de Inscripciones"
    },
};

export const PERIOD_ORDER = {
    INSCRIPCION: 1,
    AMPLIACION: 2,
};

export const getPeriodValidationSchema = (existingPeriods = [], year) => {
    return yup.object().shape({
        tipoPeriodo: yup
            .string()
            .required("El tipo de período es requerido")
            .oneOf(Object.keys(PERIOD_TYPES)),
        nombrePeriodo: yup
            .string()
            .required("El nombre del período es requerido")
            .max(100, "No puede tener más de 100 caracteres"),
        fechaInicio: yup
            .date()
            .required("La fecha de inicio es requerida")
            .min(new Date(year, 0, 1), `Debe ser posterior al 1/1/${year}`)
            .max(new Date(parseInt(year) + 1, 11, 31), `Debe ser anterior al 31/12/${parseInt(year) + 1}`),
        fechaFin: yup
            .date()
            .required("La fecha de fin es requerida")
            .min(yup.ref('fechaInicio'), "No puede ser anterior a la fecha de inicio")
            .max(new Date(parseInt(year) + 1, 11, 31), `Debe ser anterior al 31/12/${parseInt(year) + 1}`),
    });
};