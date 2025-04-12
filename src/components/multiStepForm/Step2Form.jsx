import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ButtonPrimary } from "../button/ButtonPrimary";
import "./Step2Form.css";

const Step2Form = ({ onNext, onPrev, formData = {}, updateFormData }) => {
  const [seleccionadas, setSeleccionadas] = useState(
    formData.areasCompetenciaEstudiante?.map(a => a.idArea) || []
  );
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (formData.participante?.idNivelGradoEscolar) {
      fetchAreasByGrade();
    } else {
      toast.error("Primero seleccione un grado/nivel en el paso anterior");
      onPrev();
    }
  }, [formData.participante?.idNivelGradoEscolar]);

  const fetchAreasByGrade = async () => {
    try {
      setIsLoading(true);
      const response = await (formData.participante.idNivelGradoEscolar);
      
      // Combinamos y procesamos ambas listas de áreas
      const combinedAreas = processAreas(response.data);
      
      setAreas(combinedAreas);
    } catch (error) {
      console.error("Error fetching areas by grade:", error);
      toast.error("Error al cargar las áreas para este grado");
      setAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para combinar y procesar las áreas de ambas fuentes
  const processAreas = (data) => {
    const seenAreas = new Set();
    const uniqueAreas = [];
    
    // Procesar áreas directas (de 'areas')
    if (data.areas && Array.isArray(data.areas)) {
      data.areas.forEach(area => {
        if (!seenAreas.has(area.idArea)) {
          seenAreas.add(area.idArea);
          uniqueAreas.push({
            ...area,
            source: 'Nivel', // Indica que viene del nivel escolar
            categoria: null // No pertenece a categoría
          });
        }
      });
    }
    
    // Procesar áreas de categorías (de 'areasCategorias')
    if (data.areasCategorias && Array.isArray(data.areasCategorias)) {
      data.areasCategorias.forEach(areaCat => {
        if (!seenAreas.has(areaCat.idArea)) {
          seenAreas.add(areaCat.idArea);
          uniqueAreas.push({
            idArea: areaCat.idArea,
            nombreArea: areaCat.nombreArea,
            precioArea: areaCat.precioArea,
            descripcionArea: areaCat.descripcionArea,
            nombreCortoArea: areaCat.nombreCortoArea,
            source: 'Categoría', // Indica que viene de categoría
            categoria: {
              id: areaCat.idCategoria,
              nombre: areaCat.codigoCategoria
            }
          });
        }
      });
    }
    
    return uniqueAreas;
  };

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
    const area = areas.find((a) => a.idArea === id);
    return acc + (area ? area.precioArea : 0);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const areasSeleccionadas = areas
      .filter(area => seleccionadas.includes(area.idArea))
      .map(area => ({ 
        idArea: area.idArea,
        nombreArea: area.nombreArea,
        precioArea: area.precioArea,
        source: area.source,
        categoria: area.categoria
      }));
    
    updateFormData({ 
      areasCompetenciaEstudiante: areasSeleccionadas,
      costoTotal: totalCosto,
      areasInfo: areas
    });
    onNext();
  };

  if (isLoading) {
    return (
      <div className="step2-container">
        <div className="loading-message">Cargando áreas para este grado...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="step2-container">
      <span className="step2-description">
        Seleccione las áreas en las que desea participar (Paso 2 de 5)
      </span>
      
      <div className="step2-grid">
        {areas.length > 0 ? (
          areas.map((area) => (
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
                <span className={`area-source ${area.source.toLowerCase()}`}>
                  ({area.source}{area.categoria ? `: ${area.categoria.nombre}` : ''})
                </span>
              </h3>
              <p>{area.descripcionArea}</p>
              <p className="costo">Costo: Bs {area.precioArea.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <div className="no-areas-message">
            No hay áreas disponibles para este grado. Por favor seleccione otro grado.
          </div>
        )}
      </div>
      
      {seleccionadas.length > 0 && (
        <div className="step2-selected-container">
          <div className="step2-selected-areas">
            <h3>Áreas seleccionadas:</h3>
            <div className="step2-selected-cards">
              {seleccionadas.map((id) => {
                const area = areas.find((a) => a.idArea === id);
                return (
                  <div key={id} className="step2-selected-card">
                    <div>
                      <h3>
                        {area.nombreArea}
                        <span className={`area-source ${area.source.toLowerCase()}`}>
                          ({area.source}{area.categoria ? `: ${area.categoria.nombre}` : ''})
                        </span>
                      </h3>
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
          disabled={seleccionadas.length === 0 || areas.length === 0}
        >
          Siguiente
        </ButtonPrimary>
      </div>
    </form>
  );
};

export default Step2Form;