import React, { useState } from "react";
import "./Step1Form.css";
import useFetchNivelesEscolares from "../../hooks/NivelEscolar/useFetchNivelesEscolares";
import useFetchDepartamentos from "../../hooks/departamento/useFetchDepartamentos";
import useFetchMunicipios from "../../hooks/departamento/useFetchMunicipios";
import useFetchColegio from "../../hooks/Colegio/useFetchColegio";

const Step1Form = ({ setIsStepValid }) => {
  const [formData, setFormData] = useState({
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
  });

  const { niveles, loading } = useFetchNivelesEscolares();
  const { departamentos, loadingDepartamentos } = useFetchDepartamentos();
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const { municipios, loadingMunicipios } = useFetchMunicipios(selectedDepartamento);
  const [ selectedMunicipio, setSelectedMunicipio] = useState(null);
  const { colegios, loadingColegios } = useFetchColegio(selectedMunicipio);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value }; // ← esto es clave
    setFormData(updatedData);
  
    if (name === "departamento") {
      setSelectedDepartamento(value);
    }
    if (name === "municipio") {
      setSelectedMunicipio(value);
    }
  
    const camposObligatorios = ["nombre", "apellido", "colegio", "grado"];
    const esValido = camposObligatorios.every((campo) => updatedData[campo]?.trim() !== "");
    setIsStepValid(esValido); // ← activa el botón "Siguiente"
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert("Formulario enviado correctamente");
  };

  return (
    <div className="step1-container">
      <span className="step1-description">
        Ingrese los datos del participante (Paso 1 de 4)
      </span>
        <div className="step1-grid">
          <div className="step1-card">
            <label>Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del participante"
            />
          </div>
          <div className="step1-card">
            <label>Apellido*</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido del participante"
            />
          </div>
          <div className="step1-card">
            <label>Documento de identidad</label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="Número de identificación"
            />
          </div>
          <div className="step1-card">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </div>
          <div className="step1-card">
            <label>Departamento</label>
            <select className="select" name="departamento" value={formData.departamento} onChange={handleChange}>
              <option value="">Seleccione un departamento</option>
              {loading ? (
                <option>Cargando...</option>
              ) : departamentos.length === 0 ? (
                <option>No se encontraron departamentos</option>
              ) : (
                departamentos.map((departamento) => (
                  <option key={departamento.idDepartamento} value={departamento.idDepartamento} >
                    {departamento.nombreDepartamento}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="step1-card">
            <label>Municipio</label>
            <select
              className="select"
              name="municipio"
              value={formData.municipio}
              onChange={handleChange}
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
          </div>
          <div className="step1-card">
            <label>Colegio/Institución*</label>
            <select
              className="select"
              name="colegio"
              value={formData.colegio}
              onChange={handleChange}
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
          </div>
          <div className="step1-card">
            <label>Grado/Nivel*</label>
            <select className="select" name="grado" value={formData.grado} onChange={handleChange}>
              <option value="">Seleccione un grado</option>
              {loading ? (
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
          </div>

          <div className="step1-card">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="step1-card">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Número de contacto"
            />
          </div>

        </div>
    </div>
  );
};

export default Step1Form;