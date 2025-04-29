import React, { useState, useEffect } from 'react';
import PeriodPanel from './PeriodPanel';
import EventModal from '../../modals/EventModal';
import { getOlimpiadasConEventos, saveFechaConOlimpiada, saveFechaOlimpiada } from '../../../api/api';
import { Switch } from '@headlessui/react';
import Swal from 'sweetalert2';
import { EVENT_ORDER } from '../../../schemas/EventValidationSchema';
import getEventValidationSchema from '../../../schemas/EventValidationSchema';
import './PeriodsManagement.css';

const PeriodosManagement = () => {
    const [periodoActual, setPeriodoActual] = useState('');
    const [isActivo, setIsActivo] = useState(false);
    const [eventosTemp, setEventosTemp] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [idOlimpiadaActual, setIdOlimpiadaActual] = useState(null);
    const [eventosExistentes, setEventosExistentes] = useState([]);
    const [yearExists, setYearExists] = useState(null);

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

    const handleYearChange = (e) => {
        const year = parseInt(e.target.value, 10);
        const currentYear = new Date().getFullYear();

        if (year >= 2020 && year <= currentYear) {
            setPeriodoActual(year);

            const found = periodos.find(p => p.nombreOlimpiada.includes(year));
            if (found) {
                setIdOlimpiadaActual(found.idOlimpiada);
                setEventosExistentes(found.eventos || []);
                setEventosTemp([]);
                setYearExists(true);
            } else {
                setIdOlimpiadaActual(null);
                setEventosExistentes([]);
                setEventosTemp([]);
                setYearExists(false);
            }
        } else {
            setPeriodoActual('');
            setYearExists(null);
        }
    };

    const getNextExpectedEvent = () => {
        const registrados = eventosTemp
            .filter(e => !e.esPersonalizado)
            .map(e => e.titulo)
            .sort((a, b) => EVENT_ORDER[a] - EVENT_ORDER[b]);

        const siguienteOrden = registrados.length ? EVENT_ORDER[registrados[registrados.length - 1]] + 1 : 1;

        return Object.keys(EVENT_ORDER).find(k => EVENT_ORDER[k] === siguienteOrden) || null;
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
                setEventosExistentes([...eventosTemp]);
                setEventosTemp([]);
                fetchPeriodos();
            } else {
                throw new Error(res.data.message || 'Error al registrar periodo');
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
        if (!periodoActual) {
            Swal.fire({
                icon: 'warning',
                title: 'Año no válido',
                text: 'Debe ingresar un año antes de agregar eventos'
            });
            return;
        }

        const listaEventos = idOlimpiadaActual ? eventosExistentes : eventosTemp;

        const nextExpected = (() => {
            const registrados = listaEventos
                .filter(e => !e.esPersonalizado)
                .map(e => e.titulo || e.nombreEvento)
                .sort((a, b) => EVENT_ORDER[a] - EVENT_ORDER[b]);

            const siguienteOrden = registrados.length
                ? EVENT_ORDER[registrados[registrados.length - 1]] + 1
                : 1;

            return Object.keys(EVENT_ORDER).find(k => EVENT_ORDER[k] === siguienteOrden) || null;
        })();

        if (evento.nombre !== nextExpected && !evento.esPersonalizado) {
            Swal.fire({
                icon: 'warning',
                title: 'Evento fuera de orden',
                text: `Debes agregar primero el evento: "${nextExpected}".`
            });
            return;
        }

        const lastEvent = listaEventos
            .filter(e => !e.esPersonalizado)
            .sort((a, b) => EVENT_ORDER[a.titulo || a.nombreEvento] - EVENT_ORDER[b.titulo || b.nombreEvento])
            .pop();

        if (lastEvent) {
            const lastEndDate = new Date(lastEvent.fechaFin);
            const newStartDate = new Date(evento.fechaInicio);

            if (newStartDate <= lastEndDate) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Fecha inválida',
                    text: `La fecha de inicio debe ser posterior a la fecha de fin del evento anterior (${lastEvent.titulo || lastEvent.nombreEvento}: ${lastEvent.fechaFin}).`
                });
                return;
            }
        }

        const schema = getEventValidationSchema(listaEventos, periodoActual);

        try {
            await schema.validate(evento, { abortEarly: false });

            const yaExiste = listaEventos.some(e => (e.titulo || e.nombreEvento) === evento.nombre);

            if (yaExiste) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Evento duplicado',
                    text: `Ya has registrado el evento "${evento.nombre}".`
                });
                return;
            }

            const eventoFormat = {
                titulo: evento.nombre,
                fechaInicio: evento.fechaInicio,
                fechaFin: evento.fechaFin,
                publico: evento.publico,
                esPersonalizado: evento.esPersonalizado || false
            };

            if (idOlimpiadaActual) {
                const payload = {
                    idOlimpiada: idOlimpiadaActual,
                    nombreEvento: evento.nombre,
                    fechaInicio: evento.fechaInicio,
                    fechaFin: evento.fechaFin,
                    esPublica: evento.publico
                };

                const res = await saveFechaOlimpiada(payload);

                if (res.data?.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Evento agregado',
                        text: res.data.message || 'Evento agregado correctamente',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchPeriodos();
                }
            } else {
                setEventosTemp(prev => [...prev, eventoFormat]);
                Swal.fire({
                    icon: 'success',
                    title: 'Evento agregado',
                    text: 'Evento agregado al periodo temporalmente.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }

        } catch (err) {
            if (err.inner) {
                const messages = err.inner.map(e => e.message).join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Error en validación',
                    text: messages
                });
            } else {
                console.error(err);
            }
        }
    };

    return (
        <div className="periodos-wrapper">
            <div className="form-container">
                <h2>Crear nuevo periodo</h2>

                <div className="form-group">
                    <label>Año del periodo <label> * </label></label>
                    <p>Defina un año para comenzar</p>
                    <input
                        type="number"
                        value={periodoActual}
                        onChange={handleYearChange}
                        placeholder={`Ej: ${new Date().getFullYear()}`}
                        min="2020"
                        max={new Date().getFullYear()}
                        className={yearExists === null ? '' : yearExists ? 'input-success' : 'input-error'}
                    />
                </div>

                {/* <div className="switch-group">
                    <label>Periodo activo</label>
                    <Switch
                        checked={isActivo}
                        onChange={setIsActivo}
                        className={`custom-switch ${isActivo ? 'on' : ''}`}
                    >
                        <span className={`custom-slider ${isActivo ? 'on' : ''}`} />
                    </Switch>
                </div> */}

                <div className="form-group">
                    <label>Eventos del periodo</label>
                    {((eventosTemp.length > 0) || (eventosExistentes.length > 0)) ? (
                        <ul className="event-preview-list">
                            {(idOlimpiadaActual ? eventosExistentes : eventosTemp).map((e, i) => (
                                <li key={i}>{e.titulo || e.nombreEvento}: {e.fechaInicio} - {e.fechaFin}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className="empty-event-box">
                            <p>No hay eventos registrados</p>
                            <small>Agrega al menos un evento para este periodo</small>
                        </div>
                    )}

                    <button
                        className="add-btn"
                        onClick={() => {
                            if (!periodoActual || isNaN(parseInt(periodoActual))) {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Año no válido',
                                    text: 'Por favor, ingrese un año válido.',
                                });
                                return;
                            }
                            setShowModal(true);
                        }}
                    >
                        + Agregar evento
                    </button>
                </div>

                {!idOlimpiadaActual && (
                    <button
                        className="register-btn"
                        onClick={registrarPeriodo}
                        disabled={!periodoActual || eventosTemp.length === 0}
                    >
                        Registrar Periodo
                    </button>
                )}
            </div>

            <div className="periodos-list">
                <h2>Periodos existentes</h2>
                {periodos.length === 0 ? (
                    <p>No hay periodos registrados.</p>
                ) : (
                    periodos.map((p) => (
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
                    eventosExistentes={idOlimpiadaActual ? eventosExistentes : eventosTemp}
                />
            )}
        </div>
    );
};

export default PeriodosManagement;
