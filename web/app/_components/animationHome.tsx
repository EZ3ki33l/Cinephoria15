"use client";

import { useEffect, useRef } from "react";

export const AnimationHome = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration de la taille du canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Configuration de la pluie
    const raindrops: { x: number; y: number; speed: number; length: number }[] = [];
    const numberOfDrops = 100;

    // Initialisation des gouttes de pluie
    for (let i = 0; i < numberOfDrops; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 3,
        length: Math.random() * 6 + 6,
      });
    }

    // Dessin de la pluie
    const drawRain = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = isDarkMode 
        ? "rgba(255, 255, 255, 0.015)"
        : "rgba(100, 100, 100, 0.3)";
      ctx.lineWidth = isDarkMode ? 0.8 : 1.4;

      raindrops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(drawRain);
    };

    drawRain();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/20 to-transparent dark:from-primary/30" />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none dark:opacity-20" 
      />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" />
    </div>
  );
}; 