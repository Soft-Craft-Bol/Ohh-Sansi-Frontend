import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import './BuscadorCodigo.css';

const BuscadorCodigo = ({
  descripcion,
  placeholder,
  codigoIntroducidoTexto,
  codigoIntroducido,
  onInputChange,
  onKeyPress,
  onSearch,
  error,
  containerVariants,
  inputValue,
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
          value={inputValue} // Usar inputValue en lugar de codigoIntroducido
          onChange={onInputChange}
          onKeyPress={onKeyPress}
        />
        <FaSearch className="search-icon" onClick={onSearch} />
      </div>
      <div className="cont-cod-int">
        <p className="code-text">{codigoIntroducidoTexto}</p>
        <span className="codigo-introducido">{codigoIntroducido || "sin código"}</span>
      </div>
      {error && <div className="error-message">{error}</div>}
    </motion.div>
  );
};

export default BuscadorCodigo;