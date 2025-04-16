const useInscripcionUtils = (datosInscripcion) => {
  const getNombreCompleto = () => {
    if (!datosInscripcion || !datosInscripcion.registroDatosParticipante || !datosInscripcion.registroDatosParticipante.participante) {
      return 'No disponible';
    }
    
    const { nombreParticipante, apellidoPaterno, apellidoMaterno } = datosInscripcion.registroDatosParticipante.participante;
    return `${nombreParticipante} ${apellidoPaterno} ${apellidoMaterno}`;
  };

  const getNombresAreas = () => {
    if (!datosInscripcion || !datosInscripcion.registroAreas) {
      return 'No disponible';
    }
    
    const { areas } = datosInscripcion.registroAreas;
    if (Array.isArray(areas)) {
      return areas.map(area => area.nombreArea).join(', ');
    } else {
      return typeof areas === 'string' ? areas : 'No disponible';
    }
  };

  const getNombresTutores = () => {
    if (!datosInscripcion || !datosInscripcion.registroDatosTutor) {
      return 'No disponible';
    }
    
    const { tutores } = datosInscripcion.registroDatosTutor;
    
    if (Array.isArray(tutores)) {
      return tutores.map(tutor => `${tutor.nombresTutor} ${tutor.apellidosTutor}`).join(', ');
    } else {
      return typeof tutores === 'string' ? tutores : 'No disponible';
    }
  };

  const getCodigoUnico = () => {
    if (!datosInscripcion || !datosInscripcion.registroOrdenPago) {
      return 'No disponible';
    }
    
    return datosInscripcion.registroOrdenPago.codigoUnico || 'No generado';
  };

  const inscripcionCompletada = () => {
    if (!datosInscripcion) return false;
    
    const etapas = [
      datosInscripcion.registroDatosParticipante?.estado === 'Completado',
      datosInscripcion.registroAreas?.estado === 'Completado',
      datosInscripcion.registroDatosTutor?.estado === 'Completado',
      datosInscripcion.registroOrdenPago?.estado === 'Generado' || datosInscripcion.registroOrdenPago?.estado === 'Completado'
    ];
    
    return etapas.every(etapa => etapa === true);
  };

  const getFechaActual = () => {
    const fecha = new Date();
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  return {
    getNombreCompleto,
    getNombresAreas,
    getNombresTutores,
    getCodigoUnico,
    inscripcionCompletada,
    getFechaActual
  };
};

export default useInscripcionUtils;