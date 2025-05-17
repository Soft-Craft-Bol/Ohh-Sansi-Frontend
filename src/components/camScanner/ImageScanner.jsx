import React, { useState, useRef, useEffect } from 'react';
import * as Tesseract from 'tesseract.js';
import './ImageScanner.css';
import { useLocation } from 'react-router-dom';
import { verificarPago } from '../../api/api'; 

const processReceiptText = (ocrText) => {
    const receiptData = {
        universidad: 'UNIVERSIDAD MAYOR DE SAN SIMÓN',
        direccion: 'DIRECCIÓN ADMINISTRATIVA Y FINANCIERA',
        tipoDocumento: 'RECIBO DE CAJA',
        numero: '',
        facultad: 'FAC. DE CIENCIAS Y TECNOLOGÍA',
        recibidoDe: '',
        concepto: '',
        suma: '45.00',
        totalBs: '',
        aclaracion: '',
        documento: '',
        codigo: '',
        numeroControl: '',
        fecha: '',
        usuario: ''
    };

    // Preprocesamiento mejorado del texto
    const normalizedText = ocrText
        .replace(/[|]/g, '1')
        .replace(/[!]/g, 'I')
        .replace(/[.]{2,}/g, '.')
        .replace(/\s+/g, ' ')
        .replace(/TW:/g, 'Total Bs:')
        .replace(/Br:/g, 'Por concepto de:');

    const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line);

    // Variables de contexto
    let nextLineIsRecibidoDe = false;
    let nextLineIsConcepto = false;
    let nextLineIsSuma = false;

    lines.forEach((line, index) => {
        // Extraer número de recibo
        if (line.match(/Nro[\s\.\-:]/i)) {
            const numMatch = line.match(/(\d{5,})/);
            if (numMatch) receiptData.numero = numMatch[1];
        }

        // Extraer facultad
        if (line.match(/FAC(?:ULTAD)?[:\.]|car\./i)) {
            const facMatch = line.split(/[:\.]/)[1]?.trim() || line.replace(/car\./i, '').trim();
            receiptData.facultad = facMatch
                .replace(/TELVOLOGDA/i, 'TECNOLOGÍA')
                .replace(/CIENCIAS Y/i, 'FAC. DE CIENCIAS Y');
        }

        // Extraer "Recibí de"
        if (line.match(/Recibí de:|ope del/i)) {
            const nameMatch = line.replace(/Recibí de:|ope del/i, '').trim();
            receiptData.recibidoDe = nameMatch
                .replace(/LEGECMA/i, 'LEDEZMA')
                .replace(/NEPEA/i, 'NEREA');
        }

        // Extraer concepto
        if (line.match(/Por concepto de:|concepto[:\.]/i)) {
            nextLineIsConcepto = true;
            receiptData.concepto = line.split(/[:\.]/)[1]?.trim() || '';
        } else if (nextLineIsConcepto && !line.match(/suma|total|bs\.?/i)) {
            receiptData.concepto += ' ' + line;
        }

        // Extraer suma en letras (mejora para reconocer correctamente)
        if (line.match(/suma de|La suma de/i)) {
            nextLineIsSuma = true;
            receiptData.suma = line.split(/[:\.]/)[1]?.trim() || line.replace(/suma de|La suma de/i, '').trim();
        } else if (nextLineIsSuma && line.match(/BOLIVIANOS/i)) {
            receiptData.suma += ' ' + line;
            nextLineIsSuma = false;

            // Corrección de suma en texto para convertirla a número
            const sumaMatch = receiptData.suma.match(/CUARENTA Y CINCO/i);
            if (sumaMatch) {
                receiptData.suma = '45.00';
            }
        }

        // Extraer total Bs
        if (line.match(/Total\sBs?\.?[\s:]|TW:[\s-]/i)) {
            const totalMatch = line.match(/(\d+[\.,]\d{2})/);
            if (totalMatch) {
                receiptData.totalBs = totalMatch[1].replace(',', '.');
            } else {
                for (let i = index + 1; i < Math.min(index + 4, lines.length); i++) {
                    const nextLineMatch = lines[i].match(/(\d+[\.,]\d{2})/);
                    if (nextLineMatch) {
                        receiptData.totalBs = nextLineMatch[1].replace(',', '.');
                        break;
                    }
                }
            }
        }

        // Extraer número de documento
        if (line.match(/Documento[:\.]|poLUMENLA -/i)) {
            const docMatch = line.match(/(\d{6,})/);
            if (docMatch) receiptData.documento = docMatch[1];
        }

        // Extraer fecha
        if (line.match(/\d{2}[\-\/]\d{2}[\-\/]\d{2,4}/)) {
            const dateMatch = line.match(/(\d{2}[\-\/]\d{2}[\-\/]\d{2,4})/);
            if (dateMatch) receiptData.fecha = dateMatch[1].replace(/\//g, '-');
        }

        // Extraer usuario
        if (line.match(/Usuario[:\.]|UTORREZ/i)) {
            receiptData.usuario = line.split(/[:\.]/)[1]?.trim() || line;
        }
    });

    // Post-procesamiento
    if (receiptData.suma) {
        receiptData.suma = receiptData.suma
            .replace(/00,180/i, '00/100')
            .replace(/--/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    if (receiptData.aclaracion) {
        receiptData.aclaracion = receiptData.aclaracion
            .replace(/INSERTT/i, 'INSCRIT.')
            .replace(/I5ICA/i, 'FÍSICA')
            .replace(/HATEVÁATESNS/i, 'MATEMÁTICAS')
            .replace(/STO\s+e/i, 'STO 2024');
    }

    return receiptData;
};

const validateReceiptData = (data) => {
    const errors = [];

    if (!data.documento || !/^\d{6,}$/.test(data.documento)) {
        errors.push("Número de documento no válido o no encontrado");
    }

    if (!data.totalBs || !/^\d+\.\d{2}$/.test(data.totalBs)) {
        errors.push(`Formato de precio no válido: ${data.totalBs || 'No encontrado'}`);
        const priceMatch = JSON.stringify(data).match(/(\d+[\.,]\d{2})/);
        if (priceMatch) {
            errors.push(`Posible precio encontrado: ${priceMatch[1]}`);
        }
    }

    if (!data.recibidoDe || data.recibidoDe.length < 5) {
        errors.push("Nombre del participante no válido o no encontrado");
    }

    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : ["Todos los campos importantes fueron validados correctamente"]
    };
};


const ImageScanner = ({ initialImage, onComplete, onRetry }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [receiptData, setReceiptData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    if (initialImage) {
      extractTextFromImage(initialImage);
    }
  }, [initialImage]);

  const extractTextFromImage = async (imageSrc) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const result = await Tesseract.recognize(
        imageSrc,
        'spa',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      setExtractedText(result.data.text);
      const processedData = processReceiptText(result.data.text);
      const validation = validateReceiptData(processedData);

      setReceiptData(processedData);
      setValidationResult(validation);

    } catch (error) {
      console.error('Error en OCR:', error);
      setValidationResult({
        isValid: false,
        errors: ["Error al procesar el texto del comprobante"]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerificarPago = async () => {
    if (!receiptData) return;

    setIsSubmitting(true);
    
    try {
      const response = await verificarPago({
        carnetIdentidad: receiptData.documento,
        montoPagado: receiptData.totalBs,
        imagenComprobante: initialImage,
        nombreReceptor: receiptData.recibidoDe,
        notasAdicionales: receiptData.concepto
      });

      setSubmitResult({
        success: true,
        message: 'Pago verificado exitosamente',
        data: response.data
      });
      
      onComplete(extractedText);
      
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error.response?.data?.message || 'Error al verificar el pago'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="image-scanner-container">
      {isProcessing && (
        <div className="progress">
          <p>Extrayendo texto... {progress}%</p>
          <progress value={progress} max="100" />
        </div>
      )}

      {extractedText && (
        <div className="text-preview">
          <h3>Texto reconocido:</h3>
          <div className="text-content">
            {extractedText}
          </div>
        </div>
      )}

      {validationResult && (
        <div className={`validation-results ${validationResult.isValid ? 'valid' : 'invalid'}`}>
          <h3>Resultados del análisis:</h3>
          <ul>
            {validationResult.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {receiptData && (
        <div className="structured-data">
          <h3>Datos extraídos del comprobante:</h3>
          <div className="data-grid">
            <div><strong>Documento:</strong> {receiptData.documento || 'No encontrado'}</div>
            <div><strong>Nombre:</strong> {receiptData.recibidoDe || 'No encontrado'}</div>
            <div><strong>Monto:</strong> {receiptData.totalBs || 'No encontrado'}</div>
            <div><strong>Concepto:</strong> {receiptData.concepto || 'No encontrado'}</div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleVerificarPago} 
              disabled={!validationResult?.isValid || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar y enviar'}
            </button>
            <button 
              onClick={onRetry}
              className="retry-button"
            >
              {validationResult?.isValid ? 'Usar otra imagen' : 'Volver a intentar'}
            </button>
          </div>
        </div>
      )}

      {submitResult && (
        <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
          <p>{submitResult.message}</p>
        </div>
      )}
    </div>
  );
};

// (Mantener las funciones processReceiptText y validateReceiptData)

export default ImageScanner;