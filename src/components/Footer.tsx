import { Gift, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-tethryn-bg border-t border-tethryn-border/60 py-32 px-6 dot-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-serif text-tethryn-ink tracking-tighter">
              Tethryn<span className="text-tethryn-accent">.</span>
            </Link>
            <p className="mt-8 text-tethryn-muted text-sm max-w-sm leading-relaxed italic opacity-80">
              Crafting high-fidelity digital surprise experiences for the modern romantic and visual storyteller.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-tethryn-muted/60 mb-8">Folio</h4>
            <ul className="space-y-4">
              {['Signature Showcase', 'Template Library', 'Design Principles', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-tethryn-ink hover:text-tethryn-accent transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-tethryn-muted/60 mb-8">Narrative</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-[11px] font-bold uppercase tracking-widest text-tethryn-ink hover:text-tethryn-accent transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-[11px] font-bold uppercase tracking-widest text-tethryn-ink hover:text-tethryn-accent transition-colors">
                  Privacy Folio
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-[11px] font-bold uppercase tracking-widest text-tethryn-ink hover:text-tethryn-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-[11px] font-bold uppercase tracking-widest text-tethryn-ink hover:text-tethryn-accent transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter / Bottom */}
        <div className="pt-24 border-t border-tethryn-border/40 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="max-w-md w-full">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-tethryn-muted/60 mb-6">The Journal</h4>
            <div className="flex border-b border-tethryn-border focus-within:border-tethryn-accent transition-all">
              <input 
                type="email" 
                placeholder="YOUR EMAIL IDENTITY..."
                className="w-full py-4 text-[10px] font-bold tracking-widest uppercase outline-none bg-transparent placeholder:text-tethryn-muted/40"
              />
              <button className="text-[10px] font-bold uppercase tracking-widest px-6 hover:text-tethryn-accent transition-colors">Join</button>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex space-x-8 mb-6 text-tethryn-muted/40">
              <Instagram size={18} className="hover:text-tethryn-accent cursor-pointer transition-colors" />
              <Twitter size={18} className="hover:text-tethryn-accent cursor-pointer transition-colors" />
              <Facebook size={18} className="hover:text-tethryn-accent cursor-pointer transition-colors" />
            </div>
            <p className="text-[9px] font-bold text-tethryn-muted/40 uppercase tracking-widest">
              © {new Date().getFullYear()} Tethryn Institute. All Significant Moments Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
