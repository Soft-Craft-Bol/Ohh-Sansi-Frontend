import React from "react";
import { ButtonPrimary } from '../button/ButtonPrimary';
import "./PeriodCard.css";

const PeriodCard = ({ period, onDeactivate }) => {
    return (
        <div className="period-card">
            <div>
                <strong>Período de Inscripción</strong>
                <p>{period.fechaInicioInscripcion || "No definido"} - {period.fechaFinInscripcion || "No definido"}</p>
            </div>
            <div className="period-card-actions">
                {period.active && <span className="active-badge">Activo</span>}
                <ButtonPrimary
                    className="btn-secondary"
                    onClick={() => onDeactivate(period.idPlazoInscripcion)}
                >
                    Desactivar
                </ButtonPrimary>
            </div>
        </div>
    );
};

export default PeriodCard;
