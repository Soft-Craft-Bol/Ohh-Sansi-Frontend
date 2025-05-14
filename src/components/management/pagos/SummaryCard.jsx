// src/components/SummaryCard.jsx
import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ title, value, icon, variant = 'primary', isAmount = false }) => {
  return (
    <div className={`summary-card ${variant}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className={isAmount ? 'amount' : 'count'}>{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;