import React, { useState, useEffect } from "react";
import "./Step4Form.css";

const Step4Form = ({ formData, updateFormData, onNext, onPrev }) => {
  const [asignaciones, setAsignaciones] = useState({});
  const [error, setError] = useState("");

  // Initialize assignments from formData if available
  useEffect(() => {
    if (formData.asignaciones) {
      setAsignaciones(formData.asignaciones);
    }
  }, [formData.asignaciones]);

  useEffect(() => {
    setError("");
  }, [asignaciones]);

  const handleSeleccionTutor = (areaId, event) => {
    const tutorId = event.target.value;
    if (!tutorId) {
      handleReset(areaId);
      return;
    }
    
    const tutorSeleccionado = formData.tutores.find(t => 
      t.carnetIdentidadTutor === tutorId || // Comparar por CI
      t.id === tutorId // O por ID si existe
    );
    
    if (tutorSeleccionado) {
      setAsignaciones(prev => ({
        ...prev,
        [areaId]: tutorSeleccionado
      }));
    }
  };

  const handleReset = (areaId) => {
    setAsignaciones(prev => {
      const copia = { ...prev };
      delete copia[areaId];
      return copia;
    });
  };

  const handleContinuar = () => {
    // Validate all areas have tutors assigned
    const areasSinTutor = formData.areasCompetenciaEstudiante.filter(
      area => !asignaciones[area.idArea]
    );

    if (areasSinTutor.length > 0) {
      setError("Debe asignar un tutor para cada área seleccionada");
      return;
    }

    // Update parent form data and proceed to next step
    updateFormData({ 
      asignaciones,
      tutores: formData.tutores // Asegurarse de mantener los tutores
    });
    onNext();
  };

  // Función para obtener el nombre del grado escolar
  const getNombreGrado = (idGrado) => {
    // Aquí deberías tener acceso a la lista de grados en formData o importarla
    // Esto es un ejemplo, ajusta según tu estructura real
    const grados = {
      1: "1er Grado",
      2: "2do Grado",
      // ... más grados
    };
    return grados[idGrado] || `Grado ${idGrado}`;
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

        {formData.areasCompetenciaEstudiante?.map((area) => {
          const areaInfo = formData.areasInfo?.find(a => a.idArea === area.idArea);
          const tutorAsignado = asignaciones[area.idArea];
          
          return (
            <div className="step4-form__row" key={area.idArea}>
              <span>
                {formData.participante.nombreParticipante} {formData.participante.apellidoPaterno} {formData.participante.apellidoMaterno}
              </span>
              <span>{getNombreGrado(formData.participante.idNivelGradoEscolar)}</span>
              <span className="area2">{areaInfo?.nombreArea}</span>
              <span>
                {tutorAsignado ? (
                  <>
                    {tutorAsignado.nombresTutor} {tutorAsignado.apellidosTutor} ({tutorAsignado.tipoTutorNombre})
                    <button 
                      type="button" 
                      onClick={() => handleReset(area.idArea)}
                      className="step4-form__reset"
                    >
                      Cambiar
                    </button>
                  </>
                ) : (
                  <select
                    onChange={(e) => handleSeleccionTutor(area.idArea, e)}
                    value=""
                    className="step4-form__select"
                  >
                    <option value="">Seleccionar tutor</option>
                    {formData.tutores?.map((tutor) => (
                      <option 
                        key={tutor.carnetIdentidadTutor} 
                        value={tutor.carnetIdentidadTutor}
                      >
                        {tutor.nombresTutor} {tutor.apellidosTutor} ({tutor.tipoTutorNombre})
                      </option>
                    ))}
                  </select>
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
        <button 
          type="button" 
          onClick={onPrev} 
          className="step4-form__back"
        >
          Anterior
        </button>
        <button 
          type="button" 
          onClick={handleContinuar} 
          className="step4-form__submit"
          disabled={formData.areasCompetenciaEstudiante?.length === 0}
        >
          Continuar a pago
        </button>
      </div>
    </div>
  );
};

export default Step4Form;