import React, { useState } from 'react';
import "./OrdenDePago.css";
import Header from "../../components/header/Header";
import { FaSearch } from 'react-icons/fa';
import OrdenPagoDetalle from "../../components/ordenPagoDetalle/OrdenPagoDetalle";
const OrdenDePago = () => {
  const [inputValue, setInputValue] = useState("");
  const [codigoIntroducido, setCodigoIntroducido] = useState("");

  const handleSearch = () => {
    setCodigoIntroducido(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  const renderInputSection = () => (
    <div className="buscador-codigo">
      <p>Genera la orden de pago referente a la inscripción, introduciendo el código</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Introduce el código"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
      </div>
      <div className="cont-cod-int">
        <p className="code-text">Código introducido: </p>
        <span className="codigo-introducido">{codigoIntroducido || "sin código"}</span>
      </div>
    </div>
  );
  const renderInfoSection = () => (
    <div className='info-box'>
      <div className='resumen'>
        <h3>Resumen de la inscripción</h3>
        <p>Total de participantes: <span className="bold-blue">15</span></p>
        <p>Total áreas inscritas: <span className="bold-blue">10</span></p>
        <p>Nombre del responsable de la inscripción: <span className="bold-blue">Alfredo Ernesto Torrico García</span></p>
        <p>Correo del responsable de la inscripción: <span className="bold-blue">atgealfredo@gmail.com</span></p>
      </div>
      <div className='divider'></div>
      <div className='pago'>
        <h3>Detalles del pago</h3>
        <p>Total inscripciones: <span className="bold-blue">35 bs.</span></p>
        <p>Costo por área: <span className="bold-blue">35 bs.</span></p>
        <p className='total-pagar'>Total a pagar: </p><span className="big-bold-blue">700 bs.</span>
      </div>
    </div>
  );

  return (
    <div className="orden-de-pago">
      <Header
        title="Generación de Orden de Pago"
        description="Genera la orden de pago para el participante previamente inscrito en la olimpiada, buscando con el código de inscripción brindado al finalizar el registro."
      />
      <div className="top-container">
        <h2>Generar orden de pago</h2>
        {renderInputSection()}
      </div>
      <div className='info-container'>
        {renderInfoSection()}
      </div>
      <div className='orden-detail'>
        <OrdenPagoDetalle />
      </div>
    </div>
  );
};

export default OrdenDePago;