import { useState } from 'react';
import { getEstadoInscripcion } from '../../../api/api';
import Swal from 'sweetalert2';

const useEstadoInscripcion = () => {
  const [documento, setDocumento] = useState('');
  const [error, setError] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [datosInscripcion, setDatosInscripcion] = useState(null);
  const [cargando, setCargando] = useState(false);

  const resetEstado = () => {
    setDocumento('');
    setMostrarDetalles(false);
    setDatosInscripcion(null);
    setError('');
  };

  const handleSearch = async () => {
    if (!documento) {
      setError('Por favor, introduce un número de documento válido.');
      return;
    }
    
    setCargando(true);
    setError('');
    
    try {
      const response = await getEstadoInscripcion(documento);
      setDatosInscripcion(response.data);
      setMostrarDetalles(true);
    } catch (err) {
      console.error('Error al obtener datos de inscripción:', err);
      const backendMsg = err?.response?.data?.message || err?.message || 'Error al obtener datos de inscripción. Intenta nuevamente.';
      setError(backendMsg);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: backendMsg,
        color: 'var(--dark)'
      });
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return {
    documento,
    setDocumento,
    error,
    mostrarDetalles,
    datosInscripcion,
    cargando,
    resetEstado,
    handleSearch,
    handleKeyPress
  };
};

export default useEstadoInscripcion;