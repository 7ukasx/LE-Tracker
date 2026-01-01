
import React from 'react';
import { ArrowRight, Shield, Zap, BarChart3, Sparkles, Globe, Wallet, Activity } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 overflow-x-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-8 flex justify-between items-center backdrop-blur-md bg-white/10 dark:bg-black/10">
        <h1 className="text-xl font-black tracking-tighter uppercase italic">LE Tracker</h1>
        <button 
          onClick={onEnter}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 sm:pt-60 sm:pb-40 px-6 sm:px-12 flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-zinc-900/20 -z-10 blur-3xl rounded-full opacity-50" />
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="inline-block px-4 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 text-[8px] font-black uppercase tracking-[0.4em] mb-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            Available Now
          </span>
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter italic uppercase leading-[0.85] mb-8">
            Finance<br />Reimagined.
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-sm sm:text-lg font-medium leading-relaxed mb-12 uppercase tracking-tight">
            The high-end personal wealth management system for the modern era. Minimalist by design. Precise by nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onEnter}
              className="group bg-black dark:bg-white text-white dark:text-black px-12 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
            >
              Enter the System <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Abstract Preview */}
        <div className="mt-24 w-full max-w-6xl aspect-[16/10] bg-slate-50 dark:bg-zinc-950 rounded-[3rem] border border-slate-200 dark:border-zinc-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_-20px_rgba(255,255,255,0.03)] overflow-hidden relative group">
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-[80%] h-[80%] grid grid-cols-3 gap-6 opacity-40 group-hover:opacity-60 transition-opacity">
                <div className="bg-slate-200 dark:bg-zinc-800 rounded-3xl animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="bg-slate-200 dark:bg-zinc-800 rounded-3xl animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="bg-slate-200 dark:bg-zinc-800 rounded-3xl animate-pulse" style={{ animationDelay: '400ms' }} />
                <div className="col-span-2 bg-slate-200 dark:bg-zinc-800 rounded-3xl animate-pulse" style={{ animationDelay: '600ms' }} />
                <div className="bg-slate-200 dark:bg-zinc-800 rounded-3xl animate-pulse" style={{ animationDelay: '800ms' }} />
             </div>
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-24">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white shadow-sm border border-slate-100 dark:border-zinc-800">
              <Activity size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Precision Tracking</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
              Sophisticated algorithms provide real-time updates on your financial trajectory with surgical precision.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white shadow-sm border border-slate-100 dark:border-zinc-800">
              <Shield size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Total Privacy</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
              Zero cloud tracking. All sensitive financial data remains encrypted in your local machine's secure storage.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white shadow-sm border border-slate-100 dark:border-zinc-800">
              <Zap size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Pure Velocity</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
              An interface built for speed. Log transactions and analyze trends in seconds with our optimized engine.
            </p>
          </div>
        </div>
      </section>

      {/* Footer / CTA Section */}
      <footer className="py-40 border-t border-slate-100 dark:border-zinc-900 px-6 sm:px-12 flex flex-col items-center">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter italic uppercase text-center mb-12">
          Ready to transcend?
        </h2>
        <button 
          onClick={onEnter}
          className="bg-black dark:bg-white text-white dark:text-black px-12 py-6 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
        >
          Initialize Account
        </button>
        <div className="mt-32 w-full flex flex-col sm:flex-row justify-between items-center gap-8 border-t border-slate-100 dark:border-zinc-900 pt-12">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">© 2025 LE Tracker</p>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-30 italic">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
