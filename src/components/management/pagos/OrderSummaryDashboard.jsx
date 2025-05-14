// src/components/OrderSummaryDashboard.jsx
import React, { useState } from 'react';
import SummaryCard from './SummaryCard';
import DateRangePicker from './DateRangePicker';
import ExportButtons from './ExportButtons';
import './OrderSummaryDashboard.css';
import {getEstadoOrdenPago}from '../../../api/api'

const OrderSummaryDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleDateChange = (dates) => {
    setDateRange({
      startDate: dates.startDate,
      endDate: dates.endDate
    });
  };

  const summaryData = {
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
    totalAmount: '0 BOB',
    collectedAmount: '0 BOB',
    pendingAmount: '0 BOB'
  };

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
          icon="📊"
          variant="primary"
        />
        <SummaryCard 
          title="Órdenes Pagadas" 
          value={summaryData.paidOrders} 
          icon="✅"
          variant="success"
        />
        <SummaryCard 
          title="Órdenes Pendientes" 
          value={summaryData.pendingOrders} 
          icon="⏳"
          variant="warning"
        />
        <SummaryCard 
          title="Órdenes Canceladas" 
          value={summaryData.canceledOrders} 
          icon="❌"
          variant="danger"
        />
        <SummaryCard 
          title="Monto Total" 
          value={summaryData.totalAmount} 
          icon="💰"
          variant="info"
          isAmount={true}
        />
        <SummaryCard 
          title="Monto Recaudado" 
          value={summaryData.collectedAmount} 
          icon="💳"
          variant="success"
          isAmount={true}
        />
        <SummaryCard 
          title="Monto Pendiente" 
          value={summaryData.pendingAmount} 
          icon="🔄"
          variant="warning"
          isAmount={true}
        />
      </div>
    </div>
  );
};

export default OrderSummaryDashboard;