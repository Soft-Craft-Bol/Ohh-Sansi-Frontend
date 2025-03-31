import React, { useState, useEffect } from "react";
import "./Step4Form.css";


const Step4Form = ({ onComplete }) => {
  const [asignaciones, setAsignaciones] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [asignaciones]);

  const handleSeleccionTutor = (areaId, tutor) => {
    setAsignaciones((prev) => ({
      ...prev,
      [areaId]: tutor,
    }));
  };

  const handleReset = (areaId) => {
    setAsignaciones((prev) => {
      const copia = { ...prev };
      delete copia[areaId];
      return copia;
    });
  };

  

  return (
    <div className="step4-form">
      <h2 className="step4-form__title">Asignación de Tutores</h2>
      <p className="step4-form__subtitle">
        Asigne tutores a los participantes para cada área (Paso 4 de 5)
      </p>

      <div className="step4-form__table">
        <div className="step4-form__header">
          <span>Nombre completo</span>
          <span>Grado</span>
          <span>Área(s) de competencia</span>
          <span>Tutor asignado</span>
        </div>

      </div>
      <div className="step4-form__note">
        <strong>Importante</strong>
        <p>
          Asigne un tutor a cada participante en cada área de competencia. Esta asignación es necesaria para completar el proceso de inscripción.
        </p>
      </div>

      {error && <div className="step4-form__warning">{error}</div>}

      <div className="step4-form__footer">
        <button type="button" onClick={handleContinuar} className="step4-form__submit">
          Continuar a pago →
        </button>
      </div>
    </div>
  );
};

export default Step4Form;
