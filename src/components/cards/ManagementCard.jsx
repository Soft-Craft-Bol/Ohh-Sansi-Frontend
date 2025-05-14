import React from "react";
import "./ManagementCard.css";
import { FaCircle } from "react-icons/fa";

const ManagementCard = ({ title, info = [], extraContent = null, status }) => {
  return (
    <div className="management-card">
      <div className="card-decoration"></div>
      
      <div className="management-card-body">
        <div className="management-card-header">
          {title && (
            <h4 className="management-card-title">
              {title}
              {status !== undefined && (
                <span className={`status-indicator ${status ? 'active' : 'inactive'}`}>
                  <FaCircle className="status-icon" />
                  {status}
                </span>
              )}
            </h4>
          )}
          
          {extraContent && <div className="management-extra">{extraContent}</div>}
        </div>
        
        <ul className="management-info-list">
          {info.map(({ label, value, highlight }, index) => (
            <li key={index} className={`management-info-item ${highlight ? 'highlight' : ''}`}>
              <span className="management-label">{label}</span>
              <span className="management-value">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagementCard;