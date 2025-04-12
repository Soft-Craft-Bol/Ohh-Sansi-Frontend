import React, { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import SelectInput from "../selected/SelectInput";
import useFetchNivelesEscolares from "../../hooks/NivelEscolar/useFetchNivelesEscolares";
import useFetchDepartamentos from "../../hooks/departamento/useFetchDepartamentos";
import useFetchMunicipios from "../../hooks/departamento/useFetchMunicipios";
import useFetchColegio from "../../hooks/Colegio/useFetchColegio";
import inscripcionSchema from "../../schemas/InscripcionValidate";
import { useNavigate } from "react-router-dom";
import { registerParticipante } from "../../api/api";
import Swal from "sweetalert2";
import "./Step1Form.css";

const Step1Form = () => {
  const navigate = useNavigate();
  const { niveles, loading: loadingNiveles } = useFetchNivelesEscolares();
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

      const participanteData = {
        idInscripcion: 60,
        nombreParticipante: values.nombre,
        apellidoPaterno: values.apellido.split(" ")[0] || "",
        apellidoMaterno: values.apellido.split(" ")[1] || "",
        carnetIdentidadParticipante: values.documento,
        fechaNacimiento: values.fechaNacimiento,
        complemento: values.complemento,
        idDepartamento: parseInt(values.departamento),
        idMunicipio: parseInt(values.municipio),
        idColegio: parseInt(values.institucion),
        idNivel: parseInt(values.grado),
        correoElectronicoParticipante: values.email || null,
        telefonoParticipante: values.telefono || null,
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
              <InputText name="nombre" label="Nombre" required onlyLetters={true} maxLength={50} 
              />
            </div>
            <div className="field-container">
              <InputText name="apellido" label="Apellido" required onlyLetters maxLength={50}
               />
            </div>
            <div className="field-container">
              <InputText name="documento" label="Documento de Identidad" required onlyNumbers maxLength={10} />
            </div>
            <div className="field-container">
              <InputText name="complemento" label="Complemento"  maxLength={2}  onlyAlphaNumeric />
            </div>
            <div className="field-container">
              <InputText name="fechaNacimiento" label="Fecha de nacimiento" type="date" required />
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
                label="Grado/Nivel"
                name="grado"
                options={niveles.map(n => ({
                  value: n.idNivel.toString(),
                  label: n.nombreNivelEscolar,
                }))}
                loading={loadingNiveles}
                emptyMessage="No se encontraron niveles"
                required
              />
            </div>
            <div className="field-container">
              <InputText name="email" label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required />
            </div>
            <div className="field-container">
              <InputText name="telefono" label="Teléfono" required onlyNumbers maxLength={8} />
            </div>

            {/* Botón */}
            <div className="field-container full-width">
              <div className="form-actions">
                <ButtonPrimary
                  type="submit"
                  buttonStyle="primary"
                  disabled={!isValid || isSubmitting}
                  onClick={() => {
                    if (!isValid) {
                      Swal.fire({
                        icon: "error",
                        title: "Campos incompletos",
                        text: "Por favor, complete todos los campos requeridos",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }
                  }}
                >
                  Registrar Participante
                </ButtonPrimary>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step1Form;
