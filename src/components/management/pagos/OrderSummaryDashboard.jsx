import React, { useState, useEffect } from 'react';
import { ButtonPrimary } from '../../button/ButtonPrimary';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getEstadoPagos, getOlimpiadas } from '../../../api/api';
import Swal from 'sweetalert2';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval, isBefore, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { exportComprobantesToPDF, exportComprobantesToExcel, exportComprobantesToCSV } from '../../../utils/exportUtils';
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
  const [comprobantesFiltrados, setComprobantesFiltrados] = useState([]);
  const [reportData, setReportData] = useState({ comprobantesPago: [], estadosComprobantePago: [] });

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
      setReportData({ comprobantesPago: [], estadosComprobantePago: [] });
      setComprobantesFiltrados([]);
      setEstados([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getEstadoPagos(idOlimpiada);

      if (response?.data) {
        // Asegurar que siempre tenemos arrays, aunque estén vacíos
        const comprobantesPago = Array.isArray(response.data.comprobantesPago) 
          ? response.data.comprobantesPago 
          : [];
        const estadosComprobantePago = Array.isArray(response.data.estadosComprobantePago) 
          ? response.data.estadosComprobantePago 
          : [];

        const newReportData = {
          comprobantesPago,
          estadosComprobantePago
        };

        setReportData(newReportData);
        setEstados(estadosComprobantePago);
        setComprobantesFiltrados(comprobantesPago);
      } else {
        // Si no hay datos, establecer arrays vacíos
        const emptyData = { comprobantesPago: [], estadosComprobantePago: [] };
        setReportData(emptyData);
        setEstados([]);
        setComprobantesFiltrados([]);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      Swal.fire('Error', 'No se pudieron cargar las órdenes', 'error');
      
      // En caso de error, establecer arrays vacíos
      const emptyData = { comprobantesPago: [], estadosComprobantePago: [] };
      setReportData(emptyData);
      setComprobantesFiltrados([]);
      setEstados([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (comprobantes = reportData.comprobantesPago, estadosComprobante = reportData.estadosComprobantePago) => {
    // Asegurar que comprobantes es un array
    const comprobantesArray = Array.isArray(comprobantes) ? comprobantes : [];
    let resultados = [...comprobantesArray];

    if (selectedEstado) {
      resultados = resultados.filter(c => 
        c.idEstadoComprobante?.toString() === selectedEstado.toString()
      );
    }

    resultados = resultados.filter(c => {
      try {
        // Verificar que fechaPago existe
        if (!c.fechaPago) return false;
        
        const fechaPago = parseISO(c.fechaPago);
        
        if (!fechaInicio && !fechaFin) return true;
        
        if (fechaInicio && !fechaFin) {
          return isAfter(fechaPago, startOfDay(fechaInicio));
        }
        
        if (!fechaInicio && fechaFin) {
          return isBefore(fechaPago, endOfDay(fechaFin));
        }
        
        return isWithinInterval(fechaPago, {
          start: startOfDay(fechaInicio),
          end: endOfDay(fechaFin)
        });
      } catch {
        return false;
      }
    });

    setComprobantesFiltrados(resultados);
  };

  const handleApplyFilters = () => {
    aplicarFiltros();
  };

  return (
    <div className="rop-container">
      <h2 className="rop-title">Reporte de Pagos</h2>

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
            disabled={!selectedOlimpiada || !Array.isArray(estados) || estados.length === 0}
          >
            <option value="">Todos los estados</option>
            {Array.isArray(estados) && estados.map(estadoComprobantePago => (
              <option key={estadoComprobantePago.idEstadoComprobantePago} value={estadoComprobantePago.idEstadoComprobantePago}>
                {estadoComprobantePago.nombreEstadoComprobante}
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

      {/* Loading indicator */}
      {loading && (
        <div className="rop-loading">
          Cargando datos...
        </div>
      )}

      {/* Resultados */}
      {!loading && Array.isArray(comprobantesFiltrados) && comprobantesFiltrados.length > 0 ? (
        <div className="rop-results">
          <div className="rop-results-header">
            <h3 className="rop-results-title">Resultados: {comprobantesFiltrados.length} comprobantes encontrados</h3>

            <ExportButtons
              data={comprobantesFiltrados}
              title={`Reporte de Comprobantes - ${olimpiadas.find(o => o.idOlimpiada == selectedOlimpiada)?.nombreOlimpiada || ''}`}
              dateRange={{ start: fechaInicio, end: fechaFin }}
              exportFunctions={{
                pdf: exportComprobantesToPDF,
                excel: exportComprobantesToExcel,
                csv: exportComprobantesToCSV
              }}
              estados={Array.isArray(reportData.estadosComprobantePago) ? reportData.estadosComprobantePago : []} />
          </div>

          <div className="rop-table-container">
            <table className="rop-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fecha Pago</th>
                  <th>Nombre Receptor</th>
                  <th>Notas Adicionales</th>
                  <th>Monto (BOB)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {comprobantesFiltrados.map((comprobante) => {
                  const estadoObj = Array.isArray(reportData.estadosComprobantePago) 
                    ? reportData.estadosComprobantePago.find(e => e.idEstadoComprobantePago === comprobante.idEstadoComprobante)
                    : null;
                  const estado = estadoObj ? estadoObj.nombreEstadoComprobante : 'DESCONOCIDO';
                  
                  return (
                    <tr key={comprobante.idComprobantePago}>
                      <td>{comprobante.codTransaccion || 'N/A'}</td>
                      <td>
                        {comprobante.fechaPago 
                          ? format(parseISO(comprobante.fechaPago), 'dd/MM/yyyy')
                          : 'N/A'
                        }
                      </td>
                      <td>{comprobante.nombreReceptor || 'N/A'}</td>
                      <td>{comprobante.notasAdicionales || 'N/A'}</td>
                      <td>{comprobante.montoPagado?.toFixed(2) || '0.00'}</td>
                      <td>{estado}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : !loading && selectedOlimpiada ? (
        <div className="rop-empty">
          No se encontraron órdenes con los filtros aplicados
        </div>
      ) : !loading ? (
        <div className="rop-empty">
          Seleccione una olimpiada para comenzar
        </div>
      ) : null}
    </div>
  );
};

export default ReporteOrdenPago;