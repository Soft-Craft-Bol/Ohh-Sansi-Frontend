export const convertirNumeroAPalabras = (numero) => {
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  
  const num = Math.floor(numero);
  
  if (num === 0) return 'CERO';
  if (num < 10) return unidades[num];
  if (num < 20) return especiales[num - 11];
  if (num < 100) {
    const decena = Math.floor(num / 10);
    const unidad = num % 10;
    return decenas[decena] + (unidad !== 0 ? ' Y ' + unidades[unidad] : '');
  }
  if (num === 100) return 'CIEN';
  if (num < 1000) {
    const centena = Math.floor(num / 100);
    const resto = num % 100;
    return (centena === 1 ? 'CIENTO' : unidades[centena] + 'CIENTOS') + 
           (resto !== 0 ? ' ' + convertirNumeroAPalabras(resto) : '');
  }
  return 'NÚMERO GRANDE';
};