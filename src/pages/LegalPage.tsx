import { motion } from 'motion/react';

export default function LegalPage() {
  return (
    <div className="pt-40 pb-24 px-6 min-h-screen bg-tethryn-bg dot-bg">
      <div className="absolute inset-0 atmosphere pointer-events-none" />
      <div className="max-w-3xl mx-auto bg-white p-12 lg:p-20 shadow-premium border border-tethryn-border relative z-10 rounded-[2.5rem]">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-tethryn-accent mb-4 block">Legal Information</span>
          <h1 className="text-5xl font-serif text-tethryn-ink mb-16 tracking-tighter">Terms & <span className="italic">Privacy.</span></h1>
          
          <div className="space-y-12 text-[13px] text-tethryn-muted leading-relaxed font-medium">
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-tethryn-ink mb-4">01. Service Overview</h2>
              <p>
                Tethryn provides a digital storytelling and archiving platform. By using our service, you agree to treat the narratives and media uploaded with respect to intellectual property and personal privacy.
              </p>
            </section>

            <section>
               <h2 className="text-[10px] font-black uppercase tracking-widest text-tethryn-ink mb-4">02. Data Security</h2>
               <p>
                 All your stories are stored using enterprise-grade encryption. Private stories are accessible only via unique links and authenticated author credentials. We never sell your personal narrative data to third parties.
               </p>
            </section>

            <section>
               <h2 className="text-[10px] font-black uppercase tracking-widest text-tethryn-ink mb-4">03. Content Responsibility</h2>
               <p>
                 Users are solely responsible for the content they publish. Any content violating international laws, including hate speech or unauthorized distribution of private media, will be permanently purged without notice.
               </p>
            </section>

            <section>
               <h2 className="text-[10px] font-black uppercase tracking-widest text-tethryn-ink mb-4">04. AI Integrations</h2>
               <p>
                 Our "AI Refinement" features use large language models (Gemini) to assist in narrative composition. While we strive for emotional resonance, the AI remains an assistant; primary authorship belongs to the user.
               </p>
            </section>
          </div>

          <div className="mt-20 pt-12 border-t border-tethryn-border/40 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-tethryn-muted/40">
             <span>Last Updated: May 2026</span>
             <span>Tethryn Platform</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
