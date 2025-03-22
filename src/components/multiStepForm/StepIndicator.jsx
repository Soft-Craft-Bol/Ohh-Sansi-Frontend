import React from "react";
import "./MultiStepForm.css";

const StepIndicator = ({ steps, currentStep }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="steps-indicator" style={{ "--progress-width": `${progressWidth}%` }}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentStep >= index + 1 ? "completed" : ""} ${currentStep === index + 1 ? "active" : ""}`}
        >
          <span className="step-number">{index + 1}</span>
          <span className="step-text">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;