// src/components/ReporteOrdenPago.jsx
import React, { useState } from 'react';
import { ButtonPrimary } from '../../button/ButtonPrimary';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getReporteOrdenPago } from '../../../api/api';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mapDataForTable } from '../../../utils/exportUtils';
import './ReporteOrdenPago.css';
import ExportButtons from './ExportButtons';

const ReporteOrdenPago = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const handleGenerarReporte = async () => {
    try {
      setLoading(true);
      
      const fechaInicioFormatted = format(fechaInicio, 'dd/MM/yyyy');
      const fechaFinFormatted = format(fechaFin, 'dd/MM/yyyy');

      const response = await getReporteOrdenPago(fechaInicioFormatted, fechaFinFormatted);
      
      if (response.data) {
        setReportData(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Reporte generado',
          text: `Se encontraron ${response.data.length} órdenes de pago`,
          background: 'var(--light)',
          color: 'var(--dark)'
        });
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al generar el reporte',
        background: 'var(--light)',
        color: 'var(--dark)'
      });
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const tableData = mapDataForTable(reportData);

  return (
    <div className="reporte-container">
      <h2>Reporte de Órdenes de Pago</h2>
      <div className="filtros-container">
        <div className="date-picker-group">
          <label>Fecha Inicio:</label>
          <DatePicker
            selected={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
            dateFormat="dd/MM/yyyy"
            locale={es}
            className="date-picker-input"
          />
        </div>
        <div className="date-picker-group">
          <label>Fecha Fin:</label>
          <DatePicker
            selected={fechaFin}
            onChange={(date) => setFechaFin(date)}
            dateFormat="dd/MM/yyyy"
            locale={es}
            className="date-picker-input"
            minDate={fechaInicio}
          />
        </div>
        <ButtonPrimary 
          onClick={handleGenerarReporte}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Generar Reporte'}
        </ButtonPrimary>
      </div>
      
      {reportData.length > 0 && (
        <div className="reporte-actions">
          <h3>Resultados: {reportData.length} órdenes encontradas</h3>
          <ExportButtons 
            reportData={reportData}
            dateRange={{
              start: fechaInicio,
              end: fechaFin
            }}
            title="Reporte de Órdenes de Pago"
          />

          <div className="reporte-table-container">
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Vencimiento</th>
                  <th>Responsable</th>
                  <th>Concepto</th>
                  <th>Monto (BOB)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.codigo}</td>
                    <td>{item.fechaEmision}</td>
                    <td>{item.fechaVencimiento}</td>
                    <td>{item.responsable}</td>
                    <td>{item.concepto}</td>
                    <td>{item.monto}</td>
                    <td>{item.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteOrdenPago;