import * as yup from 'yup';

export const PERIOD_TYPES = {
  INSCRIPCION: { label: 'INSCRIPCION', color: 'blue' },
  AMPLIACION: { label: 'AMPLIACION', color: 'orange' }
};

export const PERIOD_STATUS = {
  PENDIENTE: { label: 'Pendiente', color: 'gray' },
  ACTIVO: { label: 'En Curso', color: 'green' },
  FINALIZADO: { label: 'Finalizado', color: 'blue' },
  CANCELADO: { label: 'Cancelado', color: 'red' }
};

export const getPeriodValidationSchema = (existingPeriods = [], year, editingId = null) => {
    return yup.object().shape({
        tipoPeriodo: yup
            .string()
            .required("El tipo de período es requerido")
            .oneOf(Object.keys(PERIOD_TYPES))
            .test(
                'unique-period-type',
                'Ya existe un período con este tipo',
                function(value) {
                    // Skip validation if no value or no existing periods
                    if (!value || !existingPeriods || existingPeriods.length === 0) {
                        return true;
                    }
                    
                    // Check if there's already a period with this type, excluding the current editing one
                    const duplicatePeriod = existingPeriods.find(
                        period => period.tipoPeriodo === value && 
                                 period.idPeriodo !== editingId
                    );
                    
                    return !duplicatePeriod;
                }
            ),
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