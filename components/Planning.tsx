
import React, { useState } from 'react';
import { Category, SavingGoal } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Target, Plus, Trash2, PiggyBank, Calculator } from 'lucide-react';
import { translations } from '../translations';

interface PlanningProps {
  budgets: Record<string, number>;
  savingGoals: SavingGoal[];
  onSaveBudget: (category: Category, limit: number) => void;
  onSaveSaving: (goals: SavingGoal[]) => void;
  lang?: 'de' | 'en';
  privacyMode?: boolean;
}

const Planning: React.FC<PlanningProps> = ({ budgets, savingGoals, onSaveBudget, onSaveSaving, lang = 'de', privacyMode = false }) => {
  const t = translations[lang];
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const addGoal = () => {
    if (!newGoalName || !newGoalTarget) return;
    const newGoal: SavingGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoalName,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0
    };
    onSaveSaving([...savingGoals, newGoal]);
    setNewGoalName('');
    setNewGoalTarget('');
  };

  const updateGoalAmount = (id: string, amount: number) => {
    onSaveSaving(savingGoals.map(g => g.id === id ? { ...g, currentAmount: amount } : g));
  };

  const removeGoal = (id: string) => {
    onSaveSaving(savingGoals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-10 sm:space-y-16 animate-in fade-in duration-500">
      {/* Category Budgets */}
      <div className="bg-white dark:bg-black p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-zinc-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 sm:mb-12">
          <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] w-fit">
            <Calculator size={28} className="sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter leading-tight">{t.planning.title}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t.planning.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {Object.values(Category).filter(c => c !== Category.SALARY).map(category => (
            <div key={category} className="p-5 sm:p-6 bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="p-2.5 sm:p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-black dark:text-white flex-shrink-0">
                  {CATEGORY_ICONS[category]}
                </div>
                <span className="font-black text-[10px] sm:text-xs uppercase italic tracking-wider truncate">
                  {t.categories[category]}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <input 
                    type={privacyMode ? "password" : "number"} 
                    placeholder="0" 
                    value={budgets[category] || ''} 
                    onChange={(e) => onSaveBudget(category, parseFloat(e.target.value) || 0)} 
                    className={`w-20 sm:w-24 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-right focus:ring-1 focus:ring-black dark:focus:ring-white outline-none font-black text-xs sm:text-sm ${privacyMode ? 'tracking-widest' : ''}`} 
                  />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400">€</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Goals Section */}
      <div className="bg-white dark:bg-black p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-zinc-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 sm:mb-12">
          <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] w-fit">
            <PiggyBank size={28} className="sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter leading-tight">{t.planning.savingsTitle}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Ziele setzen und Fortschritt tracken</p>
          </div>
        </div>
        
        <div className="space-y-5">
          {savingGoals.map(goal => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.id} className="p-5 sm:p-6 bg-slate-50 dark:bg-zinc-900/40 rounded-[2rem] border border-slate-100 dark:border-zinc-800 flex flex-col gap-6">
                <div className="flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl">
                      <Target size={16} />
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase italic tracking-wider">{goal.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Ziel: {privacyMode ? '••••' : `${goal.targetAmount.toLocaleString()} €`}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeGoal(goal.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">{t.planning.currentAmount}:</span>
                      <input 
                        type={privacyMode ? "password" : "number"} 
                        value={goal.currentAmount} 
                        onChange={(e) => updateGoalAmount(goal.id, parseFloat(e.target.value) || 0)} 
                        className="flex-1 sm:w-28 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-right font-black text-xs sm:text-sm dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none" 
                      />
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-[10px] font-black italic tracking-tight text-black dark:text-white">
                        {progress.toFixed(0)}% Erreicht
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-black dark:bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-8 mt-4 border-t border-slate-100 dark:border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5">
                <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1 px-1">Titel</label>
                <input 
                  type="text" 
                  placeholder={t.planning.name} 
                  value={newGoalName} 
                  onChange={(e) => setNewGoalName(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-5 py-4 text-[10px] font-black dark:text-white uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1 px-1">{t.planning.targetAmount}</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newGoalTarget} 
                  onChange={(e) => setNewGoalTarget(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-5 py-4 text-[10px] font-black dark:text-white uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                />
              </div>
              <div className="sm:col-span-4 flex items-end">
                <button 
                  onClick={addGoal} 
                  className="w-full h-[52px] bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                  <Plus size={16} /> {t.planning.addSaving}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
