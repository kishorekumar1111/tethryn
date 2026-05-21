import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '../lib/utils';

interface StorySlideProps {
  image: string;
  line1: string;
  line2?: string;
  index: number;
  overlayOnly?: boolean;
}

export const StorySlide: React.FC<StorySlideProps> = ({ image, line1, line2, index, overlayOnly = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  const rotateX = useTransform(smoothY, [0, 1], [3, -3]);
  const rotateY = useTransform(smoothX, [0, 1], [-3, 3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
        }
      });

      if (!overlayOnly) {
        tl.fromTo(imageRef.current, { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 1.5 });
      } else {
        tl.fromTo(containerRef.current, { backgroundColor: "rgba(5,5,5,0)" }, { backgroundColor: "rgba(5,5,5,0.8)", duration: 1 });
      }

      tl.fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(textRef.current, { opacity: 0, y: -50, duration: 0.5 }, "+=1");

    }, containerRef);

    return () => ctx.revert();
  }, [overlayOnly]);

  return (
    <section ref={containerRef} className="h-screen relative flex items-center justify-center overflow-hidden w-full p-6 lg:p-20 perspective-1000">
      {!overlayOnly && (
        <motion.div 
          style={{ rotateX, rotateY }}
          className="scene-frame absolute inset-0 m-6 lg:m-20"
        >
          <img 
            ref={imageRef}
            src={image} 
            alt={`Story segment ${index}`}
            className="absolute inset-0 w-full h-full object-cover grayscale-[10%] brightness-[0.7]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-rose-900/20" />
        </motion.div>
      )}
      
      {!overlayOnly && <div className="absolute inset-0 bg-luxury-black/20" />}

      <div ref={textRef} className="relative z-10 px-6 max-w-4xl w-full">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: "circOut" }}
           viewport={{ once: false, margin: "-10%" }}
           className="text-center"
        >
          <h3 className={cn(
            "font-serif font-normal text-4xl md:text-6xl lg:text-7xl mb-8 tracking-tight leading-[1.15]",
            line2 ? "text-white/80" : "text-white"
          )}>
            {line1}
          </h3>
          {line2 && (
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="font-serif italic text-xl md:text-2xl text-white/70"
            >
              {line2}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
