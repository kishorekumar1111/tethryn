import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface LuxuryMemory {
  id: string;
  image: string;
  caption: string;
  date?: string;
}

interface Props {
  memories: LuxuryMemory[];
}

export default function SectionGallery({ memories }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={containerRef} className="relative w-full bg-[#1a050f] pb-[10vh]">
      <div className="sticky top-0 w-full h-[30vh] flex flex-col items-center justify-end pb-10 z-0 pointer-events-none">
        <motion.h3 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0.3]),
            y: useTransform(scrollYProgress, [0, 0.1], [0, -50])
          }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl italic text-[#ffb3c6] font-light drop-shadow-2xl"
        >
          Timeless Moments
        </motion.h3>
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0.3]),
          }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#ff4d6d] to-transparent mx-auto mt-6" 
        />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 z-10" style={{ marginTop: '-15vh' }}>
        {memories.map((memory, index) => {
          const targetScale = 1 - ((memories.length - index) * 0.05);
          return (
            <Card 
              key={memory.id || index} 
              i={index}
              memory={memory}
              progress={scrollYProgress}
              range={[index * (1 / memories.length), 1]}
              targetScale={targetScale}
              total={memories.length}
            />
          );
        })}
      </div>
    </section>
  );
}

interface CardProps {
  key?: React.Key;
  i: number;
  memory: LuxuryMemory;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
}

function Card({ i, memory, progress, range, targetScale, total }: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // Dynamic top offset based on index so they stack with a little visible edge
  const topOffset = `calc(15vh + ${i * 4}vh)`;

  return (
    <div ref={containerRef} className="h-[80vh] flex items-center justify-center sticky mb-10 md:mb-24" style={{ top: topOffset }}>
      <motion.div 
        style={{ scale, transformOrigin: "top" }}
        className="relative w-full h-full md:h-[70vh] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 bg-[#2a0815] group"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 z-10 pointer-events-none" />
        
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 z-20 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
          {memory.date && (
            <div className="flex items-center gap-4 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
              <span className="w-12 h-[1px] bg-[#ff4d6d]" />
              <span className="font-sans text-[10px] md:text-xs tracking-[0.5em] text-[#ffb3c6] font-bold uppercase">
                {memory.date}
              </span>
            </div>
          )}
          <h4 className="font-serif text-2xl md:text-5xl italic text-white/95 leading-tight font-light drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
            "{memory.caption}"
          </h4>
        </div>

        <motion.img 
          src={memory.image} 
          alt={memory.caption}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] scale-105 group-hover:scale-100 group-hover:brightness-[0.85] transition-all duration-[1.5s] ease-out"
        />
        
        {/* Subtle overlay glow */}
        <div className="absolute inset-0 bg-[#ff4d6d]/0 group-hover:bg-[#ff4d6d]/10 transition-colors duration-1000 z-10 pointer-events-none mix-blend-overlay" />
      </motion.div>
    </div>
  );
}
