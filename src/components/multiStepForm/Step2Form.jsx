import React, { useState } from "react";
import "./Step2Form.css"; // Importar el archivo CSS

const areas = [
  { id: 1, nombre: "Matemáticas", descripcion: "Competencia de matemáticas", costo: 50 },
  { id: 2, nombre: "Informática", descripcion: "Competencia de informática", costo: 50 },
  { id: 3, nombre: "Física", descripcion: "Competencia de física", costo: 50 },
  { id: 4, nombre: "Química", descripcion: "Competencia de química", costo: 50 },
  { id: 5, nombre: "Biología", descripcion: "Competencia de biología", costo: 50 },
];

const Step2Form = () => {
  const [seleccionadas, setSeleccionadas] = useState([]);

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((areaId) => areaId !== id) : [...prev, id]
    );
  };

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
          <ul>
            {seleccionadas.map((id) => {
              const area = areas.find((a) => a.id === id);
              return <li key={id}>{area.nombre}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Step2Form;