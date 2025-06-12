import React, { useState, useEffect } from 'react';
import { ButtonPrimary } from '../../button/ButtonPrimary';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getEstadoOrdenPago, getOlimpiadas } from '../../../api/api';
import Swal from 'sweetalert2';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import './ReporteOrdenPago.css';
import ExportButtons from './ExportButtons';

const ReporteOrdenPago = () => {
  // Estados para los filtros
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [selectedOlimpiada, setSelectedOlimpiada] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');

  // Estados para los datos
  const [loading, setLoading] = useState(false);
  const [loadingOlimpiadas, setLoadingOlimpiadas] = useState(true);
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [reportData, setReportData] = useState({ ordenes: [], estadosOrden: [] });

  // Cargar olimpiadas
  useEffect(() => {
    const cargarOlimpiadas = async () => {
      try {
        setLoadingOlimpiadas(true);
        const response = await getOlimpiadas();
        const data = Array.isArray(response?.data?.data) ? response.data.data :
          Array.isArray(response) ? response : [];
        setOlimpiadas(data);
      } catch (error) {
        console.error('Error al cargar olimpiadas:', error);
        Swal.fire('Error', 'No se pudieron cargar las olimpiadas', 'error');
        setOlimpiadas([]);
      } finally {
        setLoadingOlimpiadas(false);
      }
    };
    cargarOlimpiadas();
  }, []);

  // Manejar cambio de olimpiada
  const handleOlimpiadaChange = async (e) => {
    const idOlimpiada = e.target.value;
    setSelectedOlimpiada(idOlimpiada);
    setSelectedEstado('');

    if (!idOlimpiada) {
      setReportData({ ordenes: [], estadosOrden: [] });
      setOrdenesFiltradas([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getEstadoOrdenPago(idOlimpiada);

      if (response.data) {
        setReportData(response.data);
        setEstados(response.data.estadosOrden);
        aplicarFiltros(response.data.ordenes || []);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      Swal.fire('Error', 'No se pudieron cargar las órdenes', 'error');
      setReportData({ ordenes: [], estadosOrden: [] });
      setOrdenesFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  const aplicarFiltros = (ordenes = reportData.ordenes, estadosOrden = reportData.estadosOrden) => {
    let resultados = [...ordenes];

    if (selectedEstado) {
      resultados = resultados.filter(o => o.idEstado.toString() === selectedEstado.toString());
    }

    resultados = resultados.filter(o => {
      try {
        const fechaOrden = parseISO(o.fechaEmisionOrdenPago);
        if (!fechaInicio && !fechaFin) return true;

        if (fechaInicio && !fechaFin) {
          return isAfter(fechaOrden, startOfDay(fechaInicio));
        }

        if (!fechaInicio && fechaFin) {
          return isBefore(fechaOrden, endOfDay(fechaFin));
        }
        return isWithinInterval(fechaOrden, {
          start: startOfDay(fechaInicio),
          end: endOfDay(fechaFin)
        });
      } catch {
        return false;
      }
    });

    setOrdenesFiltradas(resultados);
  };

  const handleApplyFilters = () => {
    aplicarFiltros();
  };

  return (
    <div className="rop-container">
      <h2 className="rop-title">Reporte de Órdenes de Pago</h2>

      {/* Filtros */}
      <div className="rop-filters">
        <div className="rop-filter-group">
          <label className="rop-label">Olimpiada:</label>
          <select
            className="rop-select"
            value={selectedOlimpiada}
            onChange={handleOlimpiadaChange}
            disabled={loadingOlimpiadas}
          >
            <option value="">Seleccionar olimpiada</option>
            {olimpiadas.map(olimpiada => (
              <option key={olimpiada.idOlimpiada} value={olimpiada.idOlimpiada}>
                {olimpiada.nombreOlimpiada}
              </option>
            ))}
          </select>
        </div>

        <div className="rop-filter-group">
          <label className="rop-label">Estado:</label>
          <select
            className="rop-select"
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            disabled={!selectedOlimpiada || estados.length === 0}
          >
            <option value="">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado.idEstado} value={estado.idEstado}>
                {estado.estado}
              </option>
            ))}
          </select>
        </div>

        <div className="rop-filter-group">
          <label className="rop-label">Fecha Inicio:</label>
          <DatePicker
            selected={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
            dateFormat="dd/MM/yyyy"
            locale={es}
            className="rop-datepicker"
            selectsStart
            startDate={fechaInicio}
            endDate={fechaFin}
          />
        </div>

        <div className="rop-filter-group">
          <label className="rop-label">Fecha Fin:</label>
          <DatePicker
            selected={fechaFin}
            onChange={(date) => setFechaFin(date)}
            dateFormat="dd/MM/yyyy"
            locale={es}
            className="rop-datepicker"
            selectsEnd
            startDate={fechaInicio}
            endDate={fechaFin}
            minDate={fechaInicio}
          />
        </div>
        <div className="rop-filter-group" style={{ alignSelf: 'flex-end' }}>
          <ButtonPrimary onClick={handleApplyFilters}>
            Aplicar filtros
          </ButtonPrimary>
        </div>
      </div>

      {/* Resultados */}
      {ordenesFiltradas.length > 0 ? (
        <div className="rop-results">
          <div className="rop-results-header">
            <h3 className="rop-results-title">Resultados: {ordenesFiltradas.length} órdenes encontradas</h3>

            <ExportButtons
              data={ordenesFiltradas}
              title={`Reporte de Órdenes - ${olimpiadas.find(o => o.idOlimpiada == selectedOlimpiada)?.nombreOlimpiada || ''}`}
              dateRange={{ start: fechaInicio, end: fechaFin }}
              exportFunctions={{
                pdf: exportToPDF,
                excel: exportToExcel,
                csv: exportToCSV
              }}
              estados={reportData.estadosOrden}
            />
          </div>

          <div className="rop-table-container">
            <table className="rop-table">
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
                {ordenesFiltradas.map((orden) => {
                  const estadoObj = reportData.estadosOrden.find(e => e.idEstado === orden.idEstado);
                  const estado = estadoObj ? estadoObj.estado : 'DESCONOCIDO';
                  return (
                    <tr key={orden.idOrdenPago}>
                      <td>{orden.codOrdenPago}</td>
                      <td>{format(parseISO(orden.fechaEmisionOrdenPago), 'dd/MM/yyyy')}</td>
                      <td>{format(parseISO(orden.fechaVencimiento), 'dd/MM/yyyy')}</td>
                      <td>{orden.responsablePago}</td>
                      <td>{orden.concepto}</td>
                      <td>{orden.montoTotalPago?.toFixed(2)}</td>
                      <td>{estado}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rop-empty">
          {selectedOlimpiada ? 'No se encontraron órdenes con los filtros aplicados' : 'Seleccione una olimpiada para comenzar'}
        </div>
      )}
    </div>
  );
};

export default ReporteOrdenPago;