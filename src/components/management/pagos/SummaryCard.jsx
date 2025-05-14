import React from 'react';
import './SummaryCard.css';
import { FiDollarSign, FiCheck, FiClock, FiX, FiPieChart, FiDownload, FiRefreshCw } from 'react-icons/fi';

const Icons = {
  total: () => <span className="material-icon"><FiDollarSign/></span>,
  paid: () => <span className="material-icon"><FiCheck/></span>,
  pending: () => <span className="material-icon"><FiClock/></span>,
  canceled: () => <span className="material-icon"><FiX/></span>,
  amount: () => <span className="material-icon"><FiPieChart/></span>,
  collected: () => <span className="material-icon"><FiDownload/></span>,
  pendingAmount: () => <span className="material-icon"><FiRefreshCw/></span>
};

const SummaryCard = ({ title, value, iconType, isAmount = false }) => {
  const IconComponent = Icons[iconType] || Icons.total;
  
  return (
    <div className="summary-card">
      <div className="card-icon">
        <IconComponent />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className={isAmount ? 'amount' : 'count'}>{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;