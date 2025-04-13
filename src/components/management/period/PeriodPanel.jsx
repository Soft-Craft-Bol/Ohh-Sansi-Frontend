import React, { useState } from 'react';
import { FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import EventModal from '../../modals/EventModal';
import EventCard from '../../cards/EventCard';
import './PeriodPanel.css';

const PeriodPanel = ({ nombreOlimpiada, estadoOlimpiada, eventos }) => {
  const [expanded, setExpanded] = useState(false);
  const [eventList, setEventList] = useState(eventos || []);
  const [showModal, setShowModal] = useState(false);

  const handleAddEvento = (evento) => {
    setEventList(prev => [...prev, evento]);
  };

  const handleDeleteEvento = (index) => {
    const updatedList = [...eventList];
    updatedList.splice(index, 1);
    setEventList(updatedList);
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
                  key={i}
                  evento={e}
                  onEdit={() => console.log('Editar evento', i)}
                  onDelete={() => handleDeleteEvento(i)}
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
          onClose={() => setShowModal(false)}
          onSave={(evento) => {
            handleAddEvento(evento);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default PeriodPanel;
