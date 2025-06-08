import React from 'react';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './NetworkErrorAlert.css'; 

const MySwal = withReactContent(Swal);

const NetworkErrorAlert = ({ error, onRetry }) => {
  const showErrorAlert = () => {
    MySwal.fire({
      icon: 'error',
      title: 'Error de conexión',
      html: (
        <div>
          <p>No se pudo conectar al servidor. Razón:</p>
          <p className="error-detail">{error}</p>
          <p>Puedes seguir navegando con información de ejemplo.</p>
        </div>
      ),
      confirmButtonText: 'Entendido',
      footer: '<a href="/">Recargar página</a>',
      showCancelButton: true,
      cancelButtonText: 'Reintentar',
      showCloseButton: true
    }).then((result) => {
      if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        onRetry();
      }
    });
  };

  React.useEffect(() => {
    showErrorAlert();
  }, []);

  return (
    <div className="network-error-banner">
      <FaWifi className="network-error-icon" />
      <span>Estás viendo información de ejemplo debido a un problema de conexión.</span>
      <button onClick={onRetry} className="retry-button">
        <FaExclamationTriangle /> Reintentar
      </button>
    </div>
  );
};

export default NetworkErrorAlert;