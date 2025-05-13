import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
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
  onClear,
  allowLetters = false, // Nueva prop para controlar si permite letras
  maxLength = 11 // Nueva prop para longitud máxima
}) => {
  const handleInternalChange = (e) => {
    const value = e.target.value;
    
    if (allowLetters) {
      if (value.length <= maxLength) {
        onInputChange(e); // Pasamos el evento completo
      } else {
        // Cortar el valor si excede maxLength
        e.target.value = value.slice(0, maxLength);
        onInputChange(e);
      }
    } 
    // Si allowLetters es false, solo permite números
    else {
      if (/^\d*$/.test(value)) {
        if (value.length <= maxLength) {
          onInputChange(e);
        } else {
          e.target.value = value.slice(0, maxLength);
          onInputChange(e);
        }
      }
    }
  };

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
          value={codigoIntroducido}
          onChange={handleInternalChange}
          onKeyPress={onKeyPress}
          maxLength={maxLength}
        />
        {codigoIntroducido && (
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
        <span className="codigo-introducido">{codigoIntroducido || "sin código"}</span>
      </div>
      {error && <div className="error-message">{error}</div>}
    </motion.div>
  );
};

export default BuscadorCodigo;