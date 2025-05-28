import React, { useState, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getEstudianteByCarnet, verificarPago, getEstadoPago } from '../../api/api';
import Header from '../../components/header/Header';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';
import ImageScanner from '../../components/camScanner/ImageScanner';
import uploadImageToCloudinary from '../../utils/uploadImageToCloudinary';
import './Comprobante.css';

export default function Comprobante() {
  // ─── Estados ───────────────────────────────────────────────────────────
   const [codigoUnico, setCodigoUnico] = useState('');
  const [estadoPago, setEstadoPago] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [attempts, setAttempts] = useState(2);
  const [scanComplete, setScanComplete] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // ─── Funciones ──────────────────────────────────────────────────────────

  const handleVerifyCodigo = useCallback(async () => {
    if (!codigoUnico.trim()) {
      Swal.fire('Código vacío', 'Ingresa tu código único de inscripción.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const response = await getEstadoPago(codigoUnico);
      setEstadoPago(response.data);
      
      // Validar estado de pago
      if (response.data.estadoPago === 'Pago verificado') {
        Swal.fire(
          'Pago ya verificado',
          'Este código ya tiene un pago verificado, no es necesario subir comprobante.',
          'info'
        );
      } else if (response.data.mensaje === 'El participante no generó orden de pago') {
        Swal.fire(
          'Sin orden de pago',
          'Debes generar primero una orden de pago antes de subir comprobante.',
          'warning'
        );
      }
    } catch (err) {
      if (err.response?.status === 404) {
        Swal.fire('No encontrado', 'El código no está registrado.', 'error');
      } else {
        Swal.fire(
          'Error',
          err.response?.data?.message || err.message || 'Error al verificar código',
          'error'
        );
      }
      setEstadoPago(null);
    } finally {
      setIsLoading(false);
    }
  }, [codigoUnico]);

  const handleImageUpload = useCallback(event => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setScanComplete(false);
    }
  }, []);

  const handleImageCropped = useCallback(imageUrl => {
    setCroppedImage(imageUrl);
    setAttempts(prev => prev - 1);
  }, []);

  const handleRetry = useCallback(() => {
    if (attempts > 0) {
      setSelectedImage(null);
      setCroppedImage(null);
    }
  }, [attempts]);

  const handleScanComplete = useCallback((text, data) => {
    setExtractedText(text);
    setReceiptData({
      codTransaccion: data.codTransaccion || '',
      nombreReceptor: data.nombreReceptor || '',
      notasAdicionales: text, // Usamos el texto completo OCR
      montoPagado: data.montoPagado || '',
      carnetIdentidad: data.carnetIdentidad || '',
      fechaPago: data.fechaPago || ''
    });
    setScanComplete(true);
     if (!ocrIsValid) setAttempts(prev => prev - 1);
  }, []);

  // Función para subir la imagen y verificar el pago
  const handleSubmitReceipt = useCallback(async () => {
    if (!receiptData || !croppedImage) return;

    setIsUploading(true);
    try {
      // 1. Convertir imagen cropped a Blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'comprobante.jpg', { type: 'image/jpeg' });

      // 2. Subir a Cloudinary
      const imageUrl = await uploadImageToCloudinary(file);

      // 3. Preparar datos para verificarPago
      const pagoData = {
        carnetIdentidad: carnet || receiptData.carnetIdentidad,
        montoPagado: parseFloat(receiptData.montoPagado) || 0,
        fechaPago: receiptData.fechaPago || new Date().toISOString().split('T')[0],
        codTransaccion: receiptData.codTransaccion || '',
        imagenComprobante: imageUrl,
        nombreReceptor: receiptData.nombreReceptor || '',
        estadoOrden: "PAGADO",
        notasAdicionales: receiptData.notasAdicionales || ''
      };

      // 4. Llamar a verificarPago
      const responsePago = await verificarPago(pagoData);
      console.log("Respuesta del backend:", responsePago.data);
      // 5. Mostrar resultado
      if (responsePago.data && responsePago.status === 200) {
        Swal.fire(
          '¡Pago verificado!',
          'Tu comprobante ha sido registrado correctamente.',
          'success'
        );


        // Resetear el formulario
        setSelectedImage(null);
        setCroppedImage(null);
        setScanComplete(false);
        setAttempts(2);
        setExtractedText('');
        setReceiptData(null);
      } else {
        throw new Error('No se pudo verificar el pago. Inténtalo nuevamente.');
      }

    } catch (error) {
      console.error('Error al verificar pago:', error);
      const mensajeError = error.response?.data || error.message || 'Ocurrió un error';
      const mensajeLimpio = typeof mensajeError === 'string'
        ? mensajeError.replace(/^ERROR:\s*/i, '')
        : 'Ocurrió un error al verificar el pago';

      Swal.fire('Error', mensajeLimpio, 'error');
    } finally {
      setIsUploading(false);
    }
  }, [croppedImage, receiptData]);

  // ─── Render ─────────────────────────────────jhj────────────────────────────
   if (!estadoPago) {
    return (
      <div className="comprobante-verification">
        <Header
          title="Verificar código único"
          description="Ingresa tu código único de inscripción para continuar"
        />
        <div className="verification-form">
          <input
            type="text"
            className="carnet-input"
            placeholder="Ej: LG614I"
            value={codigoUnico}
            onChange={e => setCodigoUnico(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="carnet-btn"
            onClick={handleVerifyCodigo}
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : <FaSearch />}
          </button>
        </div>
      </div>
    );
  }

  if (estadoPago.estadoPago === 'Pago verificado') {
    return (
      <div className="comprobante-verification">
        <Header
          title="Estado de pago"
          description="Tu pago ya ha sido verificado"
        />
        <div className="pago-verificado">
          <div className="pago-info">
            <h3>Pago Verificado</h3>
            <p>No es necesario subir comprobante adicional.</p>
            <div className="pago-details">
              <p><strong>Código:</strong> {codigoUnico}</p>
              <p><strong>Nombre:</strong> {estadoPago.nombreParticipante} {estadoPago.apellidoPaterno} {estadoPago.apellidoMaterno}</p>
              <p><strong>Monto:</strong> {estadoPago.montoTotalPago} Bs.</p>
              <p><strong>Responsable:</strong> {estadoPago.responsablePago}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

   if (estadoPago.mensaje === 'El participante no generó orden de pago') {
    return (
      <div className="comprobante-verification">
        <Header
          title="Estado de pago"
          description="No se encontró orden de pago"
        />
        <div className="sin-orden-pago">
          <div className="pago-info">
            <h3>Orden de pago no generada</h3>
            <p>Debes generar primero una orden de pago para poder subir comprobantes.</p>
            <button 
              className="back-button"
              onClick={() => setEstadoPago(null)}
            >
              Volver a intentar
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="comprobante-container">
      <Header
        title="Comprobante de pago"
        description={`Sube tu comprobante para verificar tu inscripción (Código: ${codigoUnico})`}
      />
      <div className="comprobante-content">
        {!selectedImage ? (
          <div className="upload-section">
            {attempts > 0 ? (
              <label className="file-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <div className="upload-box">
                  <svg className="upload-icon" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <p>Selecciona tu comprobante</p>
                  <span className="file-types">Formatos aceptados: JPG, PNG</span>
                  {attempts < 2 && (
                    <p className="attempts-info">Intentos restantes: {attempts}</p>
                  )}
                </div>
              </label>
            ) : (
              <div className="upload-disabled-message">
                <p className="error-message">
                  Has alcanzado el número máximo de intentos permitidos.
                </p>
                <p>Por favor, contacta con soporte para continuar.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="editor-section">
            {!scanComplete ? (
              <>
                <ImageEditor
                  imageSrc={selectedImage}
                  onComplete={handleImageCropped}
                  onCancel={handleRetry}
                  disabled={attempts <= 0}
                  isConfirmed={scanComplete}
                />
                {croppedImage && (
                  <div className="scanner-section">
                    <ImageScanner
  initialImage={croppedImage}
  onComplete={(txt, data) => handleScanComplete(txt, data, true)}
  onRetry={handleRetry}
  attemptsLeft={attempts}
  allowManualEdit={attempts === 0}
/>
                  </div>
                )}
              </>
            ) : (
              <div className="success-message">
                <h3>¡Proceso completado!</h3>
                <p>El comprobante ha sido procesado correctamente.</p>
                {receiptData && (
                  <div className="receipt-data">
                    <h4>Datos del comprobante:</h4>
                    <div className="data-grid">
                      <div>
                        <strong>Documento:</strong> {receiptData.carnetIdentidad}
                      </div>
                      <div>
                        <strong>Nombre:</strong> {receiptData.nombreReceptor}
                      </div>
                      <div>
                        <strong>Monto:</strong> {receiptData.montoPagado} Bs.
                      </div>
                      <div>
                        <strong>Fecha:</strong> {receiptData.fechaPago}
                      </div>
                      <div>
                        <strong>Transacción:</strong> {receiptData.codTransaccion}
                      </div>
                    </div>
                  </div>
                )}
                <button
                  className="submit-button"
                  onClick={handleSubmitReceipt}
                  disabled={isUploading}
                >
                  {isUploading ? 'Verificando pago...' : 'Confirmar y verificar pago'}
                </button>
                <button
                  className="new-scan-button"
                  onClick={() => {
                    setSelectedImage(null);
                    setCroppedImage(null);
                    setScanComplete(false);
                    setAttempts(3);
                    setExtractedText('');
                    setReceiptData(null);
                  }}
                >
                  Realizar nuevo escaneo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}