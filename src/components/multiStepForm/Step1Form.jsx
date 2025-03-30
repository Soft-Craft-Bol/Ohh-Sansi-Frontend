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
  nombre: Yup.string().required("El nombre es requerido"),
  apellido: Yup.string().required("El apellido es requerido"),
  documento: Yup.string(),
  fechaNacimiento: Yup.date(),
  departamento: Yup.string(),
  municipio: Yup.string().when("departamento", {
    is: (val) => val && val.length > 0,
    then: Yup.string().required("Seleccione un municipio"),
  }),
  institucion: Yup.string().required("La institución es requerida"),
  grado: Yup.string().required("El grado es requerido"),
  email: Yup.string().email("Ingrese un email válido"),
  telefono: Yup.string(),
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
    ...formData, // Sobrescribe con los valores de formData si existen
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setFormData({ ...formData, ...values });
    onNext();
    setSubmitting(false);
  };

 // ... (imports y validación permanecen iguales)

return (
    <Formik
      initialValues={initialFormData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
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
              />
            </div>
            
            {/* Apellido */}
            <div className="field-container">
              <InputText
                label="Apellido"
                name="apellido"
                placeholder="Apellido del participante"
                required
              />
            </div>
            
            {/* Documento */}
            <div className="field-container">
              <InputText
                label="Documento de identidad"
                name="documento"
                placeholder="Número de identificación"
              />
            </div>
            
            {/* Fecha de Nacimiento */}
            <div className="field-container">
              <InputText
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
              />
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
              />
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
              />
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
              />
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
              />
            </div>
            
            {/* Email */}
            <div className="field-container">
              <InputText
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>
            
            {/* Teléfono */}
            <div className="field-container">
              <InputText
                label="Teléfono"
                name="telefono"
                type="tel"
                placeholder="Número de contacto"
              />
            </div>
            
            {/* Botón - Ocupa ancho completo */}
            <div className="field-container full-width">
              <div className="form-actions">
                <ButtonPrimary type="submit" buttonStyle="primary">
                  Siguiente
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step1Form;