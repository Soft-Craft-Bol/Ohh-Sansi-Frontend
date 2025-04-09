import React from "react";
import "./ManagementCard.css";

const ManagementCard = ({ title, info = [], extraContent = null }) => {
  return (
    <div className="management-card">
      <div className="management-card-body">
        <div className="management-card-header">
          {title && <h4 className="management-card-title">{title}</h4>}
          {extraContent && <div className="management-extra">{extraContent}</div>}
        </div>
        <ul className="management-info-list">
          {info.map(({ label, value }, index) => (
            <li key={index} className="management-info-item">
              <span className="management-label">{label}:</span>
              <span className="management-value">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagementCard;
