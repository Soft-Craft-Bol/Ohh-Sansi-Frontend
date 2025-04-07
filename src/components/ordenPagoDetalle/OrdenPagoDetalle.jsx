import React from 'react';
import './OrdenPagoDetalle.css';

const OrdenPagoDetalle = () => {
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
          <p className="numero-rojo">N°001233</p>
        </div>
      </div>
      <div className="datos-emisor">
        <p><strong>Emitido por la unidad:</strong> <span className="underline">FACULTAD DE CIENCIAS Y TECNOLOGÍA</span></p>
        <p><strong>Señor(es):</strong> <span className="underline">Alfredo Ernesto Torrico Garcia</span> <strong>NIT/CI:</strong> <span className="underline espacio-nit"></span></p>
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
            <td>20</td>
            <td>Inscripción a la olimpiada estudiantil</td>
            <td>Bs. 35</td>
            <td>Bs. 700</td>
          </tr>
          {/* <tr><td colSpan="4">&nbsp;</td></tr> */}
          
        </tbody>
      </table>
      <p className="nota">Nota: no vale como factura oficial</p>
      <div className="totales">
        <p><strong>Son:</strong> <span className="underline">SETECIENTOS 00/100</span> Bolivianos: <span className="monto-box">700</span></p>
      </div>
      <p className="footer-fecha">Cochabamba, 02 de abril de 2025</p>
      <div className="boton-descargar">
        <button className="btn-descargar">⬇ Descargar orden</button>
      </div>
    </div>
  );
};

export default OrdenPagoDetalle;