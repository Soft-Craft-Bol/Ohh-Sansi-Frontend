import React from 'react';
import './OrdenPagoDetalle.css';
import { generateOrdenPagoPDF } from '../../utils/PDFGenerator';

const OrdenPagoDetalle = ({ data, nit_tutor }) => {
  console.log('dato de la orden',data)
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    return `Cochabamba, ${dia} de ${mes} de ${año}`;
  };

  const handleDownload = () => {
    try {
      generateOrdenPagoPDF(data)
        .save()
        .catch(error => {
          console.error('Error al generar el PDF:', error);
          alert('Ocurrió un error al generar el PDF. Por favor intente nuevamente.');//cambiar a soner, criterio de acptacion
        });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el PDF. Por favor intente nuevamente.');//cambiar a soner, criterio de acptacion
    }
  };

  return (
    <div className="orden-pago-detalle">
      <div className="cabecera">
        <div>
          <p className="titulo-uni">UNIVERSIDAD MAYOR DE SAN SIMÓN</p>
          <p className="subtitulo">FACULTAD DE CIENCIAS Y TECNOLOGÍA</p>
          <p className="subtexto">Secretaría Administrativa</p>
        </div>
        <div className="orden-numero">
          <p><strong>ORDEN DE PAGO</strong></p>
          <p className="numero-rojo">{data?.codOrdenPago || 'N°000000'}</p>
        </div>
      </div>
      <div className="datos-emisor">
        <p>
          <strong>Emitido por la unidad:</strong> 
          <span className="underline"> {data?.emisor || 'FACULTAD DE CIENCIAS Y TECNOLOGÍA'}</span>
        </p>
        <p>
          <strong>Señor(es):</strong> 
          <span className="underline"> {data?.responsablePago || 'Nombre no disponible'}</span> 
          <strong> NIT/CI:</strong> 
          <span className="underline espacio-nit">{nit_tutor}</span>
        </p>
        <p><strong>Por lo siguiente:</strong></p>
      </div>
      <table className="tabla-detalle">
        <thead>
          <tr>
            <th>CANTIDAD</th>
            <th>CONCEPTO</th>
            <th>P. UNITARIO</th>
            <th>IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data?.cantidad || 0}</td>
            <td>{data?.concepto || 'Concepto no especificado'}</td>
            <td>Bs. {data?.precio_unitario?.toFixed(2) || '0.00'}</td>
            <td>Bs. {data?.montoTotalPago?.toFixed(2) || '0.00'}</td>
          </tr>
        </tbody>
      </table>
      <p className="nota">Nota: no vale como factura oficial</p>
      <div className="totales">
        <p>
          <strong>Son:</strong> 
          <span className="underline"> {data?.precioLiteral || 'CERO 00/100'}</span> 
          Bolivianos: <span className="monto-box">{data?.montoTotalPago?.toFixed(2) || '0.00'}</span>
        </p>
      </div>
      <p className="footer-fecha">
        {formatFecha(data?.fechaEmisionOrdenPago) || 'Fecha no disponible'}
      </p>
      
      <div className="boton-descargar">
        <button className="btn-descargar" onClick={handleDownload}>
          ⬇ Descargar orden
        </button>
      </div>
    </div>
  );
};

export default OrdenPagoDetalle;