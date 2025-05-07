import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import Button from '@mui/material/Button';
import './ImageEditor.css';

export default function ImageEditor({ imageSrc, onComplete, onCancel }) {
  const [image, status] = useImage(imageSrc, 'anonymous');
  const [rotation, setRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const rectRef = useRef();
  const trRef = useRef();
  const stageRef = useRef();

  useEffect(() => {
    if (image) {
      setDimensions({ width: image.width, height: image.height });
    }
  }, [image]);

  useEffect(() => {
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, []);

  const handleConfirm = () => {
    const stage = stageRef.current;
    const rectNode = rectRef.current;

    const scaleX = rectNode.scaleX();
    const scaleY = rectNode.scaleY();

    rectNode.scaleX(1);
    rectNode.scaleY(1);

    const position = rectNode.absolutePosition();
    const width = rectNode.width() * scaleX;
    const height = rectNode.height() * scaleY;

    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    const context = newCanvas.getContext('2d');

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = dimensions.width;
    tmpCanvas.height = dimensions.height;
    const tmpCtx = tmpCanvas.getContext('2d');

    tmpCtx.save();
    tmpCtx.translate(dimensions.width / 2, dimensions.height / 2);
    tmpCtx.rotate((rotation * Math.PI) / 180);
    tmpCtx.translate(-dimensions.width / 2, -dimensions.height / 2);
    tmpCtx.drawImage(image, 0, 0);
    tmpCtx.restore();

    context.drawImage(
      tmpCanvas,
      position.x,
      position.y,
      width,
      height,
      0,
      0,
      width,
      height
    );

    newCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      onComplete(url);
    }, 'image/jpeg');
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="editor-container">
      <Stage width={dimensions.width} height={dimensions.height} ref={stageRef}>
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              rotation={rotation}
              x={dimensions.width / 2}
              y={dimensions.height / 2}
              offset={{ x: image.width / 2, y: image.height / 2 }}
            />
          )}
          <Rect
            ref={rectRef}
            x={100}
            y={100}
            width={200}
            height={150}
            fill="rgba(0,0,0,0.2)"
            stroke="red"
            strokeWidth={2}
            draggable
            onDragEnd={(e) => {
              const node = e.target;
              const newPos = node.position();
              node.position(newPos);
            }}
          />
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 50 || newBox.height < 50) return oldBox;
              return newBox;
            }}
          />
        </Layer>
      </Stage>

      <div className="editor-buttons">
        <Button variant="contained" color="primary" onClick={rotateImage}>
          Rotar 90°
        </Button>
        <Button
          variant="outlined"
          style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
