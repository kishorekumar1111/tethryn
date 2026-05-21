import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-tethryn-bg px-6 relative overflow-hidden">
      <div className="atmosphere" />
      <div className="noise" />
      <div className="text-center max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[120px] font-serif italic text-tethryn-accent/10 leading-none">404</span>
          <h1 className="text-4xl font-serif text-tethryn-ink mt-4 mb-6 italic">We couldn't find that page.</h1>
          <p className="text-tethryn-muted text-sm font-medium tracking-tight mb-12 leading-relaxed opacity-80">
            The story or page you are looking for does not exist or has been moved.
          </p>
          
          <Link 
            to="/" 
            className="btn-premium inline-flex px-10 py-5 text-[11px]"
          >
            <ArrowLeft size={14} />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
