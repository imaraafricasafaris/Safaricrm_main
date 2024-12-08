import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="sketchfab-embed-wrapper h-full w-full"> 
        <iframe 
          title="Elephant Poly" 
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/c575914e9177426d92649ace95047400/embed"
          className="w-full h-full opacity-50"
        />
      </div>
    </div>
  );
}