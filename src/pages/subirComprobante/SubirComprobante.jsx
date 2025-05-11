import React, { useState, useRef, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import Header from '../../components/header/Header';
import './SubirComprobante.css';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';
import Swal from 'sweetalert2';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';

export default function SubirComprobante() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  const handleFileSelect = async (file) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;
    const invalidNameChars = /[<>:"/\\|?*]/;

    if (!file) return;

    if (!validTypes.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Formato de archivo no válido.', text: 'Solo se admite formato JPG, PNG', confirmButtonColor: '#7a5cf5' });
      return;
    }
    if (file.size > maxSize) {
      Swal.fire({ icon: 'error', title: 'Archivo muy grande', text: 'El archivo no debe superar los 5MB', confirmButtonColor: '#7a5cf5' });
      return;
    }
    if (invalidNameChars.test(file.name)) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'El nombre del archivo contiene caracteres inválidos', confirmButtonColor: '#7a5cf5' });
      return;
    }

    setSelectedFile(file);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditingImage(reader.result);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
    event.target.value = null;
  };

  return (
    <div>
      <Header
        title="Comprobante de pago"
        description="Suba su comprobante de pago para verificar su inscripción"
      />

      {showEditor && editingImage && (
        <ImageEditor
          imageSrc={editingImage}
          onComplete={async (croppedUrl) => {
            const blob = await fetch(croppedUrl).then((res) => res.blob());
            const editedFile = new File([blob], 'comprobante-editado.jpg', {
              type: blob.type,
            });
            setSelectedFile(editedFile);
            setPreviewUrl(croppedUrl);
            setShowEditor(false);
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingImage(null);
          }}
        />
      )}

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
              <img
                src={previewUrl}
                alt="Vista previa"
                className="preview-image"
              />
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
              <p className="drag-text">Arrastra y suelta aquí tu comprobante de pago</p>
              <p className="format-text">Formatos aceptados: JPG, PNG (máx. 5MB)</p>
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
            accept="image/jpeg,image/png" 
          />
        </div>

        <div className="action-buttons">
          <ButtonPrimary disabled={!selectedFile}>Confirmar y enviar</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

