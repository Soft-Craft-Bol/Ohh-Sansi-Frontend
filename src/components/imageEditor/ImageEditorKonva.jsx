import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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

// Constantes de configuración
const WRAPPER_SIZE = 600;  // Tamaño fijo del contenedor
const MIN_RECT_SIZE = 50;   // Tamaño mínimo del rectángulo de recorte

// Parámetros del Transformer
const TRANSFORMER_ANCHORS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const TRANSFORMER_ANCHOR_SIZE = 18;
const TRANSFORMER_ANCHOR_STROKE = 4;
const TRANSFORMER_BORDER_STROKE = 4;

// Parámetros del Rectángulo
const RECT_FILL = 'rgba(0,0,0,0.2)';
const RECT_STROKE = 'red';
const RECT_STROKE_WIDTH = 8;

export default function ImageEditor({ imageSrc, onComplete, onCancel }) {
  // Estados principales
  const [image] = useImage(imageSrc, 'anonymous');
  const [rotation, setRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [rectPos, setRectPos] = useState({ x: 0, y: 0 });
  const [rectSize, setRectSize] = useState({ width: 400, height: 300 });
  const [confirmed, setConfirmed] = useState(false);

  // Referencias al canvas y nodos Konva
  const rectRef = useRef();
  const trRef = useRef();
  const stageRef = useRef();

  // 1) Al cargar la imagen, guardar dimensiones reales
  // ─── 1) Al cargar la imagen, ajustar rectángulo al 100% ─────────────────
useEffect(() => {
  if (!image) return;
  const { width, height } = image;
  // guardar dimensiones
  setDimensions({ width, height });
  // hacer que el rect cubra toda la imagen
  setRectSize({ width: height, height });  // <-- aquí width: width
  setRectSize({ width, height });
  // posicionarlo arriba/izquierda
  setRectPos({ x: 0, y: 0 });
}, [image]);

  // 2) Calcular dimensiones rotadas y límites
  const { stageW, stageH, boundWidth, boundHeight } = useMemo(() => {
    const rotado = rotation % 180 !== 0;
    const w = rotado ? dimensions.height : dimensions.width;
    const h = rotado ? dimensions.width : dimensions.height;
    return { stageW: w, stageH: h, boundWidth: w, boundHeight: h };
  }, [dimensions, rotation]);

  // 3) Centrar el rectángulo cuando cambian límites o tamaño del rect
  useEffect(() => {
    const x = (boundWidth - rectSize.width) / 2;
    const y = (boundHeight - rectSize.height) / 2;
    setRectPos({ x, y });
  }, [boundWidth, boundHeight, rectSize.width, rectSize.height]);

  // 4) Conectar el Transformer al Rect
  useEffect(() => {
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [rectPos, rectSize]);

  // 5) Calcular escala y offset para mostrar completo dentro del wrapper
  const { scale, offsetX, offsetY } = useMemo(() => {

    const s = Math.min(WRAPPER_SIZE / stageW, WRAPPER_SIZE / stageH);
    return {
      scale: s,
      offsetX: (WRAPPER_SIZE - stageW * s) / 2,
      offsetY: (WRAPPER_SIZE - stageH * s) / 2,
    };
  }, [stageW, stageH]);

  // ─── 6) Rotar la imagen 90° y re-ajustar rect al 100% ─────────────────
const rotateImage = () => {
  // nuevo ángulo
  const next = (rotation + 90) % 360;
  setRotation(next);

  // dimensiones tras rotar
  const isRotated = next % 180 !== 0;
  const boundW = isRotated ? dimensions.height : dimensions.width;
  const boundH = isRotated ? dimensions.width : dimensions.height;

  // ajustar rect para cubrir toda la imagen rotada
  setRectSize({ width: boundW, height: boundH });
  // posicionarlo arriba/izquierda
  setRectPos({ x: 0, y: 0 });
};


  // 7) Mantener el rectángulo dentro de la imagen al arrastrar
  const handleDragMove = useCallback(e => {
    const node = e.target;
    let { x, y } = node.position();
    x = Math.max(0, Math.min(x, boundWidth - node.width() * node.scaleX()));
    y = Math.max(0, Math.min(y, boundHeight - node.height() * node.scaleY()));
    node.position({ x, y });
    setRectPos({ x, y });
  }, [boundWidth, boundHeight]);

  // 8) Limitar el tamaño del rectángulo al finalizar transformación
  const handleTransformEnd = useCallback(() => {
    const node = rectRef.current;
    const sX = node.scaleX(), sY = node.scaleY();
    const newW = Math.min(boundWidth, node.width() * sX);
    const newH = Math.min(boundHeight, node.height() * sY);
    node.scaleX(1);
    node.scaleY(1);
    setRectSize({ width: newW, height: newH });
  }, [boundWidth, boundHeight]);

  // 9) Confirmar recorte: rotar en canvas y extraer la sección seleccionada
  const handleConfirm = useCallback(() => {
    const node = rectRef.current;
    const sX = node.scaleX(), sY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const { x, y } = node.absolutePosition();
    const w = node.width() * sX;
    const h = node.height() * sY;

    // Ángulo normalizado [0,360)
    const angle = rotation % 360;

    // 1) Canvas temporal que contendrá la imagen entera rotada
    const tmp = document.createElement('canvas');
    if (angle === 90 || angle === 270) {
      // intercambiar dims cuando es 90/270
      tmp.width = dimensions.height;
      tmp.height = dimensions.width;
    } else {
      tmp.width = dimensions.width;
      tmp.height = dimensions.height;
    }
    const tctx = tmp.getContext('2d');

    // 2) Centrar origen y aplicar rotación
    tctx.save();
    tctx.translate(tmp.width / 2, tmp.height / 2);
    tctx.rotate((angle * Math.PI) / 180);
    // tras rotar, dibujamos la imagen desplazada
    tctx.drawImage(
      image,
      -dimensions.width / 2,
      -dimensions.height / 2,
      dimensions.width,
      dimensions.height
    );
    tctx.restore();

    // 3) Canvas final para recortar la porción seleccionada
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const octx = out.getContext('2d');
    octx.drawImage(tmp, x, y, w, h, 0, 0, w, h);

    // 4) Convertir a Blob y devolver URL
     out.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    onComplete(url); 
    setConfirmed(true);  
  }, 'image/jpeg');
  }, [dimensions, image, onComplete, rotation]);


  return (
    <div className="editor-container">
      {/* Contenedor fijo que oculta excedentes */}
      <div
        style={{
          width: WRAPPER_SIZE,
          height: WRAPPER_SIZE,
          overflow: 'visible',
          margin: '0 auto 1rem',
          border: '1px solid #ccc',
          position: 'relative',
        }}
      >
        {/* Stage con imagen y rectángulo de recorte */}
        <Stage
          width={stageW}
          height={stageH}
          ref={stageRef}
          style={{
            position: 'absolute',
            top: offsetY,
            left: offsetX,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                rotation={rotation}
                x={stageW / 2}
                y={stageH / 2}
                offset={{
                  x: dimensions.width / 2,
                  y: dimensions.height / 2,
                }}
              />
            )}
            {/* Rectángulo semitransparente de recorte */}
            <Rect
              ref={rectRef}
              x={rectPos.x}
              y={rectPos.y}
              width={rectSize.width}
              height={rectSize.height}
              fill={RECT_FILL}
              stroke={RECT_STROKE}
              strokeWidth={RECT_STROKE_WIDTH / scale}
              draggable
              onDragMove={handleDragMove}
              onTransformEnd={handleTransformEnd}
            />
            {/* Handles de redimensionado */}
            <Transformer
              ref={trRef}
              rotateEnabled={false}

              // ── SOLO EN LOS CUATRO PUNTOS CENTRALES DE CADA LADO ─────
              enabledAnchors={[
                'top-center',
                'middle-right',
                'bottom-center',
                'middle-left',
              ]}

              // ── STROKE PUNTEADO PARA EL BORDE ────────────────────────
              borderStroke="white"
              borderStrokeWidth={TRANSFORMER_BORDER_STROKE / scale}
              borderDash={[6 / scale, 4 / scale]}

              // ── MANIJAS CIRCULARES (PERO ATRAPAN EN EL CENTRO DEL BORDE) ─
              anchorSize={TRANSFORMER_ANCHOR_SIZE / scale}
              anchorCornerRadius={7 / scale}
              anchorFill="white"
              anchorStroke="blue"
              anchorStrokeWidth={TRANSFORMER_ANCHOR_STROKE / scale}

              boundBoxFunc={(oldBox, newBox) => {
                // aquí tu lógica de límites para que el recorte nunca salga
                // fuera de la imagen
                newBox.width = Math.min(boundWidth, newBox.width);
                newBox.height = Math.min(boundHeight, newBox.height);
                newBox.x = Math.max(0, Math.min(newBox.x, boundWidth - newBox.width));
                newBox.y = Math.max(0, Math.min(newBox.y, boundHeight - newBox.height));

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
      {/* Botones de acción */}
      {!confirmed && (
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

      )}
          </div>
  );
}
