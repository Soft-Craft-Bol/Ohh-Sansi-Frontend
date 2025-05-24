import React, { useState } from 'react';
import './ManualEntryForm.css';

const ManualEntryForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    monto: '',
    concepto: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="manual-form-container">
      <h2>Ingreso manual de datos</h2>
      <p>Por favor complete los siguientes campos:</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número de documento:</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
            pattern="\d{6,}"
            title="Debe contener al menos 6 dígitos"
          />
        </div>
        
        <div className="form-group">
          <label>Nombre completo:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            minLength="5"
          />
        </div>
        
        <div className="form-group">
          <label>Monto pagado:</label>
          <input
            type="text"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            required
            pattern="\d+\.\d{2}"
            title="Formato: 00.00"
          />
        </div>
        
        <div className="form-group">
          <label>Concepto:</label>
          <input
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onBack} className="back-button">
            Volver
          </button>
          <button type="submit" className="submit-button">
            Enviar datos
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualEntryForm;