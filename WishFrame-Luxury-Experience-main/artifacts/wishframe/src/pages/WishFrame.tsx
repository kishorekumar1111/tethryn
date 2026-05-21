import { useEffect, useRef, useState, useCallback } from "react";
import Confetti from "../components/Confetti";
import ParticleField from "../components/ParticleField";
import SceneParallax from "../components/SceneParallax";
import AmbientAudio from "../components/AmbientAudio";
import BirthdayCake from "../components/BirthdayCake";
import SecretLetter from "../components/SecretLetter";
import PhotoGallery from "../components/PhotoGallery";
import Preloader from "../components/Preloader";
import FilmGrain from "../components/FilmGrain";

// ─── CUSTOMIZATION ─────────────────────────────────────────────────────────────
const name = "Buddy";
const friendshipYears = 3;
const videoId = "jfKfPfyJRdk"; // Replace with a YouTube video ID
const finalMessage = "From your friend, with all the respect in the world.";

const memories = [
  {
    text: "That trip we almost didn't take",
    subtext: "We were broke, tired, and somehow it became the best story we ever tell.",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=85",
    tag: "Adventure", year: "2022",
  },
  {
    text: "The 2AM conversation",
    subtext: "No sleep, terrible snacks, and we solved all the world's problems that night.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=85",
    tag: "Real Talk", year: "2023",
  },
  {
    text: "When you showed up without being asked",
    subtext: "That's when I knew. Some people just get it. You always get it.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=700&q=85",
    tag: "Loyalty", year: "2024",
  },
];
// ────────────────────────────────────────────────────────────────────────────────

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
const STATS = [
  { end: Math.round(friendshipYears * 365.25), label: "Days of friendship", suffix: "" },
  { end: friendshipYears, label: "Years together", suffix: "+" },
  { end: 47, label: "Memories made", suffix: "+" },
  { end: 100, label: "Real, always", suffix: "%" },
];

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

function StatItem({ end, label, suffix, active }: { end: number; label: string; suffix: string; active: boolean }) {
  const val = useCountUp(end, active);
  return (
    <div className="wf-stat-item">
      <span className="wf-stat-num">
        {val.toLocaleString()}{suffix}
      </span>
      <span className="wf-stat-label">{label}</span>
    </div>
  );
}

function FriendshipStats() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="wf-stats reveal" ref={ref}>
      <div className="wf-stats-grid">
        {STATS.map((s, i) => (
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
function useScrollGradient() {
  useEffect(() => {
    const root = document.documentElement;
    const fn = () => {
      const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-hue", String(Math.round(220 + p * 120)));
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
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
function YearsCounter() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const val = useCountUp(friendshipYears, active, 900);
  return (
    <div className="wf-counter" ref={ref}>
      <span className="wf-counter-num">{val}</span>
      <span className="wf-counter-label">years of real friendship</span>
    </div>
  );
}

/* ── Memory card ── */
function MemoryCard({ mem, i }: { mem: typeof memories[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return (
    <div
      className={`wf-memory-card reveal reveal--delay-${i}`}
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
function VideoMemory() {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="wf-video-section" ref={ref}>
      <p className="wf-section-label reveal">✦ a moment in motion</p>
      <h2 className="wf-section-title reveal">
        Some things are better<br /><em>seen than said</em>
      </h2>
      <div className={`wf-video-frame reveal ${loaded ? "loaded" : ""}`}>
        <div className="wf-video-corner wf-video-corner--tl" />
        <div className="wf-video-corner wf-video-corner--tr" />
        <div className="wf-video-corner wf-video-corner--bl" />
        <div className="wf-video-corner wf-video-corner--br" />
        {visible && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            title="Video Memory"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="wf-video-iframe"
            onLoad={() => setLoaded(true)}
          />
        )}
        {!loaded && visible && <div className="wf-video-loading"><div className="wf-video-spinner" /></div>}
        <div className="wf-video-overlay-text">
          <span>✦ replace with a personal video · swap the videoId above</span>
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

/* ── Main ── */
export default function WishFrame() {
  const [preloaded, setPreloaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  useScrollReveal();
  useScrollGradient();

  const handleBegin = useCallback(() => {
    setTimeout(() => storySectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

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
      {/* ── Cinematic preloader ── */}
      {!preloaded && <Preloader name={name} onDone={() => setPreloaded(true)} />}

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
          The chapters that<br /><em>made us</em>
        </h2>
        <YearsCounter />
        <div className="wf-memory-list">
          {memories.map((mem, i) => <MemoryCard key={i} mem={mem} i={i} />)}
        </div>
      </section>

      <Divider />

      {/* ── SECTION 3: FRIENDSHIP STATS ── */}
      <FriendshipStats />

      <Divider />

      {/* ── SECTION 4: PHOTO GALLERY ── */}
      <PhotoGallery />

      <Divider />

      {/* ── SECTION 5: VIDEO ── */}
      <VideoMemory />

      <Divider />

      {/* ── SECTION 6: EMOTIONAL BUILDUP ── */}
      <section className="wf-buildup">
        <ParticleField count={60} />
        <div className="wf-buildup-bg-orb wf-buildup-bg-orb--1" />
        <div className="wf-buildup-bg-orb wf-buildup-bg-orb--2" />
        <div className="wf-buildup-content">
          <p className="wf-buildup-pre reveal">✦ And then it hits you</p>
          <h2 className="wf-buildup-text reveal">
            Every late night,<br />every inside joke,<br />
            <em>every single moment —</em>
          </h2>
          <p className="wf-buildup-afterline reveal">led to right now.</p>
        </div>
      </section>

      <Divider />

      {/* ── SECTION 7: BIRTHDAY CAKE ── */}
      <section className="wf-cake-section">
        <p className="wf-section-label reveal">✦ make a wish</p>
        <h2 className="wf-section-title reveal">
          Three candles,<br /><em>one for each year</em>
        </h2>
        <div className="reveal"><BirthdayCake /></div>
      </section>

      <Divider />

      {/* ── SECTION 8: SECRET LETTER ── */}
      <SecretLetter />

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
            <span className="wf-birthday-name">{name}</span>
            <span className="wf-birthday-heart">🎂</span>
          </div>
          <p className="wf-final-msg">{finalMessage}</p>
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
          <span className="wf-btn-inner">✦ &nbsp;Create WishFrame</span>
          <span className="wf-btn-ring" />
        </a>
        <p className="wf-cta-footer reveal">Premium digital surprises · Starting ₹499</p>
        <div className="wf-logo reveal">
          <span className="wf-logo-star">✦</span> WishFrame
        </div>
      </section>
    </div>
  );
}
