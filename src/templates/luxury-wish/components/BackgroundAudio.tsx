import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundAudio({ src }: { src?: string }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Attempt to auto-play if we have a source
    if (audioRef.current && src) {
      audioRef.current.volume = 0.4;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
          // Auto-play was prevented
        });
      }
    }
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!src) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
      />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>
    </>
  );
}
