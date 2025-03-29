import React, { useState, useEffect } from "react";
import "./Step4Form.css";

const mockAreas = [
  { id: 1, nombre: "Matemáticas", estudiante: "Erika Cespedes", grado: "5to Secundaria" },
  { id: 2, nombre: "Informática", estudiante: "Erika Cespedes", grado: "5to Secundaria" },
];

const mockTutores = {
  Matemáticas: ["Carlos Pérez", "Ana Torres", "Luis Fernández", "Daniela Gómez", "Zoe Castro"],
  Informática: ["Miguel Luna", "Patricia Rojas"],
};

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

  const handleContinuar = () => {
    const todasAsignadas = mockAreas.every((area) => asignaciones[area.id]);
    if (!todasAsignadas) {
      setError("Debe asignar un tutor para cada área antes de continuar.");
    } else {
      setError("");
      onComplete?.(asignaciones);
    }
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

        {mockAreas.map((area) => {
          const tutores = mockTutores[area.nombre] || [];
          return (
            <div key={area.id} className="step4-form__row">
              <span>{area.estudiante}</span>
              <span>{area.grado}</span>
              <span>
                <span className="step4-form__tag">{area.nombre}</span>
              </span>
              <span className="step4-form__actions">
                <select
                  className="step4-form__select"
                  value={asignaciones[area.id] || ""}
                  onChange={(e) => handleSeleccionTutor(area.id, e.target.value)}
                >
                  <option value="">Seleccionar tutor</option>
                  {tutores.length === 0 ? (
                    <option disabled>No hay tutores registrados en esta área</option>
                  ) : (
                    [...tutores].sort().map((tutor) => (
                      <option key={tutor} value={tutor}>
                        {tutor}
                      </option>
                    ))
                  )}
                </select>
                {asignaciones[area.id] && (
                  <button
                    type="button"
                    className="step4-form__reset"
                    onClick={() => handleReset(area.id)}
                  >
                    Restablecer
                  </button>
                )}
              </span>
            </div>
          );
        })}
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
