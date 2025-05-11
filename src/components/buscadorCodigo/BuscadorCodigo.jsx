import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './BuscadorCodigo.css';

const BuscadorCodigo = ({
  descripcion,
  placeholder,
  codigoIntroducidoTexto,
  inputValue,
  onInputChange,
  onKeyPress,
  onSearch,
  error,
  containerVariants,
  onClear
}) => {
  return (
    <motion.div
      className="buscador-codigo"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <p>{descripcion}</p>
      <div className="input-container">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          maxLength={11}
        />
        {inputValue && (
          <FaTimes 
            className="clear-icon" 
            onClick={onClear}
            title="Limpiar campo"
          />
        )}
        <FaSearch 
          className="search-icon" 
          onClick={onSearch} 
          title="Buscar"
        />
      </div>
      <div className="cont-cod-int">
        <p className="code-text">{codigoIntroducidoTexto}</p>
        <span className="codigo-introducido">{inputValue|| "sin código"}</span>
      </div>
      {error && <div className="error-message">{error}</div>}
    </motion.div>
  );
};

export default BuscadorCodigo;