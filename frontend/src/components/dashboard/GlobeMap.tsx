"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

interface GlobeMapProps {
  className?: string;
}

export default function GlobeMap({ className }: GlobeMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const fadeMask = "radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%)";

  useEffect(() => {
    let phi = 0;
    let width = 0;
    
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.1, 0.2],
      markerColor: [0, 0.94, 1],
      glowColor: [0, 0.4, 0.6],
      markers: [
        // Simulated attack sources/targets for visual flair
        { location: [37.7595, -122.4367], size: 0.05 }, // SF
        { location: [40.7128, -74.0060], size: 0.04 }, // NY
        { location: [51.5074, -0.1278], size: 0.04 }, // London
        { location: [55.7558, 37.6173], size: 0.06 }, // Moscow
        { location: [39.9042, 116.4074], size: 0.07 }, // Beijing
        { location: [-23.5505, -46.6333], size: 0.04 }, // Sao Paulo
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.003;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "600px",
        aspectRatio: 1,
        margin: "auto",
        position: "relative",
      }}
    >
      <div 
        style={{
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          WebkitMaskImage: fadeMask,
          maskImage: fadeMask
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerInteracting.current =
              e.clientX - pointerInteractionMovement.current;
            if (canvasRef.current) {
              canvasRef.current.style.cursor = 'grabbing';
            }
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) {
              canvasRef.current.style.cursor = 'grab';
            }
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) {
              canvasRef.current.style.cursor = 'grab';
            }
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
            contain: "layout paint size",
            opacity: 1,
            transition: "opacity 1s ease",
          }}
        />
      </div>
    </div>
  );
}
