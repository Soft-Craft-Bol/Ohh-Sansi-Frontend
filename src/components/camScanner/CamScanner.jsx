import { useOpenCv } from "opencv-react";
import { useState } from "react";

const CamScanner = () => {
  const { cv, loaded } = useOpenCv();
  const [scannedImage, setScannedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!cv || !originalImage) return;

    setIsProcessing(true);
    
    try {
      const imgElement = document.createElement('img');
      imgElement.src = originalImage;
      
      await new Promise((resolve) => {
        imgElement.onload = () => resolve();
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0);

      // Procesamiento con OpenCV
      const src = cv.matFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      const dst = new cv.Mat();
      const gray = new cv.Mat();
      const binary = new cv.Mat();

      // 1. Convertir a escala de grises
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // 2. Aplicar umbral adaptativo para mejorar contraste (efecto blanco/negro)
      cv.adaptiveThreshold(
        gray,
        binary,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        11,
        2
      );

      // 3. Opcional: Mejorar contraste con CLAHE
      const clahe = new cv.CLAHE();
      clahe.setClipLimit(2.0);
      clahe.setTilesGridSize(new cv.Size(8, 8));
      clahe.apply(gray, dst);

      // Mostrar resultado
      const outputCanvas = document.createElement('canvas');
      cv.imshow(outputCanvas, dst.empty() ? binary : dst);
      setScannedImage(outputCanvas.toDataURL('image/jpeg'));

      // Liberar memoria
      src.delete();
      dst.delete();
      gray.delete();
      binary.delete();
      clahe.delete();
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!loaded) {
    return <div>Cargando OpenCV...</div>;
  }

  return (
    <div className="scanner-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Document Scanner</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isProcessing}
          style={{ display: 'block', margin: '10px 0' }}
        />
        
        {originalImage && (
          <button
            onClick={processImage}
            disabled={isProcessing}
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isProcessing ? 'Procesando...' : 'Mejorar Documento'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {originalImage && (
          <div>
            <h3>Original</h3>
            <img
              src={originalImage}
              alt="Original"
              style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ddd' }}
            />
          </div>
        )}

        {scannedImage && (
          <div>
            <h3>Resultado</h3>
            <img
              src={scannedImage}
              alt="Documento escaneado"
              style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ddd' }}
            />
            <a
              href={scannedImage}
              download="documento-escaneado.jpg"
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: '#2196F3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Descargar
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CamScanner;