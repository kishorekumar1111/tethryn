import { motion } from 'motion/react';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { auth, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const navLinks = [
    { name: 'Collections', path: '/gallery' },
    { name: 'Studio', path: '/builder' },
    { name: 'Vault', path: '/dashboard' },
    ...(user?.email === 'kkmusiqyt@gmail.com' ? [{ name: 'Lab Core', path: '/admin' }] : []),
  ];

  const isViewPage = location.pathname.startsWith('/t/') || location.pathname.startsWith('/view/');

  if (isViewPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-tethryn-bg/90 backdrop-blur-3xl border-b border-tethryn-border/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center group">
              <span className="font-sans text-2xl font-bold tracking-tighter text-tethryn-ink">
                Tethryn<span className="italic font-serif font-medium text-tethryn-accent ml-px">.</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "text-[12px] font-bold uppercase tracking-widest transition-all",
                    location.pathname === link.path ? "text-tethryn-accent" : "text-tethryn-muted hover:text-tethryn-ink"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full border border-tethryn-border p-0.5 overflow-hidden group-hover:border-tethryn-accent transition-all">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-[12px] font-medium text-tethryn-ink">Vault</span>
                </Link>
                <button 
                  onClick={() => signOut(auth)}
                  className="text-tethryn-muted hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center space-x-2 text-[12px] font-medium text-tethryn-ink hover:text-tethryn-accent transition-colors"
              >
                <UserIcon size={14} />
                <span>Sign In</span>
              </button>
            )}
            <Link 
              to="/builder"
              className="btn-premium"
            >
              Compose
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-tethryn-ink">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-tethryn-card border-b border-tethryn-border"
        >
          <div className="px-6 pt-2 pb-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-4 text-sm font-medium text-tethryn-muted hover:text-tethryn-ink hover:bg-tethryn-secondary rounded-lg transition-all"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/builder"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-4 btn-premium mt-4"
            >
              Compose Studio
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
