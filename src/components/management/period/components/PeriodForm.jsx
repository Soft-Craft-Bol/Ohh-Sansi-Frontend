import React, { useMemo, useCallback, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { savePeriodoOlimpiada, updatePeriodoOlimpiada } from '../../../../api/api';
import { PERIOD_TYPES, getPeriodValidationSchema } from '../../../../schemas/PeriodValidationSchema';
import { formatDateForInput } from '../../../../utils/formatDate';
import '../PeriodsManagement.css';

export default function PeriodForm({ selectedOlimpiada, editing, onClose, onSave, periods = [] }) {
    const [submitting, setSubmitting] = useState(false);

    const validationSchema = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return getPeriodValidationSchema(
            periods, 
            currentYear, 
            editing?.idPeriodo
        );
    }, [periods, editing]);

    const initial = useMemo(() => ({
        tipoPeriodo: editing?.tipoPeriodo || 'INSCRIPCIONES',
        nombrePeriodo: editing?.nombrePeriodo || '',
        fechaInicio: editing ? formatDateForInput(editing.fechaInicio) : '',
        fechaFin: editing ? formatDateForInput(editing.fechaFin) : ''
    }), [editing]);

    const handleSubmit = useCallback(async (values) => {
        setSubmitting(true);
        try {
            // Check for duplicate period type manually as a safety check
            if (!editing) {
                const duplicatePeriod = periods.find(p => p.tipoPeriodo === values.tipoPeriodo);
                if (duplicatePeriod) {
                    Swal.fire('Error', 'Ya existe un período con este tipo', 'error');
                    setSubmitting(false);
                    return;
                }
            } else {
                const duplicatePeriod = periods.find(
                    p => p.tipoPeriodo === values.tipoPeriodo && p.idPeriodo !== editing.idPeriodo
                );
                if (duplicatePeriod) {
                    Swal.fire('Error', 'Ya existe un período con este tipo', 'error');
                    setSubmitting(false);
                    return;
                }
            }
            
            if (editing) {
                // Update existing period
                await updatePeriodoOlimpiada(
                    editing.idPeriodo, 
                    selectedOlimpiada, 
                    values
                );
                Swal.fire('Éxito', 'Período actualizado', 'success');
            } else {
                // Create new period
                await savePeriodoOlimpiada({ 
                    idOlimpiada: selectedOlimpiada, 
                    ...values 
                });
                Swal.fire('Éxito', 'Período creado', 'success');
            }
            
            onSave();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [selectedOlimpiada, editing, onSave, periods]);

    return (
        <div className="gpo-create-form">
            <h3>{editing ? 'Editar Período' : 'Nuevo Período'}</h3>
            <Formik
                initialValues={initial}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <div className="gpo-form-row">
                            <div className="gpo-form-group">
                                <label>Tipo de Período</label>
                                <Field as="select" name="tipoPeriodo">
                                    <option value="">-- Seleccione tipo --</option>
                                    {Object.entries(PERIOD_TYPES).map(([value, config]) => (
                                        <option
                                            key={value}
                                            value={value}
                                            disabled={value === 'AMPLIACION'}
                                        >
                                            {config.label}
                                            {value === 'AMPLIACION' }
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="tipoPeriodo" component="div" className="gpo-error-message" />
                            </div>

                            <div className="gpo-form-group">
                                <label>Nombre del Período</label>
                                <Field
                                    type="text"
                                    name="nombrePeriodo"
                                    placeholder="Ej: Inscripción General"
                                />
                                <ErrorMessage name="nombrePeriodo" component="div" className="gpo-error-message" />
                            </div>
                        </div>

                        <div className="gpo-form-row">
                            <div className="gpo-form-group">
                                <label>Fecha Inicio</label>
                                <Field type="date" name="fechaInicio" />
                                <ErrorMessage name="fechaInicio" component="div" className="gpo-error-message" />
                            </div>

                            <div className="gpo-form-group">
                                <label>Fecha Fin</label>
                                <Field type="date" name="fechaFin" />
                                <ErrorMessage name="fechaFin" component="div" className="gpo-error-message" />
                            </div>
                        </div>

                        <div className="gpo-form-actions">
                            <button type="submit" className="gpo-save-btn" >
                                Guardar Período
                            </button>
                           {/*  <button
                                type="button"
                                className="gpo-cancel-btn"
                                onClick={handleCancelForm}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button> */}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
