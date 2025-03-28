import React from "react";
import  {ButtonPrimary}  from '../button/ButtonPrimary';
import "./PeriodCard.css";

const PeriodCard = ({ period, onDeactivate }) => {
  return (
    <div className="period-card">
      <div>
        <strong>{period.name}</strong>
        <p>{period.startDate} - {period.endDate}</p>
      </div>
      <div>
        {period.active && <span className="active-badge">Activo</span>}
        <ButtonPrimary className="btn-secondary"onClick={() => onDeactivate(period.id)}>Desactivar</ButtonPrimary>
      </div>
    </div>
  );
};

export default PeriodCard;
