
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, BarChart, Bar, Cell } from 'recharts';
import { Transaction, TransactionType, UserProfile, Category, SavingGoal } from '../types';
import StatCard from './StatCard';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, Clock, Target, BarChart3 } from 'lucide-react';
import { translations } from '../translations';
import { CATEGORY_ICONS } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Record<string, number>;
  savingGoals: SavingGoal[];
  profile: UserProfile;
  privacyMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, budgets, savingGoals, profile, privacyMode = false }) => {
  const t = translations[profile.language || 'de'].dashboard;
  const categoriesT = translations[profile.language || 'de'].categories;

  // Monthly stats grouping for comparisons
  const monthlyStatsMap = useMemo(() => {
    const months: Record<string, { income: number, expense: number }> = {};
    transactions.forEach(tx => {
      const key = tx.date.substring(0, 7); // YYYY-MM
      if (!months[key]) months[key] = { income: 0, expense: 0 };
      if (tx.type === TransactionType.INCOME) months[key].income += tx.amount;
      else months[key].expense += tx.amount;
    });
    return months;
  }, [transactions]);

  const trends = useMemo(() => {
    const now = new Date();
    const curMonthKey = now.toISOString().substring(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = lastMonth.toISOString().substring(0, 7);

    const cur = monthlyStatsMap[curMonthKey] || { income: 0, expense: 0 };
    const prev = monthlyStatsMap[lastMonthKey] || { income: 0, expense: 0 };

    const calculateDelta = (c: number, p: number) => {
      if (p === 0) return c > 0 ? 100 : 0;
      return ((c - p) / p) * 100;
    };

    return {
      income: calculateDelta(cur.income, prev.income),
      expense: calculateDelta(cur.expense, prev.expense),
      balance: calculateDelta(cur.income - cur.expense, prev.income - prev.expense)
    };
  }, [monthlyStatsMap]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const performanceData = useMemo(() => {
    const months = Object.entries(monthlyStatsMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6); // Last 6 months
    
    if (months.length === 0) return [];
    
    const maxExpense = Math.max(...months.map(m => m[1].expense), 1);
    
    return months.map(([key, data]) => ({
      name: new Date(key + '-01').toLocaleDateString(profile.language, { month: 'short' }),
      expense: data.expense,
      income: data.income,
      percentage: (data.expense / maxExpense) * 100
    }));
  }, [monthlyStatsMap, profile.language]);

  const latestTransaction = useMemo(() => {
    if (transactions.length === 0) return null;
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [transactions]);

  const chartData = useMemo(() => {
    const dateMap = new Map<string, { date: string, income: number, expense: number }>();
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedTx.forEach(t => {
      if (!dateMap.has(t.date)) dateMap.set(t.date, { date: t.date, income: 0, expense: 0 });
      const entry = dateMap.get(t.date);
      if (entry) {
        if (t.type === TransactionType.INCOME) entry.income += t.amount;
        else entry.expense += t.amount;
      }
    });

    return Array.from(dateMap.values()).map(d => ({
      ...d,
      net: d.income - d.expense
    })).slice(-10);
  }, [transactions]);

  const budgetProgress = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === TransactionType.EXPENSE && d.getMonth() === curMonth && d.getFullYear() === curYear;
    }).forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(budgets).map(([cat, limit]) => {
      const spent = categoryTotals[cat] || 0;
      return { name: cat, spent, limit, percent: limit > 0 ? Math.min((spent / limit) * 100, 100) : 0 };
    });
  }, [transactions, budgets]);

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 pb-20 lg:pb-0">
      
      {/* Mobile View: Simplified */}
      <div className="lg:hidden space-y-6">
        <div className="bg-black dark:bg-white p-8 rounded-[2rem] text-white dark:text-black shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[1.7]"><Wallet size={120} /></div>
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{t.balance}</span>
            <h3 className="text-5xl font-black italic tracking-tighter">
              {privacyMode ? '••••' : `${stats.balance.toLocaleString()} ${profile.currency}`}
            </h3>
            <div className="flex items-center gap-2 mt-4">
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trends.balance >= 0 ? 'bg-white/10 text-emerald-400' : 'bg-white/10 text-rose-400'}`}>
                {trends.balance >= 0 ? '+' : ''}{trends.balance.toFixed(1)}%
              </span>
              <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{t.vsLastMonth}</span>
            </div>
          </div>
        </div>

        {/* Comparison Section Mobile */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">{t.income}</span>
              <p className="font-black italic text-xl">{privacyMode ? '•••' : `${stats.income.toLocaleString()}`}</p>
              <span className={`text-[9px] font-black ${trends.income >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trends.income >= 0 ? '+' : ''}{trends.income.toFixed(0)}%
              </span>
           </div>
           <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">{t.expense}</span>
              <p className="font-black italic text-xl">{privacyMode ? '•••' : `${stats.expenses.toLocaleString()}`}</p>
              <span className={`text-[9px] font-black ${trends.expense >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {trends.expense >= 0 ? '+' : ''}{trends.expense.toFixed(0)}%
              </span>
           </div>
        </div>

        {/* Performance Distribution Chart Mobile */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 space-y-6">
           <div className="flex justify-between items-center">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.monthlyGrowth}</h4>
             <BarChart3 size={14} className="text-slate-300" />
           </div>
           <div className="flex items-end justify-between h-32 gap-2">
             {performanceData.map((d, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2">
                 <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-t-lg relative group overflow-hidden" style={{ height: `${Math.max(d.percentage, 10)}%` }}>
                   <div className="absolute inset-0 bg-black dark:bg-white opacity-20 group-hover:opacity-40 transition-opacity" />
                 </div>
                 <span className="text-[8px] font-black uppercase text-slate-400">{d.name}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Savings Goals Mobile Section */}
        {savingGoals.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.savings}</h4>
              <Target size={12} className="text-slate-300" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {savingGoals.map(goal => (
                <div key={goal.id} className="min-w-[180px] bg-white dark:bg-zinc-900 p-5 rounded-[1.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-wider truncate">{goal.name}</p>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-black dark:bg-white" style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    {privacyMode ? '••••' : `${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title={t.balance} 
          value={`${stats.balance.toLocaleString()} ${profile.currency}`} 
          icon={<Wallet className="w-5 h-5" />} 
          privacyMode={privacyMode}
          trend={trends.balance}
          trendLabel={t.vsLastMonth}
        />
        <StatCard 
          title={t.income} 
          value={`${stats.income.toLocaleString()} ${profile.currency}`} 
          icon={<TrendingUp className="w-5 h-5" />} 
          privacyMode={privacyMode}
          trend={trends.income}
          trendLabel={t.vsLastMonth}
        />
        <StatCard 
          title={t.expense} 
          value={`${stats.expenses.toLocaleString()} ${profile.currency}`} 
          icon={<TrendingDown className="w-5 h-5" />} 
          privacyMode={privacyMode}
          trend={trends.expense}
          trendLabel={t.vsLastMonth}
        />
      </div>

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Flow Chart */}
          <div className="bg-white dark:bg-black p-10 rounded-[3rem] border border-slate-100 dark:border-slate-900 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-12 text-slate-400">{t.cashFlow}</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px'}} 
                    itemStyle={{color: '#fff'}}
                    labelStyle={{fontWeight: 'black', marginBottom: '4px', textTransform: 'uppercase'}}
                    formatter={(value: any) => privacyMode ? '••••' : value}
                  />
                  <Area type="monotone" dataKey="income" stroke="none" fill="currentColor" fillOpacity={0.05} className="text-black dark:text-white" />
                  <Area type="monotone" dataKey="expense" stroke="#94a3b8" strokeWidth={2} fill="none" />
                  <Line type="monotone" dataKey="net" stroke="currentColor" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} className="text-black dark:text-white" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

         

        <div className="space-y-8">
          {/* Budget Progress Vertical */}
          <div className="bg-white dark:bg-black p-10 rounded-[3rem] border border-slate-100 dark:border-slate-900">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-12 text-slate-400">{t.budgetPulse}</h3>
            <div className="space-y-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {budgetProgress.length > 0 ? budgetProgress.map((bp) => (
                <div key={bp.name} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="font-black text-xs uppercase italic tracking-wider">{categoriesT[bp.name as keyof typeof categoriesT]}</span>
                    <span className="text-[10px] font-bold text-slate-500">{bp.percent.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 bg-black dark:bg-white`} style={{ width: `${bp.percent}%` }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                    <span>{t.spent}: {privacyMode ? '••••' : bp.spent.toFixed(0)}</span>
                    <span>{t.limit}: {privacyMode ? '••••' : bp.limit}</span>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300"><ArrowUpRight className="w-6 h-6" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.noBudgets}</p>
                </div>
              )}
            </div>
          </div>

          {/* Savings Summary Desktop */}
          <div className="bg-white dark:bg-black p-10 rounded-[3rem] border border-slate-100 dark:border-slate-900">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-slate-400">{t.savings}</h3>
            <div className="space-y-8">
              {savingGoals.length > 0 ? savingGoals.map(goal => {
                const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-[10px] uppercase italic tracking-widest">{goal.name}</h4>
                      <span className="text-[9px] font-black text-slate-400">{percent.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-black dark:bg-white transition-all duration-1000" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              }) : (
                <p className="text-center py-10 text-[10px] font-black uppercase text-slate-400 italic">{t.noSavings}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
