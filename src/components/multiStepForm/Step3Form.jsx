import { useState, useEffect } from "react";
import "./Step3Form.css";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import { getAllTutor, registerTutor } from "../../api/api"; 
import registerTutorValidationSchema from "../../schemas/registerTutorValidate";
import { Formik, Form } from "formik";
import { toast } from "sonner";

const Step3Form = ({ onNextStep }) => { 
  const [tipoTutores, setTipoTutores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const tutorData = {
        idTipoTutor: Number(values.idTipoTutor),
        emailTutor: values.emailTutor,
        nombresTutor: values.nombresTutor,
        apellidosTutor: values.apellidosTutor,
        telefono: values.telefono,
        carnetIdentidadTutor: values.carnetIdentidadTutor,
      };

      const response = await registerTutor(tutorData);
      
      toast.success("Tutor registrado exitosamente");
      resetForm();
      
      // Si es parte de un wizard, pasar al siguiente paso
      if (onNextStep) onNextStep();
      
    } catch (error) {
      console.error("Error registering tutor:", error);
      toast.error(error.response?.data?.message || "Error al registrar tutor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step3-container">
      <h2 className="step3-title">Asignación de Tutores</h2>
      <p className="step3-description">
        Complete la información de los tutores (Paso 3 de 5)
      </p>
      
      <Formik
        initialValues={initialValues}
        validationSchema={registerTutorValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="step3-form">
            {/* Campo para seleccionar tipo de tutor */}
            <div className="step3-form-group">
              <label>Tipo de Tutor*</label>
              <select
                name="idTipoTutor"
                value={formik.values.idTipoTutor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="step3-select"
              >
                <option value="">Seleccione un tipo</option>
                {tipoTutores.map((tipo) => (
                  <option key={tipo.idTipoTutor} value={tipo.idTipoTutor}>
                    {tipo.nombreTipoTutor}
                  </option>
                ))}
              </select>
              {formik.touched.idTipoTutor && formik.errors.idTipoTutor && (
                <div className="error-message">{formik.errors.idTipoTutor}</div>
              )}
            </div>

            <div className="step3-form-group">
              <InputText
                name="nombresTutor"
                label="Nombres del profesor o tutor*"
                type="text"
                placeholder="Ingrese el nombre del tutor"
                value={formik.values.nombresTutor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nombresTutor && formik.errors.nombresTutor}
              />
            </div>

            <div className="step3-form-group">
              <InputText
                name="apellidosTutor"
                label="Apellidos del profesor o tutor*"
                type="text"
                placeholder="Ingrese el apellido del tutor"
                value={formik.values.apellidosTutor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.apellidosTutor && formik.errors.apellidosTutor}
              />
            </div>

            <div className="step3-form-group">
              <InputText
                name="emailTutor"
                label="Correo electrónico del profesor o tutor*"
                type="email"
                placeholder="Ingrese el correo electrónico del tutor"
                value={formik.values.emailTutor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailTutor && formik.errors.emailTutor}
              />
            </div>

            <div className="step3-form-group">
              <InputText
                name="telefono"
                label="Teléfono del profesor o tutor*"
                type="text"
                placeholder="Ingrese el número telefónico del tutor"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.telefono && formik.errors.telefono}
              />
            </div>

            <div className="step3-form-group">
              <InputText
                name="carnetIdentidadTutor"
                label="Número de documento del profesor o tutor*"
                type="text"
                placeholder="Ingrese el número de documento del tutor"
                value={formik.values.carnetIdentidadTutor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.carnetIdentidadTutor && formik.errors.carnetIdentidadTutor}
              />
            </div>

            <div className="step3-button-container">
              <ButtonPrimary
                type="submit"
                buttonStyle="primary"
                disabled={!formik.isValid || isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Continuar a áreas de competencia'}
              </ButtonPrimary>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step3Form;