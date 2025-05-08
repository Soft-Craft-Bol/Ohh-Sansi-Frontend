import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import Button from '@mui/material/Button';
import './ImageEditor.css';

export default function ImageEditor({ imageSrc, onComplete, onCancel }) {
  const [image, status] = useImage(imageSrc, 'anonymous');
  const [rotation, setRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [rectPosition, setRectPosition] = useState({ x: 0, y: 0 });
  const [rectSize, setRectSize] = useState({ width: 400, height: 300 });
  const rectRef = useRef();
  const trRef = useRef();
  const stageRef = useRef();

  useEffect(() => {
    if (image) {
      setDimensions({ width: image.width, height: image.height });
      // Set initial position of the crop rectangle (centered)
      setRectPosition({
        x: (image.width - rectSize.width) / 2,
        y: (image.height - rectSize.height) / 2,
      });
    }
  }, [image]);

  useEffect(() => {
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [rectPosition, rectSize]);

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

  const handleDragMove = (e) => {
    const node = e.target;
    const newPos = node.position();
    const { width, height } = dimensions;
  
    // Restrict the rectangle to stay within the bounds of the image
    if (newPos.x < 0) newPos.x = 0;
    if (newPos.y < 0) newPos.y = 0;
  
    // Restrict the rectangle to not exceed the right and bottom limits
    if (newPos.x + node.width() > width) newPos.x = width - node.width();
    if (newPos.y + node.height() > height) newPos.y = height - node.height();
  
    setRectPosition(newPos);
    node.position(newPos);
  };
  

  const handleResize = (e) => {
    const node = e.target;
    const newSize = {
      width: node.width(),
      height: node.height(),
    };

    const { width, height } = dimensions;

    // Ensure the resized rectangle doesn't exceed the size of the image
    if (newSize.width > width) newSize.width = width;
    if (newSize.height > height) newSize.height = height;

    setRectSize(newSize);
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
            x={rectPosition.x}
            y={rectPosition.y}
            width={rectSize.width}
            height={rectSize.height}
            fill="rgba(0,0,0,0.2)"
            stroke="red"
            strokeWidth={4}
            draggable
            onDragMove={handleDragMove}
            onResize={handleResize}
          />
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              const { width, height } = dimensions;
              if (newBox.width > width) newBox.width = width;
              if (newBox.height > height) newBox.height = height;
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
