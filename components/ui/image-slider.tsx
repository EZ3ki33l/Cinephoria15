"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  showControls = true,
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
  showControls?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startAutoplayTimer = useCallback(() => {
    if (autoplay) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
  }, [autoplay]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
    startAutoplayTimer();
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
    startAutoplayTimer();
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    startAutoplayTimer();
  };

  useEffect(() => {
    startAutoplayTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoplayTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadImages = () => {
    setLoading(true);
    const loadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve(image);
        img.onerror = reject;
      });
    });

    Promise.all(loadPromises)
      .then((loadedImages) => {
        setLoadedImages(loadedImages as string[]);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to load images", error));
  };

  useEffect(() => {
    loadImages();
  }, []);

  const slideVariants = {
    initial: (direction: number) => ({
      scale: 0.8,
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      rotateY: direction > 0 ? 30 : -30,
    }),
    visible: {
      scale: 1,
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
      },
    },
    exit: (direction: number) => ({
      scale: 0.8,
      opacity: 0,
      x: direction < 0 ? 100 : -100,
      rotateY: direction < 0 ? -30 : 30,
      transition: {
        duration: 0.4,
        ease: [0.33, 1, 0.68, 1],
      },
    }),
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <div className="relative w-full h-full">
      <div
        className={cn(
          "overflow-hidden h-full w-full relative flex items-center justify-center",
          className
        )}
        style={{
          perspective: "1500px",
        }}
      >
        {areImagesLoaded && (
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div className="absolute inset-0 z-[51]">
              <motion.img
                key={currentIndex}
                src={loadedImages[currentIndex]}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="visible"
                exit="exit"
                className="image h-full w-full absolute inset-0 object-contain"
                style={{
                  backfaceVisibility: "hidden",
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {areImagesLoaded && children}
        
        {areImagesLoaded && overlay && (
          <div
            className={cn("absolute inset-0 bg-slate-300/10 z-[52]", overlayClassName)}
          />
        )}
      </div>

      {/* Contrôles dans un conteneur séparé avec position absolute */}
      {showControls && areImagesLoaded && (
        <div className="absolute inset-0 pointer-events-none">
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 transition-colors rounded-full p-2 text-white z-[54] pointer-events-auto"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 transition-colors rounded-full p-2 text-white z-[54] pointer-events-auto"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[54] pointer-events-auto">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="group"
                aria-label={`Aller à l'image ${index + 1}`}
              >
                <div
                  className={cn(
                    "h-1.5 rounded-full bg-white/50 transition-all duration-300 group-hover:bg-white/100",
                    currentIndex === index ? "w-6 bg-white" : "w-2"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
