import React, { useRef, useEffect, useState } from 'react';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Transformer,
} from 'react-konva';
import useImage from 'use-image';
import Button from '@mui/material/Button';
import './ImageEditor.css';

export default function ImageEditor({ imageSrc, onComplete, onCancel }) {
  const [image]      = useImage(imageSrc, 'anonymous');
  const [rotation, setRotation]     = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [rectPos, setRectPos]       = useState({ x: 0, y: 0 });
  const [rectSize, setRectSize]     = useState({ width: 400, height: 300 });

  const rectRef  = useRef();
  const trRef    = useRef();
  const stageRef = useRef();

  // 1) Cuando la imagen carga, ajusta sus dimensiones y centra el rect de recorte
  useEffect(() => {
    if (!image) return;
    const { width, height } = image;
    setDimensions({ width, height });
    setRectPos({
      x: (width  - rectSize.width) / 2,
      y: (height - rectSize.height) / 2,
    });
  }, [image]);

  // 2) Conecta Transformer al Rect
  useEffect(() => {
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [rectPos, rectSize]);

  // 3) Al confirmar: rotamos en un canvas y recortamos
  const handleConfirm = () => {
    const node = rectRef.current;
    const sX = node.scaleX(), sY = node.scaleY();
    node.scaleX(1); node.scaleY(1);

    const { x, y } = node.absolutePosition();
    const w = node.width()  * sX;
    const h = node.height() * sY;

    // Canvas intermedio para rotar
    const tmp = document.createElement('canvas');
    tmp.width  = dimensions.width;
    tmp.height = dimensions.height;
    const tctx = tmp.getContext('2d');
    tctx.save();
    tctx.translate(dimensions.width/2, dimensions.height/2);
    tctx.rotate((rotation * Math.PI)/180);
    tctx.translate(-dimensions.width/2, -dimensions.height/2);
    tctx.drawImage(image, 0, 0);
    tctx.restore();

    // Canvas final de recorte
    const out = document.createElement('canvas');
    out.width  = w; out.height = h;
    const octx = out.getContext('2d');
    octx.drawImage(tmp, x, y, w, h, 0, 0, w, h);

    out.toBlob(blob => {
      onComplete(URL.createObjectURL(blob));
    }, 'image/jpeg');
  };

  const rotateImage = () => setRotation(r => (r + 90) % 360);

  // 4) Mantiene el rect dentro de la imagen original
  const handleDragMove = e => {
    const node = e.target;
    let { x, y } = node.position();
    const { width, height } = dimensions;
    x = Math.max(0, Math.min(x, width  - node.width()));
    y = Math.max(0, Math.min(y, height - node.height()));
    node.position({ x, y });
    setRectPos({ x, y });
  };

  // 5) Ajusta tamaño tras el transform
  const handleTransformEnd = () => {
    const node = rectRef.current;
    const sX = node.scaleX(), sY = node.scaleY();
    const newW = Math.min(dimensions.width,  node.width()  * sX);
    const newH = Math.min(dimensions.height, node.height() * sY);
    node.scaleX(1); node.scaleY(1);
    setRectSize({ width: newW, height: newH });
  };

  // 6) Calcula las “dimensiones rotadas” para el Stage
  const isRotated = rotation % 180 !== 0;
  const stageW    = isRotated ? dimensions.height : dimensions.width;
  const stageH    = isRotated ? dimensions.width  : dimensions.height;

  // 7) Escala “contain” dentro de un wrapper fijo
  const wrapperSize = 600; 
  const scale       = Math.min(wrapperSize / stageW, wrapperSize / stageH);

  return (
    <div className="editor-container">
      {/* Wrapper siempre 1000×1000, overflow hidden */}
      <div
        style={{
          width:      wrapperSize,
          height:     wrapperSize,
          overflow:   'hidden',
          margin:     '0 auto 1rem',
          border:     '1px solid #ccc',
          position:   'relative',
        }}
      >
        {/* Stage con dims rotadas y centrado + escalado */}
        <Stage
          width={stageW}
          height={stageH}
          ref={stageRef}
          style={{
            position:       'absolute',
            top:            (wrapperSize - stageH * scale) / 2,
            left:           (wrapperSize - stageW * scale) / 2,
            transform:      `scale(${scale})`,
            transformOrigin:'0 0',
          }}
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                rotation={rotation}
                x={stageW  / 2}
                y={stageH / 2}
                offset={{
                  x: dimensions.width / 2,
                  y: dimensions.height / 2,
                }}
              />
            )}

            <Rect
              ref={rectRef}
              x={rectPos.x}
              y={rectPos.y}
              width={rectSize.width}
              height={rectSize.height}
              fill="rgba(0,0,0,0.2)"
              stroke="red"
              strokeWidth={4}
              draggable
              onDragMove={handleDragMove}
              onTransformEnd={handleTransformEnd}
            />

            <Transformer
              ref={trRef}
              rotateEnabled={false}
              enabledAnchors={[
                'top-left','top-right','bottom-left','bottom-right'
              ]}
              anchorSize={12}
              anchorStrokeWidth={3}
              borderStrokeWidth={3}
              boundBoxFunc={(oldBox, newBox) => {
                const { width, height } = dimensions;
                newBox.width  = Math.min(width,  newBox.width);
                newBox.height = Math.min(height, newBox.height);
                const minSize = 50;
                if (newBox.width < minSize || newBox.height < minSize) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>

      <div className="editor-buttons">
        <Button variant="contained" color="primary" onClick={rotateImage}>
          Rotar 90°
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={onCancel}
          style={{ margin: '0 1rem' }}
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
