import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Form, Formik } from "formik";
import BuscadorCodigo from "./../buscadorCodigo/BuscadorCodigo";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getCatalogoAreasCategorias, setCatalogoAreasParticipante } from "../../api/api";
import "./Step2Form.css";

const AsignarAreasForm = ({ participanteCI }) => {
  const [estudiante, setEstudiante] = useState(null);
  const [areas, setAreas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codigoIntroducido, setCodigoIntroducido] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (participanteCI && participanteCI.trim() !== "") {
      buscarEstudiante(participanteCI);
    }
  }, [participanteCI]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5 
      } 
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 11 && /^\d*$/.test(value)) {
      setCodigoIntroducido(value);
      setError("");
    } else if (value.length > 11) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El carnet no puede tener más de 11 dígitos'
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      buscarEstudiante(codigoIntroducido);
    }
  };

  const buscarEstudiante = async (carnet) => {
    if (!carnet || carnet.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese un número de carnet'
      });
      return;
    }
  
    const carnetNumerico = parseInt(carnet, 10);
    if (isNaN(carnetNumerico) || carnetNumerico > 2147483647) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El carnet debe ser un número válido dentro del rango permitido (-2,147,483,648 a 2,147,483,647)'
      });
      return;
    }
  
    setLoading(true);
    try {
      const resCatalogo = await getCatalogoAreasCategorias(carnetNumerico);
      console.log("Catálogo de áreas:", resCatalogo.data);
  
      if (resCatalogo.data.length === 0) {
        setEstudiante({ carnetIdentidadParticipante: carnetNumerico });
        setAreas([]);
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'No hay materias disponibles para el grado del participante.'
        });
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
  
      if (err.message === "Network Error") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error en la red, intenta más tarde'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || "No se encontró el estudiante o las áreas"
        });
      }
  
      setEstudiante(null);
      setAreas([]);
      setError(err.message || "No se encontró el estudiante o las áreas");
    } finally {
      setLoading(false);
    }
  };

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      if (prev.length >= 2) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Máximo 2 áreas permitidas'
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleGuardar = async () => {
    if (!estudiante || seleccionadas.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar al menos un área'
      });
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
      await setCatalogoAreasParticipante(estudiante.carnetIdentidadParticipante, dataToSend);
  
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Áreas asignadas correctamente'
      });
      setEstudiante(null);
      setSeleccionadas([]);
      setAreas([]);
      setCodigoIntroducido("");
    } catch (e) {
      console.error("Error al asignar las áreas:", e);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al asignar las áreas'
      });
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
    <motion.div 
      className="step2-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2>Asignar Áreas al Estudiante</h2>

      <div className="step2-carnet-container">
        <BuscadorCodigo
          descripcion="Ingrese el carnet del estudiante para buscar áreas disponibles"
          placeholder="Ej: 123456789"
          codigoIntroducidoTexto="Carnet introducido:"
          codigoIntroducido={codigoIntroducido}
          onInputChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onSearch={() => buscarEstudiante(codigoIntroducido)}
          //error={error}
          containerVariants={containerVariants}
        />
      </div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="loading-indicator"
        >
          Cargando...
        </motion.div>
      )}

      {estudiante && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>Seleccione hasta 2 áreas:</span>

          <motion.div 
            className="step2-grid"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {areas.map((area) => (
              <motion.div
                key={area.idArea}
                className={`step2-card ${seleccionadas.includes(area.idArea) ? "selected" : ""}`}
                onClick={() => toggleSeleccion(area.idArea)}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.div>
            ))}
          </motion.div>

          {seleccionadas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Áreas seleccionadas</h3>
              <motion.ul variants={listVariants} initial="hidden" animate="visible">
                {seleccionadas.map((id) => {
                  const area = areas.find((a) => a.idArea === id);
                  return (
                    <motion.li key={id} variants={itemVariants}>
                      {area?.nombreArea} - Bs {formatCurrency(area?.precioArea)}
                    </motion.li>
                  );
                })}
              </motion.ul>
              <p><strong>Total:</strong> Bs {formatCurrency(totalCosto)}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ButtonPrimary onClick={handleGuardar}>Guardar Selección</ButtonPrimary>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AsignarAreasForm;