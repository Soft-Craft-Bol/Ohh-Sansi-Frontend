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
import { toast } from 'sonner';

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
      console.log('Periodos cargados:', res.data);
    } catch (error) {
      toast.error('Error al cargar los periodos');
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchPeriodos();
  }, []);

  const registrarPeriodo = async () => {
    if (!periodoActual) {
      toast.warning('Ingrese un año válido');
      return;
    }

    try {
      const payload = {
        nombreOlimpiada: `Periodo Olímpico ${periodoActual}`,
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
        toast.success(res.data.message || 'Periodo registrado correctamente');
        setIdOlimpiadaActual(res.data.idOlimpiada); 
        fetchPeriodos(); 
        resetForm();
      } else {
        toast.error(res.data.message || 'Error al registrar periodo');
      }
    } catch (error) {
      toast.error('Error al registrar periodo');
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
          toast.success(res.data.message || 'Evento guardado');
          fetchPeriodos(); 
        } else {
          toast.error(res.data.message || 'Error al guardar evento');
        }
      } catch (err) {
        toast.error('Error al guardar evento');
        console.error(err);
      }
    } else {
        toast.error('No hay periodo activo para guardar el evento');
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
    <div className="periodos-wrapper">
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
