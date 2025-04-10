import React from 'react'

export default function Step5Form() {
  return (
    <div className="step5-container">
            <h3>Resumen y Pago</h3>
            <div className="summary-container">
              <div className="summary-section">
                <h4>Información del participante:</h4>
                <p>Nombre: {formData.participante.nombreParticipante} {formData.participante.apellidoPaterno} {formData.participante.apellidoMaterno}</p>
                <p>Email: {formData.participante.correoElectronicoParticipante}</p>
                <p>Documento: {formData.participante.carnetIdentidadParticipante}</p>
              </div>

              <div className="summary-section">
                <h4>Áreas seleccionadas:</h4>
                <ul>
                  {formData.areasCompetenciaEstudiante.map((area, index) => {
                    const areaInfo = formData.areasInfo?.find(a => a.idArea === area.idArea);
                    const tutorAsignado = formData.asignaciones[area.idArea];
                    return (
                      <li key={index}>
                        {areaInfo?.nombreArea} - Bs {areaInfo?.precioArea.toFixed(2)}
                        {tutorAsignado && (
                          <span className="tutor-assigned">
                            (Tutor: {tutorAsignado.nombresTutor} {tutorAsignado.apellidosTutor})
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="total">Total a pagar: Bs {formData.costoTotal?.toFixed(2)}</p>
              </div>
            </div>

            <div className="step5-actions">
              <ButtonPrimary
                type="button"
                buttonStyle="secondary"
                onClick={handlePrev}
                className="mr-2"
              >
                Anterior
              </ButtonPrimary>
              <ButtonPrimary
                type="button"
                buttonStyle="primary"
                onClick={handleSubmit}
              >
                Finalizar Inscripción
              </ButtonPrimary>
            </div>
          </div>
  )
}
