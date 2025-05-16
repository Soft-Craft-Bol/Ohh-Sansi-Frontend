import { useState } from 'react';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';
import ImageScanner from '../../components/camScanner/ImageScanner';
import Header from '../../components/header/Header';
import './Comprobante.css'; // Archivo CSS que crearemos

function Comprobante() {
  const [croppedImage, setCroppedImage] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setShowScanner(false);
    }
  };

  const handleImageCropped = (imageUrl) => {
    setCroppedImage(imageUrl);
    setShowScanner(true);
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
                <span className="file-types">Formatos aceptados: JPG, PNG, PDF</span>
              </div>
            </label>
          </div>
        ) : !showScanner ? (
          <div className="editor-section">
            <ImageEditor
              imageSrc={selectedImage} 
              onComplete={handleImageCropped} 
              onCancel={() => setSelectedImage(null)}
            />
          </div>
        ) : (
          <div className="scanner-section">
            <ImageScanner initialImage={croppedImage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Comprobante;