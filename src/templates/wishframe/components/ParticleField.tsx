import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

export default function ParticleField({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const dots: Dot[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: 0.15 + Math.random() * 0.45,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.015,
    }));

    let alive = true;

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        d.pulse += d.pulseSpeed;

        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;

        const alpha = d.opacity * (0.6 + 0.4 * Math.sin(d.pulse));

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
        gradient.addColorStop(0, `rgba(201, 169, 110, ${alpha})`);
        gradient.addColorStop(1, `rgba(201, 169, 110, 0)`);
        ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
