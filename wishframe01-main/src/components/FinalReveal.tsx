import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { config } from '../config';
import gsap from 'gsap';

export const FinalReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const trigger = {
        trigger: containerRef.current,
        start: "top center",
        onEnter: () => {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#c5a059', '#ffffff', '#0a0a1a'],
            shapes: ['circle', 'square'],
            gravity: 0.8,
            scalar: 1,
            drift: 0,
          });
        }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, 
        { opacity: 0, scale: 0.9, filter: "blur(10px)" },
        { 
          opacity: 1, scale: 1, filter: "blur(0px)",
          scrollTrigger: trigger,
          duration: 2.5,
          ease: "expo.out"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-luxury-black">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-luxury-gold),_transparent_70%)] blur-[100px]" />
      </div>

      <motion.div 
        className="relative z-10 text-center px-6"
      >
        <p className="text-luxury-gold font-sans text-xs tracking-[0.5em] uppercase mb-8 opacity-60">
          The Final Chapter
        </p>
        <h2 ref={textRef} className="font-serif italic text-5xl md:text-8xl lg:text-9xl text-white text-glow leading-tight">
          {config.final.statement.includes('recipientName') 
            ? config.final.statement.replace('recipientName', config.final.recipientName)
            : `${config.final.statement} ${config.final.recipientName} ❤️`}
        </h2>
      </motion.div>
    </section>
  );
};
