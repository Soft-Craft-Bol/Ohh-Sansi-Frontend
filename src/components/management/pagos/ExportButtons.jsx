// src/components/ExportButtons.jsx
import React from 'react';
import './ExportButtons.css';
import Swal from 'sweetalert2';

const ExportButtons = ({ 
  data = [], 
  title = 'Reporte', 
  dateRange, 
  exportFunctions = {
    pdf: () => {},
    excel: () => {},
    csv: () => {}
  },
  estados = [],
}) => {
  const fechaInicio = dateRange?.start || new Date();
  const fechaFin = dateRange?.end || new Date();

  const handleExport = (type) => {
    if (!Array.isArray(data) || data.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No hay datos para exportar',
        text: 'Los datos no están en el formato correcto o están vacíos'
      });
      return;
    }

    const sampleItem = data[0];
    if (!sampleItem || typeof sampleItem !== 'object') {
      Swal.fire({
        icon: 'error',
        title: 'Formato de datos incorrecto',
        text: 'Los datos deben ser un array de objetos'
      });
      return;
    }

    try {
      // Llamar a la función de exportación pasada desde el componente padre
      exportFunctions[type](data, title, fechaInicio, fechaFin, estados);
      Swal.fire({
        icon: 'success',
        title: `Exportación a ${type.toUpperCase()} exitosa`,
        text: `Los datos han sido exportados a ${type.toUpperCase()} correctamente`
      });
    } catch (error) {
      console.error(`Error al exportar a ${type}:`, error);
      Swal.fire({
        icon: 'error',
        title: `Error al exportar a ${type.toUpperCase()}`,
        text: error.message || 'Ocurrió un error durante la exportación'
      });
    }
  };

  return (
    <div className="export-buttons">
      <button onClick={() => handleExport('pdf')} className="export-btn pdf">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.018.29.018.357 0 .601-.18.601-.619 0-.348-.184-.613-.519-.613zM14.187 14.43c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.411 0 .634-.18.634-.613v-.027c0-.425-.223-.674-.54-.674z"/>
          <path d="M4 0h5l6 6v16H4V0zm13 7h-6V1H5v20h12V7z"/>
          <path d="M6.5 13.11h1.27c.83 0 1.14.49 1.14 1.05 0 .71-.32 1.19-.92 1.19-.18 0-.27-.02-.27-.02v1.07h-.22v-3.29zm.22.18v1.63c.03 0 .08.01.13.01.39 0 .69-.23.69-.83 0-.39-.2-.81-.82-.81z"/>
          <path d="M9.77 13.11h.36c1.1 0 1.83.65 1.83 1.64 0 1.05-.68 1.69-1.85 1.69h-.34v-3.33zm.22.18v2.97h.08c.79 0 1.54-.29 1.54-1.5 0-.77-.45-1.47-1.54-1.47h-.08z"/>
          <path d="M12.84 13.11h2.07v.21h-1.85v1.23h1.7v.21h-1.7v1.49h-.22v-3.14z"/>
        </svg>
        PDF
      </button>
      <button onClick={() => handleExport('excel')} className="export-btn excel">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="m14,2 l0,6 l6,0"/>
          <path d="M8.5 13.5L11 16l-2.5 2.5M15.5 13.5L13 16l2.5 2.5"/>
        </svg>
        Excel
      </button>
      <button onClick={() => handleExport('csv')} className="export-btn csv">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="m14,2 l0,6 l6,0"/>
          <circle cx="9.5" cy="15" r="1"/>
          <circle cx="12" cy="15" r="1"/>
          <circle cx="14.5" cy="15" r="1"/>
          <path d="M7 12h10M7 16h10M7 20h10"/>
        </svg>
        CSV
      </button>
    </div>
  );
};

export default ExportButtons;