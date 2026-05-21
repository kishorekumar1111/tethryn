import { useState, useEffect } from 'react';
import { ShieldCheck, HardDrive, Users, Activity, ExternalLink } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAllTemplates } from '../templates/registry';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const templates = getAllTemplates();

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!user || user.email !== 'kkmusiqyt@gmail.com') {
    return (
      <div className="h-screen flex items-center justify-center bg-tethryn-bg text-center px-6">
        <div>
          <ShieldCheck size={48} className="mx-auto text-red-500 mb-6" />
          <h1 className="text-4xl font-serif italic mb-6">Restricted Access</h1>
          <p className="text-[11px] text-tethryn-muted font-bold uppercase tracking-[0.4em]">ADMINISTATIVE_LOCK_ACTIVE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-40 px-8 min-h-screen bg-tethryn-bg relative">
      <div className="atmosphere" />
      <div className="noise" />
      
      <div className="max-w-[1720px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-16">
           <div>
              <span className="text-[13px] font-bold uppercase tracking-[0.8em] text-tethryn-accent block mb-8">LAB CORE</span>
              <h1 className="text-8xl lg:text-9xl text-editorial">System <br /> <span className="italic font-serif font-light text-tethryn-accent/20">Telemetry.</span></h1>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
           {[
             { label: 'Registered Templates', value: templates.length, icon: HardDrive },
             { label: 'Active Users', value: '1,240', icon: Users },
             { label: 'System Health', value: '100%', icon: Activity },
             { label: 'Network Latency', value: '24ms', icon: ExternalLink },
           ].map((stat, i) => (
             <div key={i} className="bg-white/50 backdrop-blur-3xl p-12 border border-white/40 rounded-[2.5rem] shadow-premium group hover:border-tethryn-accent transition-all duration-700">
                <div className="flex justify-between items-start mb-12">
                   <div className="w-12 h-12 bg-tethryn-secondary/50 rounded-xl flex items-center justify-center group-hover:bg-tethryn-accent group-hover:text-white transition-all duration-500">
                      <stat.icon size={20} />
                   </div>
                </div>
                <h3 className="text-5xl font-display font-medium tracking-tighter mb-4">{stat.value}</h3>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-tethryn-muted">{stat.label}</p>
             </div>
           ))}
        </div>

        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-16 rounded-[3rem] shadow-premium">
            <h2 className="text-4xl font-display font-medium mb-16 tracking-tight">Engine Registrations</h2>
            <div className="space-y-8">
               {templates.map(tmp => (
                 <div key={tmp.schema.id} className="flex items-center justify-between py-8 border-b border-tethryn-border/20 last:border-none">
                    <div>
                       <h4 className="text-2xl font-sans font-bold tracking-tight mb-2">{tmp.schema.title}</h4>
                       <p className="text-[12px] font-mono text-tethryn-muted">ID: {tmp.schema.id}</p>
                    </div>
                    <div className="px-6 py-3 bg-tethryn-secondary/50 rounded-xl text-[10px] font-bold uppercase tracking-widest text-tethryn-ink/60">
                       PROD_READY
                    </div>
                 </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}
