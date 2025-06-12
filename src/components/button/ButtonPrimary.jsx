import "./ButtonPrimary.css";

export const ButtonPrimary = ({
  children,
  className = "",
  onClick = null,
  label = "",
  id = "",
  type = "button", 
  buttonStyle = "primary", 
  disabled = false
}) => {
  return (
    <div className="config-btn-primary">
      {label && <label htmlFor={id}>{label}</label>}
      <button
        id={id}
        type={type} 
        className={`btn-${buttonStyle} ${disabled ? 'disabled' : ''} ${className}`} 
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};