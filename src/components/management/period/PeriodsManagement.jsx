import React, { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FiChevronDown, FiPlus } from 'react-icons/fi';
import useOlimpiadas from './hooks/useOlimpiadas';
import useOlimpiadasEventos from './hooks/useOlimpiadasEventos';
import PeriodForm from './components/PeriodForm';
import PeriodsList from './components/PeriodsList';
import './PeriodsManagement.css';

export default function PeriodsManagement() {
  const [selectedOlimpiada, setSelectedOlimpiada] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const { data: olimpiadas = [], isLoading: loadingO } = useOlimpiadas();
  const { data: eventosData = {}, isLoading: loadingEventos } = useOlimpiadasEventos();

  const refreshData = useCallback(async () => {
    await queryClient.invalidateQueries(['olimpiadas-con-eventos']);
    await queryClient.invalidateQueries(['olimpiadas']);
  }, [queryClient]);

  const periods = useMemo(() => {
    if (!selectedOlimpiada || !eventosData) return [];
    return eventosData[selectedOlimpiada] || [];
  }, [selectedOlimpiada, eventosData]);

  const allPeriods = useMemo(() => {
    if (!Array.isArray(olimpiadas)) return [];

    const periods = [];
    olimpiadas.forEach(olimpiada => {
      const eventos = eventosData[olimpiada.idOlimpiada] || [];
      eventos.forEach(evento => {
        periods.push({
          ...evento,
          nombreOlimpiada: olimpiada.nombreOlimpiada
        });
      });
    });

    return periods;
  }, [olimpiadas, eventosData]);

  const validateDateOverlap = useCallback((newPeriod, editingId = null) => {
    const { fechaInicio, fechaFin } = newPeriod;

    if (!fechaInicio || !fechaFin) return { isValid: false, message: 'Las fechas son requeridas' };

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    if (startDate >= endDate) {
      return { isValid: false, message: 'La fecha de inicio debe ser anterior a la fecha de fin' };
    }

    const periodsToCheck = editingId
      ? allPeriods.filter(p => p.idPeriodo !== editingId)
      : allPeriods;

    for (const period of periodsToCheck) {
      const periodStart = new Date(period.fechaInicio);
      const periodEnd = new Date(period.fechaFin);

   
      if (startDate < periodEnd && endDate > periodStart) {
        return {
          isValid: false,
          message: `El período se solapa con "${period.nombrePeriodo}" de la olimpiada "${period.nombreOlimpiada}" (${period.fechaInicio} - ${period.fechaFin})`
        };
      }
    }

    return { isValid: true, message: '' };
  }, [allPeriods]);

  const handleSelect = useCallback(e => {
    setSelectedOlimpiada(e.target.value || null);
    setShowForm(false);
    setEditing(null);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditing(null);
  }, []);

  
  const handleFormSave = useCallback(async () => {
    setShowForm(false);
    setEditing(null);
    await refreshData();
  }, [refreshData]);

  const handleEdit = useCallback(period => {
    setEditing(period);
    setShowForm(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setShowForm(prev => !prev);
    setEditing(null);
  }, []);

  return (
    <div className="gpo-periods-container">
      <header className="gpo-periods-header">
        <h1>Gestión de Períodos de Inscripción</h1>
        <p>Configure períodos por Olimpiada</p>
      </header>

      <section className="gpo-selection-panel">
        <div className="custom-select-wrapper">
          <label className="select-label">Olimpiada</label>
          <div className="custom-select">
            <select
              id="olimpiada-select"
              value={selectedOlimpiada || ''}
              onChange={handleSelect}
              disabled={loadingO}
            >
              <option value="">Seleccione una olimpiada</option>
              {olimpiadas.map(o => (
                <option key={o.idOlimpiada} value={o.idOlimpiada}>
                  {o.nombreOlimpiada} ({o.anio}) - {o.estado}
                </option>
              ))}
            </select>
            <FiChevronDown className="select-icon" />
          </div>
        </div>

        {selectedOlimpiada && (
          <button
            onClick={handleAddNew}
            className="elegant-add-button"
            disabled={loadingO || loadingEventos}
          >
            <FiPlus className="button-icon" />
            <span>{showForm ? 'Cancelar' : 'Nuevo período'}</span>
          </button>
        )}
      </section>


      {showForm && selectedOlimpiada && (
        <PeriodForm
          selectedOlimpiada={Number(selectedOlimpiada)}
          editing={editing}
          periods={periods}
          onClose={handleFormClose}
          onSave={handleFormSave}
          validateDateOverlap={validateDateOverlap}
        />
      )}

       {selectedOlimpiada && !loadingEventos && (
        <PeriodsList
          key={`periods-${selectedOlimpiada}`} 
          periods={periods}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}