import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface GalleryItem {
  image?: string;
  caption?: string;
  date?: string;
}

interface PhotoGalleryProps {
  galleryTitle?: string;
  galleryItems?: GalleryItem[];
}

export default function PhotoGallery({ galleryTitle, galleryItems = [] }: PhotoGalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback items if none provided
  const items = galleryItems.length > 0 ? galleryItems : [
    { image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&q=80", caption: "Us being us 📸" },
    { image: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=500&q=80", caption: "Golden hour forever ✨" }
  ];

  // Deterministic stagger rotation based on index
  const getRotation = (i: number) => {
    const rots = [-3, 2, -1.5, 3, -2, 1.5];
    return rots[i % rots.length];
  };

  return (
    <section className="wf-gallery-section" ref={containerRef}>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="wf-section-label" 
        style={{ textAlign: "center" }}
      >
        ✦ a gallery of us
      </motion.p>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="wf-section-title" 
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        {galleryTitle ? galleryTitle.split('\n').map((line: string, i: number, arr: string[]) => (
          <React.Fragment key={i}>
            {i === arr.length - 1 ? <em>{line}</em> : <>{line}<br /></>}
          </React.Fragment>
        )) : (
          <>Moments that<br /><em>live forever</em></>
        )}
      </motion.h2>

      <div className="wf-gallery-grid">
        {items.map((photo, i) => {
          const isActive = active === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: getRotation(i) }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
                delay: (i % 3) * 0.15
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0, 
                zIndex: 10,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className={`wf-polaroid ${isActive ? "wf-polaroid--active" : ""}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="wf-polaroid-img-wrap">
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="wf-polaroid-img"
                  loading="lazy"
                />
                <div className="wf-polaroid-film" />
              </div>
              <p className="wf-polaroid-caption">{photo.caption}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="wf-lightbox" 
            onClick={() => setActive(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="wf-lightbox-inner" 
              onClick={(e) => e.stopPropagation()}
            >
              <img src={items[active].image?.replace("w=500", "w=1200")} alt="" className="wf-lightbox-img" />
              <p className="wf-lightbox-caption">{items[active].caption}</p>
              <button className="wf-lightbox-close" onClick={() => setActive(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
