import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Confetti from "./components/Confetti";
import ParticleField from "./components/ParticleField";
import SceneParallax from "./components/SceneParallax";
import AmbientAudio from "./components/AmbientAudio";
import BirthdayCake from "./components/BirthdayCake";
import SecretLetter from "./components/SecretLetter";
import PhotoGallery from "./components/PhotoGallery";
import Preloader from "./components/Preloader";
import FilmGrain from "./components/FilmGrain";
import { defaults } from "./defaults";
import "./styles.css";

interface TemplateComponentProps {
  data: any;
  isUnwrapped?: boolean;
  onUnwrap?: () => void;
  scrollContainer?: React.RefObject<HTMLElement>;
}

/* ── Ornamental divider ── */
function Divider() {
  return (
    <div className="wf-divider" aria-hidden="true">
      <span className="wf-divider-line" />
      <span className="wf-divider-gem">✦</span>
      <span className="wf-divider-line" />
    </div>
  );
}

/* ── Friendship Stats ── */
function useCountUp(end: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = 16;
    const increment = end / (duration / step);
    const t = setInterval(() => {
      start += increment;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(t);
  }, [active, end, duration]);
  return val;
}

const StatItem: React.FC<{ end: number | string; label: string; suffix: string; active: boolean; }> = ({ end, label, suffix, active }) => {
  const endStr = String(end);
  const isInfinity = endStr === "∞" || endStr.toLowerCase() === "infinity";
  const isNumber = !isInfinity && (typeof end === 'number' || (!isNaN(Number(end)) && endStr.trim() !== ''));
  const numEnd = isNumber ? Number(end) : 0;
  const val = useCountUp(numEnd, active);
  
  return (
    <div className="wf-stat-item">
      <span className="wf-stat-num">
        {isNumber ? val.toLocaleString() : end}{suffix}
      </span>
      <span className="wf-stat-label">{label}</span>
    </div>
  );
}

function FriendshipStats({ years, settings }: { years: number, settings: any }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { end: settings.stat1Value || Math.round(years * 365.25), label: settings.stat1Label || "Days of friendship", suffix: "" },
    { end: settings.stat2Value || years, label: settings.stat2Label || "Years together", suffix: "+" },
    { end: settings.stat3Value || "47", label: settings.stat3Label || "Memories made", suffix: (settings.stat3Value === "∞" || settings.stat3Value === "Infinity" || settings.stat3Value === "infinity") ? "" : "+" },
    { end: settings.stat4Value || "100", label: settings.stat4Label || "Real, always", suffix: "%" },
  ];

  return (
    <div className="wf-stats reveal" ref={ref}>
      <div className="wf-stats-grid">
        {stats.map((s, i) => (
          <StatItem key={i} {...s} active={active} />
        ))}
      </div>
    </div>
  );
}

/* ── Tilt card ── */
function useTilt(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
      el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateZ(8px)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* ── Scroll gradient ── */
function useScrollGradient(scrollContainer?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = document.documentElement;
    const target = scrollContainer?.current || window;
    const isWindow = target === window;

    const fn = () => {
      let p = 0;
      if (isWindow) {
        p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      } else {
        const el = target as HTMLElement;
        p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      }
      root.style.setProperty("--scroll-hue", String(Math.round(220 + p * 120)));
    };
    target.addEventListener("scroll", fn, { passive: true });
    return () => target.removeEventListener("scroll", fn as any);
  }, [scrollContainer]);
}

/* ── Spotlight cursor ── */
function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.left = e.clientX + "px";
      ref.current.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div className="wf-spotlight" ref={ref} />;
}

/* ── Years counter ── */
function YearsCounter({ years }: { years: number }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const val = useCountUp(years, active, 900);
  return (
    <div className="wf-counter" ref={ref}>
      <span className="wf-counter-num">{val}</span>
      <span className="wf-counter-label">years of real friendship</span>
    </div>
  );
}

/* ── Memory card ── */
const MemoryCard: React.FC<{ mem: any; i: number; }> = ({ mem, i }) => {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return (
    <div
      className={`wf-memory-card reveal reveal--delay-${i % 3}`}
      ref={ref}
      style={{ "--card-i": i } as React.CSSProperties}
    >
      <div className="wf-memory-img-wrap">
        <img src={mem.image} alt={mem.text} className="wf-memory-img" loading="lazy" />
        <div className="wf-memory-img-glow" />
        <div className="wf-memory-year">{mem.year}</div>
      </div>
      <div className="wf-memory-body">
        <span className="wf-memory-tag">{mem.tag}</span>
        <p className="wf-memory-quote">&ldquo;{mem.text}&rdquo;</p>
        <p className="wf-memory-sub">{mem.subtext}</p>
        <div className="wf-memory-line" />
      </div>
    </div>
  );
}

/* ── Video section ── */
function extractYoutubeId(urlOrId: string) {
  if (!urlOrId) return "";
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId.trim();
}

function VideoMemory({ videoId, videoTitle }: { videoId: string, videoTitle?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const parsedId = extractYoutubeId(videoId);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="wf-video-section" ref={ref}>
      <p className="wf-section-label reveal">✦ a moment in motion</p>
      <h2 className="wf-section-title reveal">
        {videoTitle?.split('\n').map((line: string, i: number, arr: string[]) => (
          <React.Fragment key={i}>
            {i === arr.length - 1 ? <em>{line}</em> : <>{line}<br /></>}
          </React.Fragment>
        ))}
      </h2>
      <div className={`wf-video-frame reveal ${loaded ? "loaded" : ""}`}>
        <div className="wf-video-corner wf-video-corner--tl" />
        <div className="wf-video-corner wf-video-corner--tr" />
        <div className="wf-video-corner wf-video-corner--bl" />
        <div className="wf-video-corner wf-video-corner--br" />
        {visible && parsedId && (
          <iframe
            src={`https://www.youtube.com/embed/${parsedId}?autoplay=1&mute=1&loop=1&playlist=${parsedId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            title="Video Memory"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="wf-video-iframe"
            onLoad={() => setLoaded(true)}
          />
        )}
        {!loaded && visible && parsedId && <div className="wf-video-loading"><div className="wf-video-spinner" /></div>}
        <div className="wf-video-overlay-text">
          <span>{parsedId ? "✦ replace with a personal video · swap the videoId above" : "✦ Please provide a valid YouTube Video ID or URL"}</span>
        </div>
      </div>
    </section>
  );
}

/* ── Scroll reveal ── */
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export const WishFrame: React.FC<TemplateComponentProps> = ({ data, isUnwrapped, onUnwrap, scrollContainer }) => {
  const settings = { ...defaults, ...(data.content || {}) };
  const [preloaded, setPreloaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  useScrollReveal();
  useScrollGradient(scrollContainer);

  const handleBegin = useCallback(() => {
    if (!isUnwrapped && onUnwrap) {
      onUnwrap();
    }
    setTimeout(() => storySectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [isUnwrapped, onUnwrap]);

  useEffect(() => {
    const el = finalRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShowConfetti(true); },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="wf-app">
      <AnimatePresence>
        {(!isUnwrapped || !preloaded) && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.025 }}
            transition={{ duration: 1 }}
            className="wf-unwrap-overlay"
            style={{ zIndex: 999999, background: '#03030a' }}
          >
            {isUnwrapped && !preloaded ? (
              <Preloader name={settings.name} occasion={settings.occasion} subtext={settings.preloaderSubtext} onDone={() => setPreloaded(true)} />
            ) : (
              <div className="wf-envelope-invitation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', cursor: 'pointer' }} onClick={() => {
                if (onUnwrap) onUnwrap();
              }}>
                 <motion.div 
                   animate={{ scale: [1, 1.05, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="wf-invitation-star"
                 >
                   ✦
                 </motion.div>
                 <h1 className="wf-invitation-name">For {settings.name}</h1>
                 <p className="wf-invitation-hint">tap to open your gift</p>
                 <div className="wf-invitation-ring" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <SpotlightCursor />
      <FilmGrain />
      {showConfetti && <Confetti />}
      <AmbientAudio />

      {/* ── SCENE 1: Parallax intro ── */}
      <SceneParallax onBegin={handleBegin} />

      {/* ── SECTION 2: MEMORIES ── */}
      <section className="wf-memories" ref={storySectionRef}>
        <div className="wf-memories-sticky-label reveal">✦ A story in moments</div>
        <h2 className="wf-section-title reveal">
          {settings.memoriesTitle?.split('\n').map((line: string, i: number, arr: string[]) => (
            <React.Fragment key={i}>
              {i === arr.length - 1 ? <em>{line}</em> : <>{line}<br /></>}
            </React.Fragment>
          ))}
        </h2>
        <YearsCounter years={settings.friendshipYears} />
        <div className="wf-memory-list">
          {settings.memories?.map((mem: any, i: number) => (
            <MemoryCard key={i} mem={mem} i={i} />
          ))}
        </div>
      </section>

      <Divider />

      {/* ── SECTION 3: FRIENDSHIP STATS ── */}
      <FriendshipStats years={settings.friendshipYears} settings={settings} />

      <Divider />

      {/* ── SECTION 4: PHOTO GALLERY ── */}
      <PhotoGallery galleryTitle={settings.galleryTitle} galleryItems={settings.gallery} />

      <Divider />

      {/* ── SECTION 5: VIDEO ── */}
      <VideoMemory videoId={settings.videoId} videoTitle={settings.videoTitle} />

      <Divider />

      {/* ── SECTION 6: EMOTIONAL BUILDUP ── */}
      <section className="wf-buildup">
        <ParticleField count={60} />
        <div className="wf-buildup-bg-orb wf-buildup-bg-orb--1" />
        <div className="wf-buildup-bg-orb wf-buildup-bg-orb--2" />
        <div className="wf-buildup-content">
          <p className="wf-buildup-pre reveal">✦ And then it hits you</p>
          <h2 className="wf-buildup-text reveal">
            {settings.buildupText?.split('\n').map((line: string, i: number, arr: string[]) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <em>{line}</em> : <>{line}<br /></>}
              </React.Fragment>
            ))}
          </h2>
          <p className="wf-buildup-afterline reveal">led to right now.</p>
        </div>
      </section>

      <Divider />

      {/* ── SECTION 7: BIRTHDAY CAKE ── */}
      <section className="wf-cake-section">
        <p className="wf-section-label reveal">✦ make a wish</p>
        <h2 className="wf-section-title reveal">
          {settings.cakeTitle?.split('\n').map((line: string, i: number, arr: string[]) => (
            <React.Fragment key={i}>
              {i === arr.length - 1 ? <em>{line}</em> : <>{line}<br /></>}
            </React.Fragment>
          ))}
        </h2>
        <div className="reveal"><BirthdayCake /></div>
      </section>

      <Divider />

      {/* ── SECTION 8: SECRET LETTER ── */}
      <SecretLetter content={settings.letterContent} />

      <Divider />

      {/* ── SECTION 9: FINAL REVEAL ── */}
      <section className="wf-reveal" ref={finalRef}>
        <div className="wf-reveal-bg" />
        <div className="wf-reveal-rings">
          <div className="wf-ring wf-ring--1" />
          <div className="wf-ring wf-ring--2" />
          <div className="wf-ring wf-ring--3" />
        </div>
        <div className="wf-reveal-content reveal">
          <p className="wf-reveal-pre">Today is your day —</p>
          <h1 className="wf-birthday-text">Happy Birthday,</h1>
          <div className="wf-birthday-name-wrap">
            <span className="wf-birthday-name">{settings.name}</span>
            <span className="wf-birthday-heart">🎂</span>
          </div>
          <p className="wf-final-msg">{settings.finalMessage}</p>
          <div className="wf-reveal-stars">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="wf-star" style={{ "--si": i } as React.CSSProperties}>✦</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: CTA ── */}
      <section className="wf-cta">
        <div className="wf-cta-glow" />
        <p className="wf-cta-pre reveal">ready to do this for someone you love?</p>
        <h2 className="wf-cta-title reveal">
          Create your own<br /><em>surprise experience</em>
        </h2>
        <a href="#" className="wf-glow-btn wf-glow-btn--gold reveal" onClick={(e) => e.preventDefault()}>
          <span className="wf-btn-inner">✦ &nbsp;Create with Tethryn</span>
          <span className="wf-btn-ring" />
        </a>
        <p className="wf-cta-footer reveal">Premium digital surprises</p>
        <div className="wf-logo reveal">
          <span className="wf-logo-star">✦</span> Tethryn
        </div>
      </section>
    </div>
  );
};

export default WishFrame;
