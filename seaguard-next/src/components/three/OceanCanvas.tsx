'use client';

import { useRef, useEffect } from 'react';

export default function OceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    import('@/lib/ocean').then(({ initOcean }) => {
      if (canvasRef.current) {
        const result = initOcean(canvasRef.current);
        cleanup = result.cleanup;
      }
    });

    return () => cleanup?.();
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
}
