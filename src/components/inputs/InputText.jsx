import React, { useState } from "react";
import { useField } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputText.css";

function InputText({
  label,
  required,
  type = "text",
  showCounter = false,
  maxLength,
  icon: Icon,
  decimal = false, 
  decimalPlaces = 2,
  step = "1", 
  ...props
}) {
  const [field, meta, helpers] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;

    // Validación para números decimales
    if (decimal) {
      // Permite números y un punto decimal
      value = value.replace(/[^0-9.]/g, '');
      
      // Asegura máximo un punto decimal
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Limita los decimales
      if (parts.length === 2) {
        value = parts[0] + '.' + parts[1].slice(0, decimalPlaces);
      }
    }
    // Resto de validaciones existentes
    else if (props.onlyNumbers === true) {
      value = value.replace(/\D/g, "");
    } else if (props.onlyLetters === true) {
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑü\s]/g, "");
    } else if (props.onlyAlphaNumeric === true) {
      value = value.replace(/[^a-zA-Z0-9]/g, "");
    } else if (props.onlyLettersCapital === true) {
      value = value.replace(/[^A-Z]/g, "");
    }

    field.onChange({
      target: {
        name: field.name,
        value,
      },
    });
  };

  const handleKeyDown = (e) => {
    if (decimal && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const currentValue = parseFloat(field.value) || 0;
      const stepValue = parseFloat(step) || (decimal ? Math.pow(10, -decimalPlaces) : 1);
      
      const newValue = e.key === 'ArrowUp' 
        ? currentValue + stepValue
        : currentValue - stepValue;

      field.onChange({
        target: {
          name: field.name,
          value: newValue.toFixed(decimalPlaces)
        }
      });
    }
  };

  return (
    <div className="input-component">
      <label htmlFor={props.id || props.name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon">
            <Icon />
          </div>
        )}
        <input
          className={`text-input ${meta.touched && meta.error ?
           "input-error" : ""} 
          ${Icon ? 'with-icon' : ''}`}
          {...field}
          {...props}
          type={type === "password" && showPassword ? "text" : type}
          onKeyDown={handleKeyDown}
          step={decimal ? step || Math.pow(10, -decimalPlaces) : step}
          maxLength={maxLength}
          onChange={handleChange} // Usamos nuestro manejador personalizado
          onBlur={(e) => {
            field.onBlur(e);
            helpers.setTouched(true);
          }}
        />
        {type === "password" && (
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      {meta.touched && meta.error && <div className="error-message">{meta.error}</div>}

      {showCounter && maxLength && (
        <div className="char-counter">
          {field.value.length} / {maxLength}
        </div>
      )}
    </div>
  );
}

export default InputText;