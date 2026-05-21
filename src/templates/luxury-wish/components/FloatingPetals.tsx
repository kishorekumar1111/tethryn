import React from 'react';
import { motion } from 'motion/react';

const petals = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  scale: Math.random() * 0.5 + 0.5,
  rotation: Math.random() * 360,
  duration: Math.random() * 20 + 20,
  delay: Math.random() * 5,
  dx: Math.random() * 20 - 10,
}));

export default function FloatingPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ 
            opacity: 0, 
            y: `${petal.y}vh`, 
            x: `${petal.x}vw`,
            rotate: petal.rotation,
            scale: petal.scale
          }}
          animate={{
            y: [`${petal.y}vh`, `${petal.y - 40}vh`, `${petal.y - 80}vh`, `${petal.y - 120}vh`],
            x: [`${petal.x}vw`, `${petal.x + petal.dx * 0.33}vw`, `${petal.x + petal.dx * 0.66}vw`, `${petal.x + petal.dx}vw`],
            rotate: [petal.rotation, petal.rotation + 120, petal.rotation + 240, petal.rotation + 360],
            opacity: [0, 0.4, 0.4, 0]
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
            times: [0, 0.33, 0.66, 1]
          }}
          className="absolute w-4 h-4 rounded-tl-full rounded-br-full rounded-tr-md rounded-bl-md bg-gradient-to-br from-[#ff7eb3] to-[#ff758c] opacity-30 shadow-[0_0_10px_rgba(255,117,140,0.5)] blur-[1px]"
        />
      ))}
    </div>
  );
}
