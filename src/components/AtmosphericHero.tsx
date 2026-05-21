import React, { useMemo, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const AtmosphericParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 30 + 30,
      delay: Math.random() * -30,
      opacity: Math.random() * 0.2 + 0.05,
      blur: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-tethryn-accent rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [p.opacity, p.opacity * 3, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export const CinematicHeroObject = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end feel
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[900px] flex items-center justify-center perspective-[1000px] lg:perspective-[2000px]">
      {/* Dynamic Ambient Glow */}
      <motion.div 
        style={{ 
          x: springX, 
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-tethryn-accent rounded-full blur-[100px] lg:blur-[160px] -z-10 mt-[-50px] lg:mt-0"
      />

      <div className="relative z-10 w-[260px] h-[360px] sm:w-[320px] sm:h-[460px] lg:w-[480px] lg:h-[680px]">
        {/* Layer 3: Deepest */}
        <motion.div
          style={{ 
            x: useSpring(mouseX, { stiffness: 30, damping: 25 }), 
            y: useSpring(mouseY, { stiffness: 30, damping: 25 }),
            rotateY: useSpring(mouseX, { stiffness: 30, damping: 25 }),
            rotateX: useSpring(mouseY, { stiffness: 30, damping: 25 }),
          }}
          className="absolute -inset-8 lg:-inset-16 bg-[#121212]/5 backdrop-blur-2xl lg:backdrop-blur-3xl border border-white/10 rounded-[2.5rem] lg:rounded-[4rem] -z-30 shadow-2xl opacity-40"
        />

        {/* Layer 2: Medium */}
        <motion.div
          style={{ 
            x: useSpring(mouseX, { stiffness: 40, damping: 22 }), 
            y: useSpring(mouseY, { stiffness: 40, damping: 22 }),
            rotateY: useSpring(mouseX, { stiffness: 40, damping: 22 }),
            rotateX: useSpring(mouseY, { stiffness: 40, damping: 22 }),
          }}
          className="absolute -inset-4 lg:-inset-8 bg-white/10 backdrop-blur-xl lg:backdrop-blur-2xl border border-white/20 rounded-[2rem] lg:rounded-[3.5rem] -z-20 shadow-xl"
        />

        {/* Layer 1: Foreground / Content */}
        <motion.div
          style={{ 
            x: springX, 
            y: springY,
            rotateY: springX,
            rotateX: springY,
          }}
          className="w-full h-full bg-white/30 backdrop-blur-[20px] lg:backdrop-blur-[40px] border border-white/50 p-4 lg:p-6 rounded-[2rem] lg:rounded-[3.5rem] shadow-premium overflow-hidden group relative ring-1 ring-black/5"
        >
          <div className="w-full h-full rounded-[1.5rem] lg:rounded-[2.8rem] overflow-hidden bg-[#0C0C0D] relative">
            <motion.img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover grayscale-[60%] opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[15s] ease-out" 
              style={{
                scale: 1.1 + (springX.get() / 1000)
              }}
              alt="Cinematic Preview"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0D] via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-8 left-8 right-8 lg:bottom-12 lg:left-12 lg:right-12">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6"
              >
                <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-tethryn-accent rounded-full shadow-[0_0_10px_#857BEF] animate-pulse" />
                <span className="text-white/30 text-[9px] lg:text-[11px] font-bold uppercase tracking-[0.4em] lg:tracking-[0.6em]">STORY_01</span>
              </motion.div>
              <h3 className="text-white text-3xl lg:text-5xl font-display font-medium tracking-tighter leading-tight mb-2 lg:mb-4">
                Our <br /> <span className="italic font-serif font-light text-tethryn-accent/60">Moments</span>
              </h3>
              <p className="text-white/30 text-[11px] lg:text-[13px] font-serif italic max-w-[240px]">A beautifully personal digital experience.</p>
            </div>
          </div>

          {/* Glint effect overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </motion.div>

        {/* Cinematic Floating Tags */}
        <motion.div
           style={{ 
             x: useSpring(mouseX, { stiffness: 60, damping: 15 }), 
             y: useSpring(mouseY, { stiffness: 60, damping: 15 }),
           }}
           className="absolute -top-6 -right-6 lg:-top-12 lg:-right-20 px-6 py-3 lg:px-8 lg:py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-2xl z-20"
        >
           <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-tethryn-accent">TETHRYN_LIVE</span>
        </motion.div>

        {/* Orbiting Ring Elements (Hidden on small mobile to reduce clutter, visible on sm+) */}
        <div className="hidden sm:block">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-tethryn-accent/10 pointer-events-none"
              style={{
                width: 500 + i * 150,
                height: 500 + i * 150,
                top: '50%',
                left: '50%',
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
