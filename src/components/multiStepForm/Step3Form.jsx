import { useState, useEffect } from "react";
import stepThreeSchema from "../../schemas/stepThreeValidate";
import "./Step3Form.css";
import { toast } from "sonner";

const Step3Form = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    tipoTutor: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tipoTutores, setTipoTutores] = useState([]);
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem("step3Data");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    fetch("http://localhost:9999/api/v1/tipo-tutor/findAllTipoTutor")
      .then((response) => response.json())
      .then((data) => {
        setTipoTutores(data);  // Suponiendo que la respuesta es un array de tipos de tutor
      })
      .catch((error) => {
        console.error("Error al cargar los tipos de tutor:", error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("step3Data", JSON.stringify(formData));
    validateForm();
  }, [formData]);

  const validateForm = async () => {
    try {
      await stepThreeSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsFormValid(true);
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      setIsFormValid(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouchedFields({ ...touchedFields, [e.target.name]: true });
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      await stepThreeSchema.validate(formData, {abortEarly: false});
      setErrors({});
      fetch("http://localhost:9999/api/v1/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),  // Enviar los datos como JSON
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Tutor registrado:", data);
          toast.success("Tutor registrado correctamente")
        })
        .catch((error) => {
          console.error("Error al enviar el formulario:", error);
          alert("Ocurrió un error al enviar el formulario.");
        });
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      toast.error("Complete los campos con datos válidos")
    }
  };

  return (
    <div className="step3-container">
      <h2 className="step3-title">Asignación de Tutores</h2>
      <p className="step3-description">
        Complete la información de los tutores (Paso 3 de 5)
      </p>

      <form className="step3-form" onSubmit={handleSubmit}>
        <div className="step3-form-group">
          <label>Nombres del profesor o tutor*</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingrese el nombre del tutor"
            className={`
              ${errors.nombres && touchedFields.nombres ? "error-input" : ""}
              ${!errors.nombres && touchedFields.nombres ? "valid-input" : ""}
              default
            `}
          />
          {errors.nombres && touchedFields.nombres && <p className="error-message">{errors.nombres}</p>}
        </div>

        <div className="step3-form-group">
          <label>Apellidos del profesor o tutor*</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingrese el apellido del tutor"
            className={`
              ${errors.apellidos && touchedFields.apellidos ? "error-input" : ""}
              ${!errors.apellidos && touchedFields.apellidos ? "valid-input" : ""}
              default
            `}
          />
          {errors.apellidos && touchedFields.apellidos && <p className="error-message">{errors.apellidos}</p>}
        </div>

        <div className="step3-form-group">
          <label>Número de teléfono del tutor*</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingrese el número telefónico del tutor"
            className={`
              ${errors.telefono && touchedFields.telefono ? "error-input" : ""}
              ${!errors.telefono && touchedFields.telefono ? "valid-input" : ""}
              default
            `}
          />
          {errors.telefono && touchedFields.telefono && <p className="error-message">{errors.telefono}</p>}
        </div>

        <div className="step3-form-group">
          <label>Correo electrónico*</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="correo@ejemplo.com"
            className={`
              ${errors.correo && touchedFields.correo ? "error-input" : ""}
              ${!errors.correo && touchedFields.correo ? "valid-input" : ""}
              default
            `}
          />
          {errors.correo && touchedFields.correo && <p className="error-message">{errors.correo}</p>}
        </div>

        <div className="step3-form-group">
          <label>Tipo de tutor*</label>
          <select
            name="tipoTutor"
            value={formData.tipoTutor}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`
              ${errors.tipoTutor && touchedFields.tipoTutor ? "error-input" : ""}
              ${!errors.tipoTutor && touchedFields.tipoTutor ? "valid-input" : ""}
              default
            `}
          >
            <option value="">Seleccione el tipo de tutor</option>
            <option value="profesor">Profesor</option>
            <option value="asistente">Asistente</option>
          </select>
          {errors.tipoTutor && touchedFields.tipoTutor && <p className="error-message">{errors.tipoTutor}</p>}
        </div>

        <div className="step3-button-container">
          <button
            type="submit"
            className={`step3-button ${isFormValid ? "active" : "disabled"}`}
            disabled={!isFormValid}
          >
            Continuar a áreas de competencia
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3Form;
