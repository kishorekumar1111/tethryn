import { motion } from 'motion/react';
import { Sparkles, Heart, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-tethryn-bg">
      <div className="atmosphere" />
      <div className="noise" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-tethryn-accent mb-6 block">Our Story</span>
            <h1 className="text-6xl lg:text-8xl font-serif text-tethryn-ink mb-12 leading-tight">Moments <br /> that <span className="italic">matter.</span></h1>
            <p className="text-lg text-tethryn-muted leading-relaxed font-serif italic max-w-lg">
              Tethryn was founded on a simple belief: our digital memories should feel as special as the moments they represent. We make it easy to create beautiful, personal experiences for the people you care about.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="aspect-[4/3] bg-tethryn-secondary/50 relative overflow-hidden rounded-[2rem] shadow-premium"
          >
             <img 
               src="https://images.unsplash.com/photo-1490260400179-d656f04de422?auto=format&fit=crop&q=80&w=2000" 
               className="w-full h-full object-cover grayscale opacity-60"
               alt="Cinematic background"
             />
             <div className="absolute inset-0 bg-tethryn-accent/5 mix-blend-multiply" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-tethryn-border border border-tethryn-border mb-32 rounded-3xl overflow-hidden">
           {[
             { icon: Heart, title: "Thoughtful", desc: "Designed to help you say exactly what you mean." },
             { icon: Shield, title: "Private", desc: "Your memories are safe, secure, and only for those you choose." },
             { icon: Globe, title: "Connected", desc: "Bringing people closer together through shared stories." }
           ].map((feature, i) => (
             <div key={i} className="bg-white p-12 hover:bg-tethryn-bg transition-colors">
                <feature.icon size={24} className="text-tethryn-accent mb-8" />
                <h3 className="text-xl font-serif mb-4 text-tethryn-ink">{feature.title}</h3>
                <p className="text-xs text-tethryn-muted leading-relaxed font-medium uppercase tracking-wider">{feature.desc}</p>
             </div>
           ))}
        </div>

        <div className="text-center py-24 border-t border-tethryn-border/40">
           <Sparkles className="mx-auto text-tethryn-accent/20 mb-8" size={40} strokeWidth={1} />
           <p className="max-w-2xl mx-auto text-tethryn-muted text-sm font-medium leading-relaxed italic">
             "We believe your memories deserve a beautiful home. A place where stories are told, felt, and remembered."
           </p>
           <p className="mt-8 text-[9px] font-black uppercase tracking-[0.4em] text-tethryn-accent">— TETHRYN TEAM</p>
        </div>
      </div>
    </div>
  );
}
