import React, { useRef, useEffect } from 'react';
import { ArtPattern, Shape } from '../types/blockchain';

interface BlockArtProps {
  pattern: ArtPattern;
  size?: number;
}

export const BlockArt: React.FC<BlockArtProps> = ({ pattern, size = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    shape: Shape
  ) => {
    ctx.save();
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;

    if (shape.rotation) {
      ctx.translate(shape.x + shape.size/2, shape.y + shape.size/2);
      ctx.rotate((shape.rotation * Math.PI) / 180);
      ctx.translate(-(shape.x + shape.size/2), -(shape.y + shape.size/2));
    }

    switch (shape.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size/2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'rectangle':
        ctx.fillRect(shape.x, shape.y, shape.size, shape.size);
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.size, shape.y);
        ctx.stroke();
        break;
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = pattern.background;
    ctx.fillRect(0, 0, size, size);

    // Draw shapes
    pattern.shapes.forEach(shape => drawShape(ctx, shape));
  }, [pattern, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-lg shadow-lg"
    />
  );
};