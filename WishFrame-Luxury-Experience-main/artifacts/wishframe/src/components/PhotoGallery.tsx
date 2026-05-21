import { useState, useRef } from "react";

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&q=80",
    caption: "Us being us 📸",
    rotate: -3,
  },
  {
    src: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=500&q=80",
    caption: "Golden hour forever ✨",
    rotate: 2,
  },
  {
    src: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=500&q=80",
    caption: "Worth every mile 🚗",
    rotate: -1.5,
  },
  {
    src: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=500&q=80",
    caption: "Nights we won't forget 🌙",
    rotate: 3,
  },
  {
    src: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&q=80",
    caption: "Still can't believe this 📖",
    rotate: -2,
  },
  {
    src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80",
    caption: "Pure joy 🎉",
    rotate: 1.5,
  },
];

export default function PhotoGallery() {
  const [active, setActive] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reveal photos one by one on scroll into view
  const obsRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setupObs = () => {
    if (obsRef.current) return;
    obsRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setRevealed((prev) => prev.includes(idx) ? prev : [...prev, idx]);
          }
        });
      },
      { threshold: 0.2 }
    );
    itemRefs.current.forEach((el) => { if (el) obsRef.current!.observe(el); });
  };

  return (
    <section className="wf-gallery-section">
      <p className="wf-section-label reveal" style={{ textAlign: "center" }}>✦ a gallery of us</p>
      <h2 className="wf-section-title reveal" style={{ textAlign: "center" }}>
        Moments that<br /><em>live forever</em>
      </h2>

      <div
        className="wf-gallery-grid"
        ref={(el) => { if (el) { (containerRef as any).current = el; setupObs(); } }}
      >
        {PHOTOS.map((photo, i) => {
          const isRevealed = revealed.includes(i);
          const isActive = active === i;
          return (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              data-idx={i}
              className={`wf-polaroid ${isRevealed ? "wf-polaroid--revealed" : ""} ${isActive ? "wf-polaroid--active" : ""}`}
              style={{
                "--rot": `${photo.rotate}deg`,
                "--delay": `${i * 0.12}s`,
              } as React.CSSProperties}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="wf-polaroid-img-wrap">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="wf-polaroid-img"
                  loading="lazy"
                />
                <div className="wf-polaroid-film" />
              </div>
              <p className="wf-polaroid-caption">{photo.caption}</p>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div className="wf-lightbox" onClick={() => setActive(null)}>
          <div className="wf-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[active].src.replace("w=500", "w=1200")} alt="" className="wf-lightbox-img" />
            <p className="wf-lightbox-caption">{PHOTOS[active].caption}</p>
            <button className="wf-lightbox-close" onClick={() => setActive(null)}>✕</button>
          </div>
        </div>
      )}
    </section>
  );
}
