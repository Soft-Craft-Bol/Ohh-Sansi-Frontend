import React, { useState } from "react";
import { useFormik } from 'formik';
import "./Step1Form.css";
import useFetchNivelesEscolares from "../../hooks/NivelEscolar/useFetchNivelesEscolares";
import useFetchDepartamentos from "../../hooks/departamento/useFetchDepartamentos";
import useFetchMunicipios from "../../hooks/departamento/useFetchMunicipios";
import useFetchColegio from "../../hooks/Colegio/useFetchColegio";
import inscripcionValidate from "../../schemas/InscripcionValidate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Step1Form = ({ setIsStepValid }) => {
  const { niveles, loading: loadingNiveles } = useFetchNivelesEscolares();
  const { departamentos, loading: loadingDepartamentos } = useFetchDepartamentos();
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const { municipios, loading: loadingMunicipios } = useFetchMunicipios(selectedDepartamento);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const { colegios, loading: loadingColegios } = useFetchColegio(selectedMunicipio);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      documento: "",
      fechaNacimiento: null,
      departamento: "",
      municipio: "",
      institucion: "",
      grado: "",
      email: "",
      telefono: ""
    },
    validationSchema: inscripcionValidate,
    onSubmit: values => {
      console.log("Datos del formulario:", values);
      alert("Formulario enviado correctamente");
    },
    validateOnChange: true,
    validateOnBlur: true
  });

  // Actualizar validación del paso
  React.useEffect(() => {
    setIsStepValid(formik.isValid);
  }, [formik.isValid]);

  // Manejar cambios en departamento y municipio
  const handleDepartamentoChange = (e) => {
    const value = e.target.value;
    setSelectedDepartamento(value);
    formik.setFieldValue('departamento', value);
    formik.setFieldValue('municipio', '');
    formik.setFieldValue('institucion', '');
  };

  const handleMunicipioChange = (e) => {
    const value = e.target.value;
    setSelectedMunicipio(value);
    formik.setFieldValue('municipio', value);
    formik.setFieldValue('institucion', '');
  };

  // Restricción de entrada para teléfono y documento
  const handleTelefonoChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    formik.setFieldValue('telefono', value);
  };

  const handleDocumentoChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    formik.setFieldValue('documento', value);
  };

  return (
    <div className="step1-container">
      <span className="step1-description">
        Ingrese los datos del participante (Paso 1 de 4)
      </span>
      <form onSubmit={formik.handleSubmit}>
        <div className="step1-grid">
      
          <div className="step1-card">
            <label>Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nombre del participante"
            />
            {formik.touched.nombre && formik.errors.nombre && (
              <div className="error-message">{formik.errors.nombre}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Apellido*</label>
            <input
              type="text"
              name="apellido"
              value={formik.values.apellido}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Apellido del participante"
            />
            {formik.touched.apellido && formik.errors.apellido && (
              <div className="error-message">{formik.errors.apellido}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Documento de identidad*</label>
            <input
              type="text"
              name="documento"
              value={formik.values.documento}
              onChange={handleDocumentoChange}
              onBlur={formik.handleBlur}
              placeholder="Número de identificación"
            />
            {formik.touched.documento && formik.errors.documento && (
              <div className="error-message">{formik.errors.documento}</div>
            )}
          </div>

          
          <div className="step1-card">
            <label>Fecha de nacimiento*</label>
            <DatePicker
              selected={formik.values.fechaNacimiento}
              onChange={(date) => formik.setFieldValue('fechaNacimiento', date)}
              onBlur={() => formik.setFieldTouched('fechaNacimiento', true)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              className="step1-datepicker"
              showYearDropdown
              dropdownMode="select"
              minDate={new Date(2007, 0, 1)}
              maxDate={new Date(2020, 11, 31)}
              yearDropdownItemNumber={14}
            />
            {formik.touched.fechaNacimiento && formik.errors.fechaNacimiento && (
              <div className="error-message">{formik.errors.fechaNacimiento}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Departamento*</label>
            <select
              className="select"
              name="departamento"
              value={formik.values.departamento}
              onChange={handleDepartamentoChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Seleccione un departamento</option>
              {loadingDepartamentos ? (
                <option>Cargando...</option>
              ) : departamentos.length === 0 ? (
                <option>No se encontraron departamentos</option>
              ) : (
                departamentos.map((departamento) => (
                  <option key={departamento.idDepartamento} value={departamento.idDepartamento}>
                    {departamento.nombreDepartamento}
                  </option>
                ))
              )}
            </select>
            {formik.touched.departamento && formik.errors.departamento && (
              <div className="error-message">{formik.errors.departamento}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Municipio*</label>
            <select
              className="select"
              name="municipio"
              value={formik.values.municipio}
              onChange={handleMunicipioChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.departamento}
            >
              <option value="">Seleccione un municipio</option>
              {loadingMunicipios ? (
                <option>Cargando...</option>
              ) : municipios.length === 0 ? (
                <option>No se encontraron municipios</option>
              ) : (
                municipios.map((municipio) => (
                  <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                    {municipio.nombreMunicipio}
                  </option>
                ))
              )}
            </select>
            {formik.touched.municipio && formik.errors.municipio && (
              <div className="error-message">{formik.errors.municipio}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Colegio/Institución*</label>
            <select
              className="select"
              name="institucion"
              value={formik.values.institucion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.municipio}
            >
              <option value="">Seleccione un colegio</option>
              {loadingColegios ? (
                <option>Cargando...</option>
              ) : colegios.length === 0 ? (
                <option>No se encontraron colegios</option>
              ) : (
                colegios.map((colegio) => (
                  <option key={colegio.idColegio} value={colegio.idColegio}>
                    {colegio.nombreColegio}-----{colegio.direccion}
                  </option>
                ))
              )}
            </select>
            {formik.touched.institucion && formik.errors.institucion && (
              <div className="error-message">{formik.errors.institucion}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Grado/Nivel*</label>
            <select
              className="select"
              name="grado"
              value={formik.values.grado}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Seleccione un grado</option>
              {loadingNiveles ? (
                <option>Cargando...</option>
              ) : niveles.length === 0 ? (
                <option>No se encontraron niveles</option>
              ) : (
                niveles.map((nivel) => (
                  <option key={nivel.idNivel} value={nivel.codigoNivel}>
                    {nivel.nombreNivelEscolar}
                  </option>
                ))
              )}
            </select>
            {formik.touched.grado && formik.errors.grado && (
              <div className="error-message">{formik.errors.grado}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="correo@ejemplo.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>

          <div className="step1-card">
            <label>Teléfono*</label>
            <input
              type="tel"
              name="telefono"
              value={formik.values.telefono}
              onChange={handleTelefonoChange}
              onBlur={formik.handleBlur}
              placeholder="Número de contacto"
            />
            {formik.touched.telefono && formik.errors.telefono && (
              <div className="error-message">{formik.errors.telefono}</div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step1Form;