import React, { useState, useMemo, useEffect } from "react";
import { Eye, Check, X, FileText, Clock, CheckCircle, XCircle, ArrowLeft, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import { getVerificacionComprobantePagos, VerificacionComprobantePagos } from '../../../api/api';
import "./PaymentVerification.css";

const PaymentVerification = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [apiData, setApiData] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPaymentData = async () => {
    setIsLoading(true);
    try {
      const response = await getVerificacionComprobantePagos();
      setApiData(response.data || []);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      showErrorAlert("Error al cargar los comprobantes");
      setApiData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const transformApiData = (data) => {
    return data.map(item => ({
      id: item.id_comprobante_pago,
      id_inscripcion: item.id_inscripcion,
      id_orden_pago: item.id_orden_pago,
      ordenante: item.nombre_receptor,
      monto: item.monto_pagado,
      fecha: item.fecha_pago,
      codigo_transaccion: item.cod_transaccion || "N/A",
      estado: item.id_estado_comprobante,
      imagen_comprobante: item.imagen_comprobante,
      notas: item.notas_adicionales || "Sin notas adicionales"
    }));
  };


  const getEstadoLabel = (estadoId) => {
    switch (estadoId) {
      case 2: return { label: "Pendiente", icon: <Clock size={16} />, color: "var(--veo-warning)" };
      case 1: return { label: "Verificado", icon: <CheckCircle size={16} />, color: "var(--veo-success)" };
      case 3: return { label: "Rechazado", icon: <XCircle size={16} />, color: "var(--veo-danger)" };
      default: return { label: "Desconocido", icon: <FileText size={16} />, color: "var(--veo-gray)" };
    }
  };

  const paymentsData = useMemo(() => {
    const transformedData = transformApiData(apiData);
    
    return {
      pendientes: transformedData.filter(item => item.estado === 2),
      verificados: transformedData.filter(item => item.estado === 1),
      rechazados: transformedData.filter(item => item.estado === 3)
    };
  }, [apiData]);

  const tabs = [
    { id: "todos", label: "Todos", icon: <FileText size={18} />, count: apiData.length },
    { id: "pendientes", label: "Pendientes", icon: <Clock size={18} />, count: paymentsData.pendientes.length },
    { id: "verificados", label: "Verificados", icon: <CheckCircle size={18} />, count: paymentsData.verificados.length },
    { id: "rechazados", label: "Rechazados", icon: <XCircle size={18} />, count: paymentsData.rechazados.length }
  ];

  const getCurrentData = () => {
    if (activeTab === "todos") return transformApiData(apiData);
    return paymentsData[activeTab] || [];
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: 'var(--veo-primary)'
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      confirmButtonColor: 'var(--veo-primary)'
    });
  };

  const handleVerificar = async (paymentId) => {
    const result = await Swal.fire({
      title: '¿Confirmar verificación?',
      text: "¿Estás seguro de que deseas verificar este pago?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--veo-success)',
      cancelButtonColor: 'var(--veo-danger)',
      confirmButtonText: 'Sí, verificar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await VerificacionComprobantePagos(paymentId, 1); 
        showSuccessAlert('El pago ha sido verificado correctamente');
        fetchPaymentData(); 
      } catch (error) {
        console.error('Error verifying payment:', error);
        showErrorAlert('Error al verificar el pago');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRechazar = async (paymentId) => {
    const result = await Swal.fire({
      title: '¿Confirmar rechazo?',
      text: "¿Estás seguro de que deseas rechazar este pago?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--veo-danger)',
      cancelButtonColor: 'var(--veo-gray)',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await VerificacionComprobantePagos(paymentId, 3);
        showSuccessAlert('El pago ha sido rechazado correctamente');
        fetchPaymentData();
      } catch (error) {
        console.error('Error rejecting payment:', error);
        showErrorAlert('Error al rechazar el pago');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerComprobante = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const downloadComprobante = () => {
    if (!selectedPayment?.imagen_comprobante) {
      showErrorAlert('No hay comprobante disponible para descargar');
      return;
    }
    
    const link = document.createElement('a');
    link.href = selectedPayment.imagen_comprobante;
    link.download = `comprobante-${selectedPayment.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentData = getCurrentData();

  return (
    <div className="veo-container">
      {/* Header */}
      <div className="veo-header">
        <h1 className="veo-title">Verificación de Pagos</h1>
        <p className="veo-subtitle">Sistema de gestión de comprobantes de pago</p>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="veo-loading-overlay">
          <div className="veo-loading-spinner"></div>
        </div>
      )}

      {/* Tabs */}
      <div className="veo-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`veo-tab ${activeTab === tab.id ? 'veo-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            disabled={isLoading}
          >
            <span className="veo-tab-icon">{tab.icon}</span>
            {tab.label}
            {tab.count > 0 && (
              <span className="veo-tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="veo-content">  
        {/* Table */}
        <div className="veo-table-container">
          {currentData.length > 0 ? (
            <table className="veo-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ordenante</th>
                  <th>Monto (Bs)</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((payment) => {
                  const estado = getEstadoLabel(payment.estado);
                  return (
                    <tr key={payment.id} className="veo-table-row">
                      <td className="veo-id-cell">#{payment.id}</td>
                      <td>{payment.ordenante}</td>
                      <td className="veo-amount">{payment.monto.toFixed(2)}</td>
                      <td className="veo-date">{payment.fecha}</td>
                      <td>
                        <span className="veo-status" style={{ backgroundColor: `${estado.color}20`, color: estado.color }}>
                          {estado.icon}
                          {estado.label}
                        </span>
                      </td>
                      <td>
                        <div className="veo-actions">
                          <button 
                            className="veo-btn veo-btn-view" 
                            onClick={() => handleVerComprobante(payment)}
                            disabled={isLoading}
                          >
                            <Eye size={16} /> Ver Comprobante
                          </button>
                          {payment.estado === 2 && (
                            <>
                              <button 
                                className="veo-btn veo-btn-verify" 
                                onClick={() => handleVerificar(payment.id)}
                                disabled={isLoading}
                              >
                                <Check size={16} /> Aprobar
                              </button>
                              <button 
                                className="veo-btn veo-btn-reject" 
                                onClick={() => handleRechazar(payment.id)}
                                disabled={isLoading}
                              >
                                <X size={16} /> Rechazar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="veo-empty-state">
              <FileText size={48} />
              <p>No hay pagos en esta categoría</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPayment && (
        <div className="veo-modal-overlay">
          <div className="veo-modal">
            <div className="veo-modal-header">
              <button className="veo-btn veo-btn-back" onClick={closeModal}>
                <ArrowLeft size={20} /> Volver
              </button>
              <h2>Comprobante de Pago #{selectedPayment.id}</h2>
              <button className="veo-btn veo-btn-download" onClick={downloadComprobante}>
                <Download size={18} /> Descargar
              </button>
            </div>
            
            <div className="veo-modal-content">
              <div className="veo-payment-details">
                <div className="veo-detail-item">
                  <span className="veo-detail-label">Ordenante:</span>
                  <span>{selectedPayment.ordenante}</span>
                </div>
                <div className="veo-detail-item">
                  <span className="veo-detail-label">ID Inscripción:</span>
                  <span>#{selectedPayment.id_inscripcion}</span>
                </div>
                <div className="veo-detail-item">
                  <span className="veo-detail-label">ID Orden de Pago:</span>
                  <span>#{selectedPayment.id_orden_pago}</span>
                </div>
                <div className="veo-detail-item">
                  <span className="veo-detail-label">Monto:</span>
                  <span className="veo-amount">{selectedPayment.monto.toFixed(2)} Bs</span>
                </div>
                <div className="veo-detail-item">
                  <span className="veo-detail-label">Fecha:</span>
                  <span>{selectedPayment.fecha}</span>
                </div>
                <div className="veo-detail-item">
                  <span className="veo-detail-label">Código Transacción:</span>
                  <span>{selectedPayment.codigo_transaccion}</span>
                </div>
                <div className="veo-detail-item">
                  <span className="veo-detail-label">Estado:</span>
                  <span className="veo-status" style={{ 
                    backgroundColor: `${getEstadoLabel(selectedPayment.estado).color}20`, 
                    color: getEstadoLabel(selectedPayment.estado).color 
                  }}>
                    {getEstadoLabel(selectedPayment.estado).icon}
                    {getEstadoLabel(selectedPayment.estado).label}
                  </span>
                </div>
                <div className="veo-detail-item veo-full-width">
                  <span className="veo-detail-label">Notas:</span>
                  <p className="veo-notes">{selectedPayment.notas}</p>
                </div>
              </div>
              
              <div className="veo-comprobante-image">
                <h3>Comprobante:</h3>
                {selectedPayment.imagen_comprobante ? (
                  <img 
                    src={selectedPayment.imagen_comprobante} 
                    alt={`Comprobante de pago #${selectedPayment.id}`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23ccc"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="Arial" font-size="10">Imagen no disponible</text></svg>';
                    }}
                  />
                ) : (
                  <div className="veo-no-image">
                    <FileText size={48} />
                    <p>No hay imagen de comprobante disponible</p>
                  </div>
                )}
              </div>
            </div>
            
            {selectedPayment.estado === 2 && (
              <div className="veo-modal-actions">
                <button 
                  className="veo-btn veo-btn-verify" 
                  onClick={() => {
                    handleVerificar(selectedPayment.id);
                    closeModal();
                  }}
                  disabled={isLoading}
                >
                  <Check size={18} /> Aprobar Pago
                </button>
                <button 
                  className="veo-btn veo-btn-reject" 
                  onClick={() => {
                    handleRechazar(selectedPayment.id);
                    closeModal();
                  }}
                  disabled={isLoading}
                >
                  <X size={18} /> Rechazar Pago
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;