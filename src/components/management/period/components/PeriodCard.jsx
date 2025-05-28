import { useState } from "react";
import { FiCalendar, FiChevronDown, FiChevronUp, FiEdit3, FiX, FiClock, FiAlertTriangle, FiLock } from "react-icons/fi";
import { PERIOD_TYPES, PERIOD_STATUS } from "../../../../schemas/PeriodValidationSchema";
import  formatDate  from "../../../../utils/formatDate";
import '../PeriodsManagement.css'

export default function PeriodCard ({ periodo, onEdit, onCancel, canEdit, currentStatus }){
  const [expanded, setExpanded] = useState(false);

  // Only allow editing in PENDIENTE status
  const isEditable = currentStatus === 'PENDIENTE' && canEdit;
  const statusConfig = PERIOD_STATUS[currentStatus] || PERIOD_STATUS.PENDIENTE;
  const typeConfig = PERIOD_TYPES[periodo.tipoPeriodo] || PERIOD_TYPES.INSCRIPCIONES;

  return (
    <div className={`gpo-period-card ${expanded ? 'gpo-expanded' : ''} gpo-status-${currentStatus.toLowerCase()}`}>
      <div className="gpo-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="gpo-period-info">
          <div className="gpo-period-badges">
            <span className={`gpo-period-type gpo-type-${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            <span className={`gpo-period-status gpo-status-${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <h4>{periodo.nombrePeriodo}</h4>
        </div>
        
        <div className="gpo-period-dates">
          <FiCalendar className="gpo-date-icon" />
          <span>{formatDate(periodo.fechaInicio)} - {formatDate(periodo.fechaFin)}</span>
        </div>
        
        <button className="gpo-expand-btn">
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {expanded && (
        <div className="gpo-card-details">
          <div className="gpo-detail-row">
            <span>Estado Actual:</span>
            <span className={`gpo-current-status gpo-status-${statusConfig.color}`}>
              <FiClock /> {statusConfig.label}
            </span>
          </div>
          
          {currentStatus === 'ACTIVO' && (
            <div className="gpo-active-indicator">
              <FiAlertTriangle className="gpo-pulse" />
              <span>Período actualmente en curso</span>
            </div>
          )}

          <div className="gpo-card-actions">
            <button
              className="gpo-edit-btn"
              onClick={() => onEdit(periodo)}
              disabled={!isEditable}
              title={!isEditable ? 'No se puede editar este período' : 'Editar período'}
            >
              {isEditable ? <FiEdit3 /> : <FiLock />} {isEditable ? 'Editar' : 'Bloqueado'}
            </button>
            
           {/*  <button
              className="gpo-cancel-period-btn"
              onClick={() => onCancel(periodo)}
              disabled={!isEditable || currentStatus === 'CANCELADO'}
              title={!isEditable ? 'No se puede cancelar este período' : 'Cancelar período'}
            >
              <FiX /> Cancelar
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};
