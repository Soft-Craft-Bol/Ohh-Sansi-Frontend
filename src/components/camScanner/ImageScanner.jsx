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


const ImageScanner = ({ initialImage }) => {
    const location = useLocation();
    const [image, setImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState('');
    const [receiptData, setReceiptData] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [useMagicPro, setUseMagicPro] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

    useEffect(() => {
        if (initialImage) {
            setImage(initialImage);
            processImage(initialImage);
        }
    }, [initialImage]);

    const showUploader = !initialImage && !location.search.includes('image=');

    const [settings, setSettings] = useState({
        contrast: 100,
        brightness: 100,
        grayscale: false,
        sharpen: false,
    });

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const originalCanvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !originalCanvasRef.current) {
            console.error('Canvas references not initialized');
        }
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
            processImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const processImage = (imgSrc) => {
        if (!canvasRef.current || !originalCanvasRef.current) {
            console.error('Canvas elements not ready');
            return;
        }

        setIsProcessing(true);
        setProgress(0);

        const img = new Image();
        img.onload = () => {
            try {
                // Dibujar imagen original
                const originalCanvas = originalCanvasRef.current;
                const originalCtx = originalCanvas.getContext('2d');
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                originalCtx.drawImage(img, 0, 0, img.width, img.height);

                // Procesar imagen
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.filter = `
                    contrast(${settings.contrast}%)
                    brightness(${settings.brightness}%)
                    ${settings.grayscale ? 'grayscale(100%)' : ''}
                `;

                ctx.drawImage(img, 0, 0, img.width, img.height);

                if (useMagicPro) {
                    applyMagicProEffect(ctx, img.width, img.height);
                } else if (settings.sharpen) {
                    applySharpenFilter(ctx, img.width, img.height);
                }

                setProcessedImage(canvas.toDataURL('image/jpeg'));
                setIsProcessing(false);
                extractTextFromImage(canvas);
            } catch (error) {
                console.error('Error processing image:', error);
                setIsProcessing(false);
            }
        };
        img.onerror = () => {
            console.error('Error loading image');
            setIsProcessing(false);
        };
        img.src = imgSrc;
    };

    const applySharpenFilter = (ctx, width, height) => {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (i > width * 4 && i < data.length - width * 4) {
                for (let j = 0; j < 3; j++) {
                    data[i + j] = data[i + j] * 1.5 -
                        data[i + j - 4] * 0.25 -
                        data[i + j + 4] * 0.25;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };

    const applyMagicProEffect = (ctx, width, height) => {
        ctx.filter = `contrast(150%) brightness(110%) saturate(120%)`;
        ctx.drawImage(ctx.canvas, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (i > width * 4 && i < data.length - width * 4) {
                for (let j = 0; j < 3; j++) {
                    data[i + j] = data[i + j] * 1.8 -
                        data[i + j - 4] * 0.4 -
                        data[i + j + 4] * 0.4;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        ctx.filter = 'grayscale(100%) contrast(200%)';
        ctx.drawImage(ctx.canvas, 0, 0, width, height);
        ctx.filter = 'none';
    };

    const extractTextFromImage = async (canvas) => {
        setText('Procesando texto...');
        setProgress(0);
        setValidationResult(null);
        setSubmitResult(null);

        try {
            const result = await Tesseract.recognize(
                canvas,
                'spa',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );

            const receiptData = processReceiptText(result.data.text);
            const validation = validateReceiptData(receiptData);

            setText(`TEXTO RECONOCIDO:\n${result.data.text}\n\nDATOS EXTRAÍDOS:\n${JSON.stringify(receiptData, null, 2)}`);
            setReceiptData(receiptData);
            setValidationResult(validation);

            if (!validation.isValid) {
                console.warn("Problemas de validación:", validation.errors);
            }
        } catch (error) {
            console.error('Error en OCR:', error);
            setText('Error al procesar el texto');
            setValidationResult({
                isValid: false,
                errors: ["Error en el proceso de reconocimiento de texto"]
            });
        }
    };

    const handleVerificarPago = async () => {
        if (!receiptData) {
            alert('No hay datos de recibo para enviar');
            return;
        }

        // Validación adicional
        if (!receiptData.documento || !/^\d{6,}$/.test(receiptData.documento)) {
            alert('El número de documento no es válido o no se encontró');
            return;
        }

        if (!receiptData.totalBs || !/^\d+\.\d{2}$/.test(receiptData.totalBs)) {
            alert('El monto total no es válido o no se encontró');
            return;
        }

        // Preparar los datos para el endpoint
        const pagoData = {
            carnetIdentidad: parseInt(receiptData.documento),
            montoPagado: parseFloat(receiptData.totalBs),
            fechaPago: receiptData.fecha || new Date().toISOString().split('T')[0],
            codTransaccion: receiptData.numero || `SCAN-${Date.now()}`,
            imagenComprobante: image || '',
            nombreReceptor: receiptData.recibidoDe || 'Nombre no encontrado',
            estadoOrden: 'PAGADO',
            notasAdicionales: receiptData.concepto || 'Pago detectado mediante escáner'
        };

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const response = await verificarPago(pagoData);
            setSubmitResult({
                success: true,
                message: 'Pago verificado exitosamente',
                data: response.data
            });
        } catch (error) {
            console.error('Error al verificar el pago:', error);
            setSubmitResult({
                success: false,
                message: error.response?.data?.message || 'Error al verificar el pago',
                error: error
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSettingChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseInt(value)
        }));
    };

    const applyChanges = () => {
        if (image) {
            processImage(image);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="image-scanner-container">
            <h2>Escáner de Boletas</h2>

            <div className="controls">
                {showUploader && (
                    <button onClick={triggerFileInput} disabled={isProcessing}>
                        Subir Boleta
                    </button>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <div className="settings">
                    <label>
                        Contraste: {settings.contrast}%
                        <input
                            type="range"
                            name="contrast"
                            min="0"
                            max="200"
                            value={settings.contrast}
                            onChange={handleSettingChange}
                        />
                    </label>

                    <label>
                        Brillo: {settings.brightness}%
                        <input
                            type="range"
                            name="brightness"
                            min="0"
                            max="200"
                            value={settings.brightness}
                            onChange={handleSettingChange}
                        />
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            name="grayscale"
                            checked={settings.grayscale}
                            onChange={handleSettingChange}
                        />
                        Escala de grises
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            name="sharpen"
                            checked={settings.sharpen}
                            onChange={handleSettingChange}
                        />
                        Enfocar
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="magicPro"
                            checked={useMagicPro}
                            onChange={() => setUseMagicPro(!useMagicPro)}
                        />
                        Efecto Magic Pro
                    </label>

                    <button onClick={applyChanges} disabled={!image || isProcessing}>
                        Aplicar Cambios
                    </button>
                </div>
                {validationResult && (
                    <div className={`validation-results ${validationResult.isValid ? 'valid' : 'invalid'}`}>
                        <h3>Resultados de Validación:</h3>
                        <ul>
                            {validationResult.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {isProcessing && (
                <div className="progress">
                    Procesando... {progress}%
                    <progress value={progress} max="100" />
                </div>
            )}

            <div className="image-container">
                <div className="image-column">
                    <h3>Original</h3>
                    <canvas
                        ref={originalCanvasRef}
                        style={{ maxWidth: '100%', display: image ? 'block' : 'none' }}
                    />
                    {image && originalCanvasRef.current && (
                        <p>Tamaño: {originalCanvasRef.current.width} x {originalCanvasRef.current.height} px</p>
                    )}
                </div>

                <div className="image-column">
                    <h3>Procesada</h3>
                    <canvas
                        ref={canvasRef}
                        style={{ maxWidth: '100%', display: processedImage ? 'block' : 'none' }}
                    />
                    {processedImage && canvasRef.current && (
                        <p>Tamaño: {canvasRef.current.width} x {canvasRef.current.height} px</p>
                    )}
                </div>
            </div>

            {receiptData && (
                <div className="structured-data">
                    <h3>Datos Estructurados:</h3>
                    <div className="data-grid">
                        <div><strong>Número:</strong> {receiptData.numero || 'No encontrado'}</div>
                        <div><strong>Facultad:</strong> {receiptData.facultad || 'No encontrada'}</div>
                        <div><strong>Recibido de:</strong> {receiptData.recibidoDe || 'No encontrado'}</div>
                        <div><strong>Concepto:</strong> {receiptData.concepto || 'No encontrado'}</div>
                        <div><strong>Suma:</strong> {receiptData.suma || 'No encontrada'}</div>
                        <div><strong>Total Bs.:</strong> {receiptData.totalBs || 'No encontrado'}</div>
                        <div><strong>Documento:</strong> {receiptData.documento || 'No encontrado'}</div>
                        <div><strong>Fecha:</strong> {receiptData.fecha || 'No encontrada'}</div>
                        <div><strong>Usuario:</strong> {receiptData.usuario || 'No encontrado'}</div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            onClick={handleVerificarPago} 
                            disabled={!receiptData.documento || !receiptData.totalBs || isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Verificar Pago'}
                        </button>
                    </div>

                    {submitResult && (
                        <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
                            <h3>{submitResult.success ? 'Éxito' : 'Error'}</h3>
                            <p>{submitResult.message}</p>
                            {submitResult.data && (
                                <div className="submit-data">
                                    <pre>{JSON.stringify(submitResult.data, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="text-results">
                <h3>Texto Extraído:</h3>
                <textarea
                    value={text}
                    readOnly
                    placeholder="El texto reconocido aparecerá aquí..."
                />
            </div>
        </div>
    );
};

export default ImageScanner;