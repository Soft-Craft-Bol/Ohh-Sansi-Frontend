import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Form, Formik } from "formik";
import BuscadorCodigo from "./../buscadorCodigo/BuscadorCodigo";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getCatalogoAreasCategorias, setCatalogoAreasParticipante, getEstudenteByCi } from "../../api/api";
import "./Step2Form.css";

const AsignarAreasForm = ({ participanteCI, shouldSearch, onSearchComplete, onComplete, autoNavigate }) => {
  const [estudiante, setEstudiante] = useState(null);
  const [areas, setAreas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codigoIntroducido, setCodigoIntroducido] = useState("");
  const [areasAsignadas, setAreasAsignadas] = useState([]);
  const [error, setError] = useState("");
  const [dataEstudiante, setDataEstudiante] = useState(null);

  const carnet = estudiante ? estudiante.carnetIdentidadParticipante : null;
  useEffect(() => {
    const fetchEstudiante = async (carnet) => {
      try {

        const res = await getEstudenteByCi(carnet);
        console.log("Respuesta de estudiante:", res.data);
        if (res.data) {
          setDataEstudiante(res.data);
          setCodigoIntroducido(res.data.carnetIdentidadParticipante.toString());
        } else {
          setDataEstudiante(null);
        }
      } catch (error) {
        console.error("Error fetching estudiante:", error);
        setDataEstudiante(null);
      }
    }
    fetchEstudiante(carnet);
  }, [carnet]);

  useEffect(() => {
    console.log("Participante CI:", participanteCI);
    if (participanteCI && participanteCI.trim() !== "") {
      if (shouldSearch) {
        buscarEstudiante(participanteCI);
        //onSearchComplete(); // Notificar que la búsqueda se completó
      }
    }
  }, [participanteCI, shouldSearch, onSearchComplete]);

  useEffect(() => {
    if (autoNavigate && seleccionadas.length > 0) {
      // Esperar un momento para que el usuario vea el mensaje de éxito
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoNavigate, seleccionadas, onComplete]);

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
    if (/^\d*$/.test(value)) {
      if (value.length <= 11) {
        setCodigoIntroducido(value);
        setError("");
      } else {
        setError("El carnet no puede tener más de 11 dígitos");
        // Cortar el valor a 11 dígitos
        setCodigoIntroducido(value.slice(0, 11));
      }
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
        text: 'El carnet debe ser un número válido'
      });
      return;
    }

    setLoading(true);
    try {
      // Obtener áreas disponibles y estado de asignación
      const resCatalogo = await getCatalogoAreasCategorias(carnetNumerico);

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

      // Procesar áreas asignadas
      const asignadas = resCatalogo.data
        .filter(item => item.asignada)
        .map(item => item.id_area);

      setAreasAsignadas(asignadas);
      setSeleccionadas(asignadas); // Marcamos como seleccionadas las áreas ya asignadas

      // Preparar datos para mostrar
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
        yaAsignada: item.asignada // Nuevo campo para saber si ya está asignada
      }));

      setEstudiante({ carnetIdentidadParticipante: carnetNumerico });
      setAreas(combined);

      // Mostrar mensaje si ya tiene áreas asignadas
      if (asignadas.length > 0) {
        Swal.fire({
          icon: 'info',
          title: 'Áreas ya asignadas',
          text: `Se encontró ${asignadas.length} área${asignadas.length !== 1 ? 's' : ''} previamente asignada${asignadas.length !== 1 ? 's' : ''}. ${asignadas.length < 2 ? 'Puede agregar otra área' : 'Límite de áreas alcanzado'}`,
          timer: 6000
        });
      }
    } catch (err) {
      console.error("Error buscando áreas:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || "Error al buscar áreas"
      });
      setEstudiante(null);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeleccion = (id) => {
    // No permitir deseleccionar áreas ya asignadas
    if (areasAsignadas.includes(id)) return;

    setSeleccionadas((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      if (prev.length >= 2) {
        Swal.fire({
          icon: 'error',
          title: 'Límite',
          text: 'Solo puedes seleccionar hasta 2 áreas'
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleGuardar = async () => {
    const hayCambios = seleccionadas.some(id => !areasAsignadas.includes(id)) ||
      areasAsignadas.some(id => !seleccionadas.includes(id));

    if (!hayCambios) {
      Swal.fire({
        icon: 'info',
        title: 'Sin cambios',
        text: 'No se han realizado cambios en las áreas asignadas'
      });
      return;
    }

    if (!estudiante || seleccionadas.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar al menos un área'
      });
      return;
    }

    try {
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
      }).then(() => {
        onComplete(); // Llamar a la función de completar el paso
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
        text: e.response?.data?.message || 'Error al asignar las áreas'
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


  const renderAreaCard = (area) => {
    const estaSeleccionada = seleccionadas.includes(area.idArea);
    const yaAsignada = areasAsignadas.includes(area.idArea);

    return (
      <motion.div
        key={area.idArea}
        className={`step2-card ${estaSeleccionada ? "selected" : ""} ${yaAsignada ? "asignada" : ""}`}
        onClick={() => !yaAsignada && toggleSeleccion(area.idArea)}
        variants={itemVariants}
        whileHover={{ scale: yaAsignada ? 1 : 1.02 }}
        whileTap={{ scale: yaAsignada ? 1 : 0.98 }}
      >
        <div className="area-header">
          <input
            type="checkbox"
            checked={estaSeleccionada}
            readOnly
            className="area-checkbox"
          />
          <h3 className="area-title">
            {area.nombreArea}
            {yaAsignada && <span className="badge-asignada">Asignada</span>}
          </h3>
          <span className="categoria-tag">{area.categoria.nombre}</span>
        </div>
        <p className="area-descripcion">{area.descripcionArea}</p>
        <p className="costo">Bs {formatCurrency(area.precioArea)}</p>
      </motion.div>
    );
  };

  const handleClearCI = () => {
    setCodigoIntroducido("");
    setEstudiante(null);
    setAreas([]);
    setSeleccionadas([]);
    setAreasAsignadas([]);
    setDataEstudiante(null);
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
          onInputChange={(e) => setCodigoIntroducido(e.target.value)}
          onKeyPress={handleKeyPress}
          onSearch={() => buscarEstudiante(codigoIntroducido)}
          onClear={handleClearCI}
          containerVariants={containerVariants}
          allowLetters={false}
          maxLength={11}
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

      {dataEstudiante && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="step2-datos-estudiante"
        >
          <h3>Datos del Estudiante</h3>
          <p><strong>Nombre:</strong> {dataEstudiante.nombreParticipante} {dataEstudiante.apellidoPaterno} {dataEstudiante.apellidoMaterno}</p>
          <p><strong>CI:</strong> {dataEstudiante.carnetIdentidadParticipante}</p>
          <p><strong>Grado:</strong> {dataEstudiante.nombreGrado}</p>
        </motion.div>
      )}


      {estudiante && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="step2-instructions">
            {areasAsignadas.length > 0 ? (
              <p>
                <strong>Áreas asignadas:</strong> {areasAsignadas.length}/2.
                {areasAsignadas.length < 2 ? ' Puede agregar otra área.' : ' Límite alcanzado.'}
              </p>
            ) : (
              <p>Seleccione hasta 2 áreas</p>
            )}

          </div>


          <motion.div className="step2-grid" variants={listVariants} initial="hidden" animate="visible">
            {areas.map(renderAreaCard)}
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
            <ButtonPrimary
              onClick={handleGuardar}
              disabled={seleccionadas.length === 0 || (areasAsignadas.length === 2 && seleccionadas.length === areasAsignadas.length)}
            >
              Guardar Selección
            </ButtonPrimary>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AsignarAreasForm;