import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface Props {
  name: string;
  subtitle: string;
  nickname?: string;
  anniversary?: string;
}

export default function SectionHero({ name, subtitle, nickname, anniversary }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const bgTextX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const bgTextX2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Elegant text reveal variants
  const letterVariants = {
    hidden: { opacity: 0, y: 100, rotateX: -90, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      scale: 1,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center w-full px-6 overflow-hidden perspective-1000">
      
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-[0.03] select-none overflow-hidden z-0">
        <motion.div style={{ x: bgTextX1 }} className="whitespace-nowrap">
          <span className="font-serif text-[20vw] italic font-light tracking-tighter">FOREVER ALWAYS FOREVER ALWAYS</span>
        </motion.div>
        <motion.div style={{ x: bgTextX2 }} className="whitespace-nowrap">
          <span className="font-serif text-[20vw] italic font-light tracking-tighter">ALWAYS FOREVER ALWAYS FOREVER</span>
        </motion.div>
      </div>

      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 300]) }}
        className="absolute top-0 right-0 w-[50%] h-[80%] rounded-full blur-[150px] opacity-10 bg-[#ff4d6d] pointer-events-none z-0" 
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute bottom-0 left-0 w-[40%] h-[60%] rounded-full blur-[150px] opacity-[0.05] bg-[#ffffff] pointer-events-none z-0" 
      />

      <motion.div 
        style={{ y: y1, opacity: opacity1, scale: scale1 }}
        className="relative z-10 text-center flex flex-col items-center max-w-5xl mx-auto w-full mt-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
        >
          <span className="text-[10px] md:text-sm font-sans tracking-[0.5em] text-[#ff758c] uppercase mb-8 block">
            {anniversary || "YOUR SPECIAL DAY"}
          </span>
        </motion.div>

        <motion.h2 
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 1.2 }}
          className="font-serif text-6xl md:text-[10rem] mb-6 leading-[0.9] py-4 px-4 flex flex-wrap justify-center overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          {name.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-[#ffb3c6] via-[#ff4d6d] to-[#c9184a] pb-8 drop-shadow-2xl"
              style={{ paddingRight: char === ' ' ? '0.2em' : '0' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h2>

        {nickname && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 2, ease: "easeOut" }}
            className="mb-12 font-script text-4xl md:text-6xl text-[#ffb3c6] tracking-wider"
          >
            "{nickname}"
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "12rem" }}
          transition={{ duration: 2, delay: 2.5, ease: [0.76, 0, 0.24, 1] }}
          className="w-px bg-gradient-to-b from-[#ff4d6d] via-[#ff4d6d]/50 to-transparent mb-16 shadow-[0_0_15px_rgba(255,117,140,0.5)]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2, delay: 3, ease: "easeOut" }}
          className="font-serif italic text-2xl md:text-4xl text-white/80 max-w-3xl px-4 leading-relaxed font-light mix-blend-screen"
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
}
