
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Target, 
  Settings as SettingsIcon, 
  Plus, 
  Sun, 
  Moon,
  Menu,
  X,
  CreditCard,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  User as UserIcon,
  Home
} from 'lucide-react';
import { Transaction, Category, UserProfile, UserData, TransactionType, RecurringTransaction, SavingGoal } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Planning from './components/Planning';
import Settings from './components/Settings';
import AuthScreen from './components/AuthScreen';
import LandingPage from './components/LandingPage';
import ThemeToggle from './components/ThemeToggle';
import { translations } from './translations';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('fintrack_session'));
  const [showLanding, setShowLanding] = useState(!localStorage.getItem('fintrack_session'));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'planning' | 'settings'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [privacyMode, setPrivacyMode] = useState(() => localStorage.getItem('fintrack_privacy') === 'true');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ 
    name: '', currency: '€', monthlyGoal: 0, recurringTransactions: [], language: 'en', country: 'Germany'
  });

  const t = translations[profile.language || 'en'];

  const togglePrivacy = () => {
    const newVal = !privacyMode;
    setPrivacyMode(newVal);
    localStorage.setItem('fintrack_privacy', String(newVal));
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const syncRecurringItems = useCallback((currentTransactions: Transaction[], currentProfile: UserProfile) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = now.toISOString().split('T')[0];
    
    let updatedTransactions = [...currentTransactions];
    let hasChanged = false;

    if (currentProfile.monthlySalary && currentProfile.monthlySalary > 0) {
      const salaryDay = currentProfile.salaryDay || 1;
      const salaryDescription = 'Auto-Salary Credit';
      
      const alreadyExists = updatedTransactions.some(tx => {
        const txDate = new Date(tx.date);
        return tx.description === salaryDescription && 
               txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear;
      });

      if (!alreadyExists && now.getDate() >= salaryDay) {
        updatedTransactions.unshift({
          id: `auto-salary-${now.getTime()}`,
          amount: currentProfile.monthlySalary,
          type: TransactionType.INCOME,
          category: Category.SALARY,
          description: salaryDescription,
          date: todayStr
        });
        hasChanged = true;
      }
    }

    currentProfile.recurringTransactions.forEach((rec) => {
      const recDescription = `${rec.description} (Auto)`;
      
      const alreadyExists = updatedTransactions.some(tx => {
        const txDate = new Date(tx.date);
        return tx.description === recDescription && 
               txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear;
      });

      if (!alreadyExists && now.getDate() >= rec.dayOfMonth) {
        updatedTransactions.unshift({
          id: `auto-${rec.id}-${now.getTime()}`,
          amount: rec.amount,
          type: rec.type,
          category: rec.category,
          description: recDescription,
          date: todayStr
        });
        hasChanged = true;
      }
    });

    return { updatedTransactions, hasChanged };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (currentUser) {
      const userDataStr = localStorage.getItem(`fintrack_data_${currentUser}`);
      let loadedTransactions: Transaction[] = [];
      let loadedBudgets: Record<string, number> = {};
      let loadedSavingGoals: SavingGoal[] = [];
      let loadedProfile: UserProfile;
      
      if (userDataStr) {
        const data: UserData = JSON.parse(userDataStr);
        loadedTransactions = data.transactions;
        loadedBudgets = data.budgets;
        loadedProfile = data.profile;
        loadedSavingGoals = data.savingGoals || [];
      } else {
        loadedTransactions = [...INITIAL_TRANSACTIONS];
        loadedBudgets = {};
        loadedSavingGoals = [
          { id: '1', name: 'MacBook Pro', targetAmount: 2400, currentAmount: 850 },
          { id: '2', name: 'Bali Trip', targetAmount: 3000, currentAmount: 1200 }
        ];
        loadedProfile = { 
          name: currentUser, 
          currency: '€', 
          monthlyGoal: 500, 
          recurringTransactions: [], 
          language: 'en', 
          country: 'Germany' 
        };
      }

      const { updatedTransactions, hasChanged } = syncRecurringItems(loadedTransactions, loadedProfile);
      
      if (hasChanged) {
        setTransactions(updatedTransactions);
        const data: UserData = { transactions: updatedTransactions, budgets: loadedBudgets, profile: loadedProfile, savingGoals: loadedSavingGoals };
        localStorage.setItem(`fintrack_data_${currentUser}`, JSON.stringify(data));
      } else {
        setTransactions(loadedTransactions);
      }
      
      setBudgets(loadedBudgets);
      setProfile(loadedProfile);
      setSavingGoals(loadedSavingGoals);
    }
  }, [currentUser, syncRecurringItems]);

  useEffect(() => {
    if (currentUser) {
      const data: UserData = { transactions, budgets, profile, savingGoals };
      localStorage.setItem(`fintrack_data_${currentUser}`, JSON.stringify(data));
    }
  }, [transactions, budgets, profile, savingGoals, currentUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (username: string, initialProfile?: UserProfile) => {
    if (initialProfile) {
      const data: UserData = { transactions: [], budgets: {}, profile: initialProfile, savingGoals: [] };
      localStorage.setItem(`fintrack_data_${username}`, JSON.stringify(data));
    }
    localStorage.setItem('fintrack_session', username);
    setCurrentUser(username);
    setShowLanding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('fintrack_session');
    setCurrentUser(null);
    setShowLanding(true);
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('fintrack_users') || '[]');
    const updatedUsers = users.filter((u: any) => u.username !== currentUser);
    localStorage.setItem('fintrack_users', JSON.stringify(updatedUsers));
    localStorage.removeItem(`fintrack_data_${currentUser}`);
    handleLogout();
  };

  if (showLanding && !currentUser) {
    return (
      <>
        <LandingPage onEnter={() => setShowLanding(false)} />
        <ThemeToggle isDarkMode={isDarkMode} toggle={toggleTheme} />
      </>
    );
  }

  if (!currentUser) return (
    <>
      <AuthScreen onLogin={handleLogin} />
      <ThemeToggle isDarkMode={isDarkMode} toggle={toggleTheme} />
    </>
  );

  const NavItem = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`group w-full flex items-center justify-between px-5 py-4 rounded-[1.25rem] transition-all duration-300 relative ${
        activeTab === id 
        ? 'bg-slate-100 dark:bg-zinc-900 text-black dark:text-white shadow-sm' 
        : 'text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-900/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeTab === id ? 'text-black dark:text-white' : 'text-slate-300 dark:text-zinc-700'}`} />
        <span className={`font-bold text-[11px] uppercase tracking-[0.15em] transition-all ${activeTab === id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
          {label}
        </span>
      </div>
      {activeTab === id && (
        <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-in fade-in zoom-in duration-300" />
      )}
    </button>
  );

  const BottomNavItem = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 relative flex ${
        activeTab === id ? 'text-black dark:text-white' : 'text-slate-400'
      }`}
    >
      <div className="relative">
        <Icon size={20} className={`transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'scale-100'}`} />
        {activeTab === id && (
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-black dark:bg-white border-2 border-white dark:border-zinc-950 animate-pulse" />
        )}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.05em]">{label}</span>
    </button>
  );

  return (
    <div className="h-screen flex bg-[#fdfdfd] dark:bg-black transition-colors duration-500 font-inter text-black dark:text-white overflow-hidden">
      
      <ThemeToggle isDarkMode={isDarkMode} toggle={toggleTheme} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Static Sidebar for Desktop */}
      <aside className={`fixed lg:relative z-50 h-full w-[280px] bg-white dark:bg-black border-r border-slate-100 dark:border-zinc-900 transition-transform duration-500 ease-in-out transform flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center mb-12 px-2 flex-shrink-0">
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-black dark:text-white">
              LE Tracker
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <NavItem id="dashboard" label={t.nav.dashboard} icon={LayoutDashboard} />
            <NavItem id="transactions" label={t.nav.transactions} icon={Receipt} />
            <NavItem id="planning" label={t.nav.planning} icon={Target} />
            <NavItem id="settings" label={t.nav.settings} icon={SettingsIcon} />
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-8 space-y-6 flex-shrink-0">
            <div className="group p-4 bg-slate-50 dark:bg-zinc-900/30 rounded-2xl border border-slate-100 dark:border-zinc-800/50 flex items-center gap-4 transition-all hover:bg-slate-100 dark:hover:bg-zinc-900/60 cursor-pointer" onClick={() => setActiveTab('settings')}>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 overflow-hidden flex-shrink-0">
                {profile.customAvatar ? <img src={profile.customAvatar} className="w-full h-full object-cover grayscale" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || profile.name}`} className="w-full h-full grayscale" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider truncate">{profile.name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Premium</p>
              </div>
              <ChevronRight size={12} className="text-slate-300" />
            </div>

            <button onClick={handleLogout} className="group w-full flex items-center justify-between px-5 py-4 text-rose-500 bg-rose-50/30 dark:bg-rose-950/10 rounded-2xl border border-rose-100/50 transition-all hover:bg-rose-500 hover:text-white duration-300">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.nav.logout}</span>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Independent Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-[#fdfdfd] dark:bg-black custom-scrollbar">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 flex-shrink-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-3xl font-black tracking-tighter uppercase italic">{t.nav[activeTab as keyof typeof t.nav]}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePrivacy} 
              className={`p-3.5 rounded-2xl transition-all duration-300 ${privacyMode ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50'}`}
              title="Privacy Mode"
            >
              {privacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button onClick={() => setShowAddModal(true)} className="hidden lg:flex bg-black dark:bg-white text-white dark:text-black items-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95">
              <Plus className="w-4 h-4" /> <span>{t.nav.addItem}</span>
            </button>
          </div>
        </header>

        <div className="p-6 sm:p-12 max-w-7xl w-full mx-auto pb-32 lg:pb-12 flex-1">
          {activeTab === 'dashboard' && <Dashboard transactions={transactions} budgets={budgets} savingGoals={savingGoals} profile={profile} privacyMode={privacyMode} />}
          {activeTab === 'transactions' && <TransactionList transactions={transactions} onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))} lang={profile.language} privacyMode={privacyMode} />}
          {activeTab === 'planning' && <Planning budgets={budgets} savingGoals={savingGoals} onSaveBudget={(cat, limit) => setBudgets(b => ({...b, [cat]: limit}))} onSaveSaving={(goals) => setSavingGoals(goals)} lang={profile.language} privacyMode={privacyMode} />}
          {activeTab === 'settings' && <Settings profile={profile} privacyMode={privacyMode} isDarkMode={isDarkMode} onToggleTheme={setIsDarkMode} onDeleteAccount={handleDeleteAccount} onUpdate={(newProfile) => {
            const { updatedTransactions, hasChanged } = syncRecurringItems(transactions, newProfile);
            if (hasChanged) setTransactions(updatedTransactions);
            setProfile(newProfile);
          }} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation with Prominent Central Plus Button */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-zinc-900 flex justify-around items-center px-4 py-3 pb-8 sm:pb-3">
        <BottomNavItem id="dashboard" label={profile.language === 'de' ? 'Start' : 'Home'} icon={Home} />
        <BottomNavItem id="transactions" label={profile.language === 'de' ? 'Umsätze' : 'Activity'} icon={Receipt} />
        
        {/* Central Prominent Floating Plus Button */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-90 transition-transform ring-[6px] ring-white dark:ring-black"
          >
            <Plus size={34} strokeWidth={2.5} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.1em] mt-2 text-slate-400">
            {profile.language === 'de' ? 'Neu' : 'New'}
          </span>
        </div>

        <BottomNavItem id="planning" label={profile.language === 'de' ? 'Planer' : 'Planner'} icon={Target} />
        <BottomNavItem id="settings" label={profile.language === 'de' ? 'Profil' : 'Profile'} icon={UserIcon} />
      </nav>

      {showAddModal && <TransactionForm onAdd={(tx) => setTransactions([{...tx, id: Math.random().toString(36).substr(2,9)}, ...transactions])} onClose={() => setShowAddModal(false)} lang={profile.language} />}
    </div>
  );
};

export default App;
