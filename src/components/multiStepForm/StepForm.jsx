import React from "react";
import { ButtonPrimary } from "../button/ButtonPrimary";

const StepForm = ({ title, fields, onNext, onPrev, isLastStep }) => {
  return (
    <div className="step-content">
      <h2>{title}</h2>
      <div className="fields-container">
        {fields.map((field, index) => (
          <input
            key={index}
            type={field.type}
            placeholder={field.placeholder}
            name={field.name}
            required={field.required}
          />
        ))}
      </div>
      <div className="buttons-container">
        {onPrev && (
          <ButtonPrimary
            buttonStyle="secondary"
            onClick={onPrev}
          >
            Anterior
          </ButtonPrimary>
        )}
        <ButtonPrimary
          buttonStyle="primary" 
          onClick={onNext}
        >
          {isLastStep ? "Finalizar" : "Siguiente"}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default StepForm;