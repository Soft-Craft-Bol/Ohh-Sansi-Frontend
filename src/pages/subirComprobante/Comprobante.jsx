import { useState } from 'react';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';
import ImageScanner from '../../components/camScanner/ImageScanner';
import Header from '../../components/header/Header';
import './Comprobante.css';
import ManualEntryForm from '../../components/formComprobante/ManualEntryForm';

function Comprobante() {
  const [croppedImage, setCroppedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [scanComplete, setScanComplete] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setScanComplete(false);
      setShowManualForm(false);
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
    } else {
      setShowManualForm(true);
    }
  };

  const handleScanComplete = (text) => {
    setExtractedText(text);
    setScanComplete(true);
  };

  const handleManualSubmit = (formData) => {
    // Aquí puedes manejar el envío de los datos manuales
    console.log('Datos manuales:', formData);
    setScanComplete(true);
  };

  return (
    <div className="comprobante-container">
      <Header
        title="Comprobante de pago"
        description="Sube tu comprobante para verificar tu inscripción"
      />
      
      <div className="comprobante-content">
        {!selectedImage && !showManualForm ? (
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
        ) : showManualForm ? (
          <ManualEntryForm
            onSubmit={handleManualSubmit}
            onBack={() => setShowManualForm(false)}
          />
        ) : (
          <div className="editor-section">
            {!scanComplete && (
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
                    />
                  </div>
                )}
              </>
            )}
            {scanComplete && (
              <div className="success-message">
                <h3>¡Proceso completado!</h3>
                <p>El comprobante ha sido procesado correctamente.</p>
                {extractedText && (
                  <div className="extracted-text">
                    <h4>Texto extraído:</h4>
                    <pre>{extractedText}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comprobante;