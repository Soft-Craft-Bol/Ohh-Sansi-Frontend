import React, { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FiPlus } from 'react-icons/fi';
import useOlimpiadas from './hooks/useOlimpiadas';
import useOlimpiadasEventos from './hooks/useOlimpiadasEventos';
import PeriodForm from './components/PeriodForm';
import PeriodsList from './components/PeriodsList';
import './PeriodsManagement.css';

export default function PeriodsManagement() {
  const [selectedOlimpiada, setSelectedOlimpiada] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Aseguramos valores por defecto para evitar undefined
  const { data: olimpiadas = [], isLoading: loadingO } = useOlimpiadas();
  const { data: eventosData = {} } = useOlimpiadasEventos();

  // Combina olimpiadas con sus eventos
  const olimpiadasCompletas = useMemo(() => {
    if (!Array.isArray(olimpiadas)) return [];
    return olimpiadas.map(o => ({
      ...o,
      eventos: Array.isArray(eventosData[o.idOlimpiada]) ? eventosData[o.idOlimpiada] : []
    }));
  }, [olimpiadas, eventosData]);

  // Períodos de la olimpiada seleccionada
  const periods = useMemo(() => {
    if (!selectedOlimpiada) return [];
    const olimpiada = olimpiadasCompletas.find(o => o.idOlimpiada === Number(selectedOlimpiada));
    return Array.isArray(olimpiada?.eventos) ? olimpiada.eventos : [];
  }, [selectedOlimpiada, olimpiadasCompletas]);

  const handleSelect = useCallback(e => {
    setSelectedOlimpiada(e.target.value || null);
    setShowForm(false);
    setEditing(null);
  }, []);

  return (
    <div className="gpo-periods-container">
      <header className="gpo-periods-header">
        <h1>Gestión de Períodos de Inscripción</h1>
        <p>Configure períodos por Olimpiada</p>
      </header>
      <section className="gpo-selection-panel">
        <label>Olimpiada:</label>
        <select
          id="olimpiada-select"
          value={selectedOlimpiada || ''}
          onChange={handleSelect}
          disabled={loadingO}
          className="gpo-olimpiada-select"
        >
          <option value="">-- Seleccione --</option>
          {olimpiadas.map(o => (
            <option key={o.idOlimpiada} value={o.idOlimpiada}>
              {o.nombreOlimpiada} ({o.anio}) - {o.estado}
            </option>
          ))}
        </select>
  
  {selectedOlimpiada && (
      <button
        onClick={() => { setShowForm(v => !v); setEditing(null); }}
        aria-label={showForm ? 'Cancelar formulario' : 'Agregar nuevo período'}
      >
        <FiPlus />
        {showForm ? 'Cancelar' : 'Agregar Período'}
      </button>
    )
  }
</section >

    { showForm && selectedOlimpiada && (
      <PeriodForm
        selectedOlimpiada={Number(selectedOlimpiada)}
        editing={editing}
        periods={periods}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSave={() => {
          setShowForm(false);
          setEditing(null);
          queryClient.invalidateQueries(['olimpiadas-con-eventos']);
        }}
      />
    )
}

<PeriodsList
  periods={periods}
  onEdit={p => { setEditing(p); setShowForm(true); }}
/>
    </div >
  );
}

