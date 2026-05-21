import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ClickParticle {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  
  // Track mouse coordinates
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Add a new particle at click location
      const newParticle = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setParticles((prev) => [...prev, newParticle]);
      
      // Remove it after animation completes
      setTimeout(() => {
        setParticles((prev) => prev.filter(p => p.id !== newParticle.id));
      }, 1200);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Detect hover on interactive elements
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block overflow-hidden">
      {/* Outer subtle ring */}
      <motion.div
        className="absolute w-8 h-8 rounded-full border border-tethryn-accent/40 bg-tethryn-accent/5 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.3
        }}
      />
      
      {/* Inner dot */}
      <motion.div
        className="absolute w-2 h-2 bg-tethryn-accent rounded-full shadow-[0_0_10px_var(--color-tethryn-accent)]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 30,
        }}
      />

      {/* Click Particles (Floating Hearts) */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-tethryn-accent drop-shadow-[0_0_8px_rgba(133,123,239,0.5)]"
            initial={{ 
              x: particle.x - 12, 
              y: particle.y - 12,
              scale: 0.4,
              opacity: 1,
              rotate: Math.random() * 40 - 20
            }}
            animate={{ 
              y: particle.y - 80 - Math.random() * 40,
              x: particle.x - 12 + (Math.random() * 40 - 20),
              scale: 1.2,
              opacity: 0,
              rotate: Math.random() * 80 - 40
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Heart size={20} fill="currentColor" opacity={0.8} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
