import { useState, useEffect } from "react";
import "./Step3Form.css";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import {registerTutor, getTutorAsigando } from "../../api/api";
import registerTutorValidationSchema from "../../schemas/registerTutorValidate";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/WriteInputs/useDebounce";
import { verificarSerTutor, verificarTutor, verificarParticipante } from "../../hooks/loaderInfo/LoaderInfo";

const Step3Form = () => {
  const [tutoresLocales, setTutoresLocales] = useState([]);
  const [ciParticipante, setCiParticipante] = useState("");
  let debouncedCiParticipante = useDebounce(ciParticipante, 1000);
  const [ciVerificado, setCiVerificado] = useState(false);

  const MAX_TUTORES = 1; 

  const initialValues = {
    idTipoTutor: 2, //constant for Legal
    emailTutor: "",
    nombresTutor: "",
    apellidosTutor: "",
    telefono: "",
    carnetIdentidadTutor: "",
    complementoCiTutor: "",
  };

  useEffect(() => {
    if (debouncedCiParticipante.length >= 5 && !ciVerificado) {
      verificarSerTutor(
        debouncedCiParticipante,
        (data) => {
          setCiVerificado(true);
          cargarTutoresExistentes(debouncedCiParticipante);
        },
        () => {
          setCiVerificado(false);
          setTutoresLocales([]);
        }
      );
    }
  }, [debouncedCiParticipante]);

  const agregarTutor = (values, { resetForm }) => {
    if (tutoresLocales.length >= MAX_TUTORES) {
      Swal.fire({
        icon: 'error',
        title: "Error",
        text: `Solo puede registrar ${MAX_TUTORES} tutor legal`
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
      fromBackend: false //es uno nuevo local
    };
  
    setTutoresLocales([...tutoresLocales, nuevoTutor]);
    resetForm();
  
    Swal.fire({
      icon: 'success',
      title: "Éxito",
      text: "Tutor agregado correctamente",
      timer:2000
    });
  };
  
  const eliminarTutor = (index) => {
    const nuevosTutores = [...tutoresLocales];
    nuevosTutores.splice(index, 1);
    setTutoresLocales(nuevosTutores);
    Swal.fire({icon:'success',
      title:"Éxito",
      text:"Tutor eliminado",
      timer:2000})
  };

  const handleRegistrarTutores = async () => {
    if (!ciParticipante) {
      Swal.fire({icon:'error',
        title:"Error",
        text:"Debe ingresar el CI del participante antes de registrar tutores"});
      return;
    }

    if (tutoresLocales.length === 0) {
      Swal.fire({icon:'error',
        title:'Error',
        text:"Debe agregar al menos un tutor antes de registrar"});
      return;
    }

    //Filtro solo tutores nuevos
  const nuevosTutores = tutoresLocales.filter(tutor => tutor.fromBackend === false);
  if (nuevosTutores.length === 0) {
    Swal.fire({
      icon: 'info',
      title: "Sin cambios",
      text: "No hay nuevos tutores para registrar.",
      timer: 2500
    });
    return;
  }

    try {
      await registerTutor(ciParticipante, nuevosTutores);
      Swal.fire({icon:'success',title:"Éxito",text:"Tutores registrados correctamente"});
      setTutoresLocales([]);
      setCiParticipante("");
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

  const cargarTutoresExistentes = async (ci) => {
    try {
      const response = await getTutorAsigando(ci);
      if (response.data?.tutoresLegales?.length > 0) {
        // Mapeado a los datos locales
        const tutoresExistentes = response.data.tutoresLegales.map((tutor) => ({
          emailTutor: tutor.correoTut,
          nombresTutor: tutor.nombreTut,
          apellidosTutor: tutor.apellidoTut,
          telefono: tutor.telf.toString(),
          carnetIdentidadTutor: tutor.ciTut.toString(),
          complementoCiTutor: tutor.complemento || "",
          fromBackend: true
        }));
        
        setTutoresLocales(tutoresExistentes);
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
          title: "Se han cargado sus tutores ya asignados"
        });
      } else {
        setTutoresLocales([]);
      }
    } catch (error) {
      console.error("Error al cargar tutores existentes:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los tutores anteriores.' });
    }
  };
  

  return (
    <div className="step3-container page-padding">
      <h2 className="step3-title">Registro de Tutores Legales</h2>
      <p className="step3-description">
        Registre solamente {MAX_TUTORES} tutor a un participante.
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
              }}
              required
              className="step3-input"
              maxLength={10}
            />
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={registerTutorValidationSchema}
            onSubmit={agregarTutor}
            enableReinitialize
          >
            {({ values, setFieldValue, isValid, isSubmitting }) => {
              let debouncedCI = useDebounce(values.carnetIdentidadTutor, 1000); // Aquí haces debounce al documento

              useEffect(() => {
                if (debouncedCI && debouncedCI !== "completed") {
                  // Primero intenta buscar como Tutor
                  let yaEncontrado;
                  verificarTutor(debouncedCI, (data) => {
                    setFieldValue("nombresTutor", data.nombresTutor || "");
                    setFieldValue("apellidosTutor", data.apellidosTutor || "");
                    setFieldValue("emailTutor", data.emailTutor || "");
                    setFieldValue("telefono", data.telefono?.toString() || "");
                    setFieldValue("carnetIdentidadTutor", data.carnetIdentidadTutor?.toString() || "");
                    setFieldValue("complementoCiTutor", data.complementoCiTutor || "");
              
                    debouncedCI = "completed";
                    yaEncontrado = true;
                  }, async (errorMsg) => {
                    console.warn("No se encontró como tutor, intentando como participante...");
              
                    // recien busca en los Participantes
                    if(!yaEncontrado) {
                      verificarParticipante(debouncedCI, (data) => {
                        setFieldValue("nombresTutor", data.nombreParticipante || "");
                        setFieldValue(
                          "apellidosTutor",
                          `${data.apellidoPaterno || ""} ${data.apellidoMaterno || ""}`.trim()
                        );
                        setFieldValue("emailTutor", data.emailParticipante || "");
                        setFieldValue("telefono", data.telefonoParticipante?.toString() || "");
                        setFieldValue("carnetIdentidadTutor", data.carnetIdentidadParticipante?.toString() || "");
                        setFieldValue("complementoCiTutor", data.complementoCiParticipante || "");
              
                        debouncedCI = "completed";
                      }, (msg) => {
                        console.error("Error como participante:", msg);
                      });
                    }
                  });
                }
              }, [debouncedCI, setFieldValue]);

              return (
                <Form className="step3-form">
                  <div className="step3-form-group">
                    <InputText
                      name="carnetIdentidadTutor"
                      label="N° de documento del tutor"
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
                      disabled={!isValid || tutoresLocales.length >= MAX_TUTORES}
                    >
                      {tutoresLocales.length >= MAX_TUTORES ? "Límite alcanzado" : "Agregar Tutor"}
                    </ButtonPrimary>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <div className="step3-tutores-list">
          <h3>Tutores Actuales ({tutoresLocales.length}/{MAX_TUTORES})</h3>

          {tutoresLocales.length === 0 ? (
            <p className="no-tutores-message">No hay tutores agregados aún</p>
          ) : (
            <ul className="tutores-container">
              {tutoresLocales.map((tutor, index) => (
                <li key={index} className="tutor-card">
                  <div className="tutor-info">
                    <p><strong>Nombre:</strong> {tutor.nombresTutor} {tutor.apellidosTutor}</p>
                    <p><strong>Email:</strong> {tutor.emailTutor}</p>
                    <p><strong>Teléfono:</strong> {tutor.telefono}</p>
                    <p><strong>Documento:</strong> {tutor.carnetIdentidadTutor}</p>
                    <p><strong>Complemento CI:</strong> {tutor.complementoCiTutor || "N/A"}</p>
                  </div>
                  {!tutor.fromBackend && (
                    <button
                    type="button"
                    className="remove-tutor-btn"
                    onClick={() => eliminarTutor(index)}
                  >
                    × Eliminar
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
          disabled={tutoresLocales.length === 0}
        >
          Registrar Tutores
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Step3Form;