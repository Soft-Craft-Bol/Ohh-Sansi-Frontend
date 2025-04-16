import React, { useState, useEffect } from 'react';
import { FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import EventModal from '../../modals/EventModal';
import EventCard from '../../cards/EventCard';
import { saveFechaOlimpiada } from '../../../api/api';
import Swal from 'sweetalert2';
import './PeriodPanel.css';

const PeriodPanel = ({ idOlimpiada, nombreOlimpiada, estadoOlimpiada, eventos, refetchEventos }) => {
  const [expanded, setExpanded] = useState(false);
  const [eventList, setEventList] = useState(eventos || []);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setEventList(eventos || []);
  }, [eventos]);

  const extractYearFromName = (nombre) => {
    const match = nombre.match(/\b(20\d{2})\b/);
    return match ? match[1] : new Date().getFullYear();
  };

  const guardarEvento = async (evento) => {
    const payload = {
      idOlimpiada,
      nombreEvento: evento.nombre,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin,
      esPublica: evento.publico
    };

    const eventoYaExiste = eventList.some(
      (ev) => ev.nombreEvento.toLowerCase() === evento.nombre.toLowerCase()
    );

    if (eventoYaExiste) {
      Swal.fire({
        icon: 'warning',
        title: 'Evento duplicado',
        text: `Ya existe un evento llamado "${evento.nombre}" en este periodo.`,
      });
      return;
    }

    try {
      const res = await saveFechaOlimpiada(payload);

      if (res?.data?.success === true || res?.data?.message?.toLowerCase().includes("registrada")) {
        Swal.fire({
          icon: 'success',
          title: '¡Evento guardado!',
          text: res.data.message || `El evento "${evento.nombre}" fue registrado correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });

        setShowModal(false);
        await refetchEventos(); 
      } else {
        throw new Error(res?.data?.message || 'Respuesta inesperada del servidor');
      }
    } catch (err) {
      console.error('Error al guardar evento:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text:
          err?.response?.data?.message ||
          err.message ||
          'Ocurrió un error al guardar el evento.',
      });
    }
  };
  return (
    <div className="period-card">
      <div className="period-header">
        <div className="left">
          <h3>{nombreOlimpiada}</h3>
          <span className={`status-badge ${estadoOlimpiada ? 'active' : 'inactive'}`}>
            {estadoOlimpiada ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="right">
          <FiCalendar />
        </div>
      </div>

      <div className="view-events-toggle" onClick={() => setExpanded(!expanded)}>
        <span className="view-label">Ver eventos</span>
        <button className="dropdown-toggle" aria-label="Toggle eventos">
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {expanded && (
        <div className="event-body">
          {eventList.length === 0 ? (
            <p className="no-events">No hay eventos registrados</p>
          ) : (
            <div className="event-list">
              {eventList.map((e, i) => (
                <EventCard
                key={e.idFechaOlimpiada || `${e.nombreEvento}-${e.fechaInicio}-${i}`}
                evento={e}
              />
              ))}
            </div>
          )}

          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Agregar evento
          </button>
        </div>
      )}

      {showModal && (
        <EventModal
          periodo={extractYearFromName(nombreOlimpiada)}
          onClose={() => setShowModal(false)}
          onSave={guardarEvento}
        />
      )}
    </div>
  );
};

export default PeriodPanel;
