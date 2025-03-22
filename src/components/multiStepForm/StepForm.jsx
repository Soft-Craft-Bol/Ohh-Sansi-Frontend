import React from "react";
import { ButtonPrimary } from "../button/ButtonPrimary";

const StepForm = ({ title, onNext, onPrev, isLastStep, children }) => {
  return (
    <div className="step-content">
      <h2>{title}</h2>
      <div className="fields-container">
        {children} 
      </div>
      <div className="buttons-container">
        {onPrev && (
          <ButtonPrimary buttonStyle="secondary" onClick={onPrev}>
            Anterior
          </ButtonPrimary>
        )}
        <ButtonPrimary buttonStyle="primary" onClick={onNext}>
          {isLastStep ? "Finalizar" : "Siguiente"}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default StepForm;