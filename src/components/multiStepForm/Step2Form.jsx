import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ButtonPrimary } from "../button/ButtonPrimary";
import "./Step2Form.css";
import { getAreas } from "../../api/api";

const Step2Form = ({ onNext, onPrev, formData = {}, updateFormData }) => {
  const [seleccionadas, setSeleccionadas] = useState(formData.areasCompetenciaEstudiante?.map(a => a.idArea) || []);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const response = await getAreas();
      setAreas(response.data?.areas || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Error al cargar las áreas existentes");
      setAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar solo áreas activas
  const areasActivas = areas.filter(area => area.areaStatus === true);

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) => {
      if (prev.includes(id)) {
        return prev.filter((areaId) => areaId !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        toast.error("Solo puede inscribirse a 2 áreas como máximo");
        return prev;
      }
    });
  };

  const eliminarSeleccion = (id) => {
    setSeleccionadas((prev) => prev.filter((areaId) => areaId !== id));
  };

  const totalCosto = seleccionadas.reduce((acc, id) => {
    const area = areasActivas.find((a) => a.idArea === id);
    return acc + (area ? area.precioArea : 0);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const areasSeleccionadas = areasActivas
      .filter(area => seleccionadas.includes(area.idArea))
      .map(area => ({ idArea: area.idArea }));
    
    updateFormData({ 
      areasCompetenciaEstudiante: areasSeleccionadas,
      costoTotal: totalCosto
    });
    onNext();
  };

  if (isLoading) {
    return (
      <div className="step2-container">
        <div className="loading-message">Cargando áreas...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="step2-container">
      <span className="step2-description">
        Seleccione las áreas en las que desea participar (Paso 2 de 5)
      </span>
      
      <div className="step2-grid">
        {areasActivas.map((area) => (
          <div
            key={area.idArea}
            className={`step2-card ${seleccionadas.includes(area.idArea) ? "selected" : ""}`}
            onClick={() => toggleSeleccion(area.idArea)}
          >
            <h3>
              <input
                type="checkbox"
                checked={seleccionadas.includes(area.idArea)}
                onChange={() => toggleSeleccion(area.idArea)}
                className="mr-2"
              />
              {area.nombreArea}
            </h3>
            <p>{area.descripcionArea}</p>
            <p className="costo">Costo: Bs {area.precioArea.toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      {seleccionadas.length > 0 && (
        <div className="step2-selected-container">
          <div className="step2-selected-areas">
            <h3>Áreas seleccionadas:</h3>
            <div className="step2-selected-cards">
              {seleccionadas.map((id) => {
                const area = areasActivas.find((a) => a.idArea === id);
                return (
                  <div key={id} className="step2-selected-card">
                    <div>
                      <h3>{area.nombreArea}</h3>
                      <p>{area.descripcionArea}</p>
                      <p className="costo">Costo: Bs {area.precioArea.toFixed(2)}</p>
                    </div>
                    <button 
                      type="button"
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarSeleccion(id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            <h2 className="step2-total">Total: Bs {totalCosto.toFixed(2)}</h2>
          </div>
        </div>
      )}
      
      <div className="step2-actions">
        <ButtonPrimary 
          type="button"
          buttonStyle="secondary"
          onClick={onPrev}
          className="mr-2"
        >
          Anterior
        </ButtonPrimary>
        <ButtonPrimary 
          type="submit" 
          buttonStyle="primary"
          disabled={seleccionadas.length === 0}
        >
          Siguiente
        </ButtonPrimary>
      </div>
    </form>
  );
};

export default Step2Form;