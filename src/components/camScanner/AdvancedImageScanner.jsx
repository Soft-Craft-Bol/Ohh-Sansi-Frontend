import React, { useState, useRef, useEffect } from 'react';
import './AdvancedImageScanner.css';

let openCvLoading = false;

const AdvancedImageScanner = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [cvReady, setCvReady] = useState(!!window.cv);
  const fileInputRef = useRef(null);
  const originalCanvasRef = useRef(null);
  const processedCanvasRef = useRef(null);
  
  useEffect(() => {
  if (window.cv || openCvLoading) {
    if (window.cv) setCvReady(true);
    return;
  }

  openCvLoading = true;
  setStatus('Cargando OpenCV...');

  const existingScript = document.getElementById('opencv-script');
  if (existingScript) {
    existingScript.onload = () => setStatus('OpenCV listo');
    return;
  }

  if (!window.Module) window.Module = {};
  const originalOnRuntimeInitialized = window.Module.onRuntimeInitialized;
  
  window.Module = {
    ...window.Module,
    onRuntimeInitialized: () => {
      if (originalOnRuntimeInitialized) originalOnRuntimeInitialized();
      setCvReady(true);
      setStatus('OpenCV listo');
      openCvLoading = false;
    }
  };

  const script = document.createElement('script');
  script.id = 'opencv-script';
  script.src = 'https://cdn.jsdelivr.net/npm/opencv.js@1.2.1/opencv.js';
  script.async = true;
  script.onload = () => setStatus('Script cargado, inicializando...');
  script.onerror = () => {
    setStatus('Error al cargar OpenCV');
    openCvLoading = false;
  };

  document.body.appendChild(script);

  return () => {
    if (!window.cv && script.parentNode) {
      document.body.removeChild(script);
      openCvLoading = false;
    }
  };
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
    if (!cvReady || !window.cv) {
      setStatus('OpenCV no está listo aún');
      return;
    }

    setIsProcessing(true);
    setStatus('Procesando imagen...');

    const img = new Image();
    img.onload = () => {
      try {
        // Dibujar imagen original
        const originalCanvas = originalCanvasRef.current;
        if (!originalCanvas) throw new Error('Canvas original no disponible');
        
        const originalCtx = originalCanvas.getContext('2d');
        originalCanvas.width = img.width;
        originalCanvas.height = img.height;
        originalCtx.drawImage(img, 0, 0, img.width, img.height);

        // Procesar con OpenCV
        processWithOpenCV(originalCanvas);
      } catch (error) {
        console.error('Error:', error);
        setStatus(`Error: ${error.message}`);
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setStatus('Error al cargar la imagen');
      setIsProcessing(false);
    };
    img.src = imgSrc;
  };

  const processWithOpenCV = (canvas) => {
    setTimeout(() => {
      try {
        if (!window.cv) {
          throw new Error('OpenCV no está disponible');
        }
        
        if (!processedCanvasRef.current) {
          throw new Error('Canvas de procesamiento no está listo');
        }

        const src = cv.imread(canvas);
        
        if (src.empty()) {
          throw new Error('No se pudo cargar la imagen en OpenCV');
        }

        const dst = new cv.Mat();
        const processed = new cv.Mat();
        
        try {
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
          
          cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0);
          
          cv.Canny(dst, dst, 50, 150, 3, false);
          
          const contours = new cv.MatVector();
          const hierarchy = new cv.Mat();
          
          try {
            cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            
            let maxArea = 0;
            let maxContourIndex = -1;
            
            for (let i = 0; i < contours.size(); ++i) {
              const contour = contours.get(i);
              const area = cv.contourArea(contour);
              if (area > maxArea) {
                maxArea = area;
                maxContourIndex = i;
              }
            }
            
            if (maxContourIndex >= 0) {
              const maxContour = contours.get(maxContourIndex);
              const approx = new cv.Mat();
              
              try {
                const epsilon = 0.02 * cv.arcLength(maxContour, true);
                cv.approxPolyDP(maxContour, approx, epsilon, true);
                
                if (approx.rows === 4) {
                  setStatus('Documento detectado, corrigiendo perspectiva...');
                  
                  const points = [];
                  for (let i = 0; i < 4; i++) {
                    points.push({
                      x: approx.data32S[i * 2],
                      y: approx.data32S[i * 2 + 1]
                    });
                  }
                  
                  points.sort((a, b) => a.y - b.y);
                  const top = points.slice(0, 2).sort((a, b) => a.x - b.x);
                  const bottom = points.slice(2, 4).sort((a, b) => a.x - b.x);
                  const orderedPoints = [...top, ...bottom.reverse()];
                  
                  const width = Math.max(
                    Math.sqrt(Math.pow(orderedPoints[1].x - orderedPoints[0].x, 2) + 
                    Math.pow(orderedPoints[1].y - orderedPoints[0].y, 2)),
                    Math.sqrt(Math.pow(orderedPoints[3].x - orderedPoints[2].x, 2) + 
                    Math.pow(orderedPoints[3].y - orderedPoints[2].y, 2))
                  );
                  
                  const height = Math.max(
                    Math.sqrt(Math.pow(orderedPoints[2].x - orderedPoints[0].x, 2) + 
                    Math.pow(orderedPoints[2].y - orderedPoints[0].y, 2)),
                    Math.sqrt(Math.pow(orderedPoints[3].x - orderedPoints[1].x, 2) + 
                    Math.pow(orderedPoints[3].y - orderedPoints[1].y, 2))
                  );
                  
                  const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
                    0, 0,
                    width, 0,
                    width, height,
                    0, height
                  ]);
                  
                  const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
                    orderedPoints[0].x, orderedPoints[0].y,
                    orderedPoints[1].x, orderedPoints[1].y,
                    orderedPoints[2].x, orderedPoints[2].y,
                    orderedPoints[3].x, orderedPoints[3].y
                  ]);
                  
                  try {
                    const M = cv.getPerspectiveTransform(srcPoints, dstPoints);
                    
                    try {
                      cv.warpPerspective(src, processed, M, new cv.Size(width, height));
                      
                      try {
                        const grayProcessed = new cv.Mat();
                        cv.cvtColor(processed, grayProcessed, cv.COLOR_RGBA2GRAY);
                        
                        try {
                          const clahe = new cv.CLAHE();
                          clahe.collectGarbage(); 
                          clahe.create(2.0, new cv.Size(8, 8));
                          clahe.apply(grayProcessed, grayProcessed);
                          
                          cv.cvtColor(grayProcessed, processed, cv.COLOR_GRAY2RGBA);
                          
                          cv.imshow(processedCanvasRef.current, processed);
                          setProcessedImage(processedCanvasRef.current.toDataURL('image/jpeg'));
                          setStatus('Documento procesado correctamente');
                        } finally {
                          grayProcessed.delete();
                        }
                      } catch (claheError) {
                        console.error("Error en CLAHE:", claheError);
                        cv.imshow(processedCanvasRef.current, processed);
                        setProcessedImage(processedCanvasRef.current.toDataURL('image/jpeg'));
                        setStatus('Documento procesado (sin mejora de contraste)');
                      }
                    } finally {
                      M.delete();
                    }
                  } finally {
                    srcPoints.delete();
                    dstPoints.delete();
                  }
                } else {
                  setStatus('No se detectó un documento con 4 lados');
                  cv.imshow(processedCanvasRef.current, src);
                  setProcessedImage(processedCanvasRef.current.toDataURL('image/jpeg'));
                }
              } finally {
                approx.delete();
              }
            } else {
              setStatus('No se detectaron contornos significativos');
              cv.imshow(processedCanvasRef.current, src);
              setProcessedImage(processedCanvasRef.current.toDataURL('image/jpeg'));
            }
          } finally {
            contours.delete();
            hierarchy.delete();
          }
        } finally {
          dst.delete();
          processed.delete();
          src.delete();
        }
      } catch (error) {
        console.error('Error en OpenCV:', error);
        setStatus(`Error al procesar: ${error.message}`);
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="scanner-container">
      <h2>Escáner Avanzado de Boletas con OpenCV</h2>
      <div className="status">{status}</div>

      <div className="controls">
        <button onClick={triggerFileInput} disabled={isProcessing || !cvReady}>
          {cvReady ? 'Subir Boleta' : 'Cargando OpenCV...'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
          disabled={!cvReady}
        />
      </div>
      
      <div className="image-container">
        <div className="image-column">
          <h3>Original</h3>
          <canvas 
            ref={originalCanvasRef} 
            style={{ maxWidth: '100%', display: image ? 'block' : 'none' }} 
          />
        </div>
        
        <div className="image-column">
          <h3>Procesada</h3>
          <canvas 
            ref={processedCanvasRef} 
            style={{ maxWidth: '100%', display: processedImage ? 'block' : 'none' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedImageScanner;