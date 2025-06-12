import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputText from "../inputs/InputText";
import {verificarParticipante} from "../../hooks/loaderInfo/LoaderInfo";
import SelectInput from "../selected/SelectInput";
import useFetchGrados from "../../hooks/NivelEscolar/useFetchGrados";
import useFetchDepartamentos from "../../hooks/departamento/useFetchDepartamentos";
import useFetchMunicipios from "../../hooks/departamento/useFetchMunicipios";
import useFetchColegio from "../../hooks/Colegio/useFetchColegio";
import inscripcionSchema from "../../schemas/InscripcionValidate";
import { registerParticipante } from "../../api/api";
import Swal from "sweetalert2";
import "./Step1Form.css";
import DisabledButton from "../button/DisabledButton";
import useDebounce from "../../hooks/WriteInputs/useDebounce";
import { HiEnvelope, HiIdentification } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import { MdPhoneAndroid } from "react-icons/md";

const Step1Form = () => {
  const today = new Date().toISOString().split("T")[0];
  const { grados, loading: loadingGrados } = useFetchGrados();
  const { departamentos, loading: loadingDepartamentos } = useFetchDepartamentos();
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const { municipios, loading: loadingMunicipios } = useFetchMunicipios(selectedDepartamento);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const { colegios, loading: loadingColegios } = useFetchColegio(selectedMunicipio);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const handleSubmit = async (values, resetForm) => {
    if (isSubmittingForm) return;
  
    setIsSubmittingForm(true);
    setLoadingOverlay(true);
  
    Swal.fire({
      title: 'Registrando participante...',
      text: 'Por favor, espere...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const fechaNacimiento = new Date(values.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      const tutorRequerido = edad < 15;
  
      const participanteData = {
        idDepartamento: parseInt(values.departamento),
        idMunicipio: parseInt(values.municipio),
        idColegio: parseInt(values.institucion),
        idGrado: parseInt(values.grado),
        participanteHash: "hash1asd23131",
        nombreParticipante: values.nombre,
        apellidoPaterno: values.apellido.split(" ")[0] || "",
        apellidoMaterno: values.apellido.split(" ")[1] || "",
        fechaNacimiento: values.fechaNacimiento,
        carnetIdentidadParticipante: parseInt(values.documento),
        complementoCiParticipante: values.complemento || null,
        emailParticipante: values.email || null,
        tutorRequerido,
      };
      const response = await registerParticipante(participanteData); 

      if (response?.data?.existe) {
        Swal.fire({
          icon: "error",
          title: "Participante ya registrado",
          text: "Ya existe un registro con ese documento de identidad.",
          confirmButtonText: "Aceptar",
        });
        onParticipanteExistente(values.documento);
        onComplete();
        return;
        
      }

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "¡Formulario guardado!",
        text: "La información fue completada correctamente.",
        confirmButtonText: "Continuar",
        
      }).then(() => {
        resetForm();
      });
  
    } catch (error) {
      console.error("Error al registrar participante:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: error.response?.data?.message || "Ocurrió un error inesperado",
        confirmButtonText: "Cerrar",
      });
    } finally {
      setLoadingOverlay(false);
      setIsSubmittingForm(false);
    }
  };  

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !isSubmittingForm) {
        const submitButton = document.querySelector("button[type='submit']");
        if (submitButton) {
          submitButton.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSubmittingForm]);


  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const form = document.querySelector("form");
      const inputs = form.querySelectorAll("input, select");
      let hasData = false;

      inputs.forEach((input) => {
        if (input.value && input.value.trim() !== "") {
          hasData = true;
        }
      });

      if (hasData) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="in-form-container">
      {loadingOverlay && <div className="overlay"></div>}
      <h1>Registro de Participante</h1>
      <span className="form-description">Ingrese los datos del participante</span>

      <Formik
        //initialValues={loadSavedData()} perdon queria hacer pruebas UnU
        initialValues={{
          nombre: "",
          apellido: "",
          documento: "",
          complemento: "",
          fechaNacimiento: "",
          departamento: "",
          municipio: "",
          institucion: "",
          grado: "",
          email: "",
          telefono: "",}}
        validationSchema={inscripcionSchema}
        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        validateOnBlur={false}
        validateOnChange={true}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => {
          let debouncedCI = useDebounce(values.documento, 1000);

          useEffect(() => {
            if (debouncedCI && debouncedCI !== "completed" ) {
              verificarParticipante(debouncedCI, (data) => {
                setFieldValue("nombre", data.nombreParticipante || "");
                setFieldValue("apellido", `${data.apellidoPaterno || ""} ${data.apellidoMaterno || ""}`.trim());
                setFieldValue("fechaNacimiento", data.fechaNacimiento ? data.fechaNacimiento.split("T")[0] : ""); // formatear fecha
                setFieldValue("documento", data.carnetIdentidadParticipante || "");
                setFieldValue("complemento", data.complementoCiParticipante || "");
                setFieldValue("email", data.emailParticipante || "");
                
                setFieldValue("departamento", data.idDepartamento?.toString() || "");
                setFieldValue("municipio", data.idMunicipio?.toString() || "");
                setFieldValue("institucion", data.idColegio?.toString() || "");
                setFieldValue("grado", data.idGrado?.toString() || "");
                debouncedCI = "completed";  //para evitar se repita NO FUNCIONA
              }, (msg) => {
                console.error("Error:", msg);
              });
            }
          }, [debouncedCI, setFieldValue]);

          return (
          <Form className="step1-grid">
            <div className="field-container">
              <InputText name="documento" label="Documento de Identidad" required onlyNumbers maxLength={9} placeholder="Ej: 12354987"icon={HiIdentification} />
            </div>

            <div className="field-container">
              <InputText name="complemento" label="Complemento" maxLength={2} onlyAlphaNumeric placeholder="Ej: 1T" />
            </div>
            <div className="field-container">
              <InputText name="nombre" label="Nombre" required onlyLetters={true} maxLength={50} placeholder="Ej: Edwin" icon={FaUser}
              />
            </div>
            <div className="field-container">
              <InputText name="apellido" label="Apellido" required onlyLetters maxLength={50} placeholder="Ej: Sánchez Velarde" icon={FaUser}
              />
            </div>
            <div className="field-container">
              <InputText name="fechaNacimiento" label="Fecha de nacimiento" type="date" required max={today} />
            </div>
            <div className="field-container">
              <SelectInput
                label="Departamento"
                name="departamento"
                options={departamentos.map(d => ({
                  value: d.idDepartamento.toString(),
                  label: d.nombreDepartamento,
                }))}
                loading={loadingDepartamentos}
                emptyMessage="No se encontraron departamentos"
                onChange={(e) => {
                  setFieldValue("departamento", e.target.value);
                  setFieldValue("municipio", "");
                  setSelectedDepartamento(e.target.value);
                }}
                required
              />
            </div>
            <div className="field-container">
              <SelectInput
                label="Municipio"
                name="municipio"
                options={municipios.map(m => ({
                  value: m.idMunicipio.toString(),
                  label: m.nombreMunicipio,
                }))}
                loading={loadingMunicipios}
                emptyMessage="No se encontraron municipios"
                disabled={!values.departamento}
                onChange={(e) => {
                  setFieldValue("municipio", e.target.value);
                  setSelectedMunicipio(e.target.value);
                }}
                required
              />
            </div>
            <div className="field-container">
              <SelectInput
                label="Colegio/Institución"
                name="institucion"
                options={colegios.map(c => ({
                  value: c.idColegio.toString(),
                  label: `${c.nombreColegio} - ${c.direccion}`,
                }))}
                loading={loadingColegios}
                emptyMessage="No se encontraron colegios"
                disabled={!values.municipio}
                required
              />
            </div>
            <div className="field-container">
              <SelectInput
                label="Grado escolar"
                name="grado"
                options={grados.map(n => ({
                  value: n.idGrado.toString(),
                  label: n.nombreGrado
                }))}
                loading={loadingGrados}
                emptyMessage="No se encontraron niveles"
                required
              />
            </div>
            <div className="field-container">
              <InputText name="email" label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required icon={HiEnvelope}/>
            </div>
            <div className="field-container">
              <InputText name="telefono" label="Teléfono" required onlyNumbers maxLength={8} placeholder="Ej: 67559758" icon={MdPhoneAndroid} />
            </div>
            <div className="field-container full-width">
              <div className="form-actions">
                <DisabledButton
                  isValid={isValid}
                  isSubmitting={isSubmitting}
                  validationMessage="Por favor, complete todos los campos requeridos"
                >
                  Registrar Participante
                </DisabledButton>
              </div>
            </div>
          </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Step1Form;
