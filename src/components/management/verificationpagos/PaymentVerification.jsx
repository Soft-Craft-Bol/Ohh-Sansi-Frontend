import React, { useState, useMemo } from "react";
import { Eye, Check, X } from 'lucide-react';
import "./PaymentVerification.css";

const PaymentVerification = () => {
  const [activeTab, setActiveTab] = useState("pendientes");

  // Datos de ejemplo
  const paymentsData = {
    pendientes: [
      {
        id: "PAY-001",
        institucion: "Colegio San Simón",
        monto: 350,
        fecha: "15/08/2023",
        metodo: "QR",
        participantes: 7,
        estado: "Pendiente"
      },
      {
        id: "PAY-004",
        institucion: "Colegio Americano",
        monto: 400,
        fecha: "10/08/2023",
        metodo: "QR",
        participantes: 8,
        estado: "Pendiente"
      }
    ],
    verificados: [
      {
        id: "PAY-002",
        institucion: "Instituto Nacional",
        monto: 525,
        fecha: "12/08/2023",
        metodo: "Transferencia",
        participantes: 10,
        estado: "Verificado"
      }
    ],
    rechazados: [
      {
        id: "PAY-003",
        institucion: "Colegio Central",
        monto: 280,
        fecha: "08/08/2023",
        metodo: "QR",
        participantes: 6,
        estado: "Rechazado"
      }
    ]
  };

  const tabs = [
    { id: "pendientes", label: "Pendientes", count: paymentsData.pendientes.length },
    { id: "verificados", label: "Verificados", count: paymentsData.verificados.length },
    { id: "rechazados", label: "Rechazados", count: paymentsData.rechazados.length },
    { id: "todos", label: "Todos", count: Object.values(paymentsData).flat().length }
  ];

  const getCurrentData = () => {
    if (activeTab === "todos") {
      return Object.values(paymentsData).flat();
    }
    return paymentsData[activeTab] || [];
  };

  const handleVerificar = (paymentId) => {
    console.log(`Verificando pago: ${paymentId}`);
    // Aquí iría la lógica para verificar el pago
  };

  const handleRechazar = (paymentId) => {
    console.log(`Rechazando pago: ${paymentId}`);
    // Aquí iría la lógica para rechazar el pago
  };

  const handleVerComprobante = (paymentId) => {
    console.log(`Ver comprobante: ${paymentId}`);
    // Aquí iría la lógica para mostrar el comprobante
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "veo-badge-warning";
      case "verificado":
        return "veo-badge-success";
      case "rechazado":
        return "veo-badge-danger";
      default:
        return "veo-badge-default";
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="veo-container">
      {/* Header */}
      <div className="veo-header">
        <h1 className="veo-title">Verificación de Pagos</h1>
      </div>

      {/* Tabs */}
      <div className="veo-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`veo-tab ${activeTab === tab.id ? 'veo-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="veo-tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="veo-content">
        <div className="veo-section">
          <h2 className="veo-section-title">
            {activeTab === "pendientes" && "Pagos Pendientes"}
            {activeTab === "verificados" && "Pagos Verificados"}
            {activeTab === "rechazados" && "Pagos Rechazados"}
            {activeTab === "todos" && "Todos los Pagos"}
          </h2>
          <p className="veo-section-description">
            {activeTab === "pendientes" && "Revise y verifique los pagos pendientes"}
            {activeTab === "verificados" && "Pagos que han sido verificados"}
            {activeTab === "rechazados" && "Pagos que han sido rechazados"}
            {activeTab === "todos" && "Vista general de todos los pagos"}
          </p>
        </div>

        {/* Table */}
        <div className="veo-table-container">
          <table className="veo-table">
            <thead className="veo-table-header">
              <tr>
                <th className="veo-table-th">ID</th>
                <th className="veo-table-th">Institución</th>
                <th className="veo-table-th">Monto (Bs)</th>
                <th className="veo-table-th">Fecha</th>
                <th className="veo-table-th">Método</th>
                <th className="veo-table-th">Participantes</th>
                <th className="veo-table-th">Estado</th>
                <th className="veo-table-th">Acciones</th>
              </tr>
            </thead>
            <tbody className="veo-table-body">
              {currentData.map((payment, index) => (
                <tr key={payment.id} className="veo-table-row">
                  <td className="veo-table-cell veo-cell-id">{payment.id}</td>
                  <td className="veo-table-cell">{payment.institucion}</td>
                  <td className="veo-table-cell veo-cell-amount">{payment.monto}</td>
                  <td className="veo-table-cell">{payment.fecha}</td>
                  <td className="veo-table-cell">{payment.metodo}</td>
                  <td className="veo-table-cell veo-cell-center">{payment.participantes}</td>
                  <td className="veo-table-cell">
                    <span className={`veo-badge ${getEstadoBadgeClass(payment.estado)}`}>
                      {payment.estado}
                    </span>
                  </td>
                  <td className="veo-table-cell">
                    <div className="veo-actions">
                      <button
                        className="veo-btn veo-btn-view"
                        onClick={() => handleVerComprobante(payment.id)}
                        title="Ver Comprobante"
                      >
                        <Eye size={16} />
                        Ver Comprobante
                      </button>
                      {payment.estado.toLowerCase() === "pendiente" && (
                        <>
                          <button
                            className="veo-btn veo-btn-verify"
                            onClick={() => handleVerificar(payment.id)}
                            title="Verificar"
                          >
                            <Check size={16} />
                            Verificar
                          </button>
                          <button
                            className="veo-btn veo-btn-reject"
                            onClick={() => handleRechazar(payment.id)}
                            title="Rechazar"
                          >
                            <X size={16} />
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentData.length === 0 && (
            <div className="veo-empty-state">
              <p>No hay pagos en esta categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;