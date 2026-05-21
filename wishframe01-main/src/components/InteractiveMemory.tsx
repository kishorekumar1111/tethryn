import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Map, Music, X } from 'lucide-react';
import { config } from '../config';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  Heart,
  Star,
  Map,
  Music,
};

export const InteractiveMemory: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<typeof config.interactive.elements[0] | null>(null);

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      <div className="text-center mb-16 relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          className="text-sm tracking-[0.4em] uppercase mb-4"
        >
          Interaction
        </motion.p>
        <h2 className="font-serif italic text-4xl md:text-5xl lg:text-7xl">
          {config.interactive.prompt}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl w-full relative z-10">
        {config.interactive.elements.map((el, i) => {
          const Icon = iconMap[el.icon] || Heart;
          return (
            <motion.button
              key={el.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              whileHover={{ y: -10 }}
              animate={{ 
                y: [0, -5, 0],
                transition: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
              }}
              onClick={() => setSelectedElement(el)}
              className="group flex flex-col items-center gap-6 py-12 glass rounded-sm transition-all duration-1000 hover:border-luxury-gold/60 hover:shadow-[0_0_30px_rgba(197,160,89,0.1)]"
            >
              <div className="p-5 border border-white/5 group-hover:border-luxury-gold/40 transition-all duration-700 bg-white/[0.02]">
                <Icon size={28} strokeWidth={0.75} className="text-white/30 group-hover:text-luxury-gold transition-all duration-700 group-hover:scale-110" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-[9px] tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">Unlock</span>
                <div className="h-[1px] w-0 group-hover:w-full bg-luxury-gold/30 transition-all duration-1000 mx-auto" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedElement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full bg-luxury-black/40 backdrop-filter backdrop-blur-[20px] border border-white/10 rounded-lg overflow-hidden relative grid md:grid-cols-2 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
            >
              <button 
                onClick={() => setSelectedElement(null)}
                className="absolute top-6 right-6 z-20 p-2 hover:bg-white/10 rounded-full transition-colors text-luxury-gold"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="h-[300px] md:h-full relative overflow-hidden p-4">
                <div className="scene-frame h-full">
                  <img 
                    src={selectedElement.image} 
                    alt={selectedElement.message}
                    className="absolute inset-0 w-full h-full object-cover ken-burns"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="p-10 md:p-16 flex flex-col justify-center gap-6">
                <div className="text-[10px] uppercase tracking-[3px] text-luxury-gold opacity-60">Locked Memory</div>
                <p className="font-serif italic text-2xl md:text-3xl text-white/90 leading-relaxed">
                  "{selectedElement.message}"
                </p>
                <div className="h-[1px] bg-luxury-gold/50 w-12" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
