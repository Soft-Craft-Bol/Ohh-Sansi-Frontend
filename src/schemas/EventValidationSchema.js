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
          function(value) {
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
        'formato-fecha',
        'Formato de fecha inválido (dd/mm/aaaa)',
        value => /^\d{4}-\d{2}-\d{2}$/.test(value)
      )
      .test(
        'no-full-period-start',
        'No puede ocupar todo el periodo anual',
        function(value) {
          const fechaFin = this.parent.fechaFin;
          const inicioPeriodo = `${periodo}-01-01`;
          const finPeriodo = `${periodo}-12-31`;
          
          return !(value === inicioPeriodo && fechaFin === finPeriodo);
        }
      ),
    fechaFin: yup.string()
      .required('Fecha final requerida')
      .test(
        'formato-fecha',
        'Formato de fecha inválido (dd/mm/aaaa)',
        value => /^\d{4}-\d{2}-\d{2}$/.test(value)
      )
      .test(
        'fecha-posterior',
        'No puede ser anterior a la fecha de inicio',
        function(value) {
          const fechaInicio = this.parent.fechaInicio;
          return new Date(value) >= new Date(fechaInicio);
        }
      )
  });
};


export default getEventValidationSchema;