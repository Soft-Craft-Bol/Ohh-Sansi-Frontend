import React, { useState, useEffect } from 'react';
import PeriodPanel from './PeriodPanel';
import EventModal from '../../modals/EventModal';
import {
    getOlimpiadasConEventos,
    saveFechaConOlimpiada,
    saveFechaOlimpiada
} from '../../../api/api';
import './PeriodsManagement.css';
import { Switch } from '@headlessui/react';
import Swal from 'sweetalert2';

const PeriodosManagement = () => {
    const [periodoActual, setPeriodoActual] = useState('');
    const [isActivo, setIsActivo] = useState(false);
    const [eventosTemp, setEventosTemp] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [idOlimpiadaActual, setIdOlimpiadaActual] = useState(null);

    const fetchPeriodos = async () => {
        try {
            const res = await getOlimpiadasConEventos();
            setPeriodos(res.data || []);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los periodos'
            });
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPeriodos();
    }, []);

    const registrarPeriodo = async () => {
        if (!periodoActual) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Ingrese un año válido'
            });
            return;
        }
        if (eventosTemp.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Debe agregar al menos un evento antes de registrar el periodo'
            });
            return;
        }

        try {
            const payload = {
                anio: `${periodoActual}`,
                estadoOlimpiada: isActivo,
                eventos: eventosTemp.map(e => ({
                    nombreEvento: e.titulo,
                    fechaInicio: e.fechaInicio,
                    fechaFin: e.fechaFin,
                    esPublica: e.publico
                }))
            };

            const res = await saveFechaConOlimpiada(payload);

            if (res.data?.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: res.data.message || 'Periodo registrado correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIdOlimpiadaActual(res.data.idOlimpiada);
                fetchPeriodos();
                resetForm();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.data.message || 'Error al registrar periodo'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al registrar periodo'
            });

            console.error(error);
        }
    };

    const resetForm = () => {
        setEventosTemp([]);
        setPeriodoActual('');
        setIsActivo(false);
    };

    const agregarEventoTemp = async (evento) => {
        if (idOlimpiadaActual) {
            try {
                const payload = {
                    idOlimpiada: idOlimpiadaActual,
                    nombreEvento: evento.nombre,
                    fechaInicio: evento.fechaInicio,
                    fechaFin: evento.fechaFin || null,
                    esPublica: evento.publico
                };

                const res = await saveFechaOlimpiada(payload);
                if (res.data?.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Evento guardado!',
                        text: res.data.message || 'Evento guardado correctamente',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    fetchPeriodos();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: res.data.message || 'Error al guardar evento'
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar evento'
                });
                console.error(err);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay periodo activo para guardar el evento'
            });

            const eventoFormat = {
                titulo: evento.nombre,
                fechaInicio: evento.fechaInicio,
                fechaFin: evento.fechaFin,
                descripcion: evento.descripcion,
                publico: evento.publico
            };
            setEventosTemp(prev => [...prev, eventoFormat]);
        }
    };

    return (
        <div className="periodos-wrapper page-padding">
            <div className="page-header">
                <h1 className="gestion-title">Gestión de Periodos Olímpicos</h1>
                <p className="gestion-subtitle">Agrega y gestiona los periodos olímpicos y sus eventos.</p>
            </div>

            <div className="periodos-management">
                <div className="side-form">
                    <h2>Periodo Olímpico</h2>

                    <div className="form-group">
                        <label>Año del periodo</label>
                        <input
                            type="number"
                            value={periodoActual}
                            onChange={e => {
                                const year = parseInt(e.target.value, 10);
                                const currentYear = new Date().getFullYear();
                                if (year >= 2020 && year <= currentYear) {
                                    setPeriodoActual(year);
                                } else {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Advertencia',
                                        text: `Ingrese un año entre 2020 y ${currentYear}`
                                    });
                                }
                            }}
                            placeholder={`Ej: ${new Date().getFullYear()}`}
                            min="2020"
                            max={new Date().getFullYear()}
                        />
                        <small>El año para este periodo olímpico.</small>
                    </div>

                    <div className="switch-group">
                        <label>Periodo activo</label>
                        <Switch
                            checked={isActivo}
                            onChange={setIsActivo}
                            className={`custom-switch ${isActivo ? 'on' : ''}`}
                        >
                            <span className={`custom-slider ${isActivo ? 'on' : ''}`} />
                        </Switch>
                    </div>

                    <div className="form-group">
                        <label>Eventos del periodo</label>
                        {eventosTemp.length === 0 ? (
                            <div className="empty-event-box">
                                <p>No hay eventos registrados</p>
                                <small>Agrega al menos un evento para este periodo</small>
                            </div>
                        ) : (
                            <ul className="event-preview-list">
                                {eventosTemp.map((e, i) => (
                                    <li key={i}>{e.titulo}: {e.fechaInicio} - {e.fechaFin}</li>
                                ))}
                            </ul>
                        )}

                        <button className="add-btn" onClick={() => setShowModal(true)}>
                            + Agregar evento
                        </button>
                    </div>

                    <button className="register-btn" onClick={registrarPeriodo}>
                        Registrar Periodo
                    </button>
                </div>

                <div className="periodos-list">
                    <h2>Periodos Olímpicos</h2>
                    {periodos.length === 0 ? (
                        <p>No hay periodos registrados.</p>
                    ) : (
                        periodos.map((p, idx) => (
                            <PeriodPanel
                                key={idx}
                                idOlimpiada={p.idOlimpiada}
                                nombreOlimpiada={p.nombreOlimpiada}
                                estadoOlimpiada={p.estadoOlimpiada}
                                eventos={p.eventos}
                                refetchEventos={fetchPeriodos}
                            />
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <EventModal
                    periodo={periodoActual}
                    onClose={() => setShowModal(false)}
                    onSave={(evento) => {
                        agregarEventoTemp(evento);
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default PeriodosManagement;
