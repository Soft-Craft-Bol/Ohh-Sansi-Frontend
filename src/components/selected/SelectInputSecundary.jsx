// SelectInputStandalone.jsx
import React from "react";
import "./SelectInput.css";

function SelectInputStandalone({ label, required, options, loading, emptyMessage, ...props }) {
    return (
        <div className="select-component">
            {label && (
                <label htmlFor={props.id || props.name}>
                    {label} {required && <span className="required">*</span>}
                </label>
            )}
            <select className="select-input" {...props}>
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
        </div>
    );
}

export default SelectInputStandalone;