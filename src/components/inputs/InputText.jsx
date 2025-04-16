import React, { useState } from "react";
import { useField } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputText.css";

function InputText({ label, required, type = "text", as = "input", showCounter = false, maxLength, ...props}) {
    const [field, meta, helpers] = useField(props);
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-component">
      <label htmlFor={props.id || props.name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="input-wrapper">
        <input
          className={`text-input ${meta.touched && meta.error ? "input-error" : ""}`}
          {...field}
          {...props}
          type={type === "password" && showPassword ? "text" : type}
          max={props.max}
          maxLength={props.maxLength}
          
          onChange={(e) => {
            let value = e.target.value;
    
            if (props.onlyNumbers === true) {
                value = value.replace(/\D/g, "");
            }

            if (props.onlyLetters === true) {
              value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑü\s]/g, "");
            }

            if (props.onlyAlphaNumeric === true) {
              value = value.replace(/[^a-zA-Z0-9]/g, "");
            }
        
            field.onChange({
                target: {
                    name: field.name,
                    value,
                },
            });
        }}
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