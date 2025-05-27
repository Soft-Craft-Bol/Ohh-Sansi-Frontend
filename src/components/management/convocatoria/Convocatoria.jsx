import React, { useEffect, useState, useRef } from 'react';
import './Convocatoria.css';
import { uploadConvocatoriaPDF, getPeriodoInscripcionActal } from '../../../api/api';
import Swal from 'sweetalert2';


const Convocatoria = () => {
  const [areas, setAreas] = useState([]);
  const [idOlimpiada, setIdOlimpiada] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewLarge, setPreviewLarge] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPeriodoInscripcionActal();
        if (res.data && res.data.catalogoOlimpiada) {
          setAreas(res.data.catalogoOlimpiada);
          setIdOlimpiada(res.data.olimpiada.idOlimpiada);
        }
      } catch (err) {
        setMessage('Error al cargar las áreas.');
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    if (file) {
      setPdfPreview(URL.createObjectURL(file));
    } else {
      setPdfPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArea || !idOlimpiada || !pdfFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: '#033771'
      });
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await uploadConvocatoriaPDF(selectedArea, idOlimpiada, pdfFile);
      console.log('Respuesta del servidor:', response);
      Swal.fire({
        icon: 'success',
        title: '¡PDF subido correctamente!',
        text: 'La convocatoria se ha guardado.',
        confirmButtonColor: '#033771'
      });
      setSelectedArea('');
      setPdfFile(null);
      setPdfPreview(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al subir el PDF.',
        confirmButtonColor: '#033771'
      });
    }
    setLoading(false);
  };

  return (
    <div className="convocatoria-container">
      <h2>Subir PDF de Convocatoria</h2>
      <p className="convocatoria-desc">
        Aquí puedes subir la convocatoria oficial para el área seleccionada.<br />
        <span className="convocatoria-tip">
          Asegúrate de que el archivo esté en formato PDF y que el contenido sea claro y legible.
        </span>
      </p>
      <ul className="convocatoria-lista">
        <li>✓ Elige el área correspondiente antes de subir el archivo.</li>
        <li>✓ El archivo no debe superar los 10MB.</li>
        <li>✓ Puedes previsualizar el PDF antes de enviarlo.</li>
      </ul>
      <form className="convocatoria-form" onSubmit={handleSubmit}>
        <label>
          Área:
          <select
            className="convocatoria-input"
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
          >
            <option value="">Seleccione un área</option>
            {areas.map(area => (
              <option key={area.idArea} value={area.idArea}>
                {area.nombreArea}
              </option>
            ))}
          </select>
        </label>
        <label>
          Archivo PDF:
          <div className="convocatoria-file-row">
            <button
              type="button"
              className="convocatoria-file-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Seleccionar archivo
            </button>
            <span className="convocatoria-file-name">
              {pdfFile ? pdfFile.name : 'Ningún archivo seleccionado'}
            </span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
        </label>
        {pdfPreview && (
          <div className="convocatoria-preview">
            <div className="convocatoria-preview-header">
              <span>Previsualización:</span>
            </div>
            <embed
              src={pdfPreview}
              type="application/pdf"
              width="100%"
              height="400px"
            />
          </div>
        )}
        <button
          type="submit"
          className="convocatoria-btn"
          disabled={loading}
        >
          {loading ? 'Subiendo...' : 'Subir PDF'}
        </button>
        
      </form>
    </div>
  );
};

export default Convocatoria;