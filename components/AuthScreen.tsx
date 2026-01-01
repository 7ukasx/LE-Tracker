
import React, { useState, useRef } from 'react';
import { CreditCard, ArrowRight, Lock, User as UserIcon, Wallet, CheckCircle2, Upload, Trash2, Globe, Languages, ChevronLeft, Plus, Calendar, Check } from 'lucide-react';
import { translations } from '../translations';
import { TransactionType, Category, RecurringTransaction } from '../types';

interface AuthScreenProps {
  onLogin: (username: string, initialData?: any) => void;
}

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Caleb', 'Jocelyn', 'Buster', 'Midnight', 'Spooky', 'Shadow'];
const COUNTRIES = ['Germany', 'United States', 'United Kingdom', 'Switzerland', 'Austria', 'France', 'Spain', 'Italy'];

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'auth' | 'onboarding-1' | 'onboarding-2' | 'onboarding-recurring' | 'onboarding-3'>('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState('');

  // Onboarding states
  const [salary, setSalary] = useState('');
  const [salaryDay, setSalaryDay] = useState('1');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>('prefer_not_to_say');
  const [avatarSeed, setAvatarSeed] = useState(AVATAR_SEEDS[0]);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [language, setLanguage] = useState<'de' | 'en'>('en'); 
  const [country, setCountry] = useState(COUNTRIES[1]); 
  
  // Recurring states
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [newRecDesc, setNewRecDesc] = useState('');
  const [newRecAmount, setNewRecAmount] = useState('');
  const [newRecDay, setNewRecDay] = useState('1');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language].auth;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Required fields missing.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('fintrack_users') || '[]');
    if (isLogin) {
      const user = users.find((u: any) => u.username === username && u.password === password);
      if (user) onLogin(username);
      else setError('Invalid credentials.');
    } else {
      if (!tosAccepted) {
        setError('Accept Terms to proceed.');
        return;
      }
      if (users.find((u: any) => u.username === username)) setError('User exists.');
      else setStep('onboarding-1');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        setAvatarSeed('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomAvatar = () => {
    setCustomAvatar(null);
    setAvatarSeed(AVATAR_SEEDS[0]);
  };

  const addOnboardingRecurring = () => {
    if (!newRecDesc || !newRecAmount) return;
    const newItem: RecurringTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: newRecDesc,
      amount: parseFloat(newRecAmount),
      type: TransactionType.EXPENSE,
      category: Category.OTHERS,
      dayOfMonth: parseInt(newRecDay) || 1
    };
    setRecurringTransactions([...recurringTransactions, newItem]);
    setNewRecDesc('');
    setNewRecAmount('');
    setNewRecDay('1');
  };

  const removeOnboardingRecurring = (id: string) => {
    setRecurringTransactions(recurringTransactions.filter(r => r.id !== id));
  };

  const completeOnboarding = () => {
    setError('');
    const parsedAge = parseInt(age);
    if (!age || parsedAge < 16) {
      setError('Minimum age is 16.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('fintrack_users') || '[]');
    users.push({ username, password });
    localStorage.setItem('fintrack_users', JSON.stringify(users));

    const initialProfile = {
      name: username,
      currency: country === 'Germany' || country === 'Austria' || country === 'France' || country === 'Italy' || country === 'Spain' ? '€' : '$',
      language,
      country,
      monthlyGoal: 500,
      gender,
      age: parsedAge,
      avatarSeed: customAvatar ? undefined : avatarSeed,
      customAvatar: customAvatar || undefined,
      tosAccepted: true,
      monthlySalary: parseFloat(salary) || 0,
      salaryDay: parseInt(salaryDay) || 1,
      recurringTransactions: recurringTransactions,
      // Removed lastAutoUpdate so App.tsx runs the sync immediately on login
    };

    onLogin(username, initialProfile);
  };

  const StepIndicator = ({ current, total = 4 }: { current: number, total?: number }) => (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${current === (i + 1) ? 'w-8 bg-black dark:bg-white' : 'w-4 bg-slate-200 dark:bg-slate-800'}`} />
      ))}
    </div>
  );

  if (step.startsWith('onboarding')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4 transition-colors duration-500 overflow-y-auto">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 my-8">
          
          {step === 'onboarding-1' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-black dark:border-white overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    {customAvatar ? <img src={customAvatar} className="w-full h-full object-cover grayscale" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} className="w-full h-full grayscale" />}
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    {customAvatar && (
                      <button 
                        onClick={removeCustomAvatar}
                        className="bg-rose-500 text-white p-2 rounded-lg shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg shadow-lg hover:scale-110 transition-transform"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
                <h2 className="text-2xl font-black mt-6 tracking-tighter italic">{t.identitySetup}</h2>
              </div>
              <StepIndicator current={1} />
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {AVATAR_SEEDS.map((seed) => (
                    <button 
                      key={seed} 
                      onClick={() => {setAvatarSeed(seed); setCustomAvatar(null);}} 
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 ${(!customAvatar && avatarSeed === seed) ? 'border-black dark:border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-70'} transition-all`}
                    >
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} className="grayscale" />
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400">{t.age}</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 dark:text-white font-bold" placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 dark:text-white font-bold text-xs">
                      <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer_not_to_say">Hidden</option>
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={() => setStep('onboarding-2')} className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-5 rounded-xl tracking-widest">{t.next}</button>
            </div>
          )}

          {step === 'onboarding-2' && (
            <div className="space-y-6">
              <div className="text-center">
                <Globe className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-black tracking-tighter italic">{t.regionSetup}</h2>
              </div>
              <StepIndicator current={2} />
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 flex items-center gap-2"><Globe className="w-3 h-3" /> {translations[language].settings.country}</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 dark:text-white font-bold">
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 flex items-center gap-2"><Languages className="w-3 h-3" /> {translations[language].settings.language}</label>
                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                    <button onClick={() => setLanguage('de')} className={`flex-1 py-3 text-[10px] font-black rounded-lg transition-all ${language === 'de' ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' : 'text-slate-400'}`}>Deutsch</button>
                    <button onClick={() => setLanguage('en')} className={`flex-1 py-3 text-[10px] font-black rounded-lg transition-all ${language === 'en' ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' : 'text-slate-400'}`}>English</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('onboarding-1')} className="px-6 border border-slate-200 dark:border-slate-800 rounded-xl"><ChevronLeft /></button>
                <button onClick={() => setStep('onboarding-recurring')} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black py-5 rounded-xl tracking-widest">{t.next}</button>
              </div>
            </div>
          )}

          {step === 'onboarding-recurring' && (
            <div className="space-y-6">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-black tracking-tighter italic">{t.recurringSetup}</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 mt-2">{t.recurringDesc}</p>
              </div>
              <StepIndicator current={3} />
              
              <div className="space-y-4">
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {recurringTransactions.map(rec => (
                    <div key={rec.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-black text-[10px] uppercase italic">{rec.description}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{rec.amount} • Day {rec.dayOfMonth}</p>
                      </div>
                      <button onClick={() => removeOnboardingRecurring(rec.id)} className="p-2 text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Description" value={newRecDesc} onChange={(e) => setNewRecDesc(e.target.value)} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase dark:text-white" />
                    <input type="number" placeholder="Amount" value={newRecAmount} onChange={(e) => setNewRecAmount(e.target.value)} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase dark:text-white" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Day</span>
                      <input type="number" min="1" max="31" value={newRecDay} onChange={(e) => setNewRecDay(e.target.value)} className="w-full bg-transparent text-[10px] font-black uppercase dark:text-white focus:outline-none" />
                    </div>
                    <button onClick={addOnboardingRecurring} className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-xl flex items-center justify-center transition-transform hover:scale-105">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('onboarding-2')} className="px-6 border border-slate-200 dark:border-slate-800 rounded-xl"><ChevronLeft /></button>
                <button onClick={() => setStep('onboarding-3')} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black py-5 rounded-xl tracking-widest">{t.next}</button>
              </div>
            </div>
          )}

          {step === 'onboarding-3' && (
            <div className="space-y-6">
              <div className="text-center">
                <Wallet className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-black tracking-tighter italic">{t.financialSetup}</h2>
              </div>
              <StepIndicator current={4} />
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400">{t.salarySetup || 'Net Salary'}</label>
                  <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 dark:text-white font-bold" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400">Salary Day</label>
                  <input type="number" min="1" max="31" value={salaryDay} onChange={(e) => setSalaryDay(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 dark:text-white font-bold" />
                </div>
              </div>
              {error && <p className="text-rose-500 text-[10px] font-black text-center">{error}</p>}
              <div className="flex gap-4">
                <button onClick={() => setStep('onboarding-recurring')} className="px-6 border border-slate-200 dark:border-slate-800 rounded-xl"><ChevronLeft /></button>
                <button onClick={completeOnboarding} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black py-5 rounded-xl tracking-widest">{t.launch}</button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4 transition-colors duration-500">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter italic">LE Tracker</h1>
        </div>

        <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-8">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-[10px] font-black rounded-lg ${isLogin ? 'bg-white dark:bg-slate-800 text-black dark:text-white' : 'text-slate-400'}`}>{translations[language].auth.login}</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-[10px] font-black rounded-lg ${!isLogin ? 'bg-white dark:bg-slate-800 text-black dark:text-white' : 'text-slate-400'}`}>{translations[language].auth.signup}</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {error && <div className="p-3 bg-rose-50 text-rose-600 text-[10px] font-black rounded-xl text-center">{error}</div>}
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 dark:text-white font-bold" placeholder={t.username} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 dark:text-white font-bold" placeholder={t.password} />

            {!isLogin && (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => setTosAccepted(!tosAccepted)} 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${tosAccepted ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-slate-200 dark:border-zinc-800 bg-transparent'}`}
                >
                  {tosAccepted && <Check size={14} className="text-white dark:text-black" strokeWidth={4} />}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.tos}</span>
              </label>
            )}

            <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-5 rounded-xl flex items-center justify-center gap-2 tracking-widest">
              {isLogin ? t.authenticate : t.initiate} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
