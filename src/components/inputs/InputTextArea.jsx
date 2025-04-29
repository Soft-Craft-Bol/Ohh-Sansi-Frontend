import React from "react";
import "./InputTextArea.css";

function InputTextarea({
  label,
  name,
  placeholder,
  maxLength = 500,
  required,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon: Icon, // Nueva prop para el icono
}) {
  return (
    <div className="input-textarea-component">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="textarea-wrapper">
        {Icon && <Icon className="textarea-icon" />}
        <textarea
          id={name}
          name={name}
          className={`input-textarea ${touched && error ? "input-error" : ""} ${
            Icon ? "with-icon" : ""
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
        />
      </div>
      <div className="textarea-footer">
        {touched && error && <p className="error">{error}</p>}
        <p className="char-count">
          {value.length} / {maxLength}
        </p>
      </div>
    </div>
  );
}

export default InputTextarea;