import { useState, useEffect } from "react";
import "./Step3Form.css";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getAllTipoTutor, registerTutor } from "../../api/api";
import registerTutorValidationSchema from "../../schemas/registerTutorValidate";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import SelectInput from "../selected/SelectInput";

const Step3Form = () => {
  const [tipoTutores, setTipoTutores] = useState([]);
  const [tutoresLocales, setTutoresLocales] = useState([]);
  const [ciParticipante, setCiParticipante] = useState("");
  const MAX_TUTORES = 2;

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
      toast.error("Error al cargar tipos de tutor");
      setTipoTutores([]);
    }
  };

  const agregarTutor = (values, { resetForm }) => {
    if (tutoresLocales.length >= MAX_TUTORES) {
      toast.error(`Solo puede registrar un máximo de ${MAX_TUTORES} tutores`);
      return;
    }

    const existe = tutoresLocales.some((t) => t.carnetIdentidadTutor === values.carnetIdentidadTutor);

    if (existe) {
      toast.error("Ya existe un tutor con este número de documento");
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
    toast.success("Tutor agregado correctamente");
  };

  const eliminarTutor = (index) => {
    const nuevosTutores = [...tutoresLocales];
    nuevosTutores.splice(index, 1);
    setTutoresLocales(nuevosTutores);
    toast.success("Tutor eliminado");
  };

  const handleRegistrarTutores = async () => {
    if (!ciParticipante) {
      toast.error("Debe ingresar el CI del participante antes de registrar tutores");
      return;
    }

    if (tutoresLocales.length === 0) {
      toast.error("Debe agregar al menos un tutor antes de registrar");
      return;
    }

    try {
      await registerTutor(ciParticipante, tutoresLocales);
      toast.success("Tutores registrados correctamente");
      setTutoresLocales([]);
      setCiParticipante("");
    } catch (error) {
      console.error("Error al registrar los tutores:", error);
      toast.error("Error al registrar los tutores");
    }
  };

  return (
    <div className="step3-container">
      <h2 className="step3-title">Registro de Tutores</h2>
      <p className="step3-description">
        Registre uno o dos tutores para el participante. Máximo {MAX_TUTORES} tutores.
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
                    options={tipoTutores.map((tipo) => ({
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
                  />
                </div>

                <div className="step3-form-group">
                  <InputText
                    name="apellidosTutor"
                    label="Apellidos"
                    type="text"
                    placeholder="Apellidos del tutor"
                    required
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
                  />
                </div>

                <div className="step3-form-group">
                  <InputText
                    name="carnetIdentidadTutor"
                    label="N° de documento"
                    type="text"
                    placeholder="Documento del tutor"
                    required
                  />
                </div>

                <div className="step3-form-group">
                  <InputText
                    name="complementoCiTutor"
                    label="Complemento CI"
                    type="text"
                    placeholder="Complemento del documento"
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