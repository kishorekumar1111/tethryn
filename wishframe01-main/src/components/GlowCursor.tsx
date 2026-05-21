import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const GlowCursor: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="fixed inset-0 pointer-events-none z-[9999] w-32 h-32 rounded-full hidden md:block"
    >
      <div className="w-full h-full bg-luxury-gold/5 blur-[40px] rounded-full border border-luxury-gold/10" />
    </motion.div>
  );
};
