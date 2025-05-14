import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { FiPlus, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getOlimpiadasConEventos, savePeriodoOlimpiada } from '../../../api/api';
import { PERIOD_TYPES, PERIOD_ORDER } from '../../../schemas/PeriodValidationSchema';
import './PeriodsManagement.css';

const PeriodosManagement = () => {
    const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState(null);
    const [periodos, setPeriodos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: olimpiadas = [], isLoading, refetch } = useQuery({
        queryKey: ['olimpiadas'],
        queryFn: getOlimpiadasConEventos,
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al cargar las olimpiadas',
                timer: 3000
            });
        },
        select: (res) => res.data || []
    });

    useEffect(() => {
        if (olimpiadaSeleccionada) {
            const found = olimpiadas.find(o => o.idOlimpiada === Number(olimpiadaSeleccionada));
            setPeriodos(found?.eventos || []);
        } else {
            setPeriodos([]);
        }
    }, [olimpiadaSeleccionada, olimpiadas]);

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);
        try {
            const payload = {
                idOlimpiada: Number(olimpiadaSeleccionada),
                tipoPeriodo: values.tipoPeriodo,
                nombrePeriodo: values.nombrePeriodo,
                fechaInicio: values.fechaInicio,
                fechaFin: values.fechaFin
            };

            const res = await savePeriodoOlimpiada(payload);

            if (res.data.status === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: res.data.message,
                    timer: 3000
                });

                // Refetch y actualización local
                const { data } = await refetch();
                const updatedOlimpiada = data.find(o => o.idOlimpiada === Number(olimpiadaSeleccionada));
                setPeriodos(updatedOlimpiada?.eventos || []);

                resetForm();
                setShowForm(false);
            } else {
                throw new Error(res.data?.message || 'Error al registrar período');
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message ||
                    error.message ||
                    'Error al crear el período',
                timer: 3000
            });
            if (error.response?.data?.errors) {
                console.error("Errores de validación:", error.response.data.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const validationSchema = yup.object().shape({
        tipoPeriodo: yup.string().required('Tipo de período es requerido'),
        nombrePeriodo: yup.string().required('Nombre es requerido').max(100),
        fechaInicio: yup.date().required('Fecha inicio es requerida'),
        fechaFin: yup.date()
            .required('Fecha fin es requerida')
            .min(yup.ref('fechaInicio'), 'Fecha fin no puede ser anterior a inicio')
    });

    return (
        <div className="periodos-container">
            <div className="periodos-header">
                <h1>Gestión de Períodos Olímpicos</h1>
                <p>Configura los períodos para cada olimpiada</p>
            </div>

            <div className="periodos-content">
                {/* Panel de selección */}
                <div className="selection-panel">
                    <div className="form-period-group">
                        <label>Seleccionar Olimpiada</label>
                        <select
                            value={olimpiadaSeleccionada || ''}
                            onChange={(e) => setOlimpiadaSeleccionada(e.target.value || null)}
                            className="olimpiada-select"
                        >
                            <option value="">-- Seleccione una olimpiada --</option>
                            {olimpiadas.map(o => (
                                <option key={o.idOlimpiada} value={o.idOlimpiada}>
                                    {o.nombreOlimpiada}
                                </option>
                            ))}
                        </select>
                    </div>

                    {olimpiadaSeleccionada && (
                        <button
                            className="add-period-btn"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <FiPlus /> {showForm ? 'Cancelar' : 'Agregar Período'}
                        </button>
                    )}
                </div>

                {/* Contenido principal */}
                <div className="main-content">
                    {/* Formulario de creación */}
                    {showForm && olimpiadaSeleccionada && (
                        <div className="create-period-form">
                            <h3><FiCalendar /> Nuevo Período</h3>

                            <Formik
                                initialValues={{
                                    tipoPeriodo: '',
                                    nombrePeriodo: '',
                                    fechaInicio: '',
                                    fechaFin: '',
                                    esPersonalizado: false
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, setFieldValue }) => (
                                    <Form>
                                        <div className="form-row">
                                            <div className="form-period-group">
                                                <label>Tipo de Período</label>
                                                <Field as="select" name="tipoPeriodo">
                                                    <option value="">-- Seleccione tipo --</option>
                                                    {Object.entries(PERIOD_TYPES).map(([key, config]) => (
                                                        <option key={key} value={key}>
                                                            {config.label}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="tipoPeriodo" component="div" className="error-message" />
                                            </div>

                                            <div className="form-period-group">
                                                <label>Nombre del Período</label>
                                                <Field
                                                    type="text"
                                                    name="nombrePeriodo"
                                                    placeholder="Ej: Fase de Evaluación"
                                                />
                                                <ErrorMessage name="nombrePeriodo" component="div" className="error-message" />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-period-group">
                                                <label>Fecha Inicio</label>
                                                <Field type="date" name="fechaInicio" />
                                                <ErrorMessage name="fechaInicio" component="div" className="error-message" />
                                            </div>

                                            <div className="form-period-group">
                                                <label>Fecha Fin</label>
                                                <Field type="date" name="fechaFin" />
                                                <ErrorMessage name="fechaFin" component="div" className="error-message" />
                                            </div>
                                        </div>

                                        <div className="form-period-actions">
                                            <button type="submit" className="add-period-btn" disabled={isSubmitting}>
                                                Guardar Período
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    )}

                    {/* Lista de períodos */}
                    <div className="periods-list">
                        <h3>Períodos Configurados</h3>

                        {isLoading ? (
                            <div className="loading">Cargando...</div>
                        ) : periodos.length === 0 ? (
                            <div className="empty-state">
                                <FiCalendar size={48} />
                                <p>No hay períodos configurados</p>
                                {olimpiadaSeleccionada && (
                                    <button
                                        className="text-btn"
                                        onClick={() => setShowForm(true)}
                                    >
                                        Crear primer período
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="period-cards">
                                {periodos
                                    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
                                    .map(periodo => (
                                        <PeriodCard
                                            key={periodo.idPeriodo}
                                            periodo={periodo}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PeriodCard = ({ periodo }) => {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        return adjustedDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC'
        });
    };

    return (
        <div className={`period-card ${expanded ? 'expanded' : ''}`}>
            <div className="card-header" onClick={() => setExpanded(!expanded)}>
                <div className="period-info">
                    <span className={`period-type ${periodo.tipoPeriodo}`}>
                        {PERIOD_TYPES[periodo.tipoPeriodo]?.label || periodo.tipoPeriodo}
                    </span>
                    <h4>{periodo.nombrePeriodo}</h4>
                </div>
                <div className="period-dates">
                    {formatDate(periodo.fechaInicio)} - {formatDate(periodo.fechaFin)}
                </div>
                <button className="expand-btn">
                    {expanded ? <FiChevronUp /> : <FiChevronDown />}
                </button>
            </div>

            {expanded && (
                <div className="card-details">
                    <div className="detail-row">
                        <span>Estado:</span>
                        <span className={`status ${periodo.estadoPeriodo?.toLowerCase() || 'planificacion'}`}>
                            {periodo.estadoPeriodo || 'PLANIFICACION'}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span>Obligatorio:</span>
                        <span>{periodo.obligatorio ? 'Sí' : 'No'}</span>
                    </div>

                </div>
            )}
        </div>
    );
};

export default PeriodosManagement;