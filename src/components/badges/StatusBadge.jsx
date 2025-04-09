// components/badges/StatusBadge.jsx
import React from "react";
import "./StatusBadge.css";

const StatusBadge = ({ isActive }) => {
  return (
    <span className={`status-badge ${isActive ? "active" : "inactive"}`}>
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
};

export default StatusBadge;
