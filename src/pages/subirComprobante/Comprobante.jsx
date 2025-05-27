import React, { useState, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getEstudianteByCarnet, verificarPago } from '../../api/api';
import Header from '../../components/header/Header';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';
import ImageScanner from '../../components/camScanner/ImageScanner';
import uploadImageToCloudinary from '../../utils/uploadImageToCloudinary';
import './Comprobante.css';

export default function Comprobante() {
  // ─── Estados ───────────────────────────────────────────────────────────
  const [carnet, setCarnet] = useState('');
  const [isCarnetVerified, setIsCarnetVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [scanComplete, setScanComplete] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // ─── Funciones ──────────────────────────────────────────────────────────
  const handleVerifyCarnet = useCallback(async () => {
    if (!carnet.trim()) {
      Swal.fire('Carnet vacío', 'Ingresa tu número de carnet.', 'warning');
      return;
    }
    setIsVerifying(true);
    try {
      await getEstudianteByCarnet(carnet);
      setIsCarnetVerified(true);
    } catch (err) {
      if (err.response?.status === 404) {
        Swal.fire('No encontrado', 'El carnet no está registrado.', 'error');
      } else {
        Swal.fire(
          'Error',
          err.response?.data?.message || err.message || 'Error al verificar carnet',
          'error'
        );
      }
    } finally {
      setIsVerifying(false);
    }
  }, [carnet]);

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

      // 5. Mostrar resultado
      if (responsePago.data.success) {
        Swal.fire(
          '¡Pago verificado!',
          'Tu comprobante ha sido registrado correctamente.',
          'success'
        );

        // Resetear el formulario
        setSelectedImage(null);
        setCroppedImage(null);
        setScanComplete(false);
        setAttempts(3);
        setExtractedText('');
        setReceiptData(null);
      } else {
        throw new Error('No se pudo verificar el pago. Inténtalo nuevamente.');
      }

    } catch (error) {
      console.error('Error al verificar pago:', error);
      Swal.fire(
        'Error',
        error.response?.data || error.message || 'Ocurrió un error al verificar el pago',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  }, [croppedImage, receiptData, carnet]);

  // ─── Render ─────────────────────────────────────────────────────────────
  if (!isCarnetVerified) {
    return (
      <div className="comprobante-verification">
        <Header
          title="Verificar carnet"
          description="Ingresa tu número de carnet para continuar"
        />
        <div className="verification-form">
          <input
            type="text"
            className="carnet-input"
            placeholder="Ej: 1234567"
            value={carnet}
            maxLength={10}
            onChange={e => setCarnet(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            disabled={isVerifying}
          />
          <button
            className="carnet-btn"
            onClick={handleVerifyCarnet}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verificando...' : <FaSearch />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="comprobante-container">
      <Header
        title="Comprobante de pago"
        description="Sube tu comprobante para verificar tu inscripción"
      />
      <div className="comprobante-content">
        {!selectedImage ? (
          <div className="upload-section">
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
                <p>Selecciona o arrastra tu comprobante</p>
                <span className="file-types">Formatos aceptados: JPG, PNG</span>
                {attempts < 3 && (
                  <p className="attempts-info">Intentos restantes: {attempts}</p>
                )}
              </div>
            </label>
          </div>
        ) : (
          <div className="editor-section">
            {!scanComplete ? (
              <>
                <ImageEditor
                  imageSrc={selectedImage}
                  onComplete={handleImageCropped}
                  onCancel={handleRetry}
                />
                {croppedImage && (
                  <div className="scanner-section">
                    <ImageScanner
                      initialImage={croppedImage}
                      onComplete={handleScanComplete}
                      onRetry={handleRetry}
                      attemptsLeft={attempts}
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