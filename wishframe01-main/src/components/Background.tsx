import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const Background: React.FC = () => {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transformations for background
  const rotateX = useTransform(smoothY, [0, 1], [5, -5]);
  const rotateY = useTransform(smoothX, [0, 1], [-5, 5]);
  const translateX = useTransform(smoothX, [0, 1], [-15, 15]);
  const translateY = useTransform(smoothY, [0, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 bg-luxury-black overflow-hidden perspective-[1000px]">
      {/* Immersive Atmosphere Gradients with Parallax */}
      <motion.div 
        style={{ 
          x: translateX, 
          y: translateY, 
          rotateX, 
          rotateY, 
          scale: 1.05 
        }}
        className="atmosphere absolute inset-[-5%] opacity-60 pointer-events-none" 
      />

      {/* Dynamic Glow Pulses */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-3/4 w-[50vw] h-[50vw] bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-3/4 left-3/4 w-[30vw] h-[30vw] bg-rose-900/10 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Dust Particles with independent parallax */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <Particle key={i} mouseX={mouseX} mouseY={mouseY} index={i} />
        ))}
      </div>
    </div>
  );
};

const Particle: React.FC<{ mouseX: any, mouseY: any, index: number }> = ({ mouseX, mouseY, index }) => {
  const factor = 0.5 + (index % 5) * 0.3; // Variations
  const xTranslate = useTransform(mouseX, [0, 1], [-30 * factor, 30 * factor]);
  const yTranslate = useTransform(mouseY, [0, 1], [-30 * factor, 30 * factor]);

  return (
    <motion.div
       style={{ x: xTranslate, y: yTranslate }}
       className="absolute w-[1.5px] h-[1.5px] bg-rose-200/30 rounded-full"
       initial={{ 
         left: (Math.random() * 100) + "%", 
         top: (Math.random() * 100) + "%"
       }}
       animate={{
         opacity: [0, 0.3, 0],
         scale: [1, 2, 1]
       }}
       transition={{
         duration: 5 + Math.random() * 10,
         repeat: Infinity,
         ease: "easeInOut",
         delay: Math.random() * 5
       }}
    />
  );
};
