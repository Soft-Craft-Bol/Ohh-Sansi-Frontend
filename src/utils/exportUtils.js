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
export const exportToPDF = (data, title, fechaInicio, fechaFin, estadosOrden = []) => {
  try {
    if (!Array.isArray(data)) {
      throw new Error('Los datos deben ser un array');
    }

    const doc = new jsPDF();
    
    // Configuración del documento
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    
    // Función para formatear fechas
    const formatDate = (date) => {
  if (!date) return 'N/A';
  if (date instanceof Date) {
    return format(date, 'dd/MM/yyyy');
  }
  try {
    return format(parseISO(date), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};
    
    doc.text(`Período: ${formatDate(fechaInicio)} - ${formatDate(fechaFin)}`, 14, 22);
    
    // Encabezados
    const headers = [
      'Código',
      'Fecha Emisión',
      'Fecha Vencimiento',
      'Responsable',
      'Concepto',
      'Monto (BOB)',
      'Estado'
    ];
    
    // Preparar datos
     const tableData = data.map(orden => {
    const estadoObj = estadosOrden.find(e => e.idEstado === orden.idEstado);
    const estado = estadoObj ? estadoObj.estado : 'DESCONOCIDO';
    
    return [
      orden.codOrdenPago || 'N/A',
      formatDate(orden.fechaEmisionOrdenPago),
      formatDate(orden.fechaVencimiento),
      orden.responsablePago || 'N/A',
      orden.concepto || 'N/A',
      orden.montoTotalPago?.toFixed(2) || '0.00',
      estado  
    ];
  });
    
    // Generar tabla
    autoTable(doc, {
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
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Código
        1: { cellWidth: 20 }, // Fecha Emisión
        2: { cellWidth: 20 }, // Fecha Vencimiento
        3: { cellWidth: 30 }, // Responsable
        4: { cellWidth: 40 }, // Concepto
        5: { cellWidth: 15 }, // Monto
        6: { cellWidth: 20 }  // Estado
      }
    });

    // Numeración de páginas
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      
      // Footer
      doc.text(
        'Universidad Mayor de San Simón',
        14,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Guardar PDF
    doc.save(`${title.replace(/ /g, '_')}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw new Error(`No se pudo generar el PDF: ${error.message}`);
  }
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
export const mapDataForTable = (apiResponse) => {
  if (!apiResponse || !apiResponse.ordenes || !Array.isArray(apiResponse.ordenes)) {
    return [];
  }

  return apiResponse.ordenes.map(orden => ({
    idOrdenPago: orden.idOrdenPago,
    codOrdenPago: orden.codOrdenPago || 'N/A',
    fechaEmisionOrdenPago: orden.fechaEmisionOrdenPago,
    fechaVencimiento: orden.fechaVencimiento,
    responsablePago: orden.responsablePago || 'N/A',
    concepto: orden.concepto || 'N/A',
    montoTotalPago: orden.montoTotalPago || 0,
    estado: apiResponse.estadosOrden?.find(e => e.idEstado === orden.idEstado)?.estado || 'DESCONOCIDO'
  }));
};

/**
 * Exporta la lista de inscritos a PDF
 * @param {Array} data - Array de inscritos
 * @param {string} title - Título del reporte
 * @param {string} area - Área seleccionada (opcional)
 */
export const exportToPDFInscritos = (data, title, area = null) => {
  const doc = new jsPDF();
  
  // Configurar título
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Información adicional
  doc.setFontSize(10);
  doc.text(`Total de participantes: ${data.length}`, 14, 22);
  if (area) {
    doc.text(`Área: ${area}`, 14, 28);
  }
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 14, area ? 34 : 28);
  
  // Preparar headers
  const headers = [
    'ID',
    'Apellidos',
    'Nombres',
    'Colegio',
    'Municipio',
    'Departamento'
  ];
  
  // Preparar datos para la tabla
  const tableData = data.map(inscrito => [
    inscrito.id_inscripcion || 'N/A',
    `${inscrito.apellido_paterno || ''} ${inscrito.apellido_materno || ''}`.trim(),
    inscrito.nombre_participante || 'N/A',
    inscrito.nombre_colegio || 'N/A',
    inscrito.nombre_municipio || 'N/A',
    inscrito.nombre_departamento || 'N/A'
  ]);
  
  // Crear tabla
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: area ? 40 : 34,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 20 }, // ID
      1: { cellWidth: 35 }, // Apellidos
      2: { cellWidth: 30 }, // Nombres
      3: { cellWidth: 45 }, // Colegio
      4: { cellWidth: 30 }, // Municipio
      5: { cellWidth: 30 }  // Departamento
    }
  });

  // Agregar número de páginas
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`, 
      doc.internal.pageSize.width - 30, 
      doc.internal.pageSize.height - 10
    );
    
    // Footer organizacional
    doc.text(
      'Universidad Mayor de San Simón', 
      14, 
      doc.internal.pageSize.height - 10
    );
  }
  
  // Generar nombre de archivo
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const filename = `lista_inscritos_${timestamp}.pdf`;
  
  // Guardar PDF
  doc.save(filename);
};

/**
 * Exporta la lista de inscritos a Excel
 * @param {Array} data - Array de inscritos
 * @param {string} title - Título del reporte
 */
export const exportToExcelInscritos = (data, title) => {
  // Preparar datos para Excel
  const formattedData = data.map((inscrito, index) => ({
    'N°': index + 1,
    'ID Inscripción': inscrito.id_inscripcion || 'N/A',
    'Apellido Paterno': inscrito.apellido_paterno || '',
    'Apellido Materno': inscrito.apellido_materno || '',
    'Nombres': inscrito.nombre_participante || 'N/A',
    'Nombre Completo': `${inscrito.apellido_paterno || ''} ${inscrito.apellido_materno || ''} ${inscrito.nombre_participante || ''}`.trim(),
    'Colegio': inscrito.nombre_colegio || 'N/A',
    'Municipio': inscrito.nombre_municipio || 'N/A',
    'Departamento': inscrito.nombre_departamento || 'N/A'
  }));
  
  // Crear worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Configurar ancho de columnas
  const columnWidths = [
    { wch: 5 },  // N°
    { wch: 12 }, // ID Inscripción
    { wch: 18 }, // Apellido Paterno
    { wch: 18 }, // Apellido Materno
    { wch: 20 }, // Nombres
    { wch: 35 }, // Nombre Completo
    { wch: 35 }, // Colegio
    { wch: 20 }, // Municipio
    { wch: 20 }  // Departamento
  ];
  worksheet['!cols'] = columnWidths;
  
  // Crear workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscritos');
  
  // Agregar hoja de resumen
  const resumenData = [
    { 'Información': 'Reporte', 'Valor': title },
    { 'Información': 'Total Participantes', 'Valor': data.length },
    { 'Información': 'Fecha Generación', 'Valor': new Date().toLocaleDateString('es-ES') },
    { 'Información': 'Organización', 'Valor': 'Universidad Mayor de San Simón' }
  ];
  
  const resumenWorksheet = XLSX.utils.json_to_sheet(resumenData);
  resumenWorksheet['!cols'] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(workbook, resumenWorksheet, 'Resumen');
  
  // Generar nombre de archivo
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const filename = `lista_inscritos_${timestamp}.xlsx`;
  
  // Guardar archivo Excel
  XLSX.writeFile(workbook, filename);
};

/**
 * Exporta la lista de inscritos a CSV
 * @param {Array} data - Array de inscritos
 * @param {string} title - Título del reporte
 */
export const exportToCSVInscritos = (data, title) => {
  // Definir headers
  const headers = [
    'N°',
    'ID Inscripción',
    'Apellido Paterno',
    'Apellido Materno',
    'Nombres',
    'Nombre Completo',
    'Colegio',
    'Municipio',
    'Departamento'
  ];
  
  // Preparar datos CSV
  const csvData = data.map((inscrito, index) => [
    index + 1,
    inscrito.id_inscripcion || 'N/A',
    inscrito.apellido_paterno || '',
    inscrito.apellido_materno || '',
    inscrito.nombre_participante || 'N/A',
    `${inscrito.apellido_paterno || ''} ${inscrito.apellido_materno || ''} ${inscrito.nombre_participante || ''}`.trim(),
    inscrito.nombre_colegio || 'N/A',
    inscrito.nombre_municipio || 'N/A',
    inscrito.nombre_departamento || 'N/A'
  ]);
  
  // Crear contenido CSV
  let csvContent = '';
  
  // Agregar información del reporte
  csvContent += `"${title}"\n`;
  csvContent += `"Total de participantes: ${data.length}"\n`;
  csvContent += `"Fecha de generación: ${new Date().toLocaleDateString('es-ES')}"\n`;
  csvContent += `"Universidad Mayor de San Simón"\n`;
  csvContent += '\n'; // Línea vacía
  
  // Agregar headers
  csvContent += headers.map(header => `"${header}"`).join(',') + '\n';
  
  // Agregar datos
  csvData.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(',') + '\n';
  });
  
  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Generar nombre de archivo
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const filename = `lista_inscritos_${timestamp}.csv`;
  
  saveAs(blob, filename);
};

/**
 * Mapea los datos de inscritos para visualización en tabla
 * @param {Array} data - Datos de la API
 * @returns {Array} Datos formateados para visualización
 */
export const mapInscritosForTable = (data) => {
  return data.map((inscrito, index) => ({
    numero: index + 1,
    id: inscrito.id_inscripcion || 'N/A',
    apellidos: `${inscrito.apellido_paterno || ''} ${inscrito.apellido_materno || ''}`.trim(),
    nombres: inscrito.nombre_participante || 'N/A',
    nombreCompleto: `${inscrito.apellido_paterno || ''} ${inscrito.apellido_materno || ''} ${inscrito.nombre_participante || ''}`.trim(),
    colegio: inscrito.nombre_colegio || 'N/A',
    municipio: inscrito.nombre_municipio || 'N/A',
    departamento: inscrito.nombre_departamento || 'N/A'
  }));
};