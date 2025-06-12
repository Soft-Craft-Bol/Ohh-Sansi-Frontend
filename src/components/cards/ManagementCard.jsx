import React from "react";
import "./ManagementCard.css";
import { FaCircle, FaEdit, FaLock } from "react-icons/fa";

const ManagementCard = ({ 
  title, 
  info = [], 
  extraContent = null, 
  status,
  onEdit,
  editable = true,
  isEditing = false
}) => {
  return (
    <div className={`management-card ${isEditing ? 'editing' : ''}`}>
      <div className="card-decoration"></div>
      
      <div className="management-card-body">
        <div className="management-card-header">
          {title && (
            <h4 className="management-card-title">
              {title}
              {status !== undefined && (
                <span className={`status-indicator ${status?.toLowerCase().replace(/\s+/g, '-')}`}>
                  <FaCircle className="status-icon" />
                  {status}
                </span>
              )}
            </h4>
          )}
          
          {/* Botón de Editar */}
          <div className="management-card-actions">
            {editable && onEdit ? (
              <button 
                className={`edit-btn ${isEditing ? 'editing' : ''}`}
                onClick={onEdit}
                title={isEditing ? "Editando..." : "Editar olimpiada"}
                disabled={isEditing}
              >
                <FaEdit />
                {isEditing && <span className="editing-text">Editando</span>}
              </button>
            ) : (
              !editable && (
                <div className="non-editable-indicator" title="No se puede editar">
                  <FaLock />
                </div>
              )
            )}
          </div>
          
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