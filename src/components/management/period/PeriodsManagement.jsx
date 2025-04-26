import React, { useState, useEffect } from 'react';
import PeriodPanel from './PeriodPanel';
import EventModal from '../../modals/EventModal';
import {
    getOlimpiadasConEventos,
    saveFechaConOlimpiada,
    saveFechaOlimpiada
} from '../../../api/api';
import { Switch } from '@headlessui/react';
import Swal from 'sweetalert2';
import './PeriodsManagement.css';

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

    const resetForm = () => {
        setEventosTemp([]);
        setPeriodoActual('');
        setIsActivo(false);
    };

    const registrarPeriodo = async () => {
        if (!periodoActual || eventosTemp.length === 0) return;

        const payload = {
            anio: parseInt(periodoActual),
            estadoOlimpiada: isActivo,
            eventos: eventosTemp.map(e => ({
                nombreEvento: e.titulo,
                fechaInicio: e.fechaInicio,
                fechaFin: e.fechaFin,
                esPublica: e.publico
            }))
        };


        try {
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
                throw new Error(res.data.message || 'Error al registrar el periodo');
            }
        } catch (error) {
            console.error("Error al registrar periodo:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al registrar periodo'
            });
        }
    };

    const agregarEventoTemp = async (evento) => {
        const yaExiste = periodos.some(p => p.nombreOlimpiada.includes(periodoActual));
        if (yaExiste) {
            Swal.fire({
                icon: 'warning',
                title: 'Periodo duplicado',
                text: `Ya existe un periodo registrado para el año ${periodoActual}`
            });
            return;
        }

        if (!periodoActual) {
            Swal.fire({
                icon: 'warning',
                title: 'Año no válido',
                text: 'Debe ingresar un año antes de agregar eventos'
            });
            return;
        }

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
                    throw new Error(res.data.message);
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar evento',
                    text: err.message || 'No se pudo guardar el evento'
                });
            }
        } else {
            // Guardado temporal hasta que se registre el periodo
            const eventoValido = evento?.nombre && evento?.fechaInicio;
            if (!eventoValido) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Evento no válido',
                    text: 'Complete correctamente el evento antes de guardarlo.'
                });
                return;
            }

            const eventoFormat = {
                titulo: evento.nombre,
                fechaInicio: evento.fechaInicio,
                fechaFin: evento.fechaFin,
                publico: evento.publico
            };

            setEventosTemp(prev => [...prev, eventoFormat]);
            Swal.fire({
                icon: 'success',
                title: 'Evento agregado',
                text: 'El evento fue agregado al periodo temporalmente',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="periodos-wrapper">
            <div className="side-form">
                <h2>Crear nuevo periodo</h2>

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
                                setPeriodoActual('');
                            }
                        }}
                        placeholder={`Ej: ${new Date().getFullYear()}`}
                        min="2020"
                        max={new Date().getFullYear()}
                    />
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

                    <button
                        className="add-btn"
                        onClick={() => {
                            if (!periodoActual || isNaN(parseInt(periodoActual))) {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Año no válido',
                                    text: 'Por favor, ingrese un año antes de agregar eventos.',
                                });
                                return;
                            }
                            setShowModal(true);
                        }}
                    >
                        + Agregar evento
                    </button>

                </div>

                <button
                    className="register-btn"
                    onClick={registrarPeriodo}
                    disabled={!periodoActual || eventosTemp.length === 0}
                >
                    Registrar Periodo
                </button>
            </div>

            <div className="periodos-list">
                <h2>Periodos existentes</h2>
                {periodos.length === 0 ? (
                    <p>No hay periodos registrados.</p>
                ) : (
                    periodos.map((p, idx) => (
                        <PeriodPanel
                            key={p.idOlimpiada}
                            idOlimpiada={p.idOlimpiada}
                            nombreOlimpiada={p.nombreOlimpiada}
                            estadoOlimpiada={p.estadoOlimpiada}
                            eventos={p.eventos}
                            refetchEventos={fetchPeriodos}
                        />
                    ))
                )}
            </div>

            {showModal && (
                <EventModal
                    periodo={periodoActual}
                    onClose={() => setShowModal(false)}
                    onSave={agregarEventoTemp}
                />
            )}
        </div>
    );
};

export default PeriodosManagement;
