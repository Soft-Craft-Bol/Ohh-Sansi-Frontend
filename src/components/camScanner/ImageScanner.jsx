import React, { useState, useEffect } from 'react';
import * as Tesseract from 'tesseract.js';
import { Formik, Form } from 'formik';
import './ImageScanner.css';
import InputText from '../inputs/InputText';
import { ButtonPrimary } from '../button/ButtonPrimary';
import receiptSchema from '../../schemas/receiptSchema';

const processReceiptText = (ocrText) => {
  const receiptData = {
    codTransaccion: '',    // Nro factura 
    nombreReceptor: '',    // recibido de
    montoPagado: '',       // total Bs
    carnetIdentidad: '',   // documento
    fechaPago: '',         // fecha
    notasAdicionales: ocrText // Texto completo OCR por defecto
  };

  // Preprocesamiento del texto
  const normalizedText = ocrText
    .replace(/[|]/g, '1')
    .replace(/[!]/g, 'I')
    .replace(/[.]{2,}/g, '.')
    .replace(/\s+/g, ' ')
    .replace(/TW:/g, 'Total Bs:')
    .replace(/Br:/g, 'Por concepto de:');

  const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line);

  lines.forEach((line, index) => {
    // Extraer número de recibo/factura
    if (line.match(/Nro[\s\.\-:]/i)) {
      const numMatch = line.match(/(\d{5,})/);
      if (numMatch) receiptData.codTransaccion = numMatch[1];
    }

    // Extraer "Recibí de" (nombre del receptor)
    if (line.match(/Recibí de:|ope del/i)) {
      const nameMatch = line.replace(/Recibí de:|ope del/i, '').trim();
      receiptData.nombreReceptor = nameMatch
        .replace(/LEGECMA/i, 'LEDEZMA')
        .replace(/NEPEA/i, 'NEREA');
    }

    // Extraer total Bs (monto pagado)
    if (line.match(/Total\sBs?\.?[\s:]|TW:[\s-]/i)) {
      const totalMatch = line.match(/(\d+[\.,]\d{2})/);
      if (totalMatch) {
        receiptData.montoPagado = totalMatch[1].replace(',', '.');
      } else {
        for (let i = index + 1; i < Math.min(index + 4, lines.length); i++) {
          const nextLineMatch = lines[i].match(/(\d+[\.,]\d{2})/);
          if (nextLineMatch) {
            receiptData.montoPagado = nextLineMatch[1].replace(',', '.');
            break;
          }
        }
      }
    }

    // Extraer número de documento (carnet)
    if (line.match(/Documento[:\.]|poLUMENLA -/i)) {
      const docMatch = line.match(/(\d{6,})/);
      if (docMatch) receiptData.carnetIdentidad = docMatch[1];
    }

    // Extraer fecha
    if (line.match(/\d{2}[\-\/]\d{2}[\-\/]\d{2,4}/)) {
      const dateMatch = line.match(/(\d{2}[\-\/]\d{2}[\-\/]\d{2,4})/);
      if (dateMatch) receiptData.fechaPago = dateMatch[1].replace(/\//g, '-');
    }
  });

  return receiptData;
};

const validateReceiptData = (data) => {
  const requiredFields = ['carnetIdentidad', 'montoPagado', 'nombreReceptor'];
  const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: "No se pudo detectar toda la información necesaria. Por favor, suba una foto con mejor resolución o verifique que el comprobante sea legible."
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