import * as yup from 'yup';

export const EVENT_ORDER = {
  "Pre-Inscripciones": 1,
  "Inscripciones": 2,
  "Fase Previa": 3,
  "Fase-Clasificatoria": 4,
  "Fase-Final": 5,
  "Resultados": 6,
  "Premiación": 7
};

const getEventValidationSchema = (existingEvents, periodo) => {
  return yup.object().shape({
    esPersonalizado: yup.boolean(),
    nombre: yup.string().when('esPersonalizado', {
      is: false,
      then: schema => schema
        .required('Selección obligatoria')
        .test(
          'orden-evento',
          'Debe seguir la secuencia predefinida',
          function (value) {
            const eventosRegistrados = existingEvents
              .filter(e => !e.esPersonalizado)
              .sort((a, b) => EVENT_ORDER[a.nombre] - EVENT_ORDER[b.nombre]);

            const siguienteEvento = eventosRegistrados.length > 0
              ? EVENT_ORDER[eventosRegistrados[eventosRegistrados.length - 1].nombre] + 1
              : 1;

            return EVENT_ORDER[value] === siguienteEvento;
          }
        )
    }),
    fechaInicio: yup.string()
      .required('Fecha inicial requerida')
      .test(
        'no-full-period-start',
        'No puede ocupar todo el periodo anual',
        function (value) {
          const fechaFin = this.parent.fechaFin;
          if (!value || !fechaFin) return true;

          const inicioPeriodo = `${periodo}-01-01`;
          const finPeriodo = `${periodo}-12-31`;

          return !(value === inicioPeriodo && fechaFin === finPeriodo);
        }
      ),
    fechaFin: yup.string()
      .required('Fecha final requerida')
      .test(
        'fecha-posterior',
        'No puede ser anterior a la fecha de inicio',
        function (value) {
          const fechaInicio = this.parent.fechaInicio;
          if (!value || !fechaInicio) return true;

          const fechaFinDate = new Date(value);
          const fechaInicioDate = new Date(fechaInicio);

          return fechaFinDate >= fechaInicioDate;
        }
      )
  });
};

export default getEventValidationSchema;
