import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Send, 
  Sparkles,
  RefreshCw,
  Globe,
  Settings,
  Cpu,
  Activity,
  Layers,
  Zap,
  ArrowLeft,
  ChevronRight,
  Maximize2,
  Smartphone,
  ShieldCheck,
  Check,
  Loader2
} from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { signInWithGoogle } from '../lib/firebase';
import { getTemplateById, getAllTemplates } from '../templates/registry';
import { TemplateRenderer } from '../core/renderer/TemplateRenderer';
import { DynamicFormBuilder } from '../core/builder/DynamicFormBuilder';
import { tethrynService } from '../services/tethrynService';
import { geminiService } from '../services/geminiService';
import { useApp } from '../core/AppContext';

export default function BuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: isAuthLoading, refreshExperiences } = useApp();
  const initialTemplateId = searchParams.get('template') || 'memory-bloom';
  const experienceId = searchParams.get('id');
  
  const initialTemplate = getTemplateById(initialTemplateId) || getAllTemplates()[0];
  const [template, setTemplate] = useState(initialTemplate);
  const [content, setContent] = useState<Record<string, any>>(initialTemplate?.defaults || {});
  const [metadata, setMetadata] = useState({
    title: '',
    slug: Math.random().toString(36).substring(7),
    isPublished: true,
  });

  const [activeTab, setActiveTab] = useState<'content' | 'aesthetic' | 'protocol'>('content');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviewUnwrapped, setIsPreviewUnwrapped] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'phone' | 'full'>('phone');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!experienceId);

  // Load existing experience if ID provided
  useEffect(() => {
    async function loadExperience() {
      if (!experienceId) return;
      setIsLoading(true);
      try {
        const exp = await tethrynService.getById(experienceId);
        if (exp) {
          const t = getTemplateById(exp.templateId);
          if (t) {
            setTemplate(t);
            setContent({ ...t.defaults, ...exp.content });
          }
          setMetadata({
            title: exp.title,
            slug: exp.slug,
            isPublished: exp.isPublished
          });
        }
      } catch (err) {
        toast.error("Failed to load experience");
      } finally {
        setIsLoading(false);
      }
    }
    if (!isAuthLoading) loadExperience();
  }, [experienceId, isAuthLoading]);

  const handleUpdateContent = (key: string, value: any) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateChange = (id: string) => {
    const t = getTemplateById(id);
    if (!t) return;
    setTemplate(t);
    setContent(prev => ({ ...t.defaults, ...prev }));
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error("Identity verification required for deployment");
      return;
    }
    setIsPublishing(true);
    try {
      const data = {
        templateId: template.schema.id,
        title: metadata.title || (content.title as string) || 'A Tethryn Experience',
        recipientName: (content.recipientName as string) || '',
        senderName: (content.senderName as string) || '',
        slug: metadata.slug,
        content: content,
        isPublished: metadata.isPublished,
      };

      let id = experienceId;
      if (id) {
        await tethrynService.update(id, data);
      } else {
        id = await tethrynService.create(data);
      }
      
      if (id) {
        setPublishedId(id);
        setShowPublishModal(true);
        refreshExperiences();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#1A1A1A', '#FAF9F6']
        });
      }
    } catch (error) {
      toast.error("Failed to publish experience");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAIRefine = async (targetKey: string) => {
    const currentVal = (content[targetKey] || '') as string;
    const recipient = (content.recipientName as string) || 'Beloved';
    const sender = (content.senderName as string) || 'Partner';

    let promptContext = currentVal;
    if (targetKey === 'all') {
      const userPrompt = window.prompt("Tell the AI a little about your story:");
      if (!userPrompt) return;
      promptContext = userPrompt;
    }

    setIsRefining(true);
    try {
      const refined = await geminiService.refineStoryContent(
        template?.schema.id || 'default', 
        metadata.title || template?.schema.title || 'Untitled', 
        recipient, 
        promptContext,
        targetKey,
        sender
      );
      
      setContent(prev => ({ ...prev, ...refined }));
      toast.success("Synthesis complete");
    } catch (error) {
      toast.error("AI engine unavailable");
    } finally {
      setIsRefining(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-tethryn-bg text-tethryn-ink">
        <Loader2 className="animate-spin text-tethryn-accent mb-6" size={40} />
        <span className="text-[11px] font-bold uppercase tracking-[0.4em] animate-pulse">Loading Studio...</span>
      </div>
    );
  }

  if (!user && !isAuthLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-tethryn-bg text-tethryn-ink p-10 text-center">
        <ShieldCheck className="text-tethryn-muted/20 mb-8" size={64} />
        <h2 className="text-2xl font-sans font-bold mb-4">Sign In Required</h2>
        <p className="text-tethryn-muted text-sm max-w-md mb-8">Please sign in with your Google account to create your story.</p>
        <button onClick={signInWithGoogle} className="btn-premium px-10 py-4">
          Sign In
        </button>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-tethryn-bg text-tethryn-ink p-10 text-center">
        <Layers className="text-tethryn-muted/20 mb-8" size={64} />
        <h2 className="text-2xl font-sans font-bold mb-4">Template Not Found</h2>
        <p className="text-tethryn-muted text-sm max-w-md mb-8">The template you're looking for couldn't be found.</p>
        <Link to="/dashboard" className="btn-premium-secondary px-10 py-4">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 h-screen overflow-hidden bg-tethryn-bg flex flex-col md:flex-row text-tethryn-ink selection:bg-tethryn-accent/10 relative">
      <div className="atmosphere pointer-events-none" />
      <div className="noise pointer-events-none" />
      
      {/* Editorial Sidebar */}
      <div className={`w-full md:w-[480px] bg-white/40 backdrop-blur-3xl border-r border-tethryn-border/30 flex flex-col h-full z-20 shadow-premium ${isPreviewMode ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Unit Header */}
        <div className="p-8 border-b border-tethryn-border/30 flex items-center justify-between">
          <div className="flex items-center space-x-6">
             <div className="w-12 h-12 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[1.2rem] flex items-center justify-center shadow-premium">
                <Layers size={20} className="text-tethryn-accent" />
             </div>
             <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-tethryn-accent block mb-1">YOUR STORY</span>
                <h2 className="text-2xl font-display font-medium tracking-tight text-tethryn-ink leading-none">{template.schema.title}</h2>
             </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-12 h-12 flex items-center justify-center text-tethryn-muted hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <ArrowLeft size={22} />
          </button>
        </div>

        {/* System Tabs */}
        <div className="flex border-b border-tethryn-border/30 px-8">
           {[
             { id: 'content', label: 'Story', icon: Activity },
             { id: 'aesthetic', label: 'Template', icon: Layers },
             { id: 'protocol', label: 'Settings', icon: Settings }
           ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 pt-8 pb-6 flex flex-col items-center justify-center space-y-3 transition-all relative ${
                  activeTab === tab.id ? 'text-tethryn-ink' : 'text-tethryn-muted hover:text-tethryn-ink'
                }`}
              >
                <tab.icon size={16} strokeWidth={2.5} />
                <div className="text-[11px] font-bold uppercase tracking-[0.3em]">{tab.label}</div>
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 inset-x-8 h-px bg-tethryn-accent shadow-[0_0_12px_rgba(133,123,239,0.3)]" />
                )}
              </button>
           ))}
        </div>

        {/* Parameters Panel */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12 bg-white/40">
          <AnimatePresence mode="wait">
            {activeTab === 'aesthetic' && (
              <motion.div
                key="aesthetic"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-6"
              >
                {getAllTemplates().map(tmp => (
                  <button
                    key={tmp.schema.id}
                    onClick={() => handleTemplateChange(tmp.schema.id)}
                    className={`relative aspect-[3/4] rounded-[2rem] overflow-hidden group transition-all duration-700 ${
                      template.schema.id === tmp.schema.id ? 'ring-2 ring-tethryn-accent ring-offset-4 shadow-2xl' : 'ring-1 ring-tethryn-border/40 opacity-40 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    <img src={tmp.schema.previewImage} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000" alt={tmp.schema.title} />
                    <div className="absolute inset-0 bg-tethryn-ink/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white mb-2">{tmp.schema.title}</span>
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tethryn-accent">Select</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-10 p-6 bg-tethryn-accent/5 border border-tethryn-accent/10 rounded-xl relative overflow-hidden group">
                   <div className="flex items-center space-x-3 mb-4">
                      <Sparkles size={16} className="text-tethryn-accent" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-tethryn-accent">AI Synthesis Ready</span>
                   </div>
                   <button 
                    onClick={() => handleAIRefine('all')}
                    disabled={isRefining}
                    className="w-full py-3.5 bg-tethryn-ink text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 rounded-lg transition-all disabled:opacity-50"
                   >
                     {isRefining ? 'Writing...' : 'Help me find the words'}
                   </button>
                </div>
                <div className="builder-premium-form">
                  <DynamicFormBuilder 
                    schema={template.schema} 
                    formData={content} 
                    onUpdate={handleUpdateContent}
                    onAIRefine={handleAIRefine}
                    isRefining={isRefining}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'protocol' && (
              <motion.div key="protocol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-tethryn-muted">Public Link Path</label>
                    <div className="flex h-14">
                      <div className="px-5 bg-tethryn-secondary text-[11px] font-mono text-tethryn-muted border border-tethryn-border rounded-l-xl flex items-center">/t/</div>
                      <input 
                        className="flex-1 px-5 bg-white border-y border-r border-tethryn-border rounded-r-xl text-[12px] font-sans outline-none focus:border-tethryn-accent transition-colors"
                        value={metadata.slug} 
                        onChange={(e) => setMetadata({...metadata, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-tethryn-muted">Memory Name</label>
                    <input 
                      className="w-full h-14 px-5 bg-white border border-tethryn-border rounded-xl text-[12px] font-sans outline-none focus:border-tethryn-accent transition-colors"
                      value={metadata.title} 
                      onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                      placeholder="e.g. Anniversary Gift 2024"
                    />
                  </div>

                  <div className="pt-8 border-t border-tethryn-border">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-tethryn-muted">Public Visibility</span>
                        <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${metadata.isPublished ? 'bg-tethryn-accent' : 'bg-neutral-200'}`} onClick={() => setMetadata(m => ({...m, isPublished: !m.isPublished}))}>
                           <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-all ${metadata.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                     </div>
                     <p className="text-[11px] text-tethryn-muted italic">Allows recipients to view this experience via the link provided above.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UI Control Strip */}
        <div className="p-5 md:p-6 border-t border-tethryn-border/30 bg-white/70 backdrop-blur-3xl flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
             <div className="flex items-center space-x-3 px-4 py-2 bg-tethryn-accent/5 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-tethryn-accent shadow-[0_0_8px_rgba(133,123,239,0.4)] animate-pulse" />
               <span className="text-[10px] font-bold tracking-[0.3em] text-tethryn-accent uppercase">Live_Synthesis</span>
             </div>
             
             {/* Mobile Preview Toggle */}
             <button 
              onClick={() => setIsPreviewMode(true)}
              className="md:hidden flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-tethryn-accent"
             >
               <Eye size={14} />
               <span>Preview</span>
             </button>
          </div>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="btn-premium w-full sm:w-auto px-10 py-3.5 text-[12px] flex items-center justify-center space-x-4 shadow-xl shadow-tethryn-accent/5 border border-tethryn-accent/20"
          >
            {isPublishing ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
            <span className="tracking-[0.15em]">{isPublishing ? 'PUBLISHING...' : 'PUBLISH STORY'}</span>
          </button>
        </div>
      </div>

        {/* Simulator Panel */}
      <div className={`flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-transparent relative ${!isPreviewMode ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Simulator Header - Responsive Layout */}
        <div className="absolute top-6 left-6 right-6 md:top-12 md:left-12 z-30 flex flex-col md:flex-row md:items-center justify-between md:justify-start gap-6 md:space-x-12">
           <div className="flex items-center justify-between md:justify-start w-full md:w-auto md:space-x-12">
             <div className="flex items-center space-x-4 md:space-x-6">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-tethryn-accent shadow-[0_0_12px_rgba(133,123,239,0.5)] animate-pulse" />
                <span className="text-[12px] md:text-[14px] font-bold uppercase tracking-[0.6em] md:tracking-[0.8em] text-tethryn-ink">SIMULATION</span>
             </div>
             <button 
                onClick={() => setIsPreviewMode(false)}
                className="md:hidden flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-tethryn-accent border border-tethryn-accent/20 px-4 py-2 rounded-full"
              >
                <Settings size={14} />
                <span>Edit</span>
              </button>
           </div>
           
           <div className="hidden sm:flex items-center space-x-6 text-tethryn-muted/40 font-mono">
              <Activity size={18} className="animate-pulse" />
              <span className="text-[11px] tracking-[0.4em] uppercase">Live Preview</span>
           </div>
        </div>

        <div className="absolute bottom-6 md:top-12 md:right-12 z-40 flex items-center space-x-6 md:space-x-10 w-full md:w-auto px-6 md:px-0">
           <div className="flex-1 md:flex-none flex bg-white/40 backdrop-blur-3xl shadow-premium border border-white/50 rounded-[1.5rem] p-1.5 md:p-2">
             <button 
               onClick={() => setPreviewDevice('phone')}
               className={`flex-1 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-[1rem] transition-all duration-500 ${previewDevice === 'phone' ? 'bg-tethryn-accent text-white shadow-2xl scale-105 md:scale-110' : 'text-tethryn-muted hover:text-tethryn-accent hover:bg-white/50'}`}
             >
               <Smartphone size={20} strokeWidth={2.5} />
             </button>
             <button 
               onClick={() => setPreviewDevice('full')}
               className={`flex-1 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-[1rem] transition-all duration-500 ${previewDevice === 'full' ? 'bg-tethryn-accent text-white shadow-2xl scale-105 md:scale-110' : 'text-tethryn-muted hover:text-tethryn-accent hover:bg-white/50'}`}
             >
               <Maximize2 size={20} strokeWidth={2.5} />
             </button>
           </div>

           <button 
             onClick={() => setIsPreviewUnwrapped(!isPreviewUnwrapped)}
             className="flex-1 md:flex-none px-6 md:px-14 py-4 md:py-6 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[1.5rem] text-[11px] md:text-[13px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-tethryn-accent hover:text-white transition-all shadow-premium"
           >
             {isPreviewUnwrapped ? 'RESET' : 'UNWRAP'}
           </button>
        </div>

        <motion.div 
          initial={false}
          animate={{ 
            width: previewDevice === 'phone' ? 360 : '100%',
            height: previewDevice === 'phone' ? 740 : '100%',
            borderRadius: previewDevice === 'phone' ? '3rem' : '0rem',
            borderWidth: previewDevice === 'phone' ? 10 : 0,
          }}
          transition={{ type: 'spring', damping: 35, stiffness: 120 }}
          className="relative bg-white shadow-2xl overflow-hidden border-tethryn-ink ring-2 ring-tethryn-border/40 mt-12 md:mt-0"
        >
          <TemplateRenderer 
            templateId={template.schema.id} 
            content={content} 
            experienceData={{
              title: metadata.title,
              slug: metadata.slug,
              isPublished: metadata.isPublished,
              recipientName: (content.recipientName as string) || (content.letterRecipient as string) || '',
              senderName: (content.senderName as string) || (content.letterSender as string) || '',
            }}
            isUnwrapped={isPreviewUnwrapped}
            onUnwrap={() => {
              setIsPreviewUnwrapped(true);
            }}
          />
          {previewDevice === 'phone' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-tethryn-ink rounded-b-3xl z-[100]" />
          )}
        </motion.div>
      </div>

      {/* Deployment Completion Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-tethryn-bg/80 backdrop-blur-md" onClick={() => setShowPublishModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative bg-white border border-tethryn-border w-full max-w-xl p-12 rounded-3xl shadow-premium text-center space-y-10"
            >
              <div className="w-20 h-20 bg-tethryn-accent rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-tethryn-accent/20">
                 <Check size={36} strokeWidth={3} />
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-tethryn-accent block">PUBLISHED SUCCESSFULLY</span>
                <h2 className="text-4xl font-sans font-bold text-tethryn-ink tracking-tight">Your story is live.</h2>
              </div>
              <div className="bg-tethryn-secondary p-6 border border-tethryn-border flex items-center justify-between rounded-xl">
                <span className="text-[13px] font-mono text-tethryn-muted truncate mr-4">tethryn.io/t/{metadata.slug}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/t/${metadata.slug}`);
                    toast.success("Link copied to clipboard");
                  }}
                  className="text-[11px] font-bold uppercase tracking-widest text-tethryn-accent hover:text-tethryn-ink transition-colors"
                >
                  COPY LINK
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                 <Link to={`/t/${metadata.slug}`} className="btn-premium py-5 text-[12px]">VIEW LIVE</Link>
                 <button onClick={() => setShowPublishModal(false)} className="btn-premium-secondary py-5 text-[12px]">CONTINUE EDITING</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
