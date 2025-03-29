import React, { useState, useEffect } from "react";
import "./Step2Form.css";
import { toast } from "sonner";

const areas = [
  { id: 1, nombre: "Matemáticas", descripcion: "Competencia de matemáticas", costo: 50 },
  { id: 2, nombre: "Informática", descripcion: "Competencia de informática", costo: 50 },
  { id: 3, nombre: "Física", descripcion: "Competencia de física", costo: 50 },
  { id: 4, nombre: "Química", descripcion: "Competencia de química", costo: 50 },
  { id: 5, nombre: "Biología", descripcion: "Competencia de biología", costo: 50 },
]; 

const Step2Form = () => {
  const [seleccionadas, setSeleccionadas] = useState([]);

  //const [areas, setAreas] = useState([]);

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

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) => {
      if (prev.includes(id)) {
        return prev.filter((areaId) => areaId !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        toast.error("Solo puede inscribirse a 2 áreas");
        return prev;
      }
    });
  };

  const eliminarSeleccion = (id) => {
    setSeleccionadas((prev) => prev.filter((areaId) => areaId !== id));
  };

  const totalCosto = seleccionadas.reduce((acc, id) => {
    const area = areas.find((a) => a.id === id);
    return acc + (area ? area.costo : 0);
  }, 0);

  return (
    <div className="step2-container">
      <span className="step2-description">
        Seleccione las áreas en las que desea participar (Paso 2 de 4)
      </span>
      <div className="step2-grid">
        {areas.map((area) => (
          <div
            key={area.id}
            className={`step2-card ${seleccionadas.includes(area.id) ? "selected" : ""}`}
            onClick={() => toggleSeleccion(area.id)}
          >
            <h3>
              <input
                type="checkbox"
                checked={seleccionadas.includes(area.id)}
                onChange={() => toggleSeleccion(area.id)}
                className="mr-2"
              />
              {area.nombre}
            </h3>
            <p>{area.descripcion}</p>
            <p className="costo">Costo: Bs {area.costo.toFixed(2)}</p>
          </div>
        ))}
      </div>
      {seleccionadas.length > 0 && (
        <div className="step2-selected-areas">
          <h3>Áreas seleccionadas:</h3>
          <div className="step2-selected-cards">
            {seleccionadas.map((id) => {
              const area = areas.find((a) => a.id === id);
              return (
                <div key={id} className="step2-selected-card">
                  <div>
                    <h3>{area.nombre}</h3>
                    <p>{area.descripcion}</p>
                    <p className="costo">Costo: Bs {area.costo.toFixed(2)}</p>
                  </div>
                  <button onClick={() => eliminarSeleccion(id)}>Quitar</button>
                </div>
              );
            })}
          </div>
          <h2>Total: Bs {totalCosto.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default Step2Form;
