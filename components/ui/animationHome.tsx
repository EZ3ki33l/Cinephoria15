"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const AnimationHome = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoaded(true);
    } else {
      window.addEventListener('load', () => setIsLoaded(true));
    }

    return () => window.removeEventListener('load', () => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const raindrops: { x: number; y: number; speed: number; length: number }[] = [];
    for (let i = 0; i < 100; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 12 + Math.random() * 8,
        length: 15 + Math.random() * 20,
      });
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
      ctx.lineWidth = 1.4;

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

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <motion.div
      className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-light/20 to-transparent" />
      </motion.div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center tracking-tight relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.span className="inline-block relative">
              <span 
                className="font-light block text-2xl sm:text-3xl md:text-4xl mb-2 text-slate-900"
              >
                Bienvenue chez
              </span>
              <motion.span 
                className="font-black tracking-normal block relative"
                animate={{
                  x: [-2, 0, 2],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "linear"
                }}
              >
                <span className="absolute -inset-0.5 text-red-600/50 blur-[2px] animate-pulse">
                  CINÉPHORIA
                </span>
                <span className="absolute -inset-0.5 text-cyan-600/50 blur-[2px] animate-pulse" style={{ animationDelay: "0.1s" }}>
                  CINÉPHORIA
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary animate-gradient">
                  CINÉPHORIA
                </span>
              </motion.span>
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-medium text-slate-800 tracking-wide text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.span
              className="inline-block relative"
              animate={{
                textShadow: [
                  "0 0 8px rgba(var(--primary), 0.3), -1px 0 rgba(255,0,0,0.3), 1px 0 rgba(0,255,255,0.3)",
                  "0 0 15px rgba(var(--primary), 0.5), -1px 0 rgba(255,0,0,0.4), 1px 0 rgba(0,255,255,0.4)",
                  "0 0 8px rgba(var(--primary), 0.3), -1px 0 rgba(255,0,0,0.3), 1px 0 rgba(0,255,255,0.3)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              Évadez-vous le temps d'un film
            </motion.span>
          </motion.p>

          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            animate={{
              opacity: [0, 0.03, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="absolute inset-0 bg-primary-light" />
          </motion.div>
        </div>
      </div>

      <div className="absolute top-4 left-4 hidden sm:block">
        <motion.div 
          className="text-xs text-primary/30 font-mono"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {new Date().toLocaleTimeString()}
        </motion.div>
      </div>

      <div className="absolute bottom-4 right-4 hidden sm:block">
        <motion.div 
          className="text-xs text-primary/30 font-mono"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          SYS.INIT//CINEMA_MODE
        </motion.div>
      </div>

      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`absolute w-8 h-8 border-primary/20 ${
            corner.includes('top') ? 'top-0' : 'bottom-0'
          } ${corner.includes('left') ? 'left-0' : 'right-0'}`}
        >
          <div className={`absolute ${
            corner.includes('left') ? 'border-l' : 'border-r'
          } ${corner.includes('top') ? 'border-t' : 'border-b'
          } w-full h-full border-primary/20`} />
        </div>
      ))}

      <motion.div
        className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none"
        animate={{
          opacity: [0, 0.05, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};
