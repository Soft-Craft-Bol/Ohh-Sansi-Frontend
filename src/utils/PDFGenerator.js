import html2pdf from 'html2pdf.js';
export const generateOrdenPagoPDF = (data) => {
  const colors = {
    light: '#F9F9F9',
    lighter: '#ffffff',
    blue: '#033771',
    lightBlue: '#CFE8FF',
    lightBlue2: '#F4F9FF',
    darkGrey: '#E2E2E2',
    red: '#EA0613',
    yellow: '#C8D444',
    grey: '#eee',
    lightYellow: '#FFF2C6',
    dark: '#342E37',
    orange: '#FD7238',
    lightOrange: '#FFE0D3',
    borderGray: 'rgba(0, 0, 0, 0.2)'
  };
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: 'Lato', Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; color: ${colors.dark}; background-color: ${colors.lighter};">
      <!-- Cabecera -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid ${colors.borderGray}; padding-bottom: 10px; margin-bottom: 20px;">
        <div>
          <p style="font-weight: 700; text-transform: uppercase; font-size: 16px; margin: 0;">UNIVERSIDAD MAYOR DE SAN SIMÓN</p>
          <p style="font-weight: 600; text-transform: uppercase; font-size: 15px; margin: 5px 0;">FACULTAD DE CIENCIAS Y TECNOLOGÍA</p>
          <p style="font-size: 14px; margin: 0;">Secretaría Administrativa</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: bold; margin: 0;">ORDEN DE PAGO</p>
          <p style="color: ${colors.red}; font-weight: bold; margin: 0;">${data.codOrdenPago || 'N°000000'}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p style="display: flex; align-items: center; font-size: 16px; margin: 8px 0;">
          <strong>Emitido por la unidad:</strong> 
          <span style="flex-grow: 1; border-bottom: 1px solid ${colors.borderGray}; margin-left: 10px; padding-bottom: 2px;">
            ${data.emisor || 'FACULTAD DE CIENCIAS Y TECNOLOGÍA'}
          </span>
        </p>
        <p style="display: flex; align-items: center; font-size: 16px; margin: 8px 0;">
          <strong>Señor(es):</strong> 
          <span style="flex-grow: 1; border-bottom: 1px solid ${colors.borderGray}; margin-left: 10px; padding-bottom: 2px;">
            ${data.responsablePago || 'Nombre no disponible'}
          </span>
          <strong>NIT/CI:</strong> 
          <span style="flex-grow: 0.5; border-bottom: 1px solid ${colors.borderGray}; margin-left: 10px; padding-bottom: 2px;">00000000</span>
        </p>
        <p style="font-size: 16px; margin: 8px 0;"><strong>Por lo siguiente:</strong></p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 10px;">
        <thead>
          <tr>
            <th style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: center; font-size: 15px; background-color: ${colors.darkGrey}; color: ${colors.dark}; text-transform: uppercase; font-weight: 600;">CANTIDAD</th>
            <th style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: center; font-size: 15px; background-color: ${colors.darkGrey}; color: ${colors.dark}; text-transform: uppercase; font-weight: 600;">CONCEPTO</th>
            <th style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: center; font-size: 15px; background-color: ${colors.darkGrey}; color: ${colors.dark}; text-transform: uppercase; font-weight: 600;">P. UNITARIO</th>
            <th style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: center; font-size: 15px; background-color: ${colors.darkGrey}; color: ${colors.dark}; text-transform: uppercase; font-weight: 600;">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: center; font-size: 15px; background-color: ${colors.lighter};">${data.cantidad || 0}</td>
            <td style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: left; font-size: 15px; background-color: ${colors.lighter};">${data.concepto || 'Concepto no especificado'}</td>
            <td style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: right; font-size: 15px; background-color: ${colors.lighter};">Bs. ${data.precio_unitario?.toFixed(2) || '0.00'}</td>
            <td style="border: 1px solid ${colors.borderGray}; padding: 8px; text-align: right; font-size: 15px; background-color: ${colors.lighter};">Bs. ${data.montoTotalPago?.toFixed(2) || '0.00'}</td>
          </tr>
        </tbody>
      </table>
      <p style="font-size: 14px; font-style: italic; color: #555; margin-top: 10px;">Nota: no vale como factura oficial</p>
      <div style="margin-top: 20px;">
        <p style="display: flex; align-items: center; justify-content: space-between; font-size: 16px; margin: 8px 0;">
          <span>
            <strong>Son:</strong> 
            <span style="border-bottom: 1px solid ${colors.borderGray}; padding-bottom: 2px; margin-left: 10px; width: 700px; text-align: center;">
              ${data.precioLiteral || 'CERO 00/100'}
            </span>
            <Strong>Bolivianos:</strong>
          </span>
          <span style="border: 1px solid ${colors.borderGray}; padding: 4px 10px; border-radius: 4px; margin-left: 10px; font-weight: bold; color: ${colors.blue}; font-size: 19px;">
            ${data.montoTotalPago?.toFixed(2) || '0.00'}
          </span>
        </p>
      </div>
      <p style="margin-top: 20px; font-size: 14px;">${formatDate(data.fechaEmisionOrdenPago) || 'Fecha no disponible'}</p>
    </div>
  `;
  const opt = {
    margin: 10,
    filename: `orden_pago_${data.codOrdenPago || new Date().getTime()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  return html2pdf().from(element).set(opt);
};
function formatDate(dateStr) {
  if (!dateStr) return '';
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const date = new Date(dateStr);
  return `Cochabamba, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}