import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getAreaByCI, inscripcionEstudiante, sendEmail } from "../../api/api";
import "./Step2Form.css";

const Step2Form = ({ formData = {}, updateFormData, navigate }) => {
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!formData.participante?.carnetIdentidadParticipante) {
      toast.error("Debe ingresar el carnet del participante en el Paso 1");
      return;
    }
    fetchAreasByCI();
  }, []);

  const fetchAreasByCI = async () => {
    try {
      setIsLoading(true);
      const response = await getAreaByCI(formData.participante.carnetIdentidadParticipante);
      const processed = processAreas(response.data);
      setAreas(processed);
    } catch (error) {
      console.error("Error al obtener áreas por CI:", error);
      toast.error("No se pudieron cargar las áreas");
    } finally {
      setIsLoading(false);
    }
  };

  const processAreas = (data) => {
    const seen = new Set();
    const result = [];

    data.areas?.forEach(area => {
      if (!seen.has(area.idArea)) {
        seen.add(area.idArea);
        result.push({ ...area, source: "Nivel", categoria: null });
      }
    });

    data.areasCategorias?.forEach(area => {
      if (!seen.has(area.idArea)) {
        seen.add(area.idArea);
        result.push({
          idArea: area.idArea,
          nombreArea: area.nombreArea,
          precioArea: area.precioArea,
          descripcionArea: area.descripcionArea,
          nombreCortoArea: area.nombreCortoArea,
          source: "Categoría",
          categoria: {
            id: area.idCategoria,
            nombre: area.codigoCategoria,
          }
        });
      }
    });

    return result;
  };

  const toggleSeleccion = (id) => {
    setSeleccionadas(prev => {
      if (prev.includes(id)) {
        return prev.filter(a => a !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        toast.error("Solo puede inscribirse a 2 áreas como máximo");
        return prev;
      }
    });
  };

  const totalCosto = seleccionadas.reduce((acc, id) => {
    const area = areas.find(a => a.idArea === id);
    return acc + (area?.precioArea || 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (seleccionadas.length === 0) {
      toast.error("Debe seleccionar al menos una área");
      return;
    }

    const areasSeleccionadas = areas.filter(area => seleccionadas.includes(area.idArea));
    const dataToSend = {
      
      areasCompetenciaEstudiante: areasSeleccionadas.map(area => ({
        idArea: area.idArea,
      })),
      costoTotal: totalCosto
    };

    try {
      const response = await inscripcionEstudiante(dataToSend);
      toast.success("Inscripción completada con éxito");

      // Opcionalmente enviar emails
      // Aquí puedes enviar correos a tutores si aplica

      // Redirigir
      navigate("/home");

    } catch (err) {
      console.error("Error en inscripción:", err);
      toast.error("Error al registrar la inscripción");
    }
  };

  if (isLoading) {
    return <div className="step2-container">Cargando áreas disponibles...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="step2-container">
      <h2>Seleccione áreas para participar</h2>

      <div className="step2-grid">
        {areas.map(area => (
          <div
            key={area.idArea}
            className={`step2-card ${seleccionadas.includes(area.idArea) ? "selected" : ""}`}
            onClick={() => toggleSeleccion(area.idArea)}
          >
            <h3>{area.nombreArea}</h3>
            <p><strong>Precio:</strong> {area.precioArea} Bs</p>
            <p><strong>Origen:</strong> {area.source}</p>
            {area.categoria && <p><strong>Categoría:</strong> {area.categoria.nombre}</p>}
          </div>
        ))}
      </div>

      <div className="step2-footer">
        <p>Total a pagar: <strong>{totalCosto} Bs</strong></p>
        <ButtonPrimary type="submit">Finalizar inscripción</ButtonPrimary>
      </div>
    </form>
  );
};

export default Step2Form;
