import React, { useState } from "react";
import { toast } from "sonner";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getAreaByIdGrade, getEstudianteByCarnet } from "../../api/api";
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
      
      if (!resEstudiante.data?.participante) {
        throw new Error("No se encontró información del participante");
      }
      
      setEstudiante(resEstudiante.data.participante);

      const idNivel = resEstudiante.data.participante.idNivel;
      console.log("ID Nivel:", idNivel);

      if (!idNivel) {
        throw new Error("No se pudo determinar el nivel del estudiante");
      }

      const resAreas = await getAreaByIdGrade(idNivel);
      const combined = processAreas(resAreas.data);
      setAreas(combined);
    } catch (err) {
      console.error("Error buscando estudiante:", err);
      toast.error(err.message || "No se encontró el estudiante o las áreas");
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
      const areasSeleccionadas = areas
        .filter((a) => seleccionadas.includes(a.idArea))
        .map((a) => ({
          idArea: a.idArea,
          nombreArea: a.nombreArea,
          precioArea: a.precioArea,
        }));

      // await asignarAreasEstudiante({ idEstudiante: estudiante.idParticipante, areas: areasSeleccionadas });
      toast.success("Áreas asignadas correctamente");
      setEstudiante(null);
      setSeleccionadas([]);
      setAreas([]);
    } catch (e) {
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
      <h2>Asignar Áreas al Estudiante</h2>

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

          <span>Seleccione hasta 2 áreas:</span>

          <div className="step2-grid">
            {areas.map((area) => (
              <div
                key={area.idArea}
                className={`step2-card ${seleccionadas.includes(area.idArea) ? "selected" : ""}`}
                onClick={() => toggleSeleccion(area.idArea)}
              >
                <h3>{area.nombreArea}</h3>
                <p>{area.descripcionArea}</p>
                <p className="costo">Bs {formatCurrency(area.precioArea)}</p>
              </div>
            ))}
          </div>

          {seleccionadas.length > 0 && (
            <div>
              <h3>Áreas seleccionadas</h3>
              <ul>
                {seleccionadas.map((id) => {
                  const area = areas.find((a) => a.idArea === id);
                  return (
                    <li key={id}>
                      {area?.nombreArea} - Bs {formatCurrency(area?.precioArea)}
                    </li>
                  );
                })}
              </ul>
              <p><strong>Total:</strong> Bs {formatCurrency(totalCosto)}</p>
            </div>
          )}

          <ButtonPrimary onClick={handleGuardar}>Guardar Selección</ButtonPrimary>
        </div>
      )}
    </div>
  );
};

export default AsignarAreasForm;