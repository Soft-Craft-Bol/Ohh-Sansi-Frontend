// src/components/ExportButtons.jsx
import React from 'react';
import './ExportButtons.css';

const ExportButtons = ({ dateRange }) => {
  const handleExport = (format) => {
    // In a real app, this would trigger an API call to export data
    console.log(`Exporting data (${format}) from`, dateRange.startDate, 'to', dateRange.endDate);
    alert(`Exportando reporte en formato ${format.toUpperCase()} para el rango seleccionado`);
  };

  return (
    <div className="export-buttons">
      <button onClick={() => handleExport('pdf')} className="export-btn pdf">
        PDF
      </button>
      <button onClick={() => handleExport('excel')} className="export-btn excel">
        Excel
      </button>
      <button onClick={() => handleExport('csv')} className="export-btn csv">
        CSV
      </button>
    </div>
  );
};

export default ExportButtons;