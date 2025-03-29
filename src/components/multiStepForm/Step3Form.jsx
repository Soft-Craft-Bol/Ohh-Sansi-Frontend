import { useState, useEffect } from "react";
import "./Step3Form.css";

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
  const [tipoTutores, setTipoTutores] = useState([]);  // Para cargar los tipos de tutor

  useEffect(() => {
    const savedData = localStorage.getItem("step3Data");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    // Usar fetch para cargar los tipos de tutor desde el backend
    fetch("http://localhost:9999/api/v1/tipo-tutor/findAllTipoTutor")
      .then((response) => response.json())  // Convierte la respuesta a JSON
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

  const validateForm = () => {
    let newErrors = {};

    if (formData.nombres && !/^[A-Za-z\s]+$/.test(formData.nombres)) {
      newErrors.nombres = "Solo se permiten letras y espacios.";
    }

    if (formData.apellidos && !/^[A-Za-z\s]+$/.test(formData.apellidos)) {
      newErrors.apellidos = "Solo se permiten letras y espacios.";
    }

    if (formData.telefono && !/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = "Solo se permiten números.";
    }

    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Formato de correo inválido.";
    }

    if (isSubmitted && !formData.tipoTutor) {
      newErrors.tipoTutor = "Seleccione un tipo de tutor.";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
    setIsSubmitted(true);

    if (isFormValid) {
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
          alert("Formulario enviado correctamente.");
        })
        .catch((error) => {
          console.error("Error al enviar el formulario:", error);
          alert("Ocurrió un error al enviar el formulario.");
        });
    } else {
      alert("Corrija los errores antes de continuar.");
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
            placeholder="Ingrese el nombre del tutor"
            className={errors.nombres ? "error-input" : "valid-input"}
          />
          {errors.nombres && <p className="error-message">{errors.nombres}</p>}
        </div>

        <div className="step3-form-group">
          <label>Apellidos del profesor o tutor*</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Ingrese el apellido del tutor"
            className={errors.apellidos ? "error-input" : "valid-input"}
          />
          {errors.apellidos && <p className="error-message">{errors.apellidos}</p>}
        </div>

        <div className="step3-form-group">
          <label>Número de teléfono del tutor*</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ingrese el número telefónico del tutor"
            className={errors.telefono ? "error-input" : "valid-input"}
          />
          {errors.telefono && <p className="error-message">{errors.telefono}</p>}
        </div>

        <div className="step3-form-group">
          <label>Correo electrónico*</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className={errors.correo ? "error-input" : "valid-input"}
          />
          {errors.correo && <p className="error-message">{errors.correo}</p>}
        </div>

        <div className="step3-form-group">
          <label>Tipo de tutor*</label>
          <select
            name="tipoTutor"
            value={formData.tipoTutor}
            onChange={handleChange}
            className={errors.tipoTutor ? "error-input" : "valid-input"}
          >
            <option value="">Seleccione el tipo de tutor</option>
            {tipoTutores.length > 0 &&
              tipoTutores.map((tipo) => (
                <option key={tipo.id} value={tipo.nombre}>
                  {tipo.nombre}
                </option>
              ))}
          </select>
          {errors.tipoTutor && <p className="error-message">{errors.tipoTutor}</p>}
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
