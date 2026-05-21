import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface Props {
  title?: string;
  content: string;
  signature: string;
}

export default function SectionLetter({ title, content, signature }: Props) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const rotateSubtle = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  const wordAnimation = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section ref={containerRef} className="py-48 px-4 w-full flex justify-center relative overflow-hidden perspective-1000">
      
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a050f] via-[#050002] to-[#000000] opacity-50"
      />

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, y: 30, letterSpacing: "0.2em", filter: "blur(10px)" }}
           whileInView={{ opacity: 1, y: 0, letterSpacing: "0.6em", filter: "blur(0px)" }}
           viewport={{ once: true }}
           transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
           className="mb-16"
        >
          <span className="font-sans text-[10px] tracking-inherit text-[#ff758c] uppercase font-bold">{title || "A Personal Note"}</span>
        </motion.div>

        <motion.div
           style={{ rotate: rotateSubtle, rotateX: 2 }}
           initial={{ opacity: 0, scale: 0.95, y: 80, filter: "blur(15px)" }}
           whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
           viewport={{ once: true, margin: "-20%" }}
           transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
           className="bg-[#0a0104] p-12 md:p-32 border border-[#ff4d6d]/30 relative shadow-[0_30px_120px_rgba(0,0,0,1)] rounded-sm"
        >
          {/* Subtle noise/texture overlay for paper feel */}
          <div className="absolute inset-0 bg-texture opacity-[0.2] mix-blend-overlay rounded-sm pointer-events-none" />

          {/* Decorative corner accents - more luxurious */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#ff4d6d]/60" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#ff4d6d]/60" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#ff4d6d]/60" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#ff4d6d]/60" />

          {/* Seal / Emblem */}
          <div className="flex justify-center mb-24 relative z-10">
             <motion.div 
               whileHover={{ rotate: 180, scale: 1.1 }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="w-16 h-16 rounded-full border border-[#ff4d6d]/40 flex items-center justify-center p-1 cursor-pointer group"
             >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffb3c6] via-[#ff4d6d] to-[#c9184a] opacity-90 shadow-[0_0_20px_rgba(255,77,109,0.3)] group-hover:shadow-[0_0_40px_rgba(255,77,109,0.6)] transition-shadow duration-1000" />
             </motion.div>
          </div>

          <div className="space-y-12 text-center relative z-10 px-4 md:px-8">
            {content.split('\n\n').map((paragraph, i) => {
              const words = paragraph.split(" ");
              return (
                <motion.div 
                  key={i} 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%", amount: 0.3 }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.2,
                      }
                    }
                  }}
                  className="font-serif italic text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-loose font-light text-white/95 drop-shadow-md"
                >
                  {words.map((word, wIdx) => (
                    <motion.span 
                      key={wIdx} 
                      variants={wordAnimation}
                      className="inline-block mr-[0.25em]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 2, delay: 1, ease: "easeOut" }}
            className="mt-32 text-center relative z-10 flex flex-col items-center"
          >
            <div className="w-16 h-px bg-[#ff4d6d]/30 mb-8" />
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              className="relative inline-block"
            >
              {/* Pen Tip Sparkle */}
              <motion.div
                variants={{
                  hidden: { left: "0%", opacity: 0, scale: 0.5 },
                  visible: { 
                    left: "100%", 
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 0.5]
                  }
                }}
                transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5, times: [0, 0.1, 0.9, 1] }}
                className="absolute top-1/2 -translate-y-1/2 -mt-1 w-8 h-8 z-30 pointer-events-none mix-blend-screen"
                style={{ marginLeft: "-16px" }}
              >
                <div className="absolute inset-0 bg-[#ffb3c6] rounded-full blur-[8px] animate-pulse" />
                <div className="absolute inset-2.5 bg-white rounded-full blur-[1px]" />
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative z-10 flex flex-col items-center"
              >
                {signature ? (
                  <p className="font-script text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#ffb3c6] via-[#ff4d6d] to-[#c9184a] drop-shadow-[0_0_15px_rgba(255,117,140,0.5)] py-4 pr-12 pl-2 z-10 relative">
                    {signature}
                  </p>
                ) : (
                  <svg 
                    viewBox="0 0 400 100" 
                    className="w-64 md:w-96 h-auto drop-shadow-[0_0_15px_rgba(255,117,140,0.5)] z-10 relative"
                    fill="none" 
                    stroke="url(#signature-gradient)" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <defs>
                      <linearGradient id="signature-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffb3c6" />
                        <stop offset="50%" stopColor="#ff4d6d" />
                        <stop offset="100%" stopColor="#c9184a" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M 50,60 C 50,40 60,30 70,30 C 80,30 90,40 90,60 C 90,80 80,90 70,90 C 60,90 50,80 50,60 M 70,95 C 60,95 50,85 50,65 L 50,30 M 110,60 C 110,40 120,30 130,30 C 140,30 150,40 150,60 C 150,80 140,90 130,90 C 120,90 110,80 110,60 M 130,95 C 120,95 110,85 110,65 L 110,30 M 170,75 L 190,45 L 210,75 L 230,45 L 250,75 M 270,45 L 270,75 C 270,85 280,85 280,75 L 280,45 M 310,45 L 340,45 M 325,45 L 325,75"
                      variants={{
                        hidden: { pathLength: 0 },
                        visible: { pathLength: 1 }
                      }}
                      transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
                    />
                  </svg>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
