import React from 'react';
import { motion, useAnimation } from 'motion/react';

interface Props {
  introText: string;
  onOpen: () => void;
  key?: React.Key;
}

export default function SectionCover({ introText, onOpen }: Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    },
    exit: { 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const topDoorVariants = {
    exit: { y: "-100vh", transition: { duration: 2, ease: [0.76, 0, 0.24, 1] }}
  };
  
  const bottomDoorVariants = {
    exit: { y: "100vh", transition: { duration: 2, ease: [0.76, 0, 0.24, 1] }}
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      filter: "blur(20px)",
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
    >
      {/* Background Doors */}
      <motion.div variants={topDoorVariants} className="absolute top-0 left-0 right-0 h-1/2 bg-[#1a050f] pointer-events-auto origin-top" />
      <motion.div variants={bottomDoorVariants} className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#1a050f] pointer-events-auto origin-bottom" />

      {/* Glow Effect */}
      <motion.div 
        variants={itemVariants}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", times: [0, 0.5, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] rounded-full blur-[120px] bg-gradient-to-tr from-[#ff4d6d] via-[#800f2f] to-transparent pointer-events-none" 
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center w-full max-w-3xl mx-auto pointer-events-none">
        <motion.span 
          variants={itemVariants}
          className="text-[#ffb3c6] text-[10px] md:text-sm tracking-[0.6em] uppercase mb-16 font-light pointer-events-auto"
        >
          A Special Gift
        </motion.span>
        
        <motion.h1 
          variants={itemVariants}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-light italic mb-20 text-white/95 leading-tight px-4 text-center tracking-wide drop-shadow-[0_0_20px_rgba(255,117,140,0.3)] pointer-events-auto"
        >
          {introText}
        </motion.h1>

        <motion.button
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            letterSpacing: "0.4em",
            borderColor: "rgba(255, 77, 109, 1)",
            boxShadow: "0 0 40px rgba(255, 77, 109, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="interactive-element group relative px-16 py-5 font-sans tracking-[0.3em] text-[10px] md:text-sm uppercase text-[#ff4d6d] border border-[#ff4d6d]/40 transition-all duration-700 bg-transparent overflow-hidden rounded-sm pointer-events-auto"
        >
          <span className="relative z-10 transition-colors duration-700 group-hover:text-white font-medium">Open Present</span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#c9184a] via-[#ff758c] to-[#c9184a] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.button>
      </div>
    </motion.div>
  );
}
