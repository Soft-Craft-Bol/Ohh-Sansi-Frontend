import React from "react";
import { useField } from "formik";
import "./SelectInput.css";

function SelectInput({ label, required, options, loading, emptyMessage, ...props }) {
    const [field, meta] = useField(props);

    return (
        <div className="select-component">
            <label htmlFor={props.id || props.name}>
                {label} {required && <span className="required">*</span>}
            </label>
            <select className="select-input" {...field} {...props}>
                <option value="">Seleccione una opción</option>
                {loading ? (
                    <option disabled>Cargando...</option>
                ) : !Array.isArray(options) || options.length === 0 ? (
                    <option disabled>{emptyMessage || "No hay opciones disponibles"}</option>
                ) : (
                    options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                )}

            </select>
            {meta.touched && meta.error ? (
                <div className="error-message">{meta.error}</div>
            ) : null}
        </div>
    );
}

export default SelectInput;