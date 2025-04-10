import React from 'react';
import { FiEdit, FiTrash, FiEye, FiEyeOff } from 'react-icons/fi';
import './EventCard.css';

const EventCard = ({ evento, onEdit, onDelete }) => {
  return (
    <div className="event-card">
      <div className="event-top">
        <div className="event-title">
          <span>{evento.titulo}</span>
          {evento.publico ? <FiEye className="icon eye" /> : <FiEyeOff className="icon eye" />}
        </div>
        <div className="event-actions">
          <FiEdit className="icon-edit" onClick={onEdit} />
          <FiTrash className="icon-delete" onClick={onDelete} />
        </div>
      </div>
      <p className="event-date">{evento.fechaInicio} - {evento.fechaFin}</p>
      <p className="event-desc">{evento.descripcion}</p>
    </div>
  );
};

export default EventCard;
