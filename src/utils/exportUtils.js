// src/utils/exportUtils.js
import { jsPDF } from 'jspdf';
import autoTable from'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format, parseISO } from 'date-fns';

/**
 * Exporta los datos a PDF
 * @param {Array} data 
 * @param {string} title 
 * @param {Date} fechaInicio 
 * @param {Date} fechaFin 
 */
export const exportToPDF = (data, title, fechaInicio, fechaFin) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Período: ${format(fechaInicio, 'dd/MM/yyyy')} - ${format(fechaFin, 'dd/MM/yyyy')}`, 14, 22);
  
  const headers = [
    'Código',
    'Fecha Emisión',
    'Fecha Vencimiento',
    'Responsable',
    'Concepto',
    'Monto (BOB)',
    'Estado'
  ];
  
  const tableData = data.map(item => [
    item.codOrdenPago,
    format(parseISO(item.fechaEmisionOrdenPago), 'dd/MM/yyyy'),
    format(parseISO(item.fechaVencimiento), 'dd/MM/yyyy'),
    item.responsablePago || 'N/A',
    item.concepto,
    item.montoTotalPago.toFixed(2),
    'Vigente'
  ]);
  
  autoTable(doc, {  // Cambio en la sintaxis para usar autoTable
    head: [headers],
    body: tableData,
    startY: 25,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }
  
  // Guardar PDF
  doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
};

/**
 * Exporta los datos a Excel
 * @param {Array} data - Datos a exportar
 * @param {string} title - Título del reporte
 */
export const exportToExcel = (data, title) => {
  const formattedData = data.map(item => ({
    'Código': item.codOrdenPago,
    'Fecha Emisión': format(parseISO(item.fechaEmisionOrdenPago), 'dd/MM/yyyy'),
    'Fecha Vencimiento': format(parseISO(item.fechaVencimiento), 'dd/MM/yyyy'),
    'Responsable': item.responsablePago || 'N/A',
    'Concepto': item.concepto,
    'Cantidad': item.cantidad,
    'Precio Unitario': item.precio_unitario,
    'Monto Total (BOB)': item.montoTotalPago,
    'Estado': 'Vigente'
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
  // Generar archivo Excel
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/ /g, '_')}_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
};

/**
 * Exporta los datos a CSV
 * @param {Array} data - Datos a exportar
 * @param {string} title - Título del reporte
 */
export const exportToCSV = (data, title) => {
  const headers = [
    'Código',
    'Fecha Emisión',
    'Fecha Vencimiento',
    'Responsable',
    'Concepto',
    'Cantidad',
    'Precio Unitario',
    'Monto Total (BOB)',
    'Estado'
  ];
  
  const csvData = data.map(item => [
    item.codOrdenPago,
    format(parseISO(item.fechaEmisionOrdenPago), 'dd/MM/yyyy'),
    format(parseISO(item.fechaVencimiento), 'dd/MM/yyyy'),
    item.responsablePago || 'N/A',
    item.concepto,
    item.cantidad,
    item.precio_unitario,
    item.montoTotalPago,
    'Vigente'
  ]);
  
  let csvContent = headers.join(',') + '\n';
  csvData.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(',') + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${title.toLowerCase().replace(/ /g, '_')}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
};

/**
 * Mapea los datos para la tabla
 * @param {Array} data - Datos de la API
 * @returns {Array} Datos formateados para visualización
 */
export const mapDataForTable = (data) => {
  return data.map(item => ({
    codigo: item.codOrdenPago,
    fechaEmision: format(parseISO(item.fechaEmisionOrdenPago), 'dd/MM/yyyy'),
    fechaVencimiento: format(parseISO(item.fechaVencimiento), 'dd/MM/yyyy'),
    responsable: item.responsablePago || 'N/A',
    concepto: item.concepto,
    monto: item.montoTotalPago.toFixed(2),
    estado: 'Vigente'
  }));
};