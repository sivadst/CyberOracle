'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600,
      height: 600,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.2],
      markerColor: [0, 0.94, 1], // #00f0ff (Cyan)
      glowColor: [0, 0.5, 0.7],
      markers: [
        // Simulated Attack Origins / Targets
        { location: [37.7595, -122.4367], size: 0.1 }, // SF
        { location: [40.7128, -74.0060], size: 0.1 }, // NY
        { location: [51.5074, -0.1278], size: 0.08 }, // London
        { location: [35.6762, 139.6503], size: 0.1 }, // Tokyo
        { location: [55.7558, 37.6173], size: 0.08 }, // Moscow
        { location: [39.9042, 116.4074], size: 0.12 }, // Beijing
      ],
      onRender: (state) => {
        // Rotate globe
        state.phi = phi;
        phi += 0.005;
      }
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative min-h-[300px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#0a0e17_80%)] z-10 pointer-events-none" />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 600,
          aspectRatio: 1
        }}
      />
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span className="text-xs text-[#00f0ff] font-mono uppercase">Global tracking active</span>
        </div>
      </div>
    </div>
  );
}
