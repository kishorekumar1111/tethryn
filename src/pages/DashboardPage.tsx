import { 
  Plus, 
  Settings,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Globe,
  Lock,
  Activity,
  BarChart3,
  Eye,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebase';
import { tethrynService } from '../services/tethrynService';
import { storageService } from '../services/storageService';
import { supabaseStorageService } from '../services/supabaseStorageService';
import { TethrynExperience } from '../types/tethryn';
import { useApp } from '../core/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardPage() {
  const { user, loading, experiences, refreshExperiences } = useApp();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'firebase' | 'supabase' | 'both' | 'inactive'>('checking');
  const [activeTab, setActiveTab] = useState<'stories' | 'drafts' | 'archived'>('stories');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkStorage() {
      if (!user) return;
      try {
        const isFirebaseActive = await storageService.testConnection();
        const isSupabaseActive = await supabaseStorageService.testConnection();
        
        if (isSupabaseActive && isFirebaseActive) setStorageStatus('both');
        else if (isSupabaseActive) setStorageStatus('supabase');
        else if (isFirebaseActive) setStorageStatus('firebase');
        else setStorageStatus('inactive');
      } catch {
        setStorageStatus('inactive');
      }
    }
    checkStorage();
  }, [user]);

  const totalViews = experiences.reduce((acc, exp) => acc + (exp.views || 0), 0);
  const publishedCount = experiences.filter(e => e.isPublished).length;

  const filteredExperiences = experiences.filter(exp => {
    if (activeTab === 'stories') return true; // Show all by default or exp.isPublished? Let's say all because maybe they want to see everything
    if (activeTab === 'drafts') return !exp.isPublished;
    if (activeTab === 'archived') return false; 
    return true;
  });

  const handleDuplicate = async (exp: TethrynExperience) => {
    const toastId = toast.loading("DUPLICATING...");
    try {
      const { id, createdAt, updatedAt, views, ...rest } = exp;
      const newSlug = `${rest.slug}-copy-${Math.random().toString(36).substring(7)}`;
      await tethrynService.create({
        ...rest,
        title: `${rest.title} (Clone)`,
        slug: newSlug,
      });
      toast.success("DUPLICATED SUCCESSFULLY", { id: toastId });
      refreshExperiences();
    } catch (error) {
      toast.error("FAILED TO DUPLICATE", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this memory? This cannot be undone.")) return;
    setIsDeleting(id);
    try {
      await tethrynService.delete(id);
      toast.success("DELETED SUCCESSFULLY");
      refreshExperiences();
    } catch (error) {
      toast.error("FAILED TO DELETE");
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = (exp: TethrynExperience) => {
    const url = `${window.location.origin}/t/${exp.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(exp.id!);
    toast.success("LINK COPIED TO CLIPBOARD");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!user && !loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-tethryn-bg px-6 text-center text-tethryn-ink overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-lg"
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.4em] text-tethryn-muted mb-8 block">Your Space</span>
          <h1 className="text-5xl lg:text-7xl font-sans font-bold mb-10 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-tethryn-ink to-tethryn-muted">
            Your <br /> <span className="italic font-serif font-medium opacity-80">Stories.</span>
          </h1>
          <p className="text-tethryn-muted mb-12 text-lg">
            A space to create unforgettable digital moments for the people you care about.
          </p>
          <button 
            onClick={signInWithGoogle} 
            className="btn-premium px-12 py-4 text-[14px]"
          >
            Sign in
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tethryn-bg text-tethryn-ink font-sans selection:bg-tethryn-accent/10 relative">
      <div className="atmosphere" />
      <div className="noise" />

      {/* Top Protocol Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/40 backdrop-blur-3xl border-b border-tethryn-border/30 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-10">
           <div className="flex items-center space-x-4">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
             <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-tethryn-muted">Connected</span>
           </div>
           <div className="h-4 w-px bg-tethryn-border/40" />
           <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-tethryn-ink/60">{user?.email}</span>
        </div>
        <div className="flex items-center space-x-8 opacity-40">
          <Activity size={14} strokeWidth={2.5} />
          <Lock size={14} strokeWidth={2.5} />
        </div>
      </div>

      <div className="max-w-[1720px] mx-auto pt-32 pb-40 px-8 lg:px-16">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="text-[13px] font-bold uppercase tracking-[0.8em] text-tethryn-accent block mb-8">YOUR SPACE</span>
            <h1 className="text-8xl lg:text-9xl text-editorial">
              Your <br /> <span className="italic font-serif font-light text-tethryn-accent/20">Memories.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-8"
          >
            <div className="px-12 py-8 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-premium">
               <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-tethryn-muted block mb-4">Views</span>
               <div className="flex items-baseline space-x-3">
                 <span className="text-5xl font-display font-medium tracking-tighter">{totalViews}</span>
                 <Eye size={16} className="text-tethryn-accent opacity-60" />
               </div>
            </div>
            <div className="px-12 py-8 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-premium">
               <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-tethryn-muted block mb-4">Stories</span>
               <div className="flex items-baseline space-x-3">
                 <span className="text-5xl font-display font-medium tracking-tighter">{experiences.length}</span>
                 <BarChart3 size={16} className="text-tethryn-accent opacity-60" />
               </div>
            </div>
          </motion.div>
        </header>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between py-12 mb-16 border-t border-tethryn-border/30 gap-10">
          <div className="flex items-center space-x-12">
            <button onClick={() => setActiveTab('stories')} className={`text-[13px] font-bold tracking-[0.3em] uppercase pb-2 transition-colors ${activeTab === 'stories' ? 'text-tethryn-ink border-b-2 border-tethryn-accent' : 'text-tethryn-muted hover:text-tethryn-ink'}`}>Stories</button>
            <button onClick={() => setActiveTab('drafts')} className={`text-[13px] font-bold tracking-[0.3em] uppercase pb-2 transition-colors ${activeTab === 'drafts' ? 'text-tethryn-ink border-b-2 border-tethryn-accent' : 'text-tethryn-muted hover:text-tethryn-ink'}`}>Drafts</button>
            <button onClick={() => setActiveTab('archived')} className={`text-[13px] font-bold tracking-[0.3em] uppercase pb-2 transition-colors ${activeTab === 'archived' ? 'text-tethryn-ink border-b-2 border-tethryn-accent' : 'text-tethryn-muted hover:text-tethryn-ink'}`}>Archived</button>
          </div>
          <Link 
            to="/gallery" 
            className="btn-premium px-12 py-6 text-[15px] shadow-2xl shadow-tethryn-accent/5"
          >
            <Plus size={20} strokeWidth={3} />
            <span>Create Story</span>
          </Link>
        </div>

        {/* Intelligence Grid */}
        {!loading && experiences.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-32 grid grid-cols-1 lg:grid-cols-4 gap-10"
          >
            <div className="lg:col-span-3 p-16 bg-white/40 backdrop-blur-3xl border border-tethryn-border/30 rounded-[3rem] relative overflow-hidden shadow-premium">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center space-x-5">
                       <Activity size={18} className="text-tethryn-accent" />
                       <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-tethryn-ink">Story Highlights</span>
                    </div>
                    <span className="text-[11px] font-mono text-tethryn-muted">LIVE</span>
                  </div>
                  <div className="h-48 flex items-end justify-between space-x-6">
                     {experiences.slice(0, 7).reverse().map((exp, i) => (
                       <div key={i} className="flex-1 flex flex-col items-center group">
                          <div className="text-[12px] font-mono text-tethryn-muted opacity-0 group-hover:opacity-100 transition-all duration-500 mb-4 transform translate-y-2 group-hover:translate-y-0">{(exp.views || 0)}</div>
                          <div 
                            className="w-full bg-tethryn-secondary/50 rounded-t-2xl group-hover:bg-tethryn-accent transition-all duration-700 ease-out" 
                            style={{ height: `${Math.max(10, Math.min(100, ((exp.views || 0) / (totalViews || 1)) * 400))}%` }} 
                          />
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tethryn-muted/30 mt-6 truncate w-full text-center group-hover:text-tethryn-ink transition-colors">{exp.slug}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 p-24 opacity-[0.03] pointer-events-none text-tethryn-ink transform rotate-12">
                  <BarChart3 size={320} />
               </div>
            </div>

            <div className="p-16 bg-[#0C0C0D] text-tethryn-bg rounded-[3rem] relative overflow-hidden shadow-2xl flex flex-col justify-between">
               <div className="relative z-10">
                  <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-tethryn-accent mb-12 block">TEMPLATE USAGE</span>
                  <div className="space-y-10">
                     {Array.from(new Set(experiences.map(e => e.templateId))).map(tId => (
                       <div key={tId} className="space-y-4">
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-tethryn-bg/40">
                             <span>{tId}</span>
                             <span className="text-tethryn-glow">{Math.round((experiences.filter(e => e.templateId === tId).length / experiences.length) * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 w-full rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${(experiences.filter(e => e.templateId === tId).length / experiences.length) * 100}%` }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full bg-tethryn-accent shadow-[0_0_12px_rgba(133,123,239,0.3)]" 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="absolute -bottom-[10%] -left-[10%] w-64 h-64 bg-tethryn-accent/20 blur-[100px] rounded-full" />
            </div>
          </motion.div>
        )}

        {/* Content Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white/20 rounded-[2.5rem] border border-tethryn-border animate-pulse" />
              ))
            ) : filteredExperiences.length === 0 ? (
              <div className="col-span-full py-64 card-premium flex flex-col items-center justify-center text-center bg-white/30 backdrop-blur-xl">
                 <div className="w-24 h-24 border border-tethryn-border/40 rounded-full flex items-center justify-center mb-10 bg-tethryn-secondary/40">
                    <Plus size={32} className="text-tethryn-muted opacity-20" />
                 </div>
                 <h3 className="text-4xl font-serif italic text-tethryn-muted opacity-40 mb-4">Begin your story.</h3>
                 <p className="text-[12px] uppercase font-bold tracking-[0.8em] text-tethryn-muted/30">Create something they'll always remember.</p>
              </div>
            ) : filteredExperiences.map((exp, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                key={exp.id} 
                className="card-premium group relative flex flex-col p-12 bg-white/40 backdrop-blur-xl border border-white/40 ring-1 ring-tethryn-border/10"
              >
                 <div className="flex justify-between items-start mb-12">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-tethryn-muted mb-2">Template</span>
                       <span className="text-[14px] font-display font-medium text-tethryn-ink">{exp.templateId}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center space-x-3 ${exp.isPublished ? 'bg-green-50/50 text-green-700 border border-green-100 shadow-sm' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${exp.isPublished ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)]' : 'bg-neutral-300'}`} />
                       <span>{exp.isPublished ? 'Active' : 'Draft'}</span>
                    </div>
                 </div>

                 <h3 className="text-4xl font-display font-medium mb-6 leading-tight tracking-tight text-tethryn-ink group-hover:text-tethryn-accent transition-all duration-700">
                   {exp.title}
                 </h3>
                 <div className="flex items-center space-x-3 text-[13px] text-tethryn-muted mb-16 font-serif italic">
                   <Globe size={14} className="opacity-40" />
                   <span className="opacity-60 group-hover:opacity-100 transition-opacity">/uplink/{exp.slug}</span>
                 </div>

                 <div className="mt-auto grid grid-cols-2 gap-6">
                    <button 
                      onClick={() => navigate(`/builder?id=${exp.id}`)}
                      className="btn-premium py-4 text-[13px]"
                    >
                      Edit Story
                    </button>
                    <button 
                      onClick={() => copyToClipboard(exp)}
                      className="btn-premium-secondary py-4 text-[13px] flex items-center justify-center space-x-3"
                    >
                      {copiedId === exp.id ? <Check size={16} strokeWidth={3} /> : <ArrowUpRight size={16} strokeWidth={3} />}
                      <span>{copiedId === exp.id ? 'Stored' : 'Share'}</span>
                    </button>
                 </div>
                 
                 <div className="mt-10 flex items-center justify-between pt-10 border-t border-tethryn-border/20">
                    <button 
                      onClick={() => handleDuplicate(exp)}
                      className="text-[12px] font-bold uppercase tracking-[0.2em] text-tethryn-muted hover:text-tethryn-ink transition-all flex items-center space-x-3"
                    >
                      <Copy size={14} strokeWidth={2.5} />
                      <span>Copy</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(exp.id!)}
                      disabled={isDeleting === exp.id}
                      className="text-[12px] font-bold uppercase tracking-[0.2em] text-tethryn-muted hover:text-red-500 transition-all flex items-center space-x-3"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                      <span>{isDeleting === exp.id ? 'Removing' : 'Delete'}</span>
                    </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Audit */}
        <footer className="mt-64 pt-16 border-t border-tethryn-border/20 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex items-center space-x-20">
              <div className="flex flex-col">
                 <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-tethryn-muted mb-3">Status</span>
                 <span className="text-[13px] font-display font-medium text-tethryn-ink">All systems operational</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-tethryn-muted mb-3">Version</span>
                 <span className="text-[13px] font-display font-medium text-tethryn-ink">Tethryn Platform</span>
              </div>
           </div>
           <div className="text-right">
             <span className="text-[12px] font-bold uppercase tracking-[0.6em] text-tethryn-muted">TETHRYN • MMXXIV</span>
           </div>
        </footer>
      </div>
    </div>
  );
}
