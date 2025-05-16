import React, { useState, useEffect } from 'react';
import { ButtonPrimary } from '../../button/ButtonPrimary';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getEstadoOrdenPago } from '../../../api/api';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SummaryCard from './SummaryCard';
import './OrderSummaryDashboard.css';

const OrderSummaryDashboard = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
    totalAmount: '0 BOB',
    collectedAmount: '0 BOB',
    pendingAmount: '0 BOB'
  });

  const handleGenerarReporte = async () => {
    try {
      setLoading(true);
      
      const fechaInicioFormatted = format(fechaInicio, 'dd/MM/yyyy');
      const fechaFinFormatted = format(fechaFin, 'dd/MM/yyyy');

      const response = await getEstadoOrdenPago({
        fechaInicio: fechaInicioFormatted,
        fechaFin: fechaFinFormatted
      });
      
      if (response?.data?.length > 0) {
        const data = response.data[0];
        setSummaryData({
          totalOrders: data.total_ordenes || 0,
          paidOrders: data.ordenes_pagadas || 0,
          pendingOrders: data.ordenes_pendientes || 0,
          canceledOrders: data.ordenes_canceladas || 0,
          totalAmount: `${(data.monto_total || 0).toFixed(2)} BOB`,
          collectedAmount: `${(data.monto_recaudado || 0).toFixed(2)} BOB`,
          pendingAmount: `${(data.monto_pendiente || 0).toFixed(2)} BOB`
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Datos actualizados',
          text: `Resumen de órdenes cargado correctamente`,
          background: 'var(--light)',
          color: 'var(--dark)'
        });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al cargar el resumen de órdenes',
        background: 'var(--light)',
        color: 'var(--dark)'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reporte-container">
      <h2>Resumen de Órdenes de Pago</h2>
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
          {loading ? 'Cargando...' : 'Actualizar Datos'}
        </ButtonPrimary>
      </div>
      
      <div className="summary-grid">
        <SummaryCard 
          title="Total Órdenes" 
          value={summaryData.totalOrders} 
          iconType="total"
        />
        <SummaryCard 
          title="Órdenes Pagadas" 
          value={summaryData.paidOrders} 
          iconType="paid"
        />
        <SummaryCard 
          title="Órdenes Pendientes" 
          value={summaryData.pendingOrders} 
          iconType="pending"
        />
        <SummaryCard 
          title="Órdenes Canceladas" 
          value={summaryData.canceledOrders} 
          iconType="canceled"
        />
        <SummaryCard 
          title="Monto Total" 
          value={summaryData.totalAmount} 
          iconType="amount"
          isAmount={true}
        />
        <SummaryCard 
          title="Monto Recaudado" 
          value={summaryData.collectedAmount} 
          iconType="collected"
          isAmount={true}
        />
        <SummaryCard 
          title="Monto Pendiente" 
          value={summaryData.pendingAmount} 
          iconType="pendingAmount"
          isAmount={true}
        />
      </div>
    </div>
  );
};

export default OrderSummaryDashboard;