import { useState, useEffect } from "react";
import "./Step3Form.css";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { registerTutor, getTutorAsigando, parentescoTutor } from "../../api/api";
import registerTutorValidationSchema from "../../schemas/registerTutorValidate";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/WriteInputs/useDebounce";
import { verificarSerTutor, verificarTutor, verificarParticipante } from "../../hooks/loaderInfo/LoaderInfo";
import SelectInput from "../selected/SelectInput";

const Step3Only = () => {
  const [ciParticipante, setCiParticipante] = useState("");
  const [ciVerificado, setCiVerificado] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const debouncedCiParticipante = useDebounce(ciParticipante, 1000);
  const [parentescoOptions, setParentescoOptions] = useState([]);
  const [loadingParentesco, setLoadingParentesco] = useState(true);

  const initialValues = {
    idTipoTutor: 2,
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
        () => {
          setCiVerificado(true);
          cargarTutorExistente(debouncedCiParticipante);
          setMostrarFormulario(true);
        },
        () => {
          setCiVerificado(false);
        }
      );
    }
  }, [debouncedCiParticipante]);

  useEffect(() => {
    const fetchParentescos = async () => {
      setLoadingParentesco(true);
      try {
        const response = await parentescoTutor();
        if (response.data.tutorParentescos) {
          const filteredOptions = response.data.tutorParentescos
            .filter(parentesco => parentesco.parentesco !== "Profesor") //estamos en tutores Legales
            .map(p => ({
              value: p.idTutorParentesco.toString(),
              label: p.parentesco,
            }));
          setParentescoOptions(filteredOptions);
        } else {
          setParentescoOptions([]);
        }
      } catch (error) {
        console.error("Error al cargar los parentescos:", error);
        setParentescoOptions([]);
      } finally {
        setLoadingParentesco(false);
      }
    };

    fetchParentescos();
  }, []);

  const cargarTutorExistente = async (ci) => {
    try {
      const response = await getTutorAsigando(ci);
      if (response.data?.tutoresLegales?.length > 0) {
        Swal.fire({
          icon: "info",
          title: "El participante ya tiene tutor legal registrado",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setMostrarFormulario(false);
        setCiParticipante("");
      } else {
        setMostrarFormulario(true);
      }
    } catch (error) {
      console.error("Error al cargar tutor:", error);
    }
  };

  const handleRegistrarTutor = async (values, { resetForm }) => {
    try {
      const idTutorParentesco = values.idTutorParentesco;
      const tutorData = {
        idTipoTutor: values.idTipoTutor,
        emailTutor: values.emailTutor,
        nombresTutor: values.nombresTutor,
        apellidosTutor: values.apellidosTutor,
        telefono: values.telefono,
        carnetIdentidadTutor: values.carnetIdentidadTutor,
        complementoCiTutor: values.complementoCiTutor,
        fromBackend: false
      };

      const bodyForEndpoint = {
        idTutorParentesco: parseInt(idTutorParentesco,10),
        tutors: [tutorData]
      }

      await registerTutor(ciParticipante, bodyForEndpoint);
      Swal.fire({ icon: "success", title: "Éxito", text: "Tutor registrado correctamente" });
      resetForm();
      setMostrarFormulario(false);
      setCiParticipante("");
    } catch (error) {
      console.error("Error al registrar tutor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "No se pudo registrar el tutor",
      });
    }
  };

  return (
    <div className="step3-container page-padding">
      <h2 className="step3-title">Registro de Tutor Legal</h2>
      <p className="step3-description">Solo se permite registrar un tutor legal por participante.</p>

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
            setMostrarFormulario(false);
          }}
          required
          className="step3-form-group"
          maxLength={10}
        />
      </div>

      {mostrarFormulario && (
        <Formik
          initialValues={initialValues}
          validationSchema={registerTutorValidationSchema}
          onSubmit={handleRegistrarTutor}
          enableReinitialize
        >
          {({ values, setFieldValue, isValid }) => {
            const debouncedCI = useDebounce(values.carnetIdentidadTutor, 1000);

            useEffect(() => {
              if (debouncedCI && debouncedCI !== "completed") {
                let yaEncontrado = false;
                verificarTutor(debouncedCI, (data) => {
                  setFieldValue("nombresTutor", data.nombresTutor || "");
                  setFieldValue("apellidosTutor", data.apellidosTutor || "");
                  setFieldValue("emailTutor", data.emailTutor || "");
                  setFieldValue("telefono", data.telefono?.toString() || "");
                  setFieldValue("carnetIdentidadTutor", data.carnetIdentidadTutor?.toString() || "");
                  setFieldValue("complementoCiTutor", data.complementoCiTutor || "");
                  yaEncontrado = true;
                }, () => {
                  if (!yaEncontrado) {
                    verificarParticipante(debouncedCI, (data) => {
                      setFieldValue("nombresTutor", data.nombreParticipante || "");
                      setFieldValue("apellidosTutor", `${data.apellidoPaterno || ""} ${data.apellidoMaterno || ""}`.trim());
                      setFieldValue("emailTutor", data.emailParticipante || "");
                      setFieldValue("telefono", data.telefonoParticipante?.toString() || "");
                      setFieldValue("carnetIdentidadTutor", data.carnetIdentidadParticipante?.toString() || "");
                      setFieldValue("complementoCiTutor", data.complementoCiParticipante || "");
                    }, (msg) => console.error("Error como participante:", msg));
                  }
                });
              }
            }, [debouncedCI]);

            return (
              <div>
              <SelectInput
                label="Relación de parentesco con el participante "
                name="idTutorParentesco"
                options={parentescoOptions}
                loading={loadingParentesco}
                emptyMessage={"No hay parentescos disponibles"}
                required
                onChange={(e) => {
                  setFieldValue("idTutorParentesco", e.target.value);
                }}
              />
              <Form className="step3-grid">
                <div className="step3-form-group">
                  <InputText name="carnetIdentidadTutor" label="N° de documento del tutor" type="text" placeholder="Documento del tutor" required onlyNumbers maxLength={9} />
                </div>
                <div className="step3-form-group">
                  <InputText name="complementoCiTutor" label="Complemento CI" type="text" placeholder="Complemento del documento" maxLength={2} onlyAlphaNumeric />
                </div>
                <div className="step3-form-group">
                  <InputText name="nombresTutor" label="Nombres" type="text" placeholder="Nombres del tutor" required onlyLetters maxLength={50} />
                </div>
                <div className="step3-form-group">
                  <InputText name="apellidosTutor" label="Apellidos" type="text" placeholder="Apellidos del tutor" required onlyLetters maxLength={50} />
                </div>
                <div className="step3-form-group">
                  <InputText name="emailTutor" label="Correo electrónico" type="email" placeholder="Correo del tutor" required />
                </div>
                <div className="step3-form-group">
                  <InputText name="telefono" label="Teléfono" type="text" placeholder="Teléfono del tutor" required onlyNumbers maxLength={8} />
                </div>
                <div>
                </div>
                <div className="step3-finish">
                  <ButtonPrimary type="submit" buttonStyle="primary" disabled={!isValid}>
                    Registrar Tutor
                  </ButtonPrimary>
                </div>
              </Form>
              </div>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default Step3Only;
