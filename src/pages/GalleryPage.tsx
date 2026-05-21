import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllTemplates } from '../templates/registry';

export default function GalleryPage() {
  const templates = getAllTemplates();
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Romantic', 'Cinematic', 'Minimal', 'Melodic'];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.schema.category === activeCategory;
    const matchesSearch = t.schema.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.schema.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-48 pb-64 px-8 min-h-screen bg-tethryn-bg relative">
      <div className="atmosphere" />
      <div className="noise" />
      
      <div className="max-w-[1720px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-48">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[13px] font-bold uppercase tracking-[1em] text-tethryn-accent mb-12 block"
          >
            TEMPLATE GALLERY
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2 }}
            className="text-8xl lg:text-9xl text-editorial mb-16"
          >
            Find your <br /> <span className="italic font-serif font-light text-tethryn-accent/15">Template.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-tethryn-muted text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-serif italic"
          >
            "Every template is designed to help you create something unforgettable. <br /> Choose one to begin your story."
          </motion.p>
          <div className="editorial-divider max-w-sm mx-auto mt-24 opacity-60" />
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32 border-b border-tethryn-border/30 pb-12">
          <div className="flex items-center space-x-12 overflow-x-auto w-full lg:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[12px] uppercase tracking-[0.4em] font-bold transition-all py-4 relative group ${
                  activeCategory === cat 
                    ? 'text-tethryn-accent' 
                    : 'text-tethryn-muted hover:text-tethryn-ink'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div layoutId="catUnderline" className="absolute bottom-0 left-0 right-0 h-px bg-tethryn-accent" />
                )}
              </button>
            ))}
          </div>
          
          <div className="relative w-full lg:w-[480px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-tethryn-accent/60 w-4 h-4" />
            <input 
              type="text" 
              placeholder="SEARCH TEMPLATES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-6 border border-tethryn-border rounded-[1.5rem] bg-white/40 backdrop-blur-3xl focus:border-tethryn-accent outline-none transition-all duration-500 text-[11px] font-bold tracking-[0.2em] text-tethryn-ink uppercase placeholder:text-tethryn-muted/30 shadow-premium"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
          {loading ? (
             <div className="col-span-full py-64 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-tethryn-accent mb-10" size={48} strokeWidth={1} />
                <p className="text-[12px] font-bold uppercase tracking-[0.8em] text-tethryn-muted animate-pulse">Loading Templates...</p>
             </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, idx) => (
                <motion.div
                  key={template.schema.id}
                  initial={{ opacity: 0, scale: 0.98, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-tethryn-secondary/10 shadow-premium border border-tethryn-border group-hover:border-tethryn-accent/20 transition-all duration-[1s] group-hover:-translate-y-2">
                    <img 
                      src={template.schema.previewImage} 
                      alt={template.schema.title}
                      className="w-full h-full object-cover transition-all duration-[8s] ease-out group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tethryn-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="absolute top-8 left-8">
                      <span className="px-5 py-3 bg-white/90 backdrop-blur-xl rounded-[1rem] text-tethryn-ink text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl border border-white/50">
                        {template.schema.category}
                      </span>
                    </div>

                    <div className="absolute inset-0 border-[24px] border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" />
                  </div>

                  <div className="pt-12 flex flex-col flex-1 pl-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-4xl font-display font-medium text-tethryn-ink group-hover:text-tethryn-accent transition-all duration-700 tracking-tight leading-none">{template.schema.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tethryn-accent animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-tethryn-muted/40">TPL_0{idx + 1}</span>
                      </div>
                    </div>
                    <p className="text-tethryn-muted text-lg leading-relaxed mb-12 font-serif italic opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                       {template.schema.description}
                    </p>
                    
                    <div className="mt-auto flex items-center space-x-12">
                      <Link
                        to={`/builder?template=${template.schema.id}`}
                        className="btn-premium px-12 py-6 text-[13px] group"
                      >
                         <span>CHOOSE</span>
                         <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                      <Link 
                        to={`/view/preview?template=${template.schema.id}`}
                        className="text-[12px] font-bold uppercase tracking-[0.4em] text-tethryn-muted hover:text-tethryn-ink transition-all relative after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-px after:bg-tethryn-accent after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform"
                      >
                        PREVIEW
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="py-80 text-center">
            <h3 className="text-5xl font-serif text-tethryn-muted/30 italic">No templates found.</h3>
            <button onClick={() => setSearchQuery('')} className="mt-12 btn-premium-secondary px-12 py-5 text-[12px]">RESET SEARCH</button>
          </div>
        )}
      </div>
    </div>
  );
}
