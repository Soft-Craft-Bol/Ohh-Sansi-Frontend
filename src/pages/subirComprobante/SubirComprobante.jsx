import React, { useState, useRef, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import Header from '../../components/header/Header';
import './SubirComprobante.css';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?worker';
import Swal from 'sweetalert2';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

export default function SubirComprobante() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

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
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;
    const invalidNameChars = /[<>:"/\\|?*]/;

    if (!file) return;

    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Formato de archivo no válido. Solo JPG, PNG o PDF.',
        confirmButtonColor: '#7a5cf5',
      });
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El archivo no debe superar los 5MB.',
        confirmButtonColor: '#7a5cf5',
      });
      return;
    }

    if (invalidNameChars.test(file.name)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del archivo contiene caracteres inválidos.',
        confirmButtonColor: '#7a5cf5',
      });
      return;
    }

    setSelectedFile(file);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file.type === 'application/pdf') {
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
      renderPDF(blobUrl);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingImage(reader.result);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPDF = async (url) => {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
    } catch (err) {
      console.error('Error al renderizar PDF:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el PDF.',
        confirmButtonColor: '#7a5cf5',
      });
    }
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
      {!showEditor && (
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
          {selectedFile.type === 'application/pdf' ? (
            <div className="pdf-preview">
              <canvas ref={canvasRef} />
              <p>{selectedFile.name}</p>
              <p>{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="preview-image"
                />
              )}
              <p>{selectedFile.name}</p>
              <p>{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </>
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
          <p className="drag-text">
            Arrastra y suelta aquí tu comprobante de pago
          </p>
          <p className="format-text">
            Formatos aceptados: JPG, PNG o PDF (máx. 5MB)
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
        accept="image/jpeg,image/png,application/pdf"
      />
    </div>

    <div className="action-buttons">
      <ButtonPrimary disabled={!selectedFile}>Confirmar y enviar</ButtonPrimary>
    </div>
  </div>
)}

    </div>
  );
}
