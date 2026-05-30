"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.15],
      markerColor: [0, 0.94, 1], // #00f0ff
      glowColor: [0, 0.94, 1],
      markers: [
        // New York
        { location: [40.7128, -74.006], size: 0.05 },
        // London
        { location: [51.5074, -0.1278], size: 0.05 },
        // Tokyo
        { location: [35.6762, 139.6503], size: 0.07 },
        // San Francisco
        { location: [37.7749, -122.4194], size: 0.05 },
      ],
      onRender: (state: Record<string, number>) => {
        state.phi = phi;
        phi += 0.003;
      },
    };

    const globe = createGlobe(canvasRef.current, options);

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="w-full max-w-[800px] aspect-square mx-auto relative flex items-center justify-center opacity-80 mix-blend-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0e17_70%)] z-10 pointer-events-none" />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 1,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
