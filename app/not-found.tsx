'use client'

import React from 'react'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
  // Positions fixes pour les particules
  const particles = [
    { id: 1, x: 10, y: 20 },
    { id: 2, x: 20, y: 40 },
    { id: 3, x: 30, y: 60 },
    { id: 4, x: 40, y: 80 },
    { id: 5, x: 50, y: 20 },
    { id: 6, x: 60, y: 40 },
    { id: 7, x: 70, y: 60 },
    { id: 8, x: 80, y: 80 },
    { id: 9, x: 90, y: 20 },
    { id: 10, x: 15, y: 40 },
    { id: 11, x: 25, y: 60 },
    { id: 12, x: 35, y: 80 },
    { id: 13, x: 45, y: 20 },
    { id: 14, x: 55, y: 40 },
    { id: 15, x: 65, y: 60 },
    { id: 16, x: 75, y: 80 },
    { id: 17, x: 85, y: 20 },
    { id: 18, x: 95, y: 40 },
    { id: 19, x: 5, y: 60 },
    { id: 20, x: 45, y: 80 }
  ]

  return (
    <div className="flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-screen">
        {/* Effet de glitch */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            x: [-2, 2, -2],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <h1 className="text-[150px] font-bold text-primary font-mono tracking-tighter">
            404
          </h1>
        </motion.div>

        {/* Texte principal */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <h1 className="text-[150px] font-bold text-secondary font-mono tracking-tighter">
              404
            </h1>
            <p className="text-2xl text-primary-light mt-4 font-mono">
              ERREUR SYSTÈME DÉTECTÉE
            </p>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mt-8"
            >
              <a
                href="/"
                className="inline-block px-8 py-3 bg-secondary text-white font-mono hover:bg-secondary-light 
                transition-colors duration-300 border border-secondary-light shadow-lg shadow-cyan-500/50 rounded-full"
              >
                RETOUR À LA MATRICE
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Particules cyberpunk */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-500"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: ['0%', '100%'],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2 + (particle.id % 3),
              repeat: Infinity,
              ease: "linear",
              delay: particle.id * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default NotFoundPage 