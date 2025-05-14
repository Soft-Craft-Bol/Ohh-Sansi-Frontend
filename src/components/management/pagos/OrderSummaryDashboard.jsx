import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import DateRangePicker from './DateRangePicker';
import ExportButtons from './ExportButtons';
import './OrderSummaryDashboard.css';
import { getEstadoOrdenPago } from '../../../api/api';

const OrderSummaryDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
    totalAmount: '0 BOB',
    collectedAmount: '0 BOB',
    pendingAmount: '0 BOB'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDateChange = (dates) => {
    setDateRange({
      startDate: dates.startDate,
      endDate: dates.endDate
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getEstadoOrdenPago();
        
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
        }
      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Resumen de Órdenes</h1>
        <div className="dashboard-controls">
          <DateRangePicker onChange={handleDateChange} />
          <ExportButtons dateRange={dateRange} />
        </div>
      </header>

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