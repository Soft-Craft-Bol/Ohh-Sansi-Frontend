import { useState, useEffect } from "react";
import "./Step3Form.css";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getAllTipoTutor, registerTutor } from "../../api/api";
import registerTutorValidationSchema from "../../schemas/registerTutorValidate";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import SelectInput from "../selected/SelectInput";

const Step3Form = () => {
  const [tipoTutores, setTipoTutores] = useState([]);
  const [tutoresLocales, setTutoresLocales] = useState([]);
  const [ciParticipante, setCiParticipante] = useState("");
  const MAX_TUTORES = 3;
  const LIMITE_POR_TIPO = {
    LEGAL: 1,
    ACADEMICO: 2
  };
  

  const initialValues = {
    idTipoTutor: "",
    emailTutor: "",
    nombresTutor: "",
    apellidosTutor: "",
    telefono: "",
    carnetIdentidadTutor: "",
    complementoCiTutor: "",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllTipoTutor();
      const tipos = response.data?.tipoTutores || response.data?.data?.tipoTutores || response.data || [];
      setTipoTutores(Array.isArray(tipos) ? tipos : []);
    } catch (error) {
      console.error("Error fetching tutor types:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar los tipos de tutores",
        confirmButtonText: "Aceptar",
      });
      setTipoTutores([]);
    }
  };

  const agregarTutor = (values, { resetForm }) => {
    if (tutoresLocales.length >= MAX_TUTORES) {
      Swal.fire({icon:'error',
        title: "error",
        text:`Solo puede registrar un máximo de ${MAX_TUTORES} tutores`});
      return;
    }

    const existe = tutoresLocales.some((t) => t.carnetIdentidadTutor === values.carnetIdentidadTutor);

    if (existe) {
      Swal.fire({icon:'error',
        title:"Error",
        text:"Ya existe un tutor con este número de documento"});
      return;
    }

    const tipoTutor = tipoTutores.find((t) => t.idTipoTutor === Number(values.idTipoTutor));

    const nuevoTutor = {
      ...values,
      idTipoTutor: Number(values.idTipoTutor),
      tipoTutorNombre: tipoTutor?.nombreTipoTutor || "Sin tipo",
    };

    setTutoresLocales([...tutoresLocales, nuevoTutor]);
    resetForm();
    Swal.fire({icon:'success',
      title:"Éxito",
      text:"Tutor agregado correctamente"});
  };

  const eliminarTutor = (index) => {
    const nuevosTutores = [...tutoresLocales];
    nuevosTutores.splice(index, 1);
    setTutoresLocales(nuevosTutores);
    Swal.fire({icon:'success',
      title:"Éxito",
      text:"Tutor eliminado"});
  };
  const getTipoTutorDisponible = () => {
    const counts = {};
  
    tutoresLocales.forEach((t) => {
      const tipo = t.tipoTutorNombre?.toUpperCase();
      counts[tipo] = (counts[tipo] || 0) + 1;
    });
  
    return tipoTutores.filter((tipo) => {
      const tipoNombre = tipo.nombreTipoTutor?.toUpperCase();
      const limite = LIMITE_POR_TIPO[tipoNombre];
      const actual = counts[tipoNombre] || 0;
      return limite ? actual < limite : true;
    });
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

    try {
      await registerTutor(ciParticipante, tutoresLocales);
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

  return (
    <div className="step3-container page-padding">
      <h2 className="step3-title">Registro de Tutores</h2>
      <p className="step3-description">
        Registre uno o {MAX_TUTORES} tutores para el participante. Máximo {MAX_TUTORES} tutores.
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
              onChange={(e) => setCiParticipante(e.target.value)}
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
            {(formik) => (
              <Form className="step3-form">
                <div className="step3-form-group">
                  <SelectInput
                    label="Tipo de Tutor"
                    name="idTipoTutor"
                    options={getTipoTutorDisponible().map((tipo) => ({
                      value: tipo.idTipoTutor,
                      label: tipo.nombreTipoTutor,
                    }))}
                    
                    value={formik.values.idTipoTutor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="select"
                    required
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

                <div className="step3-button-container">
                  <ButtonPrimary
                    type="submit"
                    buttonStyle="primary"
                    disabled={!formik.isValid || tutoresLocales.length >= MAX_TUTORES}
                  >
                    {tutoresLocales.length >= MAX_TUTORES ? "Límite alcanzado" : "Agregar Tutor"}
                  </ButtonPrimary>
                </div>
              </Form>
            )}
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
                    <h4>{tutor.tipoTutorNombre}</h4>
                    <p><strong>Nombre:</strong> {tutor.nombresTutor} {tutor.apellidosTutor}</p>
                    <p><strong>Email:</strong> {tutor.emailTutor}</p>
                    <p><strong>Teléfono:</strong> {tutor.telefono}</p>
                    <p><strong>Documento:</strong> {tutor.carnetIdentidadTutor}</p>
                    <p><strong>Complemento CI:</strong> {tutor.complementoCiTutor || "N/A"}</p>
                  </div>
                  <button
                    type="button"
                    className="remove-tutor-btn"
                    onClick={() => eliminarTutor(index)}
                  >
                    × Eliminar
                  </button>
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