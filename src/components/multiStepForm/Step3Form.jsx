import { useState, useEffect } from "react";
import "./Step3Form.css";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getAllTutor } from "../../api/api"; 
import registerTutorValidationSchema from "../../schemas/registerTutorValidate";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import SelectInput from "../selected/SelectInput";
import Swal from "sweetalert2";

const Step3Form = ({ onNext, onPrev, formData = {}, updateFormData }) => {
  const [tipoTutores, setTipoTutores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tutoresLocales, setTutoresLocales] = useState(formData.tutores || []);
  const MAX_TUTORES = 2;
  
  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = {
    idTipoTutor: "",
    emailTutor: "", 
    nombresTutor: "",
    apellidosTutor: "",
    telefono: "",
    carnetIdentidadTutor: "",
  };

  const fetchData = async () => {
    try {
      const response = await getAllTutor();
      const tipos = response.data?.tipoTutores || 
              response.data?.data?.tipoTutores || 
              response.data || 
              [];
      setTipoTutores(Array.isArray(tipos) ? tipos : []);
    } catch (error) {
      console.error("Error fetching tutor types:", error);
      toast.error("Error al cargar tipos de tutor");
      setTipoTutores([]);
    }
  };

  const agregarTutor = (tutor, { resetForm }) => {
    if (tutoresLocales.length >= MAX_TUTORES) {
      toast.error(`Solo puede registrar un máximo de ${MAX_TUTORES} tutores`);
      return;
    }

    // Verificar si ya existe un tutor con el mismo CI
    const existe = tutoresLocales.some(t => 
      t.carnetIdentidadTutor === tutor.carnetIdentidadTutor
    );
    
    if (existe) {
      toast.error("Ya existe un tutor con este número de documento");
      return;
    }

    // Buscar el nombre del tipo de tutor
    const tipoTutor = tipoTutores.find(t => t.idTipoTutor === Number(tutor.idTipoTutor));
    
    const nuevoTutor = {
      ...tutor,
      idTipoTutor: Number(tutor.idTipoTutor),
      tipoTutorNombre: tipoTutor?.nombreTipoTutor || "Sin tipo"
    };

    setTutoresLocales([...tutoresLocales, nuevoTutor]);
    resetForm();
    toast.success("Tutor agregado localmente");
    
    // Mostrar mensaje si se alcanza el límite
    if (tutoresLocales.length + 1 >= MAX_TUTORES) {
      toast.info(`Ha alcanzado el límite máximo de ${MAX_TUTORES} tutores`);
    }
  };

  const eliminarTutor = (index) => {
    const nuevosTutores = [...tutoresLocales];
    nuevosTutores.splice(index, 1);
    setTutoresLocales(nuevosTutores);
    toast.success("Tutor eliminado");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({ tutores: tutoresLocales });
    onNext();
  };

  return (
    <div className="step3-container">
      <h2 className="step3-title">Registro de Tutores</h2>
      <p className="step3-description">
        Agregue los tutores del participante (Paso 3 de 5) - Máximo {MAX_TUTORES}
      </p>
      
      <div className="step3-content">
        {/* Formulario para agregar nuevos tutores */}
        <div className="step3-form-container">
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
                    className="step3-select"
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

                <div className="step3-button-container">
                  <ButtonPrimary
                    type="submit"
                    buttonStyle="primary"
                    disabled={!formik.isValid || isSubmitting || tutoresLocales.length >= MAX_TUTORES}
                    onClick={() => {
                      if (!formik.isValid) {
                        Swal.fire({
                          icon: 'error',
                          title: 'Datos incompletos',
                          text: 'Por favor, complete todos los campos requeridos',
                          showConfirmButton: false,
                          timer: 2000,
                        });
                      }
                    }}
                  >
                    {tutoresLocales.length >= MAX_TUTORES ? 
                      'Límite alcanzado' : 
                      'Agregar Tutor'}
                  </ButtonPrimary>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Lista de tutores agregados */}
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

      {/* Botones de navegación */}
      <div className="step3-navigation">
        <ButtonPrimary 
          type="button"
          buttonStyle="secondary"
          onClick={onPrev}
        >
          Anterior
        </ButtonPrimary>
        <ButtonPrimary 
          type="button"
          buttonStyle="primary"
          onClick={handleSubmit}
          disabled={tutoresLocales.length === 0}
        >
          Siguiente
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Step3Form;