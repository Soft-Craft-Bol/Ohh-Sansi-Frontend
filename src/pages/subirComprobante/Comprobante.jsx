import { useState } from 'react';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';
import ImageScanner from '../../components/camScanner/ImageScanner';
import Header from '../../components/header/Header';
import './Comprobante.css';

function Comprobante() {
  const [croppedImage, setCroppedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [scanComplete, setScanComplete] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setScanComplete(false);
    }
  };

  const handleImageCropped = (imageUrl) => {
    setCroppedImage(imageUrl);
    setAttempts(prev => prev - 1);
  };

  const handleRetry = () => {
    if (attempts > 0) {
      setSelectedImage(null);
      setCroppedImage(null);
    }
  };

  const handleScanComplete = (text, data) => {
    setExtractedText(text);
    // Mapeamos los datos antiguos a los nuevos nombres
    setReceiptData({
      codTransaccion: data.numero || '',
      nombreReceptor: data.recibidoDe || '',
      notasAdicionales: data.concepto || '',
      montoPagado: data.totalBs || '',
      aclaracion: data.aclaracion || '',
      carnetIdentidad: data.documento || '',
      NumeroControl: data.NumeroControl || '',
      fechaPago: data.fecha || '',
      rawData: data
    });
    setScanComplete(true);
  };



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
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
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
                      <div><strong>Documento:</strong> {receiptData.documento}</div>
                      <div><strong>Nombre:</strong> {receiptData.recibidoDe}</div>
                      <div><strong>Monto:</strong> {receiptData.totalBs} Bs.</div>
                      <div><strong>Concepto:</strong> {receiptData.concepto}</div>
                    </div>
                  </div>
                )}

                {extractedText && (
                  <details className="extracted-text">
                    <summary>Ver texto reconocido</summary>
                    <pre>{extractedText}</pre>
                  </details>
                )}

                <button 
                  className="new-scan-button"
                  onClick={() => {
                    setSelectedImage(null);
                    setCroppedImage(null);
                    setScanComplete(false);
                    setAttempts(3);
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

export default Comprobante;