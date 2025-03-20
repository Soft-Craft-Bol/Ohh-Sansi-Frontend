import "./ButttonPrimary.css";

export const ButtonPrimary = ({
  children,
  className = "",
  onClick = null,
  label = "",
  id = "",
  type = "button", 
  buttonStyle = "primary", 
}) => {
  return (
    <div className="config-btn-primary">
      {label && <label htmlFor={id}>{label}</label>}
      <button
        id={id}
        type={type} 
        className={`btn-${buttonStyle} ${className}`} 
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};
