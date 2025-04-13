import React from 'react';
import Swal from 'sweetalert2';
import { ButtonPrimary } from './ButtonPrimary';

const DisabledButton = ({
  children,
  isValid,
  isSubmitting,
  validationMessage = "Por favor, complete todos los campos requeridos",
  className = "",
  ...props
}) => {
 
  const buttonStyle = isValid ? "primary" : "disabled";
  
  const handleClick = (e) => {
    if (!isValid) {
      e.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: validationMessage,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  
  return (
    <ButtonPrimary
      type="submit"
      buttonStyle={buttonStyle}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </ButtonPrimary>
  );
};

export default DisabledButton;