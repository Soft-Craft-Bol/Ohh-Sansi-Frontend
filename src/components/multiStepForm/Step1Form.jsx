import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import SelectInput from "../selected/SelectInput";
import useFetchNivelesEscolares from "../../hooks/NivelEscolar/useFetchNivelesEscolares";
import useFetchDepartamentos from "../../hooks/departamento/useFetchDepartamentos";
import useFetchMunicipios from "../../hooks/departamento/useFetchMunicipios";
import useFetchColegio from "../../hooks/Colegio/useFetchColegio";
import "./Step1Form.css";

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es requerido")
    .min(2, "Mínimo 2 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
  
  apellido: Yup.string()
    .required("El apellido es requerido")
    .min(2, "Mínimo 2 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
  
  documento: Yup.string()
    .required("Documento es requerido")
    .matches(/^\d+$/, "Solo números")
    .min(6, "Mínimo 6 dígitos")
    .max(8, "Máximo 8 dígitos"),
  
  fechaNacimiento: Yup.date()
    .required("La fecha de nacimiento es requerida")
    .max(new Date(), "No puede ser fecha futura")
    .test("edad", "Debe tener entre 5 y 100 años", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 5 && age <= 100;
    }),
  
  departamento: Yup.string().required("El departamento es requerido"),
  
  municipio: Yup.string().when("departamento", {
    is: (val) => val && val.length > 0,
    then: Yup.string().required("Seleccione un municipio"),
  }),
  
  institucion: Yup.string().required("La institución es requerida"),
  
  grado: Yup.string().required("El grado es requerido"),
  
  email: Yup.string()
    .required("El correo electrónico es requerido")
    .email("Ingrese un email válido")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Correo electrónico inválido"
    )
    .test("valid-domain", "Dominio no permitido", (value) => {
      if (!value) return false;
      const validDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "edu.pe"];
      const [, domain] = value.split("@");
      return domain && validDomains.some(d => domain.endsWith(d));
    }),
  
  telefono: Yup.string()
    .required("El teléfono es requerido")
    .matches(/^\d{8}$/, "Debe tener exactamente 8 dígitos"),
});

const Step1Form = ({ onNext, formData = {}, setFormData }) => {
  const { niveles, loading: loadingNiveles } = useFetchNivelesEscolares();
  const { departamentos, loading: loadingDepartamentos } = useFetchDepartamentos();
  const [selectedDepartamento, setSelectedDepartamento] = React.useState(formData.departamento || "");
  const { municipios, loading: loadingMunicipios } = useFetchMunicipios(selectedDepartamento);
  const [selectedMunicipio, setSelectedMunicipio] = React.useState(formData.municipio || "");
  const { colegios, loading: loadingColegios } = useFetchColegio(selectedMunicipio);

  const initialFormData = {
    nombre: "",
    apellido: "",
    documento: "",
    fechaNacimiento: "",
    departamento: "",
    municipio: "",
    institucion: "",
    grado: "",
    email: "",
    telefono: "",
    ...formData,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setFormData({ ...formData, ...values });
    onNext();
    setSubmitting(false);
  };

  const handleNumericInput = (e, setFieldValue, fieldName, maxLength) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= maxLength) {
      setFieldValue(fieldName, value);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="step1-container">
          <span className="step1-description">
            Ingrese los datos del participante (Paso 1 de 5)
          </span>
          
          <div className="step1-grid">
            {/* Nombre */}
            <div className="field-container">
              <InputText
                label="Nombre"
                name="nombre"
                placeholder="Nombre del participante"
                required
                maxLength={50}
                value={values.nombre}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                  setFieldValue("nombre", value);
                }}
                showErrorMessage={false}
              />
              {errors.nombre && touched.nombre && (
                <div className="error-message">{errors.nombre}</div>
              )}
            </div>
            
            {/* Apellido */}
            <div className="field-container">
              <InputText
                label="Apellido"
                name="apellido"
                placeholder="Apellido del participante"
                required
                maxLength={50}
                value={values.apellido}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                  setFieldValue("apellido", value);
                }}
                showErrorMessage={false}
              />
              {errors.apellido && touched.apellido && (
                <div className="error-message">{errors.apellido}</div>
              )}
            </div>
            
            {/* Documento */}
            <div className="field-container">
              <InputText
                label="Documento de identidad"
                name="documento"
                placeholder="Número de identificación"
                required
                value={values.documento}
                onChange={(e) => handleNumericInput(e, setFieldValue, "documento", 8)}
                maxLength={8}
                showErrorMessage={false}
              />
              {errors.documento && touched.documento && (
                <div className="error-message">{errors.documento}</div>
              )}
            </div>
            
            {/* Fecha de Nacimiento */}
            <div className="field-container">
              <InputText
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
                required
                value={formatDate(values.fechaNacimiento)}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFieldValue("fechaNacimiento", e.target.value)}
                showErrorMessage={false}
              />
              {errors.fechaNacimiento && touched.fechaNacimiento && (
                <div className="error-message">{errors.fechaNacimiento}</div>
              )}
            </div>
            
            {/* Departamento */}
            <div className="field-container">
              <SelectInput
                label="Departamento"
                name="departamento"
                options={departamentos.map(d => ({
                  value: d.idDepartamento,
                  label: d.nombreDepartamento
                }))}
                loading={loadingDepartamentos}
                emptyMessage="No se encontraron departamentos"
                onChange={(e) => {
                  setFieldValue("departamento", e.target.value);
                  setFieldValue("municipio", "");
                  setSelectedDepartamento(e.target.value);
                }}
                required
                value={values.departamento}
              />
              {errors.departamento && touched.departamento && (
                <div className="error-message">{errors.departamento}</div>
              )}
            </div>
            
            {/* Municipio */}
            <div className="field-container">
              <SelectInput
                label="Municipio"
                name="municipio"
                options={municipios.map(m => ({
                  value: m.idMunicipio,
                  label: m.nombreMunicipio
                }))}
                loading={loadingMunicipios}
                emptyMessage="No se encontraron municipios"
                disabled={!values.departamento}
                onChange={(e) => {
                  setFieldValue("municipio", e.target.value);
                  setSelectedMunicipio(e.target.value);
                }}
                required
                value={values.municipio}
              />
              {errors.municipio && touched.municipio && (
                <div className="error-message">{errors.municipio}</div>
              )}
            </div>
            
            {/* Colegio/Institución */}
            <div className="field-container">
              <SelectInput
                label="Colegio/Institución"
                name="institucion"
                options={colegios.map(c => ({
                  value: c.idColegio,
                  label: `${c.nombreColegio} - ${c.direccion}`
                }))}
                loading={loadingColegios}
                emptyMessage="No se encontraron colegios"
                disabled={!values.municipio}
                required
                value={values.institucion}
                onChange={(e) => setFieldValue("institucion", e.target.value)}
              />
              {errors.institucion && touched.institucion && (
                <div className="error-message">{errors.institucion}</div>
              )}
            </div>
            
            {/* Grado/Nivel */}
            <div className="field-container">
              <SelectInput
                label="Grado/Nivel"
                name="grado"
                options={niveles.map(n => ({
                  value: n.codigoNivel,
                  label: n.nombreNivelEscolar
                }))}
                loading={loadingNiveles}
                emptyMessage="No se encontraron niveles"
                required
                value={values.grado}
                onChange={(e) => setFieldValue("grado", e.target.value)}
              />
              {errors.grado && touched.grado && (
                <div className="error-message">{errors.grado}</div>
              )}
            </div>
            
            {/* Email */}
            <div className="field-container">
              <InputText
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
                showErrorMessage={false}
              />
              {errors.email && touched.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
            
            {/* Teléfono */}
            <div className="field-container">
              <InputText
                label="Teléfono"
                name="telefono"
                type="tel"
                placeholder="Número de contacto (8 dígitos)"
                required
                value={values.telefono}
                onChange={(e) => handleNumericInput(e, setFieldValue, "telefono", 8)}
                maxLength={8}
                showErrorMessage={false}
              />
              {errors.telefono && touched.telefono && (
                <div className="error-message">{errors.telefono}</div>
              )}
            </div>
            
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step1Form;