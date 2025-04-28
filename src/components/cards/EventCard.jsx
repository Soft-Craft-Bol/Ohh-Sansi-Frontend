import React from 'react';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import './EventCard.css';

const EventCard = ({ evento, onEdit, onDelete }) => {
  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha + 'T12:00:00'); 
    return isNaN(date) ? '' : date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const fechaInicio = formatFecha(evento.fechaInicio);
  const fechaFin = evento.fechaFin ? formatFecha(evento.fechaFin) : '';


  return (
    <div className="ec-event-card">
      <div className="ec-event-top">
        <div className="ec-event-title">
          {evento.nombreEvento}
          {evento.esPublica ? (
            <FiEye className="ec-eye" />
          ) : (
            <FiEyeOff className="ec-eye-locked" />
          )}
        </div>
      </div>
      <div className="ec-event-date">
        {fechaInicio}
        {fechaFin && ` - ${fechaFin}`}
      </div>
      <div className="ec-event-desc">
        {evento.descripcion}
      </div>
    </div>
  );
};

export default EventCard;
