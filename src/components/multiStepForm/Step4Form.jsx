import { useState, useEffect } from "react";
import "./Step3Form.css";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { registerTutorAcademico, getParticipantesWithAreas } from "../../api/api";
import registerTutorValidationSchema from "../../schemas/registerTutorValidate";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/WriteInputs/useDebounce";
import { verificarTutor } from "../../hooks/loaderInfo/LoaderInfo";
import SelectInputStandalone from "../selected/SelectInputSecundary";

const Step4Form = () => {
  const [tutoresLocales, setTutoresLocales] = useState([]);
  const [ciParticipante, setCiParticipante] = useState("");
  const [selectedAreas, setSelectedAreas] = useState({});
  let debouncedCiParticipante = useDebounce(ciParticipante, 1000);
  const [ciVerificado, setCiVerificado] = useState(false);
  const [participanteData, setParticipanteData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para obtener el máximo de tutores según las áreas disponibles
  const getMaxTutores = () => {
    return participanteData ? participanteData.idsAreas.length : 0;
  };

  const initialValues = {
    idTipoTutor: 1, // Académico
    emailTutor: "",
    nombresTutor: "",
    apellidosTutor: "",
    telefono: "",
    carnetIdentidadTutor: "",
    complementoCiTutor: "",
  };

  useEffect(() => {
    if (debouncedCiParticipante.length >= 5 && !ciVerificado) {
      const timer = setTimeout(async () => {
        setLoading(true);
        try {
          const response = await getParticipantesWithAreas(debouncedCiParticipante);
          if (response.data) {
            setParticipanteData(response.data);
            
            const tutoresExistentes = response.data.areasTutores
              .filter(areaTutor => areaTutor.nombresTutor || areaTutor.apellidosTutor || areaTutor.emailTutor || areaTutor.telefono)
              .map(areaTutor => ({
                emailTutor: areaTutor.emailTutor || "No especificado",
                nombresTutor: areaTutor.nombresTutor || "Tutor asignado",
                apellidosTutor: areaTutor.apellidosTutor || "",
                telefono: areaTutor.telefono?.toString() || "No especificado",
                carnetIdentidadTutor: areaTutor.carnetIdentidadTutor?.toString() || "No especificado",
                complementoCiTutor: areaTutor.complementoCiTutor || "",
                idArea: areaTutor.idArea,
                nombreArea: areaTutor.nombreArea,
                fromBackend: true,
                tutorAsignado: true
              }));

            setTutoresLocales(tutoresExistentes);

            const selecciones = {};
            tutoresExistentes.forEach((tutor, index) => {
              if (tutor.idArea) {
                selecciones[index] = tutor.idArea;
              }
            });
            setSelectedAreas(selecciones);

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Datos del participante cargados"
            });
          } else {
            setParticipanteData(null);
            setTutoresLocales([]);
            Swal.fire({
              icon: 'warning',
              title: 'Atención',
              text: 'No se encontró el participante.',
            });
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
          setParticipanteData(null);
          setTutoresLocales([]);
          setCiVerificado(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los datos del participante.'
          });
        } finally {
          setLoading(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [debouncedCiParticipante]);

  const agregarTutor = (values, { resetForm }) => {
    const maxTutores = getMaxTutores();
    if (tutoresLocales.length >= maxTutores) {
      Swal.fire({
        icon: 'error',
        title: "Error",
        text: `Solo puede registrar un máximo de ${maxTutores} ${maxTutores === 1 ? 'tutor' : 'tutores'} académico${maxTutores === 1 ? '' : 's'}`
      });
      return;
    }

    const existe = tutoresLocales.some((t) => t.carnetIdentidadTutor === values.carnetIdentidadTutor);

    if (existe) {
      Swal.fire({
        icon: 'error',
        title: "Error",
        text: "Ya existe un tutor con este número de documento"
      });
      return;
    }

    const nuevoTutor = {
      ...values,
      fromBackend: false,
      tutorAsignado: false
    };

    setTutoresLocales([...tutoresLocales, nuevoTutor]);
    resetForm();

    Swal.fire({
      icon: 'success',
      title: "Éxito",
      text: "Tutor académico agregado correctamente",
      timer: 2000
    });
  };

  const eliminarTutor = (index) => {
    if (tutoresLocales[index].tutorAsignado) {
      Swal.fire({
        icon: 'error',
        title: "Error",
        text: "No puede eliminar un tutor ya asignado"
      });
      return;
    }

    const nuevosTutores = [...tutoresLocales];
    nuevosTutores.splice(index, 1);
    setTutoresLocales(nuevosTutores);

    const nuevasSelecciones = { ...selectedAreas };
    delete nuevasSelecciones[index];
    setSelectedAreas(nuevasSelecciones);

    Swal.fire({
      icon: 'success',
      title: "Éxito",
      text: "Tutor eliminado",
      timer: 2000
    });
  };

  const handleSelectArea = (tutorIndex, areaId) => {
    const areaYaAsignada = Object.values(selectedAreas).some(
      (area, index) => area === areaId && index !== tutorIndex
    );

    if (areaYaAsignada) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Esta área ya está asignada a otro tutor'
      });
      return;
    }

    setSelectedAreas(prev => ({
      ...prev,
      [tutorIndex]: areaId
    }));
  };

  const handleRegistrarTutores = async () => {
    if (!ciParticipante) {
      Swal.fire({
        icon: 'error',
        title: "Error",
        text: "Debe ingresar el CI del participante antes de registrar tutores"
      });
      return;
    }

    if (!participanteData || participanteData.idsAreas.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "El participante no tiene áreas asignadas"
      });
      return;
    }

    if (tutoresLocales.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Debe agregar al menos un tutor antes de registrar"
      });
      return;
    }

    const tutoresSinArea = tutoresLocales.filter((_, index) => !selectedAreas[index] && !tutoresLocales[index].tutorAsignado);
    if (tutoresSinArea.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los tutores académicos nuevos deben tener un área asignada'
      });
      return;
    }

    const areasAsignadas = Object.values(selectedAreas);
    const areasUnicas = new Set(areasAsignadas);
    if (areasAsignadas.length !== areasUnicas.size) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No puede asignar la misma área a múltiples tutores'
      });
      return;
    }

    try {
      for (const [index, tutor] of tutoresLocales.entries()) {
        if (!tutor.fromBackend) {
          const idArea = selectedAreas[index];
          
          const tutorData = {
            carnetIdentidadTutor: tutor.carnetIdentidadTutor,
            complementoCiTutor: tutor.complementoCiTutor,
            nombresTutor: tutor.nombresTutor,
            apellidosTutor: tutor.apellidosTutor,
            emailTutor: tutor.emailTutor,
            telefono: tutor.telefono
          };

          await registerTutorAcademico(ciParticipante, idArea, tutorData);
        }
      }

      Swal.fire({
        icon: 'success',
        title: "Éxito",
        text: "Tutores académicos registrados correctamente"
      });

      const response = await getParticipantesWithAreas(ciParticipante);
      if (response.data) {
        setParticipanteData(response.data);
        const tutoresActualizados = response.data.areasTutores
          .filter(areaTutor => areaTutor.idTutor !== null)
          .map(areaTutor => ({
            emailTutor: areaTutor.emailTutor,
            nombresTutor: areaTutor.nombresTutor,
            apellidosTutor: areaTutor.apellidosTutor,
            telefono: areaTutor.telefono?.toString(),
            carnetIdentidadTutor: areaTutor.idTutor?.toString(),
            complementoCiTutor: areaTutor.complementoCiTutor || "",
            idArea: areaTutor.idArea,
            nombreArea: areaTutor.nombreArea,
            fromBackend: true,
            tutorAsignado: true
          }));

        setTutoresLocales(tutoresActualizados);
        setSelectedAreas({});
      }
    } catch (error) {
      console.error("Error al registrar los tutores:", error);
      const errorMessage = error?.response?.data?.message || "Error al registrar los tutores";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage
      });
    }
  };

  return (
    <div className="step3-container page-padding">
      <h2 className="step3-title">Registro de Profesores</h2>
      <p className="step3-description">
        Registre un máximo de {getMaxTutores()} {getMaxTutores() === 1 ? 'tutor académico' : 'tutores académicos'} a un participante.
      </p>

      <div className="step3-content">
        <div className="step3-form-container">
          <div className="step3-form-group">
            <label className="ci-participante" htmlFor="ciParticipante">CI del Participante</label>
            <input
              id="ciParticipante"
              name="ciParticipante"
              type="text"
              placeholder="Ingrese el CI del participante"
              value={ciParticipante}
              onChange={(e) => {
                setCiParticipante(e.target.value);
                setCiVerificado(false);
                setParticipanteData(null);
                setSelectedAreas({});
              }}
              required
              className="step3-input"
              maxLength={10}
              disabled={loading}
            />
            {loading && <div className="loading-indicator">Cargando datos...</div>}
          </div>

          {participanteData && (
            <div className="participante-info-container">
              <h4>Datos del Participante</h4>
              <p><strong>Nombre:</strong> {participanteData.nombreCompleto}</p>
              <p><strong>CI:</strong> {participanteData.carnetIdentidad}</p>
              <p><strong>Grado:</strong> {participanteData.grado}</p>
              <div className="areas-list">
                <h5>Áreas de participación:</h5>
                <ul>
                  {participanteData.nombresAreas.map((area, index) => (
                    <li key={participanteData.idsAreas[index]}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={registerTutorValidationSchema}
            onSubmit={agregarTutor}
            enableReinitialize
          >
            {({ values, setFieldValue, isValid, isSubmitting }) => {
              let debouncedCI = useDebounce(values.carnetIdentidadTutor, 1000);

              useEffect(() => {
                if (debouncedCI && debouncedCI !== "completed") {
                  verificarTutor(debouncedCI, (data) => {
                    setFieldValue("nombresTutor", data.nombresTutor || "");
                    setFieldValue("apellidosTutor", data.apellidosTutor || "");
                    setFieldValue("emailTutor", data.emailTutor || "");
                    setFieldValue("telefono", data.telefono?.toString() || "");
                    setFieldValue("carnetIdentidadTutor", data.carnetIdentidadTutor?.toString() || "");
                    setFieldValue("complementoCiTutor", data.complementoCiTutor || "");

                    debouncedCI = "completed";
                  }, (errorMsg) => {
                    console.warn("No se encontró como tutor:", errorMsg);
                  });
                }
              }, [debouncedCI, setFieldValue]);

              return (
                <Form className="step3-form">
                  <div className="step3-form-group">
                    <InputText
                      name="carnetIdentidadTutor"
                      label="N° de documento"
                      type="text"
                      placeholder="Documento del tutor"
                      required
                      onlyNumbers
                      maxLength={9}
                    />
                  </div>

                  <div className="step3-form-group">
                    <InputText
                      name="complementoCiTutor"
                      label="Complemento CI"
                      type="text"
                      placeholder="Complemento del documento"
                      maxLength={2}
                      onlyAlphaNumeric
                    />
                  </div>

                  <div className="step3-form-group">
                    <InputText
                      name="nombresTutor"
                      label="Nombres"
                      type="text"
                      placeholder="Nombres del tutor"
                      required
                      onlyLetters={true}
                      maxLength={50}
                    />
                  </div>

                  <div className="step3-form-group">
                    <InputText
                      name="apellidosTutor"
                      label="Apellidos"
                      type="text"
                      placeholder="Apellidos del tutor"
                      required
                      onlyLetters={true}
                      maxLength={50}
                    />
                  </div>

                  <div className="step3-form-group">
                    <InputText
                      name="emailTutor"
                      label="Correo electrónico"
                      type="email"
                      placeholder="Correo del tutor"
                      required
                    />
                  </div>

                  <div className="step3-form-group">
                    <InputText
                      name="telefono"
                      label="Teléfono"
                      type="text"
                      placeholder="Teléfono del tutor"
                      required
                      onlyNumbers
                      maxLength={8}
                    />
                  </div>

                  <div className="step3-button-container">
                    <ButtonPrimary
                      type="submit"
                      buttonStyle="primary"
                      disabled={!isValid || tutoresLocales.length >= getMaxTutores()}
                    >
                      {tutoresLocales.length >= getMaxTutores() ? 
                        `Límite de ${getMaxTutores()} ${getMaxTutores() === 1 ? 'tutor' : 'tutores'} alcanzado` : 
                        "Agregar Tutor"}
                    </ButtonPrimary>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <div className="step3-tutores-list">
          <h3>Profesores Actuales ({tutoresLocales.length}/{getMaxTutores()})</h3>

          {tutoresLocales.length === 0 ? (
            <p className="no-tutores-message">No hay tutores agregados aún</p>
          ) : (
            <ul className="tutores-container">
              {tutoresLocales.map((tutor, index) => (
                <li key={index} className={`tutor-card ${tutor.tutorAsignado ? 'tutor-asignado' : ''}`}>
                  <div className="tutor-info">
                    <p><strong>Nombre:</strong> {tutor.nombresTutor} {tutor.apellidosTutor}</p>
                    <p><strong>Email:</strong> {tutor.emailTutor}</p>
                    <p><strong>Teléfono:</strong> {tutor.telefono}</p>
                    <p><strong>Documento:</strong> {tutor.carnetIdentidadTutor}</p>
                    <p><strong>Complemento CI:</strong> {tutor.complementoCiTutor || "N/A"}</p>

                    <div className="area-selector-container">
                      <label>Área asignada:</label>
                      {tutor.tutorAsignado ? (
                        <div className="area-asignada">
                          <strong>{tutor.nombreArea}</strong>
                          <span className="badge-asignado">Asignado</span>
                          {!tutor.nombresTutor && (
                            <p className="info-tutor">Información del tutor no disponible</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <SelectInputStandalone
                            name={`area-tutor-${index}`}
                            value={selectedAreas[index] || ""}
                            onChange={(e) => handleSelectArea(index, e.target.value)}
                            options={participanteData?.areasTutores
                              ?.filter(areaTutor => areaTutor.idTutor === null)
                              .map(areaTutor => ({
                                value: areaTutor.idArea,
                                label: areaTutor.nombreArea
                              })) || []}
                            emptyMessage="No hay áreas disponibles"
                            required
                          />
                          {selectedAreas[index] && (
                            <span className="area-seleccionada">
                              {participanteData?.areasTutores?.find(
                                a => a.idArea === selectedAreas[index]
                              )?.nombreArea}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {!tutor.tutorAsignado && (
                    <button
                      type="button"
                      className="remove-tutor-btn"
                      onClick={() => eliminarTutor(index)}
                    >
                      × Cancelar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="step3-navigation">
        <ButtonPrimary
          type="button"
          buttonStyle="primary"
          onClick={handleRegistrarTutores}
          disabled={tutoresLocales.length === 0 ||
            (tutoresLocales.every(t => t.tutorAsignado) &&
              tutoresLocales.length === getMaxTutores())}
        >
          {tutoresLocales.length === getMaxTutores() ?
            "Todos los tutores están asignados" : "Registrar Tutores Académicos"}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Step4Form;