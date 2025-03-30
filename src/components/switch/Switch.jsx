import React from "react";
import "./Switch.css";

const Switch = ({ label, checked, onChange }) => {
  return (
    <div className="switch-container">
      <label>{label}</label>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );
};

export default Switch;
