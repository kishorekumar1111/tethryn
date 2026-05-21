import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import confetti from 'canvas-confetti';

interface Props {
  message: string;
}

export default function SectionFinale({ message }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  useEffect(() => {
    if (isInView) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff4d6d', '#ffb3c6', '#ffffff', '#c9184a']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff4d6d', '#ffb3c6', '#ffffff', '#c9184a']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [isInView]);

  return (
    <section ref={containerRef} className="min-h-screen py-32 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a0815]/60 to-[#0a0104] pointer-events-none" />

      {/* Sweeping light beam effect */}
      <motion.div 
        animate={{ 
          opacity: [0, 0.4, 0],
          rotate: [0, 45, 0],
          scale: [1, 2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[50px] bg-gradient-to-r from-transparent via-[#ff4d6d]/15 to-transparent blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        <h2 className="font-serif text-5xl md:text-[8rem] italic mb-20 max-w-6xl mx-auto leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#ffb3c6] to-[#ff4d6d] px-4 drop-shadow-[0_0_40px_rgba(255,77,109,0.4)] filter">
          {message}
        </h2>

        <motion.div
          animate={{ opacity: [0.2, 0.8, 0.2], width: ["100px", "200px", "100px"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#ff4d6d] to-transparent mx-auto mb-24"
        />

        <motion.button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05, color: "#ffb3c6" }}
          whileTap={{ scale: 0.95 }}
          className="font-sans text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/50 transition-colors duration-500 font-medium tracking-widest relative group"
        >
          Begin Again
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-px bg-[#ff4d6d] group-hover:w-full transition-all duration-500" />
        </motion.button>
      </motion.div>
    </section>
  );
}
