import { FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import './NavigationControls.css'; // Asegúrate de tener este archivo CSS para estilos

export const NavigationControls = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-controls">
      <button 
        onClick={() => navigate(-1)} 
        className="nav-button"
        aria-label="Volver atrás"
      >
        <FaArrowLeft />
      </button>
      <button 
        onClick={() => navigate(1)} 
        className="nav-button"
        aria-label="Ir adelante"
      >
        <FaArrowRight />
      </button>
      <button 
        onClick={() => window.scrollTo(0, 0)} 
        className="nav-button"
        aria-label="Ir al inicio"
      >
        <FaHome />
      </button>
    </div>
  );
};