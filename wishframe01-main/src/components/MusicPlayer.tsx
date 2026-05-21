import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon, ListMusic } from 'lucide-react';
import { config } from '../config';
import { cn } from '../lib/utils';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = config.music[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % config.music.length);
    setIsPlaying(true);
    // Auto play next track is handled by useEffect on currentTrackIndex if needed, 
    // but here we just manually trigger it since we update state
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + config.music.length) % config.music.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed on track change:", e));
    }
  }, [currentTrackIndex]);

  return (
    <div className="fixed bottom-24 right-10 z-[200]">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            className="mb-4 p-8 glass rounded-3xl w-72 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden border-rose-900/20"
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <motion.div 
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className={cn(
                    "w-24 h-24 rounded-full bg-rose-500/5 flex items-center justify-center text-luxury-gold border border-luxury-gold/20 relative",
                  )}
                >
                  <div className="absolute inset-2 border border-luxury-gold/10 rounded-full" />
                  <div className="absolute inset-4 border border-luxury-gold/5 rounded-full" />
                  <MusicIcon size={32} strokeWidth={1} />
                </motion.div>
                <div className="w-full space-y-1">
                  <p className="text-[9px] uppercase tracking-[4px] text-luxury-gold opacity-50">Currently Playing</p>
                  <h4 className="text-lg font-serif italic text-white/90 truncate">{currentTrack.title}</h4>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 text-white/80">
                <button onClick={prevTrack} className="hover:text-luxury-gold transition-colors"><SkipBack size={18} /></button>
                <button 
                  onClick={togglePlay} 
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                </button>
                <button onClick={nextTrack} className="hover:text-luxury-gold transition-colors"><SkipForward size={18} /></button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Volume2 size={14} className="opacity-40" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-[2px] bg-white/10 accent-luxury-gold appearance-none cursor-pointer outline-none"
                  />
                </div>
                
                <div className="pt-2 border-t border-white/5">
                   <p className="text-[8px] uppercase tracking-[2px] opacity-40 mb-3 ml-1">Playlist</p>
                   <div className="space-y-2">
                     {config.music.map((track, idx) => (
                       <button 
                         key={track.id}
                         onClick={() => setCurrentTrackIndex(idx)}
                         className={cn(
                           "w-full text-left text-[11px] px-2 py-1 rounded transition-colors",
                           idx === currentTrackIndex ? "bg-luxury-gold/20 text-luxury-gold" : "hover:bg-white/5 text-white/60"
                         )}
                       >
                         {track.title}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>
            
            <audio 
              ref={audioRef} 
              src={currentTrack.url} 
              loop={false}
              onEnded={nextTrack}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-14 h-14 rounded-full glass flex items-center justify-center shadow-lg transition-all duration-500",
          isExpanded ? "border-luxury-gold bg-luxury-gold/20 text-luxury-gold" : "hover:bg-white/10 text-white/70"
        )}
      >
        <ListMusic size={24} />
      </motion.button>
    </div>
  );
};
