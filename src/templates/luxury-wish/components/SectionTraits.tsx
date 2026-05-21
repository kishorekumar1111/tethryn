import React, { useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';

interface Trait {
  title: string;
  description: string;
}

interface Props {
  traits: Trait[];
}

export default function SectionTraits({ traits }: Props) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className="py-48 px-6 w-full relative perspective-1000">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a050f] via-[#2a0815] to-[#1a050f] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-40"
        >
          <span className="font-sans text-[10px] tracking-[0.5em] text-[#ff7eb3] uppercase font-bold">The Details</span>
          <h3 className="font-serif text-4xl md:text-6xl italic text-white/95 mt-10 font-light">A Tapestry of Perfection</h3>
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "60px" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="w-px bg-gradient-to-b from-[#ff4d6d] to-transparent mx-auto mt-12 shadow-[0_0_10px_rgba(255,77,109,0.5)]"
          />
        </motion.div>

        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32 px-4 md:px-12"
        >
          {traits.map((trait, index) => (
            <TraitCard key={trait.title || index} trait={trait} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TraitCard({ trait, index }: { trait: Trait, index: number, key?: React.Key }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const springConfig = { damping: 20, stiffness: 200, mass: 0.8 };
  
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Get mouse position relative to the card
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to -1 to 1
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct * 20); // Multiplier makes the rotation more or less intense
    y.set(yPct * -20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: y,
        rotateY: x,
        transformStyle: "preserve-3d"
      }}
      variants={{
        hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
      }}
      className="flex flex-col relative group p-8 rounded-xl border border-transparent hover:border-[#ff4d6d]/10 transition-colors duration-500 interactive-element hover:bg-white/[0.02]"
    >
      <div 
        className="flex items-start gap-8 mb-8"
        style={{ transform: "translateZ(30px)" }}
      >
        <span className="font-script text-6xl md:text-8xl text-[#ff4d6d]/20 group-hover:text-[#ff4d6d] transition-all duration-1000 select-none leading-none -mt-4 drop-shadow-md">
           0{index + 1}
        </span>
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-3xl md:text-4xl text-white/90 group-hover:text-white transition-colors duration-1000 tracking-wide font-light">
            {trait.title}
          </h4>
          <div className="w-8 h-px bg-[#ff4d6d]/30 group-hover:w-16 group-hover:bg-[#ff4d6d] transition-all duration-1000" />
        </div>
      </div>
      <p 
        className="font-sans text-sm md:text-base font-light leading-loose text-white/60 md:pl-[104px] group-hover:text-white/90 transition-colors duration-1000"
        style={{ transform: "translateZ(20px)" }}
      >
        {trait.description}
      </p>
      
      {/* Background glow on hover */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-[#ff4d6d]/5 to-transparent rounded-xl pointer-events-none -z-10"
        style={{ transform: "translateZ(-10px)" }}
      />
    </motion.div>
  );
}
