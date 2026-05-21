import { useEffect, useRef, useState, useCallback } from "react";
import ParticleField from "./ParticleField";
import ShootingStars from "./ShootingStars";

interface SceneParallaxProps {
  onBegin: () => void;
}

/* ── SVG silhouette shapes ─────────────────────────────── */

function MountainsLeft() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="wf-scene-svg wf-scene-svg--mountains-left">
      {/* Far peak */}
      <path d="M -60 420 L 130 90 L 240 200 L 330 420 Z" fill="rgba(20,14,38,0.85)" />
      {/* Near peak */}
      <path d="M -80 420 L 180 40 L 310 150 L 430 420 Z" fill="rgba(15,10,28,0.9)" />
      {/* Mist overlap */}
      <path d="M -80 380 Q 100 300 350 380 L 350 420 L -80 420 Z" fill="rgba(10,8,20,0.6)" />
    </svg>
  );
}

function MountainsRight() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="wf-scene-svg wf-scene-svg--mountains-right">
      <path d="M 580 420 L 390 90 L 280 200 L 190 420 Z" fill="rgba(20,14,38,0.85)" />
      <path d="M 600 420 L 340 40 L 210 150 L 90 420 Z" fill="rgba(15,10,28,0.9)" />
      <path d="M 600 380 Q 400 300 150 380 L 150 420 L 600 420 Z" fill="rgba(10,8,20,0.6)" />
    </svg>
  );
}

function TreesLeft() {
  return (
    <svg viewBox="0 0 300 480" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="wf-scene-svg wf-scene-svg--trees-left">
      <rect x="82" y="300" width="18" height="180" fill="rgba(8,6,16,0.95)" />
      <polygon points="45,310 91,80 137,310" fill="rgba(12,8,24,0.95)" />
      <polygon points="30,350 91,160 152,350" fill="rgba(8,6,16,0.9)" />
      <rect x="170" y="340" width="14" height="140" fill="rgba(8,6,16,0.95)" />
      <polygon points="135,348 177,148 219,348" fill="rgba(10,7,20,0.92)" />
      <rect x="20" y="360" width="10" height="120" fill="rgba(8,6,16,0.95)" />
      <polygon points="-8,368 25,218 58,368" fill="rgba(10,7,20,0.9)" />
    </svg>
  );
}

function TreesRight() {
  return (
    <svg viewBox="0 0 300 480" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="wf-scene-svg wf-scene-svg--trees-right">
      <rect x="200" y="300" width="18" height="180" fill="rgba(8,6,16,0.95)" />
      <polygon points="165,310 209,80 255,310" fill="rgba(12,8,24,0.95)" />
      <polygon points="148,350 209,160 270,350" fill="rgba(8,6,16,0.9)" />
      <rect x="116" y="340" width="14" height="140" fill="rgba(8,6,16,0.95)" />
      <polygon points="81,348 123,148 165,348" fill="rgba(10,7,20,0.92)" />
      <rect x="270" y="360" width="10" height="120" fill="rgba(8,6,16,0.95)" />
      <polygon points="242,368 275,218 308,368" fill="rgba(10,7,20,0.9)" />
    </svg>
  );
}

function ArchLeft() {
  return (
    <svg viewBox="0 0 260 500" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="wf-scene-svg wf-scene-svg--arch-left">
      <path d="M -20 500 L -20 180 Q -20 20 140 20 L 140 500 Z"
        fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth="1.5" />
      <path d="M 20 500 L 20 200 Q 20 60 160 60 L 160 500 Z"
        fill="rgba(7,7,14,0.9)" />
      <line x1="-20" y1="220" x2="80" y2="220" stroke="rgba(201,169,110,0.08)" strokeWidth="1" />
      <line x1="-20" y1="280" x2="60" y2="280" stroke="rgba(201,169,110,0.06)" strokeWidth="1" />
      <line x1="-20" y1="340" x2="30" y2="340" stroke="rgba(201,169,110,0.05)" strokeWidth="1" />
    </svg>
  );
}

function ArchRight() {
  return (
    <svg viewBox="0 0 260 500" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="wf-scene-svg wf-scene-svg--arch-right">
      <path d="M 280 500 L 280 180 Q 280 20 120 20 L 120 500 Z"
        fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth="1.5" />
      <path d="M 240 500 L 240 200 Q 240 60 100 60 L 100 500 Z"
        fill="rgba(7,7,14,0.9)" />
      <line x1="280" y1="220" x2="180" y2="220" stroke="rgba(201,169,110,0.08)" strokeWidth="1" />
      <line x1="280" y1="280" x2="200" y2="280" stroke="rgba(201,169,110,0.06)" strokeWidth="1" />
      <line x1="280" y1="340" x2="230" y2="340" stroke="rgba(201,169,110,0.05)" strokeWidth="1" />
    </svg>
  );
}

function Moon() {
  return (
    <div className="wf-moon">
      <div className="wf-moon-core" />
      <div className="wf-moon-halo" />
    </div>
  );
}

/* ── Text phases ─────────────────────────────────────────── */
const TEXT_PHASES = [
  {
    label: "✦  a surprise was built for you",
    heading: ["Something special", "was waiting for you…"],
    sub: null,
  },
  {
    label: "✦  a friend like no other",
    heading: ["A real one.", "Someone who gets it."],
    sub: "This is for you, Buddy.",
  },
  {
    label: "✦  your surprise is here",
    heading: ["Your birthday", "experience begins now."],
    sub: null,
    cta: true,
  },
];

export default function SceneParallax({ onBegin }: SceneParallaxProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1 across scroll
  const [phase, setPhase] = useState(0);        // which text phase
  const rafRef = useRef<number>(0);
  const progRef = useRef(0);
  const autoScrolledRef = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const scrollableHeight = wrap.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = scrollableHeight > 0
        ? Math.max(0, Math.min(1, scrolled / scrollableHeight))
        : 0;
      progRef.current = p;
      setProgress(p);
      if (p < 0.33) setPhase(0);
      else if (p < 0.70) setPhase(1);
      else setPhase(2);

      // Auto-advance to memories section once user reaches end of parallax
      if (p >= 0.94 && !autoScrolledRef.current) {
        autoScrolledRef.current = true;
        if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
        autoTimerRef.current = setTimeout(() => {
          if (progRef.current >= 0.94) onBegin();
        }, 350);
      }
    });
  }, [onBegin]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  /* Layer parallax values */
  const p = progress;
  const ease = (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const ep = ease(Math.min(p, 1));

  /* Mountains: start 60vw offscreen each side → converge but never fully close */
  const mtnX = (1 - ep * 0.7) * 55; // vw units
  const mtnY = ep * -80;             // px upward drift

  /* Trees: more aggressive lateral movement */
  const treeX = (1 - ep * 0.85) * 72;
  const treeY = ep * -180;

  /* Arches: come in on last third */
  const archP = Math.max(0, (p - 0.55) / 0.45);
  const archX = (1 - ease(archP)) * 45;
  const archY = ease(archP) * -20;

  /* Moon: slow upward drift + scale */
  const moonY = ep * -120;
  const moonScale = 0.6 + ep * 0.5;

  /* Fade out whole scene content as scroll nears 100% */
  const exitOpacity = p > 0.86 ? Math.max(0, 1 - (p - 0.86) / 0.14) : 1;

  /* Text transitions */
  const textOpacity = (ph: number) => {
    if (ph < phase) return 0;
    if (ph > phase) return 0;
    return 1;
  };
  const textY = (ph: number) => {
    if (ph < phase) return -20;
    if (ph > phase) return 20;
    return 0;
  };

  /* Background sky color */
  const skyColors = [
    [7, 7, 14, 11, 7, 28],
    [10, 7, 22, 18, 8, 40],
    [12, 6, 22, 24, 8, 42],
  ];
  const ci = Math.min(2, phase);
  const [r1, g1, b1, r2, g2, b2] = skyColors[ci];
  const skyBg = `linear-gradient(180deg, rgb(${r1},${g1},${b1}) 0%, rgb(${r2},${g2},${b2}) 100%)`;

  return (
    <div className="wf-parallax-wrap" ref={wrapRef}>
      <div className="wf-parallax-sticky" ref={stickyRef} style={{ background: skyBg }}>

        {/* Stars */}
        <ParticleField count={65} />

        {/* Shooting stars */}
        <ShootingStars />

        {/* Moon */}
        <div style={{ transform: `translateY(${moonY}px) scale(${moonScale})`, transition: "transform 0.1s linear" }}>
          <Moon />
        </div>

        {/* ── Mountains ── */}
        <div className="wf-layer wf-layer--mountains-left"
          style={{ transform: `translateX(${-mtnX}vw) translateY(${mtnY}px)` }}>
          <MountainsLeft />
        </div>
        <div className="wf-layer wf-layer--mountains-right"
          style={{ transform: `translateX(${mtnX}vw) translateY(${mtnY}px)` }}>
          <MountainsRight />
        </div>

        {/* ── Trees ── */}
        <div className="wf-layer wf-layer--trees-left"
          style={{ transform: `translateX(${-treeX}vw) translateY(${treeY}px)` }}>
          <TreesLeft />
        </div>
        <div className="wf-layer wf-layer--trees-right"
          style={{ transform: `translateX(${treeX}vw) translateY(${treeY}px)` }}>
          <TreesRight />
        </div>

        {/* ── Arches (phase 3) ── */}
        <div className="wf-layer wf-layer--arch-left"
          style={{ transform: `translateX(${-archX}vw) translateY(${archY}px)`, opacity: ease(archP) }}>
          <ArchLeft />
        </div>
        <div className="wf-layer wf-layer--arch-right"
          style={{ transform: `translateX(${archX}vw) translateY(${archY}px)`, opacity: ease(archP) }}>
          <ArchRight />
        </div>

        {/* ── Horizon glow ── */}
        <div className="wf-horizon-glow" style={{ opacity: 0.3 + ep * 0.7 }} />

        {/* ── Text overlay ── */}
        <div className="wf-scene-text-wrap" style={{ opacity: exitOpacity, transition: "opacity 0.3s linear" }}>
          {TEXT_PHASES.map((ph, i) => (
            <div
              key={i}
              className="wf-scene-text"
              style={{
                opacity: textOpacity(i),
                transform: `translateY(${textY(i)}px)`,
                pointerEvents: i === phase ? "auto" : "none",
              }}
            >
              <p className="wf-scene-label">{ph.label}</p>
              <h1 className="wf-scene-heading">
                {ph.heading[0]}<br />
                <em>{ph.heading[1]}</em>
              </h1>
              {ph.sub && <p className="wf-scene-sub">{ph.sub}</p>}
              {ph.cta && (
                <button className="wf-glow-btn wf-scene-cta" onClick={onBegin}>
                  <span className="wf-btn-inner">Begin the Experience</span>
                  <span className="wf-btn-ring" />
                  <span className="wf-btn-ring wf-btn-ring--2" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Scroll indicator ── */}
        <div className="wf-scene-scroll" style={{ opacity: p < 0.08 ? 1 : 0 }}>
          <div className="wf-scroll-mouse"><div className="wf-scroll-wheel" /></div>
          <span className="wf-scroll-text">scroll</span>
        </div>

        {/* ── Progress bar ── */}
        <div className="wf-scene-progress">
          <div className="wf-scene-progress-fill" style={{ width: `${p * 100}%` }} />
        </div>

        {/* ── Phase dots ── */}
        <div className="wf-phase-dots">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`wf-phase-dot ${i === phase ? "active" : ""}`} />
          ))}
        </div>

      </div>
    </div>
  );
}
