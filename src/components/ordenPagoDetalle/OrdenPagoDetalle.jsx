import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaUpload } from 'react-icons/fa';
import Header from '../../components/header/Header';
import './OrdenPagoDetalle.css';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';
import Swal from 'sweetalert2';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';

// Extraemos constantes a nivel de módulo 
const VALID_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const INVALID_NAME_CHARS = /[<>:"/\\|?*]/;

export default function SubirComprobante() {
  // Estados organizados y referencias
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl]     = useState('');
  const [editingImage, setEditingImage] = useState(null);
  const [showEditor, setShowEditor]     = useState(false);
  const [isDragging, setIsDragging]     = useState(false);
  const fileInputRef = useRef(null);

  //Limpieza de URLs blob al desmontar o cambiar previewUrl
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  //Función de validación centralizada
  const validateFile = useCallback((file) => {
    if (!file) return 'No se seleccionó ningún archivo.';
    if (!VALID_TYPES.includes(file.type)) return 'Formato no válido. Solo JPG o PNG.';
    if (file.size > MAX_SIZE)       return 'El archivo supera 5 MB.';
    if (INVALID_NAME_CHARS.test(file.name)) return 'El nombre contiene caracteres inválidos.';
    return null;
  }, []);

  //Manejador de selección/edición de archivo
  const handleFileSelect = useCallback((file) => {
    const error = validateFile(file);
    if (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error, confirmButtonColor: '#7a5cf5' });
      return;
    }

    setSelectedFile(file);

    // revocamos la URL anterior si existía
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    // cargamos como data URL para el editor
    const reader = new FileReader();
    reader.onload = () => {
      setEditingImage(reader.result);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  }, [validateFile, previewUrl]);

  //Hooks para drag & drop y clicks
  const handleDragOver       = useCallback(e => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave      = useCallback(() => setIsDragging(false), []);
  const handleDrop           = useCallback(e => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); }, [handleFileSelect]);
  const handleButtonClick    = useCallback(() => fileInputRef.current.click(), []);
  const handleFileInputChange= useCallback(e => { handleFileSelect(e.target.files[0]); e.target.value = null; }, [handleFileSelect]);

  //Confirmar o cancelar la edición
  const handleConfirm = useCallback((croppedImage) => {
    setPreviewUrl(croppedImage);
    setShowEditor(false);
  }, []);
  const handleCancel  = useCallback(() => {
    setShowEditor(false);
    setEditingImage(null);
  }, []);

  return (
    <div>
      <Header
        title="Comprobante de pago"
        description="Suba su comprobante de pago para verificar su inscripción"
      />

      {/* 8. Editor de imagen */}
      {showEditor && editingImage && (
        <ImageEditor
          imageSrc={editingImage}
          onComplete={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {/* 9. Zona de arrastre / vista previa */}
      {!showEditor && !previewUrl && (
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
                {previewUrl && (
                  <div
                  style={{
                    width: 200,
                    height: 200,
                    overflow: 'hidden',
                    border: '1px solid #ccc',   // opcional, te ayuda a ver el recorte
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',        // o 'contain' si no quieres recortar
                    }}
                  />
                </div>
                )}
                <p>{selectedFile.name}</p>
                <p>{(selectedFile.size / 1024).toFixed(1)} KB</p>
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
                <p className="drag-text">
                  Arrastra y suelta aquí tu comprobante de pago
                </p>
                <p className="format-text">
                  Formatos aceptados: JPG, PNG (máx. 5MB)
                </p>
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
              accept={VALID_TYPES.join(',')}
            />
          </div>

          <div className="action-buttons">
            <ButtonPrimary disabled={!selectedFile}>
              Confirmar y enviar
            </ButtonPrimary>
          </div>
        </div>
      )}
    </div>
  );
}
