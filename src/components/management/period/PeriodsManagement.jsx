import React, { useState } from 'react';
import PeriodPanel from './PeriodPanel';
import EventModal from '../../modals/EventModal';
import './PeriodsManagement.css';
import { Switch } from '@headlessui/react';

const PeriodosManagement = () => {
    const [periodoActual, setPeriodoActual] = useState('');
    const [isActivo, setIsActivo] = useState(false);
    const [eventosTemp, setEventosTemp] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const registrarPeriodo = () => {
        if (!periodoActual) return alert('Ingrese un año');

        const nuevoPeriodo = {
            year: periodoActual,
            activo: isActivo,
            eventos: [...eventosTemp],
        };

        setPeriodos(prev => [...prev, nuevoPeriodo]);
        setEventosTemp([]);
        setPeriodoActual('');
        setIsActivo(false);
    };

    const agregarEventoTemp = (evento) => {
        const eventoFormat = {
            titulo: evento.nombre,
            fechaInicio: evento.fechaInicio,
            fechaFin: evento.fechaFin,
            descripcion: evento.descripcion,
            publico: evento.publico
        };
        setEventosTemp(prev => [...prev, eventoFormat]);
    };

    return (
        <div className="periodos-wrapper">
            <div className="page-header">
                <h1 className='gestion-title'>Gestión de Periodos Olímpicos</h1>
                <p className='gestion-subtitle'>Agrega y gestiona los periodos olímpicos y sus eventos.</p>
            </div>

            <div className="periodos-management">
                <div className="side-form">
                    <h2>Periodo Olímpico</h2>

                    <div className="form-group">
                        <label>Año del periodo</label>
                        <input
                            type="number"
                            value={periodoActual}
                            onChange={e => setPeriodoActual(e.target.value)}
                            placeholder="Ej: 2025"
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
                        periodos.map((p, idx) => <PeriodPanel key={idx} {...p} />)
                    )}
                </div>
            </div>

            {showModal && (
                <EventModal
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
