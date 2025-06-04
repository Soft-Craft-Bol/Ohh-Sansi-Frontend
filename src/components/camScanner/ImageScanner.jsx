import React, { useState, useEffect } from 'react';
import * as Tesseract from 'tesseract.js';
import { Formik, Form } from 'formik';
import './ImageScanner.css';
import InputText from '../inputs/InputText';
import { ButtonPrimary } from '../button/ButtonPrimary';
import receiptSchema from '../../schemas/receiptSchema';

const previousResults = {}; // Guardar resultados parciales entre intentos

const processReceiptText = (ocrText, attemptId = 'default') => {
  const receiptData = {
    codTransaccion: '',
    nombreReceptor: '',
    montoPagado: '',
    carnetIdentidad: '',
    fechaPago: '',
    notasAdicionales: ocrText,
  };

  const corrections = {
    'TACVOLOSIA': 'TECNOLOGIA',
    'FROCOEL': 'FROEGEL',
    'EDJCACIONAL': 'EDUCACIONAL',
    'OlMPLAos': 'OLIMPIADAS',
    'EZENCIAS': 'CIENCIAS',
    'SANSE': 'SAN SIMON',
    'OECUMATO': 'DECANATO',
    'OECANATO': 'DECANATO',
    'BOLIVIAROS': 'BOLIVIANOS',
    'NEPEA': 'NEREA',
    'LEGECMA': 'LEDEZMA'
  };

  // Corrección básica del OCR
  let normalizedText = ocrText
    .replace(/[|]/g, 'I')
    .replace(/[!]/g, 'I')
    .replace(/[1]/g, 'I')
    .replace(/[0]/g, 'O')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\uFFFD]/g, '')
    .toUpperCase();

  // Aplicar correcciones comunes
  Object.entries(corrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(wrong, 'g');
    normalizedText = normalizedText.replace(regex, correct);
  });

  const lines = normalizedText.split('\n').map(l => l.trim()).filter(Boolean);

  lines.forEach((line, index) => {
    // Número de transacción
    if (!receiptData.codTransaccion && /NRO[^\d]*?(\d{6,})/.test(line)) {
      const match = line.match(/NRO[^\d]*?(\d{6,})/);
      if (match) receiptData.codTransaccion = match[1];
    }

    // Nombre receptor
    if (!receiptData.nombreReceptor && /COOPERATIVA|RECIBI DE|USUARIO|TORREZ|LEDEZMA|FROEGEL/.test(line)) {
      const nameMatch = line.match(/(?:RECIBI DE:|USUARIO:?|COOPERATIVA|TORREZ|LEDEZMA|FROEGEL)[\s:]*([\w\s]+)/i);
      if (nameMatch) receiptData.nombreReceptor = nameMatch[1].trim();
    }

    // Monto pagado
    if (!receiptData.montoPagado && /BS|BOLIVIANOS|TOTAL/.test(line)) {
      const monto = line.match(/(\d{2,3}[.,]\d{2})/);
      if (monto) receiptData.montoPagado = monto[1].replace(',', '.');
    }

    // Documento de identidad
    if (!receiptData.carnetIdentidad && /DOCUMENTO|CEDULA|CI[:\s]/i.test(line)) {
      const doc = line.match(/(\d{6,})/);
      if (doc) receiptData.carnetIdentidad = doc[1];
    }

    // Fecha de pago
    if (!receiptData.fechaPago && /\d{2}[-\/]\d{2}[-\/]\d{2,4}/.test(line)) {
      const fecha = line.match(/(\d{2}[-\/]\d{2}[-\/]\d{2,4})/);
      if (fecha) receiptData.fechaPago = fecha[1].replace(/\//g, '-');
    }
  });

  // Intentar rellenar campos faltantes con intentos anteriores
  const prev = previousResults[attemptId] || {};
  Object.keys(receiptData).forEach(key => {
    if (!receiptData[key] && prev[key]) {
      receiptData[key] = prev[key];
    }
  });

  // Guardar datos para reintento futuro
  previousResults[attemptId] = { ...receiptData };

  return receiptData;
};


const validateReceiptData = (data) => {
  const requiredFields = ['carnetIdentidad', 'montoPagado', 'nombreReceptor'];
  const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');

  if (missingFields.length > 0) {
    return {
      isValid: false,
      missingFields,
      message: `Faltan los siguientes campos: ${missingFields.join(', ')}.`
    };
  }

  return {
    isValid: true,
    message: "La información del comprobante ha sido validada correctamente."
  };
};


const ImageScanner = ({ initialImage, onComplete, onRetry, attemptsLeftm, allowManualEdit = false, attemptsLeft }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [receiptData, setReceiptData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isEditing, setIsEditing] = useState(allowManualEdit);

  useEffect(() => {
    if (initialImage) {
      extractTextFromImage(initialImage);
    }
  }, [initialImage]);

  // Campos editables (solo los necesarios)
  const editableFields = [
    {
      key: 'codTransaccion',
      label: 'Número de Factura',
      type: 'text',
      inputProps: { onlyNumbers: true }
    },
    {
      key: 'nombreReceptor',
      label: 'Nombre del Receptor',
      type: 'text',
      inputProps: { onlyLetters: true }
    },
    {
      key: 'montoPagado',
      label: 'Monto Pagado (Bs.)',
      type: 'text',
      inputProps: { decimal: true, decimalPlaces: 2 }
    },
    {
      key: 'carnetIdentidad',
      label: 'Carnet de Identidad',
      type: 'text',
      inputProps: { onlyNumbers: true }
    },
    {
      key: 'fechaPago',
      label: 'Fecha de Pago',
      type: 'date'
    }
  ];

  const extractTextFromImage = async (imageSrc) => {
    setIsProcessing(true);
    setProgress(0);
    setReceiptData(null);
    setValidationResult(null);

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
        message: "Error al procesar el texto del comprobante. Por favor, intente nuevamente."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (values) => {
    // Mantenemos el texto OCR completo en notasAdicionales
    const updatedData = {
      ...values,
      notasAdicionales: extractedText
    };
    setReceiptData(updatedData);
    const validation = validateReceiptData(updatedData);
    setValidationResult(validation);
    setIsEditing(false);
  };

  const handleConfirm = () => {
    if (receiptData && validationResult?.isValid) {
      // Preparamos los datos finales para enviar
      const finalData = {
        ...receiptData,
        estadoOrden: "PAGADO",  // Valor fijo
        notasAdicionales: extractedText  // Texto OCR completo
      };
      onComplete(extractedText, finalData);
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

      {validationResult && (
        <div className={`validation-results ${validationResult.isValid ? 'valid' : 'invalid'}`}>
          <p>{validationResult.message}</p>
          {!validationResult.isValid && (
            <>
              {attemptsLeft > 0 ? (
                <p className="attempts-warning">
                  Tienes {attemptsLeft} intento{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}.
                  Suba una foto con mejor resolución y buena iluminación.
                </p>
              ) : (
                <div className="attempts-exhausted">
                  <h4>¡Se agotaron tus intentos!</h4>
                  <p>Por favor, edita manualmente los datos del comprobante y confírmalos.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {receiptData && (
        <div className="structured-data">
          <h3>Datos del comprobante:</h3>

          {isEditing ? (
            <Formik
              initialValues={receiptData}
              validationSchema={receiptSchema}
              enableReinitialize  
              onSubmit={handleFormSubmit}
            >
              {() => (
                <Form className="editable-fields">
                  {editableFields.map((field) => (
                    <InputText
                      key={field.key}
                      name={field.key}
                      label={field.label}
                      type={field.type}
                      {...field.inputProps}
                    />
                  ))}

                  <div className="edit-buttons">
                    <ButtonPrimary
                      buttonStyle="primary"
                      type="submit"
                    >
                      Guardar cambios
                    </ButtonPrimary>
                    {!allowManualEdit && ( // Solo mostrar cancelar si no es edición forzada
                      <ButtonPrimary
                        buttonStyle="secondary"
                        type="button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </ButtonPrimary>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              <div className="data-grid">
                {editableFields.map((field) => (
                  <div key={field.key}>
                    <strong>{field.label}:</strong> {receiptData[field.key] || 'No especificado'}
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                {allowManualEdit ? ( 
                  <ButtonPrimary
                    buttonStyle="success"
                    onClick={handleConfirm}
                  >
                    Confirmar datos manuales
                  </ButtonPrimary>
                ) : (
                  <>
                    
                    <ButtonPrimary
                      buttonStyle="success"
                      onClick={handleConfirm}
                      disabled={!validationResult?.isValid}
                    >
                      Confirmar
                    </ButtonPrimary>
                    <ButtonPrimary
                      buttonStyle="danger"
                      onClick={onRetry}
                    >
                      Volver a intentar
                    </ButtonPrimary>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {/* Hola fabri */}
      {extractedText && (
        <details className="text-preview">
          <summary>Ver texto reconocido (irá en Notas Adicionales)</summary>
          <div className="text-content">
            {extractedText}
          </div>
        </details>
      )}
    </div>
  );
};

export default ImageScanner;