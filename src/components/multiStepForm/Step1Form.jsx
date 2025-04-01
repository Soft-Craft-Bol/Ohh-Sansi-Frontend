import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from "sonner";
import InputText from "../inputs/InputText";
import { ButtonPrimary } from "../button/ButtonPrimary";
import SelectInput from "../selected/SelectInput";
import useFetchNivelesEscolares from "../../hooks/NivelEscolar/useFetchNivelesEscolares";
import useFetchDepartamentos from "../../hooks/departamento/useFetchDepartamentos";
import useFetchMunicipios from "../../hooks/departamento/useFetchMunicipios";
import useFetchColegio from "../../hooks/Colegio/useFetchColegio";
import "./Step1Form.css";

const Step1Form = ({ formData = {}, updateFormData, onNext }) => {

  const loadFormDataFromLocalStorage = () => {
    const savedData = localStorage.getItem("step1FormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        nombre: parsedData.nombre || "",
        apellido: parsedData.apellido || "",
        documento: parsedData.documento || "",
        fechaNacimiento: parsedData.fechaNacimiento || "",
        departamento: parsedData.departamento || "",
        municipio: parsedData.municipio || "",
        institucion: parsedData.institucion || "",
        grado: parsedData.grado || "",
        email: parsedData.email || "",
        telefono: parsedData.telefono || "",
      };
    }
    return {
      nombre: formData?.participante?.nombreParticipante || "",
      apellido: `${formData?.participante?.apellidoPaterno || ""} ${formData?.participante?.apellidoMaterno || ""}`.trim(),
      documento: formData?.participante?.carnetIdentidadParticipante || "",
      fechaNacimiento: formData?.participante?.fechaNacimiento || "",
      departamento: formData?.participante?.idDepartamento?.toString() || "",
      municipio: formData?.participante?.idMunicipio?.toString() || "",
      institucion: formData?.participante?.idColegio?.toString() || "",
      grado: formData?.participante?.idNivelGradoEscolar?.toString() || "",
      email: formData?.participante?.correoElectronicoParticipante || "",
      telefono: formData?.participante?.telefonoParticipante || "",
    };
  };

  const initialFormData = loadFormDataFromLocalStorage();

  
  const [selectedDepartamento, setSelectedDepartamento] = React.useState(initialFormData.departamento);
  const [selectedMunicipio, setSelectedMunicipio] = React.useState(initialFormData.municipio);

  const { niveles = [], loading: loadingNiveles } = useFetchNivelesEscolares();
  const { departamentos = [], loading: loadingDepartamentos } = useFetchDepartamentos();
  const { municipios = [], loading: loadingMunicipios } = useFetchMunicipios(selectedDepartamento);
  const { colegios = [], loading: loadingColegios } = useFetchColegio(selectedMunicipio);


  useEffect(() => {
    if (formData?.participante?.idDepartamento) {
      setSelectedDepartamento(formData.participante.idDepartamento.toString());
    }
    if (formData?.participante?.idMunicipio) {
      setSelectedMunicipio(formData.participante.idMunicipio.toString());
    }
  }, [formData]);

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
      .nullable()
      .test('documento', 'Debe tener entre 6 y 8 dígitos', (value) =>
        !value || (value.length >= 6 && value.length <= 8 && /^\d+$/.test(value))
      ),
    
    fechaNacimiento: Yup.date()
      .nullable()
      .max(new Date(), "No puede ser fecha futura")
      .test('age', 'Edad debe estar entre 5 y 100 años', function (value) {
        if (!value) return true;
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 5 && age <= 100;
      }),
    
    departamento: Yup.string().required("Departamento es requerido"),
    
    municipio: Yup.string()
      .required("Municipio es requerido")
      .when("departamento", (departamento, schema) =>
        departamento ? schema.required("Seleccione un municipio") : schema
      ),
    
    institucion: Yup.string().required("La institución es requerida"),
    
    grado: Yup.string().required("El grado es requerido"),
    
    email: Yup.string()
      .nullable()
      .email("Ingrese un email válido")
      .test('domain', 'Dominio no permitido', (value) => {
        if (!value) return true;
        const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'edu.pe'];
        const [, domain] = value.split('@');
        return domain && validDomains.some((d) => domain.endsWith(d));
      }),
    
    telefono: Yup.string()
      .nullable()
      .matches(/^\d{8}$/, "Debe tener exactamente 8 dígitos"),
  });

  const handleSubmit = (values) => {
    localStorage.setItem("step1FormData", JSON.stringify(values));

    updateFormData({
      participante: {
        ...formData?.participante,
        nombreParticipante: values.nombre,
        apellidoPaterno: values.apellido.split(' ')[0] || '',
        apellidoMaterno: values.apellido.split(' ')[1] || '',
        carnetIdentidadParticipante: values.documento || null,
        fechaNacimiento: values.fechaNacimiento || null,
        idDepartamento: values.departamento ? parseInt(values.departamento) : null,
        idMunicipio: values.municipio ? parseInt(values.municipio) : null,
        idColegio: values.institucion ? parseInt(values.institucion) : null,
        idNivelGradoEscolar: values.grado ? parseInt(values.grado) : null,
        correoElectronicoParticipante: values.email || null,
        telefonoParticipante: values.telefono || null,
      },
    });

    // Toaster
    toast.success("Datos guardados correctamente. Pasando al siguiente paso...");

    onNext();
  };

  const handleNumericInput = (e, setFieldValue, fieldName, maxLength) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= maxLength) {
      setFieldValue(fieldName, value);
    }
  };

  return (
    <div className="step1-wrapper">
      <Toaster position="top-right" richColors />
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
                  value={values.nombre}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setFieldValue('nombre', value);
                  }}
                />
              </div>
              
              {/* Apellido */}
              <div className="field-container">
                <InputText
                  label="Apellido"
                  name="apellido"
                  placeholder="Apellido del participante"
                  required
                  value={values.apellido}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setFieldValue('apellido', value);
                  }}
                />
              </div>
              
              {/* Documento */}
              <div className="field-container">
                <InputText
                  label="Documento de identidad"
                  name="documento"
                  placeholder="Número de identificación"
                  value={values.documento}
                  onChange={(e) => handleNumericInput(e, setFieldValue, 'documento', 8)}
                  maxLength={8}
                />
              </div>
              
              {/* Fecha de Nacimiento */}
              <div className="field-container">
                <InputText
                  label="Fecha de nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={values.fechaNacimiento}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFieldValue('fechaNacimiento', e.target.value)}
                />
              </div>
              
              {/* Departamento */}
              <div className="field-container">
                <SelectInput
                  label="Departamento"
                  name="departamento"
                  options={departamentos.map((d) => ({
                    value: d.idDepartamento.toString(),
                    label: d.nombreDepartamento,
                  }))}
                  loading={loadingDepartamentos}
                  emptyMessage="No se encontraron departamentos"
                  onChange={(e) => {
                    setFieldValue("departamento", e.target.value);
                    setFieldValue("municipio", "");
                    setFieldValue("institucion", "");
                    setSelectedDepartamento(e.target.value);
                  }}
                  value={values.departamento}
                  required
                />
              </div>
              
              {/* Municipio */}
              <div className="field-container">
                <SelectInput
                  label="Municipio"
                  name="municipio"
                  options={municipios.map((m) => ({
                    value: m.idMunicipio.toString(),
                    label: m.nombreMunicipio,
                  }))}
                  loading={loadingMunicipios}
                  emptyMessage="No se encontraron municipios"
                  disabled={!values.departamento}
                  onChange={(e) => {
                    setFieldValue("municipio", e.target.value);
                    setFieldValue("institucion", "");
                    setSelectedMunicipio(e.target.value);
                  }}
                  value={values.municipio}
                  required
                />
              </div>
              
              {/* Colegio/Institución */}
              <div className="field-container">
                <SelectInput
                  label="Colegio/Institución"
                  name="institucion"
                  options={colegios.map((c) => ({
                    value: c.idColegio.toString(),
                    label: `${c.nombreColegio} - ${c.direccion}`,
                  }))}
                  loading={loadingColegios}
                  emptyMessage="No se encontraron colegios"
                  disabled={!values.municipio}
                  value={values.institucion}
                  onChange={(e) => setFieldValue("institucion", e.target.value)}
                  required
                />
              </div>
              
              {/* Grado/Nivel */}
              <div className="field-container">
                <SelectInput
                  label="Grado/Nivel"
                  name="grado"
                  options={niveles.map((n) => ({
                    value: n.idNivel.toString(),
                    label: n.nombreNivelEscolar,
                  }))}
                  loading={loadingNiveles}
                  emptyMessage="No se encontraron niveles"
                  value={values.grado}
                  onChange={(e) => setFieldValue("grado", e.target.value)}
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
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                />
              </div>
              
              {/* Teléfono */}
              <div className="field-container">
                <InputText
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  placeholder="Número de contacto (8 dígitos)"
                  value={values.telefono}
                  onChange={(e) => handleNumericInput(e, setFieldValue, 'telefono', 8)}
                  maxLength={8}
                />
              </div>
              
              <div className="field-container full-width">
                <div className="form-actions">
                  <ButtonPrimary 
                    type="submit" 
                    buttonStyle="primary"
                  >
                    Siguiente
                  </ButtonPrimary>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step1Form;