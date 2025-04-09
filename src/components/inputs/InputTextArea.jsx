import React from "react";
import "./InputTextarea.css";

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
}) {
    return (
        <div className="input-textarea-component">
            {label && (
                <label htmlFor={name}>
                    {label} {required && <span className="required">*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                className={`input-textarea ${touched && error ? "input-error" : ""}`}
                placeholder={placeholder}
                maxLength={maxLength}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required
            />
            <div>{touched && error && <p className="error">{error}</p>}</div>
            <div>  
                <p className="char-count">{value.length} / {maxLength}</p>
            </div>

        </div>
    );
}

export default InputTextarea;
