import { useEffect, useRef } from "react";

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const S = 200;
    canvas.width = S;
    canvas.height = S;
    let alive = true;

    const render = () => {
      const img = ctx.createImageData(S, S);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = (Math.random() * 18) | 0;
      }
      ctx.putImageData(img, 0, 0);
      if (alive) setTimeout(render, 80);
    };
    render();
    return () => { alive = false; };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="wf-film-grain"
      aria-hidden="true"
    />
  );
}
