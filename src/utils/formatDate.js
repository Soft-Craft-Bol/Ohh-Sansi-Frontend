const formatDate = (dateString) => {
  if (!dateString) return "No definido";
  
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC' // Añade esta línea
  };

  return new Intl.DateTimeFormat('es-ES', options).format(new Date(dateString));
};
export default formatDate;
// utils/formatDate.js

export const formatDateForBackend = (date) => {
  if (!date) return null;
  
  // Si es un string del input type="date", ya viene en formato YYYY-MM-DD
  if (typeof date === 'string') {
    // Validar que el formato sea correcto (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(date)) {
      return date; // Retornar tal como está
    }
    
    // Si no es el formato esperado, intentar parsearlo
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
    
    // Usar UTC para evitar problemas de zona horaria
    const year = parsedDate.getUTCFullYear();
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  // Si es un objeto Date
  if (date instanceof Date) {
    if (isNaN(date.getTime())) return null;
    
    // Usar la fecha local (no UTC) para mantener la fecha que el usuario seleccionó
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  return null;
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  // Si ya está en formato YYYY-MM-DD, retornarlo tal como está
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(dateString)) {
    return dateString;
  }
  
  // Si viene del backend en otro formato (ej: ISO string)
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Usar la fecha local para que coincida con lo que el usuario ve
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Función auxiliar para crear una fecha sin problemas de zona horaria
export const createLocalDate = (dateString) => {
  if (!dateString) return null;
  
  // Si es formato YYYY-MM-DD, crear fecha local
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque Date usa base 0 para meses
  }
  
  return new Date(dateString);
};

// Función para comparar fechas sin problemas de hora
export const compareDates = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? createLocalDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? createLocalDate(date2) : date2;
  
  if (!d1 || !d2) return 0;
  
  // Comparar solo año, mes y día
  const d1String = formatDateForBackend(d1);
  const d2String = formatDateForBackend(d2);
  
  if (d1String < d2String) return -1;
  if (d1String > d2String) return 1;
  return 0;
};