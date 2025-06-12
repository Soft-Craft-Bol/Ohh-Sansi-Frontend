import React, { useMemo } from 'react';
import { FiCalendar } from 'react-icons/fi';
import PeriodCard from './PeriodCard';
import '../PeriodsManagement.css';

export default function PeriodsList({ periods, onEdit, onCancel }) {
  const validPeriods = useMemo(() => {
    if (!Array.isArray(periods)) {
      console.warn('PeriodsList: periods no es un array:', periods);
      return [];
    }
    
    const valid = periods.filter(p => 
      p && 
      p.idPeriodo && 
      p.nombrePeriodo && 
      p.fechaInicio && 
      p.fechaFin
    );    
    return valid;
  }, [periods]);

  const filteredPeriods = useMemo(() => {
    return validPeriods;
  }, [validPeriods]);

  if (filteredPeriods.length === 0) {
    return (
      <div className="gpo-empty-state">
        <FiCalendar size={48} />
        <p>No hay períodos configurados</p>
      </div>
    );
  }

  return (
    <div className="gpo-period-cards">
      {filteredPeriods.map((p, index) => (
        <PeriodCard
          key={`period-${p.idPeriodo}-${index}`}
          periodo={p}
          onEdit={onEdit}
          onCancel={onCancel}
          canEdit={typeof onEdit === 'function'}
          currentStatus={p.estadoActual || 'PENDIENTE'} 
        />
      ))}
    </div>
  );
}