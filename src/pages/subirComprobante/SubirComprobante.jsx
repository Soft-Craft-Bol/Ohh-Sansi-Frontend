import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaUpload } from 'react-icons/fa';
import Header from '../../components/header/Header';
import './SubirComprobante.css';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';
import Swal from 'sweetalert2';
import ImageEditor from '../../components/imageEditor/ImageEditorKonva';

export default function SubirComprobante() {
  // ─── Estados ────────────────────────────────────────────────────────────────
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl]     = useState('');
  const [isDragging, setIsDragging]     = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [showEditor, setShowEditor]     = useState(false);
  const fileInputRef                    = useRef(null);

  // ─── Limpieza de blobs ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ─── Validación y selección de archivo ─────────────────────────────────────────
  const handleFileSelect = useCallback(file => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize    = 5 * 1024 * 1024; // 5MB
    const invalidChars = /[<>:"/\\|?*]/;

    if (!validTypes.includes(file.type)) {
      Swal.fire('Formato inválido', 'Solo JPG o PNG.', 'error');
      return;
    }
    if (file.size > maxSize) {
      Swal.fire('Archivo muy grande', 'Máx. 5MB.', 'error');
      return;
    }
    if (invalidChars.test(file.name)) {
      Swal.fire('Nombre inválido', 'Caracteres no permitidos.', 'error');
      return;
    }

    setSelectedFile(file);
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);

    // Preparar editor
    const reader = new FileReader();
    reader.onload = () => {
      setEditingImage(reader.result);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  }, [previewUrl]);

  // ─── Drag & drop ───────────────────────────────────────────────────────────────
  const handleDragOver  = useCallback(e => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop      = useCallback(e => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  // ─── Input file ────────────────────────────────────────────────────────────────
  const handleButtonClick      = useCallback(() => fileInputRef.current.click(), []);
  const handleFileInputChange  = useCallback(e => {
    handleFileSelect(e.target.files[0]);
    e.target.value = null;
  }, [handleFileSelect]);

  // ─── Editor de imagen ─────────────────────────────────────────────────────────
  const handleEditorComplete = useCallback(async croppedUrl => {
    const blob = await fetch(croppedUrl).then(r => r.blob());
    const editedFile = new File([blob], 'comprobante-editado.jpg', { type: blob.type });
    setSelectedFile(editedFile);
    setPreviewUrl(croppedUrl);
    setShowEditor(false);
  }, []);

  const handleEditorCancel = useCallback(() => {
    setShowEditor(false);
    setEditingImage(null);
  }, []);

  // ─── Subida al servidor ───────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;
    try {
      const resp = await fetch('/api/subir-boleta', {
        method: 'POST',
        body: selectedFile
      });
      if (resp.status === 403) {
        throw new Error('No tienes permisos para subir este comprobante.');
      }
      if (!resp.ok) {
        throw new Error(`Error al subir: ${resp.status}`);
      }
      Swal.fire('¡Listo!', 'Comprobante subido con éxito.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message, 'error');
    }
  }, [selectedFile]);

  // ─── Render ────────────────────────────────────────────────────────────────────
  return (
    <div>
      <Header
        title="Comprobante de pago"
        description="Sube tu comprobante para verificar tu inscripción"
      />

      {showEditor && editingImage && (
        <ImageEditor
          imageSrc={editingImage}
          onComplete={handleEditorComplete}
          onCancel={handleEditorCancel}
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
              {/* Render condicional para evitar src="" */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="preview-image"
                />
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
              <p className="drag-text">Arrastra y suelta tu comprobante aquí</p>
              <p className="format-text">Solo JPG o PNG (máx. 5MB)</p>
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
          <ButtonPrimary
            onClick={handleSubmit}
            disabled={!selectedFile}
          >
            Confirmar y enviar
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
