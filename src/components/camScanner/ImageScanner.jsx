import React, { useState, useEffect } from 'react';
import * as Tesseract from 'tesseract.js';
import { Formik, Form } from 'formik';
import './ImageScanner.css';
import InputText from '../inputs/InputText';
import { ButtonPrimary } from '../button/ButtonPrimary';

const processReceiptText = (ocrText) => {
  const receiptData = {
    universidad: 'UNIVERSIDAD MAYOR DE SAN SIMÓN',
    direccion: 'DIRECCIÓN ADMINISTRATIVA Y FINANCIERA',
    tipoDocumento: 'RECIBO DE CAJA',
    codTransaccion: '',// Nro factura 
    facultad: 'FAC. DE CIENCIAS Y TECNOLOGÍA',
    nombreReceptor: '', //nombre del que paga esta como recibido de
    notasAdicionales: '', //por concepto de
    montoPagado: '', //total Bs
    aclaracion: '', // materia a la que corresponde el pago
    carnetIdentidad: '', // documento
    NumeroControl: '', //Nro control
    fechaPago: '', //fecha
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

  // Variables de contexto
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

    // Extraer suma en letras
    if (line.match(/suma de|La suma de/i)) {
      nextLineIsSuma = true;
      receiptData.suma = line.split(/[:\.]/)[1]?.trim() || line.replace(/suma de|La suma de/i, '').trim();
    } else if (nextLineIsSuma && line.match(/BOLIVIANOS/i)) {
      receiptData.suma += ' ' + line;
      nextLineIsSuma = false;

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

  return receiptData;
};

const validateReceiptData = (data) => {
  const requiredFields = ['documento', 'totalBs', 'recibidoDe'];
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

const ImageScanner = ({ initialImage, onComplete, onRetry, attemptsLeft }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [receiptData, setReceiptData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialImage) {
      extractTextFromImage(initialImage);
    }
  }, [initialImage]);

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
      key: 'notasAdicionales', 
      label: 'Notas Adicionales', 
      type: 'text'
    },
    { 
      key: 'montoPagado', 
      label: 'Monto Pagado (Bs.)', 
      type: 'text',
      inputProps: { decimal: true, decimalPlaces: 2 }
    },
    { 
      key: 'aclaracion', 
      label: 'Materia', 
      type: 'text'
    },
    { 
      key: 'carnetIdentidad', 
      label: 'Carnet de Identidad', 
      type: 'text',
      inputProps: { onlyNumbers: true }
    },
    { 
      key: 'NumeroControl', 
      label: 'Número de Control', 
      type: 'text',
      inputProps: { onlyNumbers: true }
    },
    { 
      key: 'fechaPago', 
      label: 'Fecha de Pago', 
      type: 'date',
      inputProps: { onlyNumbers: true }
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
    setReceiptData(values);
    const validation = validateReceiptData(values);
    setValidationResult(validation);
    setIsEditing(false);
  };

  const handleConfirm = () => {
    if (receiptData && validationResult?.isValid) {
      onComplete(extractedText, receiptData);
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
            <p className="attempts-warning">
              Tienes {attemptsLeft} intento{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}. 
              Suba una foto con mejor resolución y buena iluminación.
            </p>
          )}
        </div>
      )}

      {receiptData && (
        <div className="structured-data">
          <h3>Datos del comprobante:</h3>
          
          {isEditing ? (
            <Formik
              initialValues={receiptData}
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
                      {...field.inputProps} // Pasamos las props específicas aquí
                    />
                  ))}
                  
                  <div className="edit-buttons">
                    <ButtonPrimary 
                      buttonStyle="primary"
                      type="submit"
                    >
                      Guardar cambios
                    </ButtonPrimary>
                    <ButtonPrimary 
                      buttonStyle="secondary"
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </ButtonPrimary>
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
                <ButtonPrimary 
                  buttonStyle="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Editar datos
                </ButtonPrimary>
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
              </div>
            </>
          )}
        </div>
      )}

      {extractedText && (
        <details className="text-preview">
          <summary>Ver texto reconocido</summary>
          <div className="text-content">
            {extractedText}
          </div>
        </details>
      )}
    </div>
  );
};

export default ImageScanner;