import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  opacity: number;
  trail: number;
  active: boolean;
  life: number;
  maxLife: number;
}

function createStar(w: number, h: number): Star {
  const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
  return {
    x: Math.random() * w,
    y: Math.random() * h * 0.5,
    len: 80 + Math.random() * 160,
    speed: 8 + Math.random() * 14,
    angle,
    opacity: 0.8 + Math.random() * 0.2,
    trail: 0,
    active: true,
    life: 0,
    maxLife: 60 + Math.random() * 40,
  };
}

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const stars: Star[] = [];
    let frame = 0;
    let alive = true;

    const spawnInterval = 220; // frames between spawns

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, w, h);

      // Spawn new shooting star
      if (frame % spawnInterval === 0) {
        stars.push(createStar(w, h));
      }

      // Draw and update stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const progress = s.life / s.maxLife;
        const alpha = s.opacity * (1 - progress);

        if (alpha <= 0 || s.x > w + 200 || s.y > h + 200) {
          stars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(240,208,128,0)`);
        grad.addColorStop(0.7, `rgba(240,208,128,${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head glow
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
        glow.addColorStop(0, `rgba(255,255,220,${alpha})`);
        glow.addColorStop(1, `rgba(255,255,220,0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(draw);
    };

    const raf = requestAnimationFrame(draw);

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
