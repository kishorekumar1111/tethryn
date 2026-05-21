import { useState, useEffect } from "react";

interface CandleProps {
  x: number;
  blown: boolean;
  onClick: () => void;
}

function Candle({ x, blown, onClick }: CandleProps) {
  return (
    <g onClick={onClick} style={{ cursor: blown ? "default" : "pointer" }}>
      {/* Candle body */}
      <rect x={x - 4} y={120} width={8} height={32} rx={3}
        fill={blown ? "#555" : "#f0d080"} />
      {/* Drip */}
      <ellipse cx={x} cy={126} rx={5} ry={3}
        fill={blown ? "#444" : "rgba(240,208,128,0.7)"} />
      {/* Wick */}
      <line x1={x} y1={120} x2={x} y2={114} stroke={blown ? "#333" : "#2a1a0a"} strokeWidth={1.5} />
      {/* Flame */}
      {!blown && (
        <g>
          <ellipse cx={x} cy={108} rx={5} ry={8}
            fill="rgba(255,160,30,0.9)"
            style={{ animation: "flameDance 0.4s ease-in-out infinite alternate" }}>
          </ellipse>
          <ellipse cx={x} cy={110} rx={3} ry={5}
            fill="rgba(255,220,80,0.95)"
            style={{ animation: "flameDance 0.3s ease-in-out infinite alternate-reverse" }}>
          </ellipse>
          <ellipse cx={x} cy={112} rx={1.5} ry={2.5} fill="#fffff0" />
          {/* Glow */}
          <ellipse cx={x} cy={108} rx={10} ry={12}
            fill="rgba(255,180,40,0.15)"
            style={{ animation: "glowPulse 0.8s ease-in-out infinite alternate" }}>
          </ellipse>
        </g>
      )}
      {/* Smoke when blown */}
      {blown && (
        <>
          <circle cx={x} cy={110} r={2} fill="rgba(200,200,200,0.5)"
            style={{ animation: "smokeRise 1s ease-out infinite" }} />
          <circle cx={x - 2} cy={106} r={1.5} fill="rgba(200,200,200,0.3)"
            style={{ animation: "smokeRise 1s ease-out 0.2s infinite" }} />
        </>
      )}
    </g>
  );
}

export default function BirthdayCake() {
  const [blown, setBlown] = useState([false, false, false]);
  const [allBlown, setAllBlown] = useState(false);
  const [wishShown, setWishShown] = useState(false);
  const [shakeText, setShakeText] = useState(false);

  const blowCandle = (i: number) => {
    if (blown[i] || allBlown) return;
    const next = [...blown];
    next[i] = true;
    setBlown(next);
    setShakeText(true);
    setTimeout(() => setShakeText(false), 600);
    if (next.every(Boolean)) {
      setTimeout(() => {
        setAllBlown(true);
        setWishShown(true);
      }, 600);
    }
  };

  return (
    <div className="wf-cake-wrap">
      <div className={`wf-cake-hint ${shakeText ? "shake" : ""}`}>
        {allBlown
          ? "🎉 All candles blown! Your wish is on its way..."
          : `Tap each candle to blow it out — ${blown.filter(Boolean).length}/3`}
      </div>

      <svg
        viewBox="0 40 280 220"
        className="wf-cake-svg"
        style={{ filter: "drop-shadow(0 10px 40px rgba(201,169,110,0.25))" }}
      >
        <defs>
          <linearGradient id="tier1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2a1a2e" />
            <stop offset="100%" stopColor="#1a0f20" />
          </linearGradient>
          <linearGradient id="tier2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1f1030" />
            <stop offset="100%" stopColor="#160a22" />
          </linearGradient>
          <linearGradient id="tier3" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#180c28" />
            <stop offset="100%" stopColor="#0f0716" />
          </linearGradient>
          <linearGradient id="frosting" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(240,208,128,0.8)" />
            <stop offset="50%" stopColor="rgba(255,230,160,0.9)" />
            <stop offset="100%" stopColor="rgba(240,208,128,0.8)" />
          </linearGradient>
        </defs>

        {/* ── Tier 3 (bottom) ── */}
        <rect x={20} y={190} width={240} height={55} rx={6} fill="url(#tier1)" />
        <path d="M20 196 Q 80 188 140 196 Q 200 204 260 196 L260 202 Q 200 210 140 202 Q 80 194 20 202 Z"
          fill="url(#frosting)" opacity="0.9" />
        {/* Gold dots */}
        {[50, 90, 130, 170, 210].map((x) => (
          <circle key={x} cx={x} cy={220} r={3} fill="rgba(240,208,128,0.4)" />
        ))}

        {/* ── Tier 2 (middle) ── */}
        <rect x={45} y={152} width={190} height={42} rx={5} fill="url(#tier2)" />
        <path d="M45 158 Q 95 150 140 158 Q 185 166 235 158 L235 164 Q 185 172 140 164 Q 95 156 45 164 Z"
          fill="url(#frosting)" opacity="0.85" />
        {[75, 110, 140, 170, 205].map((x) => (
          <circle key={x} cx={x} cy={175} r={2.5} fill="rgba(240,208,128,0.35)" />
        ))}

        {/* ── Tier 1 (top) ── */}
        <rect x={75} y={120} width={130} height={36} rx={4} fill="url(#tier3)" />
        <path d="M75 126 Q 110 118 140 126 Q 170 134 205 126 L205 132 Q 170 140 140 132 Q 110 124 75 132 Z"
          fill="url(#frosting)" opacity="0.8" />

        {/* ── Gold border decorations ── */}
        <rect x={20} y={190} width={240} height={2} rx={1} fill="rgba(201,169,110,0.4)" />
        <rect x={45} y={152} width={190} height={2} rx={1} fill="rgba(201,169,110,0.35)" />
        <rect x={75} y={120} width={130} height={2} rx={1} fill="rgba(201,169,110,0.3)" />

        {/* ── Candles ── */}
        <Candle x={110} blown={blown[0]} onClick={() => blowCandle(0)} />
        <Candle x={140} blown={blown[1]} onClick={() => blowCandle(1)} />
        <Candle x={170} blown={blown[2]} onClick={() => blowCandle(2)} />

        {/* ── "Happy Birthday" text on cake ── */}
        <text x={140} y={178} textAnchor="middle"
          fontSize="8" fontFamily="'Cormorant Garamond', serif"
          fill="rgba(240,208,128,0.7)" letterSpacing="1">
          Happy Birthday
        </text>
        <text x={140} y={230} textAnchor="middle"
          fontSize="9" fontFamily="'Cormorant Garamond', serif"
          fontStyle="italic"
          fill="rgba(240,208,128,0.5)" letterSpacing="1">
          make a wish
        </text>
      </svg>

      {wishShown && (
        <div className="wf-wish-reveal">
          <p className="wf-wish-text">
            "May this year bring you everything you deserve —<br />
            which is <em>everything.</em>"
          </p>
        </div>
      )}
    </div>
  );
}
