import React, { useState } from "react";
import { toast } from "sonner";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getCatalogoAreasCategorias, setCatalogoAreasParticipante } from "../../api/api";
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
      const resCatalogo = await getCatalogoAreasCategorias(carnetNumerico);
      console.log("Catálogo de áreas:", resCatalogo.data);

      if (resCatalogo.data.length === 0) {
        setEstudiante({ carnetIdentidadParticipante: carnetNumerico });
        setAreas([]);
        toast.info("No hay materias disponibles para el grado del participante.");
        return;
      }
      const combined = resCatalogo.data.map((item) => ({
        idArea: item.id_area,
        nombreArea: item.nombre_area,
        nombreCortoArea: item.nombre_corto_area,
        descripcionArea: item.descripcion_area,
        precioArea: item.precio_olimpiada || 0,
        categoria: {
          id: item.id_categoria,
          nombre: item.nombre_categoria,
        },
        idOlimpiada: item.id_olimpiada,
        idCatalogo: item.id_catalogo,
      }));

      setEstudiante({ carnetIdentidadParticipante: carnetNumerico });
      setAreas(combined);
    } catch (err) {
      console.error("Error buscando catálogo de áreas:", err);
      toast.error(err.message || "No se encontró el estudiante o las áreas");
      setEstudiante(null);
      setAreas([]);
    } finally {
      setLoading(false);
    }
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
        .map((a) => ({
          idArea: a.idArea,
          idCategoria: a.categoria.id,
          idOlimpiada: a.idOlimpiada,
          idCatalogo: a.idCatalogo,
        }));
      await setCatalogoAreasParticipante(estudiante.carnetIdentidadParticipante, areasSeleccionadas);
  
      toast.success("Áreas asignadas correctamente");
      setEstudiante(null);
      setSeleccionadas([]);
      setAreas([]);
    } catch (e) {
      console.error("Error al asignar las áreas:", e);
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
          <p><strong>CI:</strong> {estudiante.carnetIdentidadParticipante}</p>

          <span>Seleccione las áreas en las que desea participar(son permitidas máximo dos áreas de competencia)</span>

          <div className="step2-grid">
            {areas.map((area) => (
              <div
                key={area.idArea}
                className={`step2-card ${seleccionadas.includes(area.idArea) ? "selected" : ""}`}
                onClick={() => toggleSeleccion(area.idArea)}
              >
                <div className="area-header">
                  <input 
                    type="checkbox" 
                    checked={seleccionadas.includes(area.idArea)}
                    onChange={() => {}}
                    className="area-checkbox"
                  />
                  <h3 className="area-title">{area.nombreArea}</h3>
                  <span className="categoria-tag">(Categoría: {area.categoria.nombre})</span>
                </div>
                <p>{area.descripcionArea}</p>
                <p className="costo">Bs {formatCurrency(area.precioArea)}</p>
              </div>
            ))}
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