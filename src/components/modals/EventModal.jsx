import React, { useState } from 'react';
import './EventModal.css';

const EventModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    publico: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3>Agregar evento</h3>
        <form onSubmit={handleSubmit}>
          <label>Nombre del evento</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Inscripciones"
          />
          <div className="date-row">
            <div>
              <label>Fecha inicio</label>
              <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
            </div>
            <div>
              <label>Fecha fin</label>
              <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
            </div>
          </div>
          <label>Descripción (opcional)</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />

          <div className="public-toggle">
            <span>Evento público</span>
            <label className="switch">
              <input type="checkbox" name="publico" checked={formData.publico} onChange={handleChange} />
              <span className="slider round" />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar evento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
