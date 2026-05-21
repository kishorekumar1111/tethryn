import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

export default function EasterEgg() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 8000);
    };

    window.addEventListener('triggerEasterEgg', handleTrigger);
    return () => window.removeEventListener('triggerEasterEgg', handleTrigger);
  }, []);

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex] || e.key === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setIsActive(true);
          konamiIndex = 0;
          setTimeout(() => setIsActive(false), 8000);
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center pointer-events-none bg-black/80 backdrop-blur-md"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                scale: 0, 
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight + window.innerHeight / 2
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, Math.random() * 2 + 1, 0],
                y: `-=${window.innerHeight}`,
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 3 + Math.random() * 3, 
                ease: "easeOut",
                delay: Math.random() * 0.5
              }}
              className="absolute text-[#ff4d6d]"
            >
              <Heart fill="currentColor" size={20 + Math.random() * 30} />
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
            className="text-center px-4"
          >
             <motion.div 
               animate={{ rotate: [0, 10, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
               transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
               className="inline-block mb-6"
             >
                <Heart size={80} className="text-[#ff4d6d]" fill="currentColor" />
             </motion.div>
            <h2 className="font-serif text-4xl md:text-7xl italic text-[#ffb3c6] drop-shadow-[0_0_20px_rgba(255,179,198,0.4)] mb-6 leading-tight">
              A Secret Just For You...
            </h2>
            <p className="font-sans text-sm md:text-lg tracking-[0.4em] uppercase text-white/90">
              I love you more than words can say. 💖
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
