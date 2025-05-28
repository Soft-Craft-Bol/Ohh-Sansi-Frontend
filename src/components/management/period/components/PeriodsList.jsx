import React, { useMemo } from 'react';
import { FiCalendar } from 'react-icons/fi';
import PeriodCard from './PeriodCard';
import { PERIOD_TYPES } from '../../../../schemas/PeriodValidationSchema';
import '../PeriodsManagement.css';

export default function PeriodsList({ periods, onEdit, onCancel }) {
  // Check if we have any INSCRIPCIONES period that has FINALIZADO
  const hasFinishedInscripcionPeriod = useMemo(() => {
    if (!Array.isArray(periods)) return false;
    return periods.some(p => 
      p.tipoPeriodo === 'INSCRIPCIONES' && 
      p.estadoActual === 'FINALIZADO'
    );
  }, [periods]);

  // Filter out AMPLIACION periods if no INSCRIPCIONES period has FINALIZADO
  const filteredPeriods = useMemo(() => {
    if (!Array.isArray(periods)) return [];
    return periods.filter(p => 
      p.tipoPeriodo !== 'AMPLIACION' || 
      (p.tipoPeriodo === 'AMPLIACION' && hasFinishedInscripcionPeriod)
    );
  }, [periods, hasFinishedInscripcionPeriod]);

  if (!Array.isArray(filteredPeriods) || filteredPeriods.length === 0) {
    return (
      <div className="gpo-empty-state">
        <FiCalendar size={48} />
        <p>No hay períodos configurados</p>
      </div>
    );
  }
  
  return (
    <div className="gpo-period-cards">
      {filteredPeriods.map(p => (
        <PeriodCard
          key={p.idPeriodo}
          periodo={p}
          onEdit={onEdit}
          onCancel={onCancel}
          canEdit={typeof onEdit === 'function'}
          currentStatus={p.estadoActual}
        />
      ))}
    </div>
  );
}
