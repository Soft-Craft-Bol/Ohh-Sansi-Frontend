import React, { useState } from "react";
import { toast } from "sonner";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getAreaByIdGrade, getEstudianteByCarnet, asignarAreasEstudiantes} from "../../api/api";
import "./Step2Form.css";
import { Form, Formik } from "formik";

const AsignarAreasForm = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [areas, setAreas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarEstudiante = async (carnet) => {
    if (!carnet || carnet.trim() === "") {
      toast.error("Por favor ingrese un número de carnet");
      return;
    }

    const carnetNumerico = parseInt(carnet, 10);
    if (isNaN(carnetNumerico)) {
      toast.error("El carnet debe contener solo números");
      return;
    }

    setLoading(true);
    try {
      const resEstudiante = await getEstudianteByCarnet(carnetNumerico);
      console.log("Estudiante encontrado:", resEstudiante.data);
      
      if (!resEstudiante.data) {
        throw new Error("No se encontró información del participante");
      }
      
      setEstudiante(resEstudiante.data);

      const idNivel = resEstudiante.data.idGrado;
      console.log("ID Nivel:", idNivel);

      const resAreas = await getAreaByIdGrade(idNivel);
      const combined = processAreas(resAreas.data);
      setAreas(combined);
    } catch (err) {
      console.error("Error buscando estudiante:", err);
      toast.error("No se encontró el estudiante o las áreas");
      setEstudiante(null);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const processAreas = (data) => {
    const seen = new Set();
    const result = [];

    if (data.areas) {
      data.areas.forEach((a) => {
        if (!seen.has(a.idArea)) {
          seen.add(a.idArea);
          result.push({ 
            ...a, 
            source: "Nivel", 
            categoria: null,
            precioArea: a.precioArea || 0 // Asegurar que precioArea tenga valor
          });
        }
      });
    }

    if (data.areasCategorias) {
      data.areasCategorias.forEach((a) => {
        if (!seen.has(a.idArea)) {
          seen.add(a.idArea);
          result.push({
            idArea: a.idArea,
            nombreArea: a.nombreArea,
            precioArea: a.precioArea || 0, // Asegurar que precioArea tenga valor
            descripcionArea: a.descripcionArea,
            nombreCortoArea: a.nombreCortoArea,
            source: "Categoría",
            categoria: {
              id: a.idCategoria,
              nombre: a.codigoCategoria,
            },
          });
        }
      });
    }

    return result;
  };

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      if (prev.length >= 2) {
        toast.error("Máximo 2 áreas permitidas");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleGuardar = async () => {
    if (!estudiante || seleccionadas.length === 0) {
      toast.error("Debe seleccionar al menos un área");
      return;
    }
  
    try {
      // Preparar los datos en el formato que espera el backend
      const dataToSend = areas
        .filter((a) => seleccionadas.includes(a.idArea))
        .map((area) => ({
          idArea: area.idArea,
          idCategoria: area.categoria?.id || null, // Si no tiene categoría, envía null
          idOlimpiada: 1, // Esto parece ser un valor fijo según tu ejemplo
          idCatalogo: area.idArea // O el valor correcto según tu lógica
        }));
  
      // Llamar al endpoint con el carnet y los datos preparados
      await asignarAreasEstudiantes(estudiante.carnetIdentidadParticipante, dataToSend);
      
      toast.success("Áreas asignadas correctamente");
      setEstudiante(null);
      setSeleccionadas([]);
      setAreas([]);
    } catch (e) {
      console.error("Error al asignar áreas:", e);
      toast.error("Error al asignar las áreas");
    }
  };

  const totalCosto = seleccionadas.reduce((acc, id) => {
    const area = areas.find((a) => a.idArea === id);
    return acc + (area?.precioArea || 0);
  }, 0);

  const formatCurrency = (value) => {
    return value?.toFixed ? value.toFixed(2) : "0.00";
  };

  return (
    <div className="step2-container">
      <h2>Registrar áreas de competencia</h2>

      <div className="step2-carnet-container">
        <Formik
          initialValues={{ carnet: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await buscarEstudiante(values.carnet);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputText
                id="carnet"
                name="carnet"
                label="Carnet del Estudiante"
                placeholder="Ej: 123456789"
                type="number"
              />
              <ButtonPrimary type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Buscando..." : "Buscar Estudiante"}
              </ButtonPrimary>
            </Form>
          )}
        </Formik>
      </div>

      {loading && <div>Cargando...</div>}

      {estudiante && (
        <div>
          <p><strong>Nombre:</strong> {`${estudiante.nombreParticipante} ${estudiante.apellidoPaterno} ${estudiante.apellidoMaterno}`}</p>
          <p><strong>CI:</strong> {estudiante.carnetIdentidadParticipante}</p>

          <span>Seleccione las áreas en las que desea participar(son permitidas máximo dos áreas de competencia)</span>

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

          <ButtonPrimary onClick={handleGuardar}>Guardar Selección</ButtonPrimary>
        </div>
      )}
    </div>
  );
};

export default AsignarAreasForm;