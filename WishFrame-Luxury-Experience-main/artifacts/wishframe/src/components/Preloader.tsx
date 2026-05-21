import { useEffect, useState } from "react";

interface PreloaderProps {
  name: string;
  onDone: () => void;
}

export default function Preloader({ name, onDone }: PreloaderProps) {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Typewriter for name
  useEffect(() => {
    if (phase < 2) return;
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setTyped(name.slice(0, i));
      if (i >= name.length) clearInterval(tick);
    }, 90);
    return () => clearInterval(tick);
  }, [phase, name]);

  useEffect(() => {
    if (phase < 2) return;
    // Wait for typing to finish + brief pause
    const delay = name.length * 90 + 700;
    const t3 = setTimeout(() => setPhase(3), delay);
    const t4 = setTimeout(() => setExiting(true), delay + 600);
    const t5 = setTimeout(() => onDone(), delay + 1400);
    return () => { clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [phase, name, onDone]);

  return (
    <div className={`wf-preloader ${exiting ? "exiting" : ""}`}>
      {/* Ambient orbs */}
      <div className="wf-pre-orb wf-pre-orb--1" />
      <div className="wf-pre-orb wf-pre-orb--2" />

      {/* Center content */}
      <div className="wf-pre-content">
        <span
          className="wf-pre-star"
          style={{ opacity: phase >= 1 ? 1 : 0 }}
        >✦</span>

        <div className="wf-pre-for" style={{ opacity: phase >= 2 ? 1 : 0 }}>
          a birthday surprise
        </div>

        <div className="wf-pre-name-wrap" style={{ opacity: phase >= 2 ? 1 : 0 }}>
          <span className="wf-pre-name">{typed}</span>
          <span className={`wf-pre-cursor ${typed.length >= name.length ? "done" : ""}`}>|</span>
        </div>

        <div className="wf-pre-sub" style={{ opacity: phase >= 3 ? 1 : 0 }}>
          crafted with love · just for you
        </div>
      </div>

      {/* Bottom progress line */}
      <div className="wf-pre-line">
        <div
          className="wf-pre-line-fill"
          style={{ width: phase >= 3 ? "100%" : phase >= 2 ? "65%" : phase >= 1 ? "30%" : "0%" }}
        />
      </div>
    </div>
  );
}
