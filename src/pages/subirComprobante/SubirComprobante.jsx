import React, { useState, useRef } from 'react';
import { FaUpload, FaFilePdf } from 'react-icons/fa';
import Header from '../../components/header/Header';
import './SubirComprobante.css';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';

export default function SubirComprobante() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileSelect = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (file && validTypes.includes(file.type)) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(''); // Pendiente de acuerdo a criterios, actual no visible
      }
    } else {
      alert('Formato de archivo no válido. Solo JPG, PNG o PDF.');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  return (
    <div>
      <Header
        title="Comprobante de pago"
        description="Suba su comprobante de pago para verificar su inscripción"
      />
      <div className="payment-receipt-preview-container">
        <h2 className="preview-title">Vista previa de comprobante de pago</h2>

        <div
          className={`drop-area ${isDragging ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="preview-container">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="preview-image"
                />
              ) : (
                <div className="pdf-preview">
                  <FaFilePdf size={48} color="#D32F2F" />
                  <p>{selectedFile.name}</p>
                </div>
              )}
              <button className="select-button" onClick={handleButtonClick}>
                Cambiar archivo
              </button>
            </div>
          ) : (
            <>
              <p className="no-preview">No hay archivo seleccionado.</p>
              <div className="upload-icon-container">
                <FaUpload />
              </div>
              <p className="drag-text">Arrastra y suelta aquí tu comprobante de pago</p>
              <p className="format-text">Formatos aceptados: JPG, PNG o PDF</p>
              <button className="select-button" onClick={handleButtonClick}>
                Seleccionar archivo
              </button>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            accept="image/jpeg,image/png,application/pdf"
          />
        </div>

        <div className="action-buttons">
          <ButtonPrimary disabled={!selectedFile}>Confirmar y enviar</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
