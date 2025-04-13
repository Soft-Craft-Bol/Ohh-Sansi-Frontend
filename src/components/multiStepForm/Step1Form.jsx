import React, { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import SelectInput from "../selected/SelectInput";
import useFetchGrados from "../../hooks/NivelEscolar/useFetchGrados";
import useFetchDepartamentos from "../../hooks/departamento/useFetchDepartamentos";
import useFetchMunicipios from "../../hooks/departamento/useFetchMunicipios";
import useFetchColegio from "../../hooks/Colegio/useFetchColegio";
import inscripcionSchema from "../../schemas/InscripcionValidate";
import { useNavigate } from "react-router-dom";
import { registerParticipante } from "../../api/api";
import Swal from "sweetalert2";
import "./Step1Form.css";
import DisabledButton from "../button/DisabledButton";


const Step1Form = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const { grados, loading: loadingGrados} = useFetchGrados();
  const { departamentos, loading: loadingDepartamentos } = useFetchDepartamentos();
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const { municipios, loading: loadingMunicipios } = useFetchMunicipios(selectedDepartamento);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const { colegios, loading: loadingColegios } = useFetchColegio(selectedMunicipio);


  const loadSavedData = () => {
    const savedData = localStorage.getItem("participanteFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
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
          telefono: "",
        };
  };

  const handleSubmit = async (values) => {
    try {
      localStorage.setItem("participanteFormData", JSON.stringify(values));

      const fechaNacimiento = new Date(values.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear(); // Cambiado a let
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--; // Ahora es válido porque edad es mutable
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
  
      if (response && response.data && response.data.existe) {
        toast.error("El participante ya está registrado con ese documento.");
        return;
      }
  
      toast.success("Participante registrado exitosamente");
      Swal.fire({
        icon: "success",
        title: "¡Formulario guardado!",
        text: "La información fue completada correctamente.",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/areas-competencia");
      });
    } catch (error) {
      console.error("Error al registrar participante:", error);
      toast.error(
        error.response?.data?.message || "Error al registrar participante"
      );
    }
  };

  return (
    <div className="form-container">
      <h1>Registro de Participante</h1>
      <span className="form-description">Ingrese los datos del participante</span>

      <Formik
        initialValues={loadSavedData()}
        validationSchema={inscripcionSchema}
        onSubmit={handleSubmit}
        validateOnBlur={true}
        validateOnChange={true}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form className="step1-grid">
            {/* Campos */}
            <div className="field-container">
              <InputText name="nombre" label="Nombre" required onlyLetters={true} maxLength={50} placeholder="Ej: Edwin" 
              />
            </div>
            <div className="field-container">
              <InputText name="apellido" label="Apellido" required onlyLetters maxLength={50} placeholder="Ej: Sánchez Velarde"
               />
            </div>
            <div className="field-container">
              <InputText name="documento" label="Documento de Identidad" required onlyNumbers maxLength={10} placeholder="Ej: 12354987"/>
            </div>
            <div className="field-container">
              <InputText name="complemento" label="Complemento"  maxLength={2}  onlyAlphaNumeric placeholder="Ej: 1T"/>
            </div>
            <div className="field-container">
              <InputText name="fechaNacimiento" label="Fecha de nacimiento" type="date" required max={today}/>
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
              <InputText name="email" label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required />
            </div>
            <div className="field-container">
              <InputText name="telefono" label="Teléfono" required onlyNumbers maxLength={8} placeholder="Ej: 67559758"/>
            </div>

            {/* Botón */}
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
        )}
      </Formik>
    </div>
  );
};

export default Step1Form;
