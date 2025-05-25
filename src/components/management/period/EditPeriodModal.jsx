import { PERIOD_TYPES } from "./PERIOD_TYPES";
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Save, Timer, X } from "lucide-react";
export const EditPeriodModal = ({ period, onClose, onSave, isSubmitting }) => {
    const periodConfig = PERIOD_TYPES[period.tipoPeriodo] || {};
    
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    const validationSchema = yup.object().shape({
        nombrePeriodo: yup.string()
            .required('Ingrese el nombre del período')
            .max(100, 'Máximo 100 caracteres'),
        fechaInicio: yup.date().required('Seleccione fecha de inicio'),
        fechaFin: yup.date()
            .required('Seleccione fecha de finalización')
            .min(yup.ref('fechaInicio'), 'La fecha final debe ser posterior al inicio')
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Editar Período - {periodConfig.label}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <Formik
                    initialValues={{
                        nombrePeriodo: period.nombrePeriodo || '',
                        fechaInicio: formatDateForInput(period.fechaInicio),
                        fechaFin: formatDateForInput(period.fechaFin)
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSave}
                >
                    <Form>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre del Período</label>
                                <Field
                                    type="text"
                                    name="nombrePeriodo"
                                    className="text-input"
                                />
                                <ErrorMessage name="nombrePeriodo" component="div" className="error-message" />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Fecha de Inicio</label>
                                    <Field type="date" name="fechaInicio" className="date-input" />
                                    <ErrorMessage name="fechaInicio" component="div" className="error-message" />
                                </div>

                                <div className="form-group">
                                    <label>Fecha de Finalización</label>
                                    <Field type="date" name="fechaFin" className="date-input" />
                                    <ErrorMessage name="fechaFin" component="div" className="error-message" />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="save-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Timer size={16} /> : <Save size={16} />}
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};