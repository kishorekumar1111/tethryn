/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Volume2, VolumeX, MailOpen, ChevronRight, Flower2, Download } from "lucide-react";
import { defaults } from "./defaults";

interface MemoryBloomProps {
  data: any;
  isUnwrapped?: boolean;
  onUnwrap?: () => void;
}

// Utility for merging classes
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

function LiquidFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="liquid">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="liquid"
          />
        </filter>
      </defs>
    </svg>
  );
}

function CustomCursor({ mousePos }: { mousePos: { x: number; y: number } }) {
    return (
        <motion.div 
            className="fixed top-0 left-0 w-8 h-8 border border-[#D81B60]/40 rounded-full pointer-events-none z-[200] hidden md:flex items-center justify-center mix-blend-difference"
            animate={{
                x: (mousePos.x + 1) * (window.innerWidth / 2) - 16,
                y: (mousePos.y + 1) * (window.innerHeight / 2) - 16,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
        >
            <div className="w-1 h-1 bg-[#D81B60] rounded-full" />
        </motion.div>
    );
}

function Petals({ count = 15, color = "#ff85a2" }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{ 
            backgroundColor: i % 2 === 0 ? color : "#fff",
            width: `${10 + Math.random() * 15}px`,
            height: `${8 + Math.random() * 10}px`,
            borderRadius: "50% 0 50% 0",
            left: `${Math.random() * 100}%`,
            top: `-5%` 
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: ["0px", `${(Math.random() - 0.5) * 200}px`],
            rotate: [0, 360, 720],
            opacity: [0, 0.3, 0.3, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
        />
      ))}
    </div>
  );
}

export const MemoryBloom: React.FC<MemoryBloomProps> = ({ data, isUnwrapped, onUnwrap }) => {
  const settings = { ...defaults, ...(data.content || {}) };
  const [step, setStep] = useState(isUnwrapped ? 4 : 0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(!isUnwrapped);

  useEffect(() => {
    if (isUnwrapped) setStep(4);
  }, [isUnwrapped]);

  // Handle loading
  useEffect(() => {
    if (!isUnwrapped) {
      const timer = setTimeout(() => setIsLoading(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isUnwrapped]);

  // Handle mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Transition to next step
  const nextStep = () => {
    if (step === 3 && onUnwrap) onUnwrap();
    setStep(prev => prev + 1);
  };

  // Handle ambient background music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      if (!isMuted) {
        audioRef.current.play().catch(() => {
            console.log("Autoplay blocked - user interaction required");
            setIsMuted(true);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  return (
    <div 
      className="relative w-full h-full min-h-[100dvh] overflow-hidden font-serif select-none cinematic-grain"
      style={{ background: "radial-gradient(circle at center, #FFFFFF 0%, #FFF0F3 40%, #FCE4EC 100%)" }}
    >
      <LiquidFilter />
      
      {/* Background Video Layer */}
      {settings.bgVideoUrl && (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <video 
            src={settings.bgVideoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover grayscale"
          />
        </div>
      )}

      <CustomCursor mousePos={mousePos} />
      
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center"
          >
             <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
             >
                <Heart size={32} fill="#FCE4EC" className="text-rose-200" />
             </motion.div>
             <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.4, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-[9px] uppercase tracking-[0.8em] font-sans font-bold text-[#8D6E63]"
             >
                Preparing Bloom
             </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Background Atmosphere */}
      <motion.div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={{
          x: mousePos.x * 20,
          y: mousePos.y * 20,
        }}
        transition={{ type: "spring", damping: 15, stiffness: 40 }}
      >
        <div className="absolute top-10 left-20 w-32 h-32 bg-pink-200/30 rounded-full blur-[80px]" />
        <div className="absolute top-40 right-40 w-48 h-48 bg-rose-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-100/30 rounded-full blur-[80px]" />
        <Particles count={15} color={settings.accentColor} />
        <Petals count={12} color={settings.accentColor} />
      </motion.div>

      {/* Experience Frame Borders */}
      <div className="absolute inset-0 pointer-events-none border-[24px] border-white/5 opacity-30 z-40"></div>
      <div className="absolute inset-10 pointer-events-none border border-white/10 z-40"></div>

      {/* Interactive Cursor Aura */}
      <motion.div 
        className="fixed w-[200px] h-[200px] pointer-events-none z-0 rounded-full blur-[60px] opacity-20 hidden md:block"
        style={{ backgroundColor: settings.accentColor }}
        animate={{
          x: (mousePos.x + 1) * (window.innerWidth / 2) - 100,
          y: (mousePos.y + 1) * (window.innerHeight / 2) - 100,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50, restDelta: 0.001 }}
      />

      {/* Audio Control */}
      {settings.audioUrl && (
        <>
            <audio ref={audioRef} src={settings.audioUrl} loop />
            <button 
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-8 right-8 z-50 p-4 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg transition-all hover:bg-white/50 active:scale-90"
            >
                {isMuted ? <VolumeX size={18} className="text-[#5D4037]/60" /> : <Volume2 size={18} className="text-[#D81B60]" />}
            </button>
        </>
      )}

      {/* Experience Sections */}
      <motion.div 
        className="relative z-10 w-full h-full max-w-lg mx-auto"
        initial={false}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <IntroSection 
              key="intro" 
              text={settings.introText} 
              onComplete={nextStep} 
            />
          )}

          {step === 1 && (
            <BloomSection 
              key="bloom" 
              title={settings.bloomTitle} 
              image={settings.bloomImage} 
              accentColor={settings.accentColor} 
              onComplete={nextStep} 
            />
          )}

          {step === 2 && (
            <MemoryJourneySection 
              key="memories" 
              memories={settings.memories} 
              onComplete={nextStep} 
            />
          )}

          {step === 3 && (
            <LetterSection 
              key="letter" 
              recipient={settings.letterRecipient}
              sender={settings.letterSender}
              content={settings.letterContent}
              onComplete={nextStep} 
            />
          )}

          {step === 4 && (
            <RevealSection 
              key="reveal" 
              text={settings.revealText} 
              accentColor={settings.accentColor} 
              giftAttachment={settings.giftAttachment}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Branding (Optional/Subtle) */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">Memory Bloom</p>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Particles({ count = 20, color = "#ff85a2" }) {
  return (
    <div className="absolute inset-0 z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-20"
          style={{ 
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%` 
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
}

function IntroSection({ text, onComplete }: { text: string; onComplete: () => void; key?: string }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 8000); 
        return () => clearTimeout(timer);
    }, [onComplete]);

    const words = text.split(" ");

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 1.2 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="overflow-hidden flex flex-wrap justify-center max-w-lg">
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        initial={{ y: "100%", rotate: 5 }}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ 
                            delay: 0.5 + i * 0.1, 
                            duration: 1.2, 
                            ease: [0.33, 1, 0.68, 1] 
                        }}
                        className="inline-block mx-1.5 text-3xl md:text-5xl font-serif italic text-[#5D4037] opacity-80"
                    >
                        {word}
                    </motion.span>
                ))}
            </div>
            <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 80, opacity: 0.2 }}
                transition={{ delay: 2, duration: 1.5 }}
                className="h-[1px] bg-[#8D6E63] mt-12"
            />
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                onClick={onComplete}
                className="mt-8 px-8 py-3 rounded-full border border-[#8D6E63]/20 text-[10px] font-sans uppercase tracking-[0.6em] text-[#8D6E63] hover:bg-[#8D6E63]/5 transition-colors cursor-pointer"
            >
                Start Journey
            </motion.button>
        </motion.div>
    );
}

function BloomSection({ title, image, accentColor, onComplete }: { title: string; image?: string; accentColor: string; onComplete: () => void; key?: string }) {
    const [isBloomed, setIsBloomed] = useState(false);

    const handleBloom = () => {
        if (!isBloomed) {
            setIsBloomed(true);
            setTimeout(onComplete, 3500);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
            <AnimatePresence>
                {!isBloomed && (
                    <motion.div 
                        key="orb-button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center cursor-pointer group relative"
                        onClick={handleBloom}
                    >
                        {/* Ripple Effect Background */}
                        <motion.div 
                            animate={{ scale: [1, 1.4], opacity: [0.2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full border-2 border-rose-200 pointer-events-none"
                        />
                        
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 0px 0px rgba(216,27,96,0)",
                                    `0 0 50px 15px #D81B6020`,
                                    "0 0 0px 0px rgba(216,27,96,0)"
                                ] 
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-48 h-48 bg-white/40 border border-white/60 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-2xl relative transition-transform group-hover:scale-110"
                        >
                            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-rose-200 to-pink-50 flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img src={image} alt="Bloom" className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
                                ) : (
                                    <Flower2 size={48} className="text-[#D81B60]/40 animate-pulse" />
                                )}
                            </div>
                        </motion.div>
                        <motion.p 
                            className="mt-10 text-[#8D6E63] text-[10px] uppercase tracking-[0.4em] font-sans font-bold opacity-60"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {title}
                        </motion.p>
                    </motion.div>
                )}

                {isBloomed && (
                    <motion.div 
                        key="bloom-effect"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {/* Bloom explosion particles */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                animate={{ 
                                    scale: [0, 1.5, 0],
                                    x: Math.cos(i * 30 * (Math.PI / 180)) * 200,
                                    y: Math.sin(i * 30 * (Math.PI / 180)) * 200,
                                    opacity: 0
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="absolute w-4 h-4 rounded-full"
                                style={{ backgroundColor: accentColor }}
                            />
                        ))}
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "backOut" }}
                            className="text-center"
                        >
                            <Heart size={80} fill={accentColor} className="text-white mx-auto shadow-xl" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MemoryJourneySection({ memories, onComplete }: { memories: any[]; onComplete: () => void; key?: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 15, y: y * -15 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    const nextMemory = () => {
        if (currentIndex < (memories?.length || 0) - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    if (!memories || memories.length === 0) {
        onComplete();
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="w-full max-w-sm flex items-center justify-between mb-10">
               <h3 className="text-[#8D6E63] text-[10px] uppercase tracking-[0.3em] font-sans font-bold opacity-60">The Journey</h3>
               <div className="flex gap-2">
                {memories.map((_: any, i: number) => (
                    <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === currentIndex ? "w-8 bg-[#D81B60]" : "w-1.5 bg-[#5D4037]/10")} />
                ))}
               </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentIndex}
                    initial={{ x: currentIndex % 2 === 0 ? 50 : -50, opacity: 0, rotate: currentIndex % 2 === 0 ? 3 : -3 }}
                    animate={{ 
                        x: 0, 
                        opacity: 1, 
                        rotateY: tilt.x, 
                        rotateX: tilt.y,
                        rotateZ: 0 
                    }}
                    exit={{ x: currentIndex % 2 === 0 ? -50 : 50, opacity: 0, scale: 0.9, rotate: currentIndex % 2 === 0 ? -2 : 2 }}
                    transition={{ 
                        type: "spring",
                        damping: 20,
                        stiffness: 100,
                        rotateY: { type: "spring", damping: 30, stiffness: 40 },
                        rotateX: { type: "spring", damping: 30, stiffness: 40 }
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative group w-full max-w-[340px] aspect-[4/5] bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-2xl flex flex-col active:scale-95 perspective-1000"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div 
                        className="w-full h-[75%] overflow-hidden rounded-xl bg-rose-50 mb-4 transition-transform group-hover:scale-[1.02] duration-700 pointer-events-none"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        <img 
                            src={typeof memories[currentIndex] === 'string' ? memories[currentIndex] : memories[currentIndex].image} 
                            alt="Memory" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div 
                        className="flex-grow flex flex-col justify-center px-1 pointer-events-none"
                        style={{ transform: "translateZ(50px)" }}
                    >
                        {memories[currentIndex]?.date && (
                             <p className="text-[#5D4037] text-[10px] font-sans font-bold uppercase tracking-[0.2em] opacity-50 mb-1">
                                {memories[currentIndex].date}
                             </p>
                        )}
                        <h4 className="text-xl font-serif italic text-[#5D4037] opacity-80 leading-snug">
                            {typeof memories[currentIndex] === 'string' ? "A beautiful memory" : `"${memories[currentIndex].caption}"`}
                        </h4>
                    </div>
                    
                    <motion.div 
                        animate={{ x: tilt.x * 5, y: -tilt.y * 5 }}
                        className="absolute inset-0 border border-white/40 rounded-2xl pointer-events-none" 
                    />
                </motion.div>
            </AnimatePresence>

            <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={nextMemory}
                className="mt-14 flex items-center gap-3 px-10 py-4 bg-white/30 backdrop-blur-xl rounded-full border border-white/40 shadow-xl text-[#5D4037] font-sans text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"
            >
                {currentIndex === memories.length - 1 ? "Read Special Note" : "Next Chapter"}
                <ChevronRight size={14} className="text-[#D81B60]" />
            </motion.button>
        </div>
    );
}

function LetterSection({ recipient, sender, content, onComplete }: { recipient: string; sender: string; content: string; onComplete: () => void; key?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 perspective-1000">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div 
                        key="envelope"
                        initial={{ opacity: 0, y: 20, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        className="w-full max-w-sm aspect-[5/3] bg-[#FDFBF7] rounded-sm shadow-2xl relative cursor-pointer group border-t-4 border-[#FCE4EC]"
                        onClick={() => setIsOpen(true)}
                    >
                         <div className="absolute -top-3 left-6 px-3 py-1 bg-[#D81B60] text-white text-[8px] font-sans font-bold tracking-[0.2em] uppercase shadow-md">Private Message</div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <MailOpen size={24} className="text-[#D81B60]/40" />
                            </div>
                         </div>
                         <div className="absolute bottom-6 left-0 right-0 text-center">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-[#8D6E63] font-bold opacity-60">To: {recipient}</p>
                            <p className="mt-1 text-[8px] italic text-[#D81B60]/40 tracking-wider">Tap to open letter</p>
                         </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="letter-content"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full max-w-md bg-[#FDFBF7] border border-stone-100 shadow-2xl p-10 sm:p-14 relative max-h-[75vh] overflow-y-auto scrollbar-hide border-t-8 border-[#FCE4EC]"
                    >
                        <div className="mb-8">
                            <p className="font-serif italic text-[#D81B60] text-xl mb-1">{recipient},</p>
                            <div className="h-[1px] w-12 bg-[#D81B60]/20" />
                        </div>
                        <div className="space-y-6">
                           {content.split('\n').map((para: string, i: number) => (
                               <p key={i} className="text-[#5D4037] leading-relaxed font-serif text-lg opacity-90">
                                   {para}
                               </p>
                           ))}
                        </div>
                        <div className="mt-10 text-right">
                            <p className="font-serif italic text-[#8D6E63] opacity-60">— {sender}</p>
                        </div>
                        
                        <motion.button 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           transition={{ delay: 2 }}
                           onClick={onComplete}
                           className="mt-14 w-full py-5 border-t border-[#D81B60]/10 text-[#D81B60] font-sans font-bold uppercase tracking-[0.3em] text-[10px] hover:text-[#D81B60] transition-opacity"
                        >
                            The Final Reveal
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function RevealSection({ text, accentColor, giftAttachment }: { text: string; accentColor: string; giftAttachment?: string; key?: string }) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowConfetti(true), 1000);
    }, []);

    const words = text.split(" ");

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative">
             {showConfetti && (
                 <div className="absolute inset-0 pointer-events-none overflow-hidden">
                     {[...Array(30)].map((_, i) => (
                         <motion.div
                             key={i}
                             initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 1 }}
                             animate={{ 
                                 y: 800, 
                                 rotate: 360,
                                 opacity: 0
                             }}
                             transition={{ 
                                 duration: 3 + Math.random() * 4, 
                                 repeat: Infinity,
                                 delay: Math.random() * 2
                             }}
                             className="absolute w-2 h-2 rounded-sm"
                             style={{ backgroundColor: i % 2 === 0 ? accentColor : '#ffe4e6' }}
                         />
                     ))}
                 </div>
             )}

             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
             >
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 80, delay: 0.2 }}
                    className="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full mx-auto mb-10 flex items-center justify-center shadow-xl"
                >
                    <Heart size={40} fill="#D81B60" className="text-white" />
                </motion.div>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {words.map((word, i) => (
                        <motion.h2 
                            key={i}
                            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
                            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.2, duration: 1 }}
                            className="text-5xl md:text-7xl font-bold font-serif text-[#D81B60] tracking-tight leading-tight"
                        >
                            {word === '❤️' ? (
                                <span className="text-[#FCE4EC] drop-shadow-[0_2px_4px_rgba(216,27,96,0.3)] inline-block animate-pulse">❤️</span>
                            ) : word}
                        </motion.h2>
                    ))}
                </div>

                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 140 }}
                    transition={{ delay: 1.5, duration: 2 }}
                    className="h-[2px] bg-gradient-to-r from-transparent via-[#D81B60]/30 to-transparent mt-12 mx-auto"
                />
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 3 }}
                    className="mt-10 text-[#8D6E63] text-[9px] uppercase tracking-[0.6em] font-sans font-bold"
                >
                    Forever Is Just The Beginning
                </motion.p>

                {giftAttachment && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 4 }}
                        className="mt-12"
                    >
                        <a 
                            href={giftAttachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-3 px-6 py-3 rounded-sm border border-[#D81B60]/20 bg-white/5 hover:bg-white/10 transition-all group"
                        >
                            <Download size={14} className="text-[#D81B60]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#5D4037]/60 group-hover:text-[#D81B60] transition-colors">Retrieve Digital Parcel</span>
                        </a>
                    </motion.div>
                )}
             </motion.div>
        </div>
    );
}

export default MemoryBloom;
