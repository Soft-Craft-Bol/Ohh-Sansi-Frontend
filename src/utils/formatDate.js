const formatDate = (dateString) => {
  if (!dateString) return "No definido";
  
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    /* hour: '2-digit',
    minute: '2-digit', */
    timeZone: 'America/La_Paz' 
  };
  
  return new Intl.DateTimeFormat('es-ES', options).format(new Date(dateString));
};

export default formatDate;