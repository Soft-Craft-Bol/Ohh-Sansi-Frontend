import React from "react";

const Step1Form = () => {
  return (
    <>
      <input type="text" placeholder="Nombre" name="nombre" required />
      <input type="text" placeholder="Apellido" name="apellido" required />
      <input type="text" placeholder="Colegio/Institución" name="colegio" required />
      <input type="text" placeholder="Grado/Nivel" name="grado" required />
      <input type="email" placeholder="Correo electrónico" name="correo" required />
      <input type="tel" placeholder="Teléfono" name="telefono" />
    </>
  );
};

export default Step1Form;