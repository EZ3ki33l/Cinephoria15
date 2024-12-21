"use client";

import { motion } from "framer-motion";

interface MovieHeaderProps {
  title: string;
}

export function MovieHeader({ title }: MovieHeaderProps) {
  return (
    <motion.h1
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center tracking-tight relative py-10"
      animate={{
        x: [-2, 0, 2],
      }}
      transition={{
        duration: 0.1,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear",
      }}
    >
      <span className="absolute -inset-0.5 text-red-600/50 blur-[2px] animate-pulse py-10">
        {title}
      </span>
      <span
        className="absolute -inset-0.5 text-cyan-600/50 blur-[2px] animate-pulse py-10"
        style={{ animationDelay: "0.1s" }}
      >
        {title}
      </span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary animate-gradient">
        {title}
      </span>
    </motion.h1>
  );
} 