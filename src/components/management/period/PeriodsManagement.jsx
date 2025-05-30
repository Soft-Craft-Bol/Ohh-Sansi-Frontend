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
  const queryClient = useQueryClient();

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

  // Obtener TODOS los períodos de TODAS las olimpiadas para validación global
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

  // Función para validar solapamiento de fechas (GLOBAL - todas las olimpiadas)
  const validateDateOverlap = useCallback((newPeriod, editingId = null) => {
    const { fechaInicio, fechaFin } = newPeriod;
    
    if (!fechaInicio || !fechaFin) return { isValid: false, message: 'Las fechas son requeridas' };
    
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    
    if (startDate >= endDate) {
      return { isValid: false, message: 'La fecha de inicio debe ser anterior a la fecha de fin' };
    }

    // Validar contra TODOS los períodos de TODAS las olimpiadas
    // Filtrar períodos excluyendo el que se está editando (solo si editingId no es null)
    const periodsToCheck = editingId 
      ? allPeriods.filter(p => p.idPeriodo !== editingId)
      : allPeriods;
    
    for (const period of periodsToCheck) {
      const periodStart = new Date(period.fechaInicio);
      const periodEnd = new Date(period.fechaFin);
      
      // Verificar solapamiento: nuevo período inicia antes de que termine el existente
      // Y nuevo período termina después de que inicie el existente
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

  const handleFormSave = useCallback(() => {
    setShowForm(false);
    setEditing(null);
    queryClient.invalidateQueries(['olimpiadas-con-eventos']);
  }, [queryClient]);

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
        <label htmlFor="olimpiada-select">Olimpiada:</label>
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
            onClick={handleAddNew}
            aria-label={showForm ? 'Cancelar formulario' : 'Agregar nuevo período'}
            className="btn-add-period"
          >
            <FiPlus />
            {showForm ? 'Cancelar' : 'Agregar Período'}
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

      {selectedOlimpiada && (
        <PeriodsList
          periods={periods}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}