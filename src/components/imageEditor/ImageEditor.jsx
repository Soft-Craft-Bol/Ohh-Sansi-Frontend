import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import './ImageEditor.css';
import getCroppedImg from './cropImage';


export default function ImageEditor({ imageSrc, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
    onComplete(croppedImage);
  };

  return (
    <div className="editor-container">
      <div className="cropper">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={4 / 3}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="controls">
        <label>Zoom</label>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => setZoom(zoom)}
        />
        <label>Rotar</label>
        <Slider
          value={rotation}
          min={0}
          max={360}
          step={1}
          onChange={(e, r) => setRotation(r)}
        />
        <div className="buttons">
          <Button variant="contained" onClick={handleDone} color="primary">
            Confirmar
          </Button>
          <Button variant="outlined" onClick={onCancel} color="secondary">
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
         >
            Rotar 90°
        </Button>

        </div>
      </div>
    </div>
  );
}
