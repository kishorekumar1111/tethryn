import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

export const LovePulse: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newHeart = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setHearts(prev => [...prev, newHeart]);
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 2000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.5, x: heart.x - 12, y: heart.y - 12 }}
            animate={{ opacity: 0, y: heart.y - 150, scale: 2, rotate: Math.random() * 40 - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-rose-500/60"
          >
            <Heart size={28} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
