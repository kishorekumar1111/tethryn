import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SectionCover from './components/SectionCover';
import SectionHero from './components/SectionHero';
import SectionGallery from './components/SectionGallery';
import SectionTraits from './components/SectionTraits';
import SectionLetter from './components/SectionLetter';
import SectionFinale from './components/SectionFinale';
import FloatingPetals from './components/FloatingPetals';
import CustomCursor from './components/CustomCursor';
import BackgroundAudio from './components/BackgroundAudio';
import EasterEgg from './components/EasterEgg';
import { defaults } from './defaults';

interface TemplateComponentProps {
  data: any;
  isUnwrapped?: boolean;
  onUnwrap?: () => void;
  scrollContainer?: React.RefObject<HTMLDivElement>;
}

export default function LuxuryWish({ data, isUnwrapped, onUnwrap, scrollContainer }: TemplateComponentProps) {
  const [hasEntered, setHasEntered] = useState(false);

  const settings = { ...defaults, ...(data.content || {}) };

  // Sync isUnwrapped logic with internal state
  useEffect(() => {
    if (isUnwrapped) {
      setHasEntered(true);
    }
  }, [isUnwrapped]);

  const handleEnter = () => {
    setHasEntered(true);
    if (onUnwrap) onUnwrap();
  };

  // Prevent scroll during cover
  useEffect(() => {
    if (!hasEntered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [hasEntered]);

  return (
    <div className="min-h-screen bg-[#1a050f] text-[#fff0f3] font-sans selection:bg-[#ff4d6d] selection:text-white relative">
      <CustomCursor />
      <div className="fixed inset-0 pointer-events-none bg-texture opacity-[0.25] z-40 mix-blend-overlay"></div>
      
      {settings.petalsEnabled !== false && <FloatingPetals />}
      {hasEntered && <BackgroundAudio src={settings.backgroundAudio} />}
      {hasEntered && <EasterEgg />}

      <AnimatePresence>
        {!hasEntered ? (
          <SectionCover key="cover" introText={settings.introText || "For You"} onOpen={handleEnter} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.2 }}
            className="flex flex-col items-center w-full relative z-10"
          >
            <SectionHero 
  name={settings.recipientName || ""} 
  subtitle={settings.heroSubtitle || ""} 
  nickname={settings.nickname || ""}
  anniversary={settings.relationshipAnniversary || ""}
/>
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SectionGallery memories={settings.memories || []} />
              </motion.div>
              
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SectionTraits traits={settings.traits || []} />
              </motion.div>
              
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SectionLetter title={settings.letterTitle || ""} content={settings.letterContent || ""} signature={settings.signature || ""} />
              </motion.div>
              
              <motion.div
                className="w-full flex justify-center"
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SectionFinale message={settings.finalMessage || ""} />
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


