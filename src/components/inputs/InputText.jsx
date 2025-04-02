import React, { useState } from "react";
import { useField } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputText.css";

function InputText({ label, required, type = "text", as = "input", showCounter = false, maxLength, ...props }) {
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
                    maxLength={maxLength}
                    onBlur={(e) => {
                        field.onBlur(e);
                        helpers.setTouched(true);
                    }}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                        if (type === "number" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                            e.preventDefault();
                        }
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
            {/* Muestra el mensaje de error */}
            {meta.touched && meta.error && <div className="error-message">{meta.error}</div>}

            {/* Contador de caracteres */}
            {showCounter && maxLength && (
                <div className="char-counter">
                    {field.value.length} / {maxLength}
                </div>
            )}
        </div>
    );
}

export default InputText;
