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
import inscripcionSchema from "../../schemas/InscripcionValidate";
import "./Step1Form.css";

const Step1Form = ({ formData, updateFormData, onNext}) => {
  const { niveles, loading: loadingNiveles } = useFetchNivelesEscolares();
  const { departamentos, loading: loadingDepartamentos } = useFetchDepartamentos();
  const [selectedDepartamento, setSelectedDepartamento] = React.useState(formData.participante.idDepartamento || "");
  const { municipios, loading: loadingMunicipios } = useFetchMunicipios(selectedDepartamento);
  const [selectedMunicipio, setSelectedMunicipio] = React.useState(formData.participante.idMunicipio || "");
  const { colegios, loading: loadingColegios } = useFetchColegio(selectedMunicipio);

  const initialFormData = {
    nombre: formData.participante?.nombreParticipante || "",
    apellido: `${formData.participante?.apellidoPaterno || ""} ${formData.participante?.apellidoMaterno || ""}`.trim(),
    documento: formData.participante?.carnetIdentidadParticipante || "",
    fechaNacimiento: formData.participante?.fechaNacimiento || "",
    departamento: formData.participante?.idDepartamento?.toString() || "",
    municipio: formData.participante?.idMunicipio?.toString() || "",
    institucion: formData.participante?.idColegio?.toString() || "",
    grado: formData.participante?.idNivelGradoEscolar?.toString() || "",
    email: formData.participante?.correoElectronicoParticipante || "",
    telefono: ""
  };

  const handleSubmit = (values) => {
    updateFormData({
      participante: {
        ...formData.participante,
        nombreParticipante: values.nombre,
        apellidoPaterno: values.apellido.split(' ')[0] || '',
        apellidoMaterno: values.apellido.split(' ')[1] || '',
        carnetIdentidadParticipante: values.documento,
        fechaNacimiento: values.fechaNacimiento,
        idDepartamento: values.departamento ? parseInt(values.departamento) : null,
        idMunicipio: values.municipio ? parseInt(values.municipio) : null,
        idColegio: values.institucion ? parseInt(values.institucion) : null,
        idNivelGradoEscolar: values.grado ? parseInt(values.grado) : null,
        correoElectronicoParticipante: values.email || null
      }
    });
    onNext();
  };

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={inscripcionSchema}
      onSubmit={handleSubmit}
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ values, setFieldValue, isValid, isSubmitting }) => (
        <Form className="step1-container">
          <span className="step1-description">
            Ingrese los datos del participante (Paso 1 de 5)
          </span>

          <div className="step1-grid">
            {/* Campos del formulario */}
            <div className="field-container">
              <InputText
                label="Nombre"
                name="nombre"
                placeholder="Nombre del participante"
                required
              />
            </div>

            <div className="field-container">
              <InputText
                label="Apellido"
                name="apellido"
                placeholder="Apellido del participante"
                required
              />
            </div>

            <div className="field-container">
              <InputText
                label="Documento de identidad"
                name="documento"
                placeholder="Número de identificación"
                required
              />
            </div>

            <div className="field-container">
              <InputText
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
                required
              />
            </div>

            <div className="field-container">
              <SelectInput
                label="Departamento"
                name="departamento"
                options={departamentos.map(d => ({
                  value: d.idDepartamento.toString(),
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
              />
            </div>

            <div className="field-container">
              <SelectInput
                label="Municipio"
                name="municipio"
                options={municipios.map(m => ({
                  value: m.idMunicipio.toString(),
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
              />
            </div>

            <div className="field-container">
              <SelectInput
                label="Colegio/Institución"
                name="institucion"
                options={colegios.map(c => ({
                  value: c.idColegio.toString(),
                  label: `${c.nombreColegio} - ${c.direccion}`
                }))}
                loading={loadingColegios}
                emptyMessage="No se encontraron colegios"
                disabled={!values.municipio}
                required
              />
            </div>

            <div className="field-container">
              <SelectInput
                label="Grado/Nivel"
                name="grado"
                options={niveles.map(n => ({
                  value: n.idNivel.toString(),
                  label: n.nombreNivelEscolar
                }))}
                loading={loadingNiveles}
                emptyMessage="No se encontraron niveles"
                required
              />
            </div>

            <div className="field-container">
              <InputText
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="field-container">
              <InputText
                label="Teléfono"
                name="telefono"
                type="tel"
                placeholder="Número de contacto"
                required
              />
            </div>

            <div className="field-container full-width">
              <div className="step1-actions">
                <ButtonPrimary
                  type="submit"
                  buttonStyle="primary"
                  disabled={!isValid || isSubmitting}
                >
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