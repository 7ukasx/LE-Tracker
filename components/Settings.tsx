
import React, { useState, useRef } from 'react';
import { UserProfile, Category, TransactionType, RecurringTransaction } from '../types';
import { User, Wallet, Plus, Trash2, ShieldCheck, Upload, Sun, Moon, Palette, X, AlertTriangle, FileText, Scale } from 'lucide-react';
import { translations } from '../translations';

interface SettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onDeleteAccount: () => void;
  privacyMode?: boolean;
  isDarkMode: boolean;
  onToggleTheme: (isDark: boolean) => void;
}

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Caleb', 'Jocelyn', 'Buster', 'Midnight', 'Spooky', 'Shadow'];
const COUNTRIES = ['Germany', 'United States', 'United Kingdom', 'Switzerland', 'Austria', 'France', 'Spain', 'Italy'];

const Settings: React.FC<SettingsProps> = ({ profile, onUpdate, onDeleteAccount, privacyMode = false, isDarkMode, onToggleTheme }) => {
  const [newRecDesc, setNewRecDesc] = useState('');
  const [newRecAmount, setNewRecAmount] = useState('');
  const [newRecDay, setNewRecDay] = useState('1');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[profile.language || 'de'];

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    onUpdate({ ...profile, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...profile, customAvatar: reader.result as string, avatarSeed: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomAvatar = () => {
    onUpdate({ 
      ...profile, 
      customAvatar: undefined, 
      avatarSeed: profile.avatarSeed || AVATAR_SEEDS[0] 
    });
  };

  const addRecurring = () => {
    if (!newRecDesc || !newRecAmount) return;
    const newItem: RecurringTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: newRecDesc,
      amount: parseFloat(newRecAmount),
      type: TransactionType.EXPENSE,
      category: Category.UTILITIES,
      dayOfMonth: parseInt(newRecDay) || 1
    };
    onUpdate({ ...profile, recurringTransactions: [...(profile.recurringTransactions || []), newItem] });
    setNewRecDesc(''); setNewRecAmount('');
  };

  return (
    <div className="max-w-4xl space-y-8 sm:space-y-12 pb-20 animate-in fade-in duration-500">
      {/* Profile Core Section */}
      <section className="bg-white dark:bg-black p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-zinc-900 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-12 border-b border-slate-100 dark:border-zinc-900 pb-12">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-black dark:border-white overflow-hidden bg-slate-50 dark:bg-zinc-900 flex items-center justify-center">
                {profile.customAvatar ? (
                  <img src={profile.customAvatar} className="w-full h-full object-cover grayscale" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || profile.name}`} className="w-full h-full grayscale" />
                )}
              </div>
              
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg shadow-lg hover:scale-110 transition-transform flex items-center justify-center border border-slate-200 dark:border-zinc-800"
                  title="Upload Image"
                >
                  <Upload size={14} />
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>

            {profile.customAvatar && (
              <button 
                onClick={removeCustomAvatar}
                className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={10} /> {profile.language === 'de' ? 'Bild entfernen' : 'Remove Image'}
              </button>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center sm:text-left">Signature</h3>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {AVATAR_SEEDS.map((seed) => (
                <button 
                  key={seed} 
                  onClick={() => {
                    onUpdate({ ...profile, avatarSeed: seed, customAvatar: undefined });
                  }} 
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${(!profile.customAvatar && profile.avatarSeed === seed) ? 'border-black dark:border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-70'}`}
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} className="grayscale" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-10 flex items-center gap-3 italic uppercase tracking-tighter"><User size={24} /> {t.settings.profileCore}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t.settings.identity}</label>
            <input type="text" value={profile.name} onChange={(e) => updateProfileField('name', e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 dark:text-white font-black text-sm uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t.settings.language}</label>
            <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/50 dark:border-zinc-800">
              <button onClick={() => updateProfileField('language', 'de')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg transition-all ${profile.language === 'de' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Deutsch</button>
              <button onClick={() => updateProfileField('language', 'en')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg transition-all ${profile.language === 'en' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>English</button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t.settings.country}</label>
            <select value={profile.country} onChange={(e) => updateProfileField('country', e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 dark:text-white font-black text-sm uppercase focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white">
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t.settings.currency}</label>
            <select value={profile.currency} onChange={(e) => updateProfileField('currency', e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 dark:text-white font-black text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white">
              <option value="€">EUR (€)</option><option value="$">USD ($)</option><option value="£">GBP (£)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Theme Selection Section */}
      <section className="bg-white dark:bg-black p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-zinc-900 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black mb-10 flex items-center gap-3 italic uppercase tracking-tighter"><Palette size={24} /> {profile.language === 'de' ? 'Design & Thema' : 'Appearance'}</h2>
        <div className="p-1.5 bg-slate-100 dark:bg-zinc-900 rounded-[1.5rem] flex items-center border border-slate-200 dark:border-zinc-800 max-w-md mx-auto sm:mx-0">
          <button 
            onClick={() => onToggleTheme(false)} 
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.25rem] transition-all duration-300 ${!isDarkMode ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Sun size={18} /> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Light</span>
          </button>
          <button 
            onClick={() => onToggleTheme(true)} 
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.25rem] transition-all duration-300 ${isDarkMode ? 'bg-zinc-800 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Moon size={18} /> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dark</span>
          </button>
        </div>
      </section>

      {/* Legal & Privacy Section */}
      <section className="bg-white dark:bg-black p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-zinc-900 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black mb-10 flex items-center gap-3 italic uppercase tracking-tighter"><Scale size={24} /> {t.settings.legal}</h2>
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-zinc-900/40 rounded-[1.5rem] border border-slate-100 dark:border-zinc-800">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
              <ShieldCheck size={14} /> {t.settings.privacy}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">
              {t.settings.privacyText}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1 p-6 bg-slate-50 dark:bg-zinc-900/40 rounded-[1.5rem] border border-slate-100 dark:border-zinc-800">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t.settings.imprint}</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white">
                  LE Tracker Project<br />
                  GitHub: {profile.name}<br />
                  Made with passion.
                </p>
             </div>
             <div className="flex-1 p-6 bg-slate-50 dark:bg-zinc-900/40 rounded-[1.5rem] border border-slate-100 dark:border-zinc-800">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">License</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white">
                  {t.settings.license}<br />
                  © {new Date().getFullYear()} {profile.name}
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="bg-rose-50/30 dark:bg-rose-950/10 p-6 sm:p-10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 shadow-sm space-y-8">
        <h2 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-3 italic uppercase tracking-tighter">
          <AlertTriangle size={24} /> {t.settings.dangerZone}
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-wider text-rose-600/70 dark:text-rose-400/70">{t.settings.deleteAccount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.settings.deleteWarning}</p>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            {confirmDelete ? (
              <div className="flex flex-col gap-2 animate-in zoom-in duration-300">
                <button 
                  onClick={onDeleteAccount}
                  className="w-full bg-rose-600 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg"
                >
                  {t.settings.confirmDelete}
                </button>
                <button 
                  onClick={() => setConfirmDelete(false)}
                  className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-500 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest"
                >
                  {profile.language === 'de' ? 'Abbrechen' : 'Cancel'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmDelete(true)}
                className="w-full border-2 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
              >
                {t.settings.deleteAccount}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Data Sovereignty Footer */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-slate-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800">
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-[1.5rem] shadow-sm text-black dark:text-white">
          <ShieldCheck size={32} />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white">{t.settings.dataSovereignty}</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-relaxed">{t.settings.localized}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
