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
            if (!editing) {
                const duplicatePeriod = periods.find(p => p.tipoPeriodo === values.tipoPeriodo);
                if (duplicatePeriod) {
                    await Swal.fire({
                        title: 'Error',
                        text: 'Ya existe un período con este tipo',
                        icon: 'error'
                    });
                    setSubmitting(false);
                    return;
                }
            } else {
                const duplicatePeriod = periods.find(
                    p => p.tipoPeriodo === values.tipoPeriodo && p.idPeriodo !== editing.idPeriodo
                );
                if (duplicatePeriod) {
                    await Swal.fire({
                        title: 'Error',
                        text: 'Ya existe un período con este tipo',
                        icon: 'error'
                    });
                    setSubmitting(false);
                    return;
                }
            }

            let response;
            const payload = {
                idPeriodo: editing.idPeriodo,
                idOlimpiada: selectedOlimpiada,
                fechaInicio: values.fechaInicio,
                fechaFin: values.fechaFin,
                tipoPeriodo: values.tipoPeriodo,
                nombrePeriodo: values.nombrePeriodo
            };
            if (editing) {
                response = await updatePeriodoOlimpiada(editing.idPeriodo, payload);
            } else {
                response = await savePeriodoOlimpiada({
                    idOlimpiada: selectedOlimpiada,
                    ...values
                });
            }

            console.log('Full response:', response);

            if (response.data && response.data.status === 'error') {
                throw {
                    response: {
                        data: {
                            message: response.data.message || 'Error desconocido',
                            status: response.data.status
                        }
                    }
                };
            }

            await Swal.fire({
                title: 'Éxito',
                text: editing ? 'Período actualizado correctamente' : 'Período creado correctamente',
                icon: 'success'
            });

            onSave();

        } catch (error) {
            console.error('Error saving period:', error);

            let errorMessage = 'Error al procesar la solicitud';

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            else if (error?.message) {
                errorMessage = error.message;
            }
            else if (error?.response?.data) {
                errorMessage = typeof error.response.data === 'string'
                    ? error.response.data
                    : JSON.stringify(error.response.data);
            }

            await Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });

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
                                            {value === 'AMPLIACION'}
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
