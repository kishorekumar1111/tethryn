import { motion } from 'motion/react';
import { ArrowRight, Shield, Globe, Zap, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInAsGuest } from '../lib/firebase';
import { getAllTemplates } from '../templates/registry';
import { useState } from 'react';
import { CinematicHeroObject, AtmosphericParticles } from '../components/AtmosphericHero';
import { useApp } from '../core/AppContext';

const BentoCard = ({ icon: Icon, title, description, linkTo, className = "", delay = 0 }: any) => {
  const CardWrapper = linkTo ? Link : 'div';
  return (
    <CardWrapper 
      to={linkTo}
      className="block w-full h-full"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        className={`p-8 sm:p-10 lg:p-14 card-premium flex flex-col justify-between group overflow-hidden relative h-full ${className}`}
      >
        <div className="absolute top-0 right-0 p-6 sm:p-8 lg:p-12 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-1000">
          <Icon size={120} className="lg:w-[160px] lg:h-[160px]" strokeWidth={0.5} />
        </div>
        
        {/* Inner soft glow */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-tethryn-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div>
          <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center mb-8 lg:mb-12 border border-tethryn-border bg-tethryn-secondary group-hover:bg-tethryn-accent group-hover:text-white group-hover:border-tethryn-accent transition-all duration-700 rounded-2xl shadow-sm group-hover:shadow-2xl group-hover:shadow-tethryn-accent/20">
            <Icon size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl lg:text-3xl font-sans font-bold mb-4 lg:mb-6 text-tethryn-ink tracking-tight">{title}</h3>
          <p className="text-base lg:text-lg text-tethryn-muted leading-relaxed tracking-tight max-w-[320px] opacity-70 group-hover:opacity-100 transition-opacity duration-500">{description}</p>
        </div>
        <div className="mt-12 lg:mt-16 flex items-center space-x-3 lg:space-x-4 text-[10px] lg:text-[12px] font-bold uppercase tracking-[0.3em] lg:tracking-[0.4em] text-tethryn-muted group-hover:text-tethryn-accent transition-all duration-500">
          <span className="opacity-40 group-hover:opacity-100">EXPLORE MODULE</span>
          <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </motion.div>
    </CardWrapper>
  );
};

export default function LandingPage() {
  const templates = getAllTemplates();
  const navigate = useNavigate();
  const { user } = useApp();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGuestLoggingIn, setIsGuestLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      if (user) {
        navigate('/dashboard');
        return;
      }
      const result = await signInWithGoogle();
      if (result) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err?.message || "Sign in failed. On localhost, click 'Continue as Guest' to test instantly with mock auth.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsGuestLoggingIn(true);
    setLoginError(null);
    try {
      await signInAsGuest();
      navigate('/dashboard');
    } catch (err: any) {
      console.warn("Guest mode fallback to offline simulation context:", err);
      const localUid = 'dev_guest_' + Math.random().toString(36).substring(7);
      localStorage.setItem('local_dev_user_uid', localUid);
      window.location.reload();
    } finally {
      setIsGuestLoggingIn(false);
    }
  };

  return (
    <div className="bg-tethryn-bg selection:bg-tethryn-accent/10 text-tethryn-ink font-sans overflow-x-hidden min-h-screen relative">
      <AtmosphericParticles />
      <div className="atmosphere" />
      <div className="noise" />
      <div className="vignette" />
      
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-center pb-24 pt-24 md:pb-32 lg:pt-20 overflow-hidden">
        <div className="max-w-[1720px] mx-auto w-full px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:justify-between items-center lg:items-stretch lg:gap-16">
            {/* Left Column: Product Communication */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-5/12 z-20 mt-16 md:mt-24 lg:mt-0 pt-0 lg:pt-12 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center space-x-4 lg:space-x-12 mb-8 lg:mb-20"
              >
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <div className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-tethryn-accent shadow-[0_0_15px_var(--color-tethryn-accent)] animate-pulse" />
                  <span className="text-[10px] sm:text-[12px] lg:text-[14px] uppercase tracking-[0.5em] lg:tracking-[1em] font-bold text-tethryn-muted">YOUR SPACE</span>
                </div>
                <div className="hidden lg:block h-px w-32 bg-tethryn-border/60" />
              </motion.div>

              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="mb-8 lg:mb-24 w-full"
              >
                <h1 className="text-[clamp(4.5rem,14vw,10.5rem)] text-editorial leading-[0.85] lg:leading-[0.8] mb-8 lg:mb-14 tracking-tighter">
                  Create <br /> 
                  <span className="italic font-serif font-light text-tethryn-accent/20 lg:text-tethryn-accent/15 lowercase tracking-[-0.03em] lg:tracking-[-0.05em]">moments.</span>
                </h1>
                
                {/* Desktop subtext */}
                <p className="hidden lg:block text-2xl lg:text-4xl text-tethryn-muted leading-relaxed font-serif italic max-w-2xl opacity-70">
                  Turn your memories into beautiful experiences. Made for someone special.
                </p>

                {/* Mobile cinematic object injected here */}
                <div className="lg:hidden relative w-full flex justify-center -my-8 pointer-events-none scale-[0.9] sm:scale-100 z-10">
                  <CinematicHeroObject />
                </div>

                {/* Mobile subtext */}
                <p className="lg:hidden text-xl md:text-2xl text-tethryn-muted leading-relaxed font-serif italic max-w-md mx-auto opacity-80 mt-12 mb-10 px-4">
                  Turn your memories into beautiful experiences. Made for someone special.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center lg:items-start gap-6 w-full"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 w-full sm:w-auto">
                  <button 
                    onClick={handleLogin}
                    disabled={isLoggingIn || isGuestLoggingIn}
                    className="btn-premium group px-12 py-6 sm:px-16 sm:py-8 lg:px-20 lg:py-10 text-[14px] sm:text-[16px] lg:text-[18px] shadow-[0_24px_48px_rgba(133,123,239,0.12)] hover:shadow-[0_48px_96px_rgba(133,123,239,0.2)] w-[85%] sm:w-auto lg:min-w-[320px] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-tethryn-accent to-tethryn-accent-hover opacity-100 group-hover:opacity-90 transition-opacity" />
                    <div className="relative z-10 flex items-center justify-center space-x-4">
                      {isLoggingIn ? (
                        <>
                          <Loader2 size={24} className="animate-spin opacity-60" />
                          <span className="tracking-[0.15em]">CONNECTING...</span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-[0.08em] font-medium font-sans uppercase">Sign In with Google</span>
                          <ArrowRight size={20} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-500" />
                        </>
                      )}
                    </div>
                  </button>

                  <button 
                    onClick={handleGuestLogin}
                    disabled={isLoggingIn || isGuestLoggingIn}
                    style={{ background: 'rgba(133, 123, 239, 0.05)' }}
                    className="group px-12 py-6 sm:px-16 sm:py-8 lg:px-16 lg:py-10 text-[14px] sm:text-[16px] border border-tethryn-border hover:border-tethryn-accent rounded-2xl w-[85%] sm:w-auto transition-all"
                  >
                    <div className="flex items-center justify-center space-x-3 text-tethryn-ink hover:text-tethryn-accent duration-300">
                      {isGuestLoggingIn ? (
                        <>
                          <Loader2 size={18} className="animate-spin opacity-60" />
                          <span className="tracking-widest uppercase text-[12px] font-sans">Guest Loading...</span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-widest uppercase text-[12px] font-sans font-medium">Continue as Guest (Local)</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {loginError && (
                  <p className="text-red-500 text-[12px] font-sans text-center lg:text-left mt-2 max-w-md">
                    {loginError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 w-full justify-center lg:justify-start">
                  <Link 
                    to="/gallery"
                    className="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.4em] lg:tracking-[0.6em] text-tethryn-muted hover:text-tethryn-accent transition-all group flex items-center space-x-4 lg:space-x-6 py-2"
                  >
                    <span className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">THE GALLERY</span>
                  </Link>
                  <p className="text-[11px] text-tethryn-muted font-sans text-center lg:text-left opacity-60 max-w-xs leading-normal">
                    Tip: If running locally without config, use Guest login to bypass Google auth instantly and save data inside LocalStorage!
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Desktop Cinematic Experience Object */}
            <div className="hidden lg:flex flex-col justify-center relative w-full lg:w-7/12 scale-100 z-10 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <CinematicHeroObject />
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Grid Feature Matrix */}
      <section className="py-24 md:py-48 lg:py-80 dot-bg border-y border-tethryn-border/30 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-tethryn-accent/[0.02] to-transparent pointer-events-none" 
        />
        <div className="max-w-[1720px] mx-auto px-6 lg:px-8 relative z-10">
           <div className="flex flex-col lg:flex-row justify-between items-start mb-20 lg:mb-48 gap-8 lg:gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl"
              >
                 <span className="text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.4em] lg:tracking-[0.6em] text-tethryn-accent mb-6 lg:mb-8 block">BEAUTIFULLY PERSONAL</span>
                 <h2 className="text-[clamp(3.5rem,10vw,10rem)] text-editorial mb-4 lg:mb-12 leading-[0.9]">
                   More than <br /> <span className="italic font-serif font-light text-tethryn-accent/20">a message.</span>
                 </h2>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="lg:max-w-md pt-4 lg:pt-20"
              >
                <p className="text-xl lg:text-2xl text-tethryn-muted font-serif italic leading-relaxed opacity-60">
                  Share something meaningful. We make it easy to turn your photos, words, and memories into an unforgettable digital experience.
                </p>
              </motion.div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              <BentoCard 
                icon={Shield} 
                title="Secure Delivery" 
                description="Your memories are private and protected, reaching only the people you intend to share them with."
                linkTo="/legal"
                delay={0.1}
              />
              <BentoCard 
                icon={Globe} 
                title="Beautifully Crafted" 
                description="Experience smooth, cinematic moments designed to feel premium, warm, and personal."
                linkTo="/about"
                delay={0.2}
              />
              <BentoCard 
                icon={Zap} 
                title="Easy to Create" 
                description="Let our AI help you find the right words and perfect the aesthetic for your special moment."
                linkTo="/gallery"
                delay={0.3}
              />
           </div>
        </div>
      </section>

      {/* Editorial Teaser */}
      <section className="py-24 md:py-48 lg:py-80 relative bg-[#0C0C0D] text-tethryn-bg overflow-hidden shadow-2xl">
         {/* Deep Atmospheric Glows for dark section */}
         <div className="absolute top-0 right-0 w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-tethryn-accent/15 rounded-full blur-[100px] lg:blur-[180px] -z-0 opacity-30" />
         <div className="absolute bottom-0 left-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-tethryn-accent/10 rounded-full blur-[80px] lg:blur-[140px] -z-0 opacity-20" />
         
         <div className="max-w-[1720px] mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 lg:gap-48 items-center">
               <motion.div
                 initial={{ opacity: 0, scale: 0.95, y: 30 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true, amount: 0.3 }}
                 transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                 className="relative group order-2 lg:order-1"
               >
                  <div className="aspect-[4/5] bg-neutral-900 border border-white/5 rounded-[2rem] lg:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative">
                     <img 
                       src={templates[0]?.schema.previewImage} 
                       className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[8s] grayscale-[40%] group-hover:grayscale-0"
                       alt="Teaser Preview"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0D] via-transparent to-transparent opacity-80" />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.3, duration: 1.5 }}
                    className="absolute bottom-8 -right-4 sm:-right-8 lg:bottom-16 lg:-right-12 w-[85%] sm:w-[360px] lg:w-[400px] p-8 lg:p-16 bg-white shadow-premium rounded-[2rem] lg:rounded-[3rem] border border-tethryn-border"
                  >
                     <span className="text-[10px] lg:text-[12px] font-bold uppercase tracking-[0.4em] lg:tracking-[0.5em] block mb-4 lg:mb-8 text-tethryn-accent">Featured Story</span>
                     <p className="text-xl sm:text-2xl lg:text-3xl font-serif italic leading-tight text-tethryn-ink opacity-90">"A beautifully personal way to say what matters most."</p>
                  </motion.div>
               </motion.div>

               <div className="relative order-1 lg:order-2 text-center lg:text-left flex flex-col items-center lg:items-start">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    className="text-[11px] lg:text-[14px] font-bold uppercase tracking-[0.6em] lg:tracking-[1em] text-tethryn-accent mb-8 lg:mb-16 block"
                  >
                    OUR PHILOSOPHY
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[clamp(4.5rem,14vw,11rem)] font-sans font-bold leading-[0.85] lg:leading-[0.8] tracking-tighter mb-12 lg:mb-20 mx-auto lg:mx-0"
                  >
                    Made for <br /> <span className="text-tethryn-accent italic font-serif font-medium opacity-80 relative left-0 sm:left-4">Connection.</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 0.6, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.1, duration: 1.5 }}
                    className="text-xl sm:text-2xl lg:text-3xl text-tethryn-bg leading-relaxed max-w-xl font-serif italic mb-12 lg:mb-20 px-6 lg:px-8 border-l-2 border-tethryn-accent/30 mx-auto lg:mx-0"
                  >
                     "Tethryn is for anyone who wants to create something they'll always remember. Because your memories deserve to be brought to life."
                  </motion.p>
                  <div className="flex flex-col sm:flex-row items-center space-y-8 sm:space-y-0 sm:space-x-12 lg:space-x-16 w-full lg:w-auto">
                     <button onClick={handleLogin} disabled={isLoggingIn} className="btn-premium px-12 py-6 lg:px-16 lg:py-8 rounded-2xl shadow-2xl hover:shadow-tethryn-accent/30 font-medium tracking-wide w-full sm:w-auto">
                        {isLoggingIn ? 'Connecting...' : 'Start Creating'}
                     </button>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center sm:items-start"
                     >
                        <span className="text-2xl lg:text-3xl font-sans font-bold leading-none text-white tracking-widest">12,500+</span>
                        <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-widest text-tethryn-accent mt-2 lg:mt-3 opacity-60">People Connecting</span>
                     </motion.div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Massive Footer CTA */}
      <section className="py-32 md:py-48 lg:py-64 bg-tethryn-bg text-center relative overflow-hidden">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-tethryn-accent/3 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none" />
         
         <motion.h2 
           initial={{ opacity: 0, scale: 0.9, y: 30 }}
           whileInView={{ opacity: 1, scale: 1, y: 0 }}
           viewport={{ once: true, amount: 0.5 }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
           className="text-[16vw] lg:text-[10vw] font-serif italic font-medium tracking-tighter text-tethryn-ink mb-16 lg:mb-24 relative z-10"
         >
           Your Story.
         </motion.h2>
         <div className="flex flex-col items-center relative z-10 px-6">
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="text-2xl sm:text-3xl lg:text-5xl font-serif italic text-tethryn-muted hover:text-tethryn-accent transition-all disabled:opacity-50 group flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <span>{isLoggingIn ? 'Connecting...' : 'Start your first story.'}</span>
              <ArrowRight className="group-hover:translate-x-4 transition-transform text-tethryn-accent hidden sm:block" size={32} strokeWidth={1.5} />
            </button>
            <div className="mt-32 lg:mt-48 flex flex-col items-center opacity-30">
               <span className="text-[10px] lg:text-[12px] font-bold uppercase tracking-[0.5em] lg:tracking-[1em] text-tethryn-ink">TETHRYN • MMXXIV</span>
            </div>
         </div>
      </section>
    </div>
  );
}
