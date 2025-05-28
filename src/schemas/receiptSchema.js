import * as Yup from 'yup';

const receiptSchema = Yup.object({
  codTransaccion:  Yup.string().required('Obligatorio'),
  nombreReceptor:  Yup.string().required('Obligatorio'),
  montoPagado:    Yup.number()
                     .typeError('Sólo números')
                     .positive('Debe ser >0')
                     .required('Obligatorio'),
  carnetIdentidad: Yup.string().required('Obligatorio'),
  fechaPago:      Yup.date().required('Obligatorio'),
});

export default receiptSchema;