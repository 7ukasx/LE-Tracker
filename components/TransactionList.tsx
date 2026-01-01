
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Trash2, Search, Calendar, Tag } from 'lucide-react';
import { translations } from '../translations';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  lang?: 'de' | 'en';
  privacyMode?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, lang = 'de', privacyMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[lang];

  const filteredAndSorted = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (!searchTerm.trim()) return sorted;

    const lowerSearch = searchTerm.toLowerCase();
    return sorted.filter(item => {
      const categoryName = t.categories[item.category].toLowerCase();
      const description = item.description.toLowerCase();
      const amount = item.amount.toString();
      
      return categoryName.includes(lowerSearch) || 
             description.includes(lowerSearch) || 
             amount.includes(lowerSearch);
    });
  }, [transactions, searchTerm, t.categories]);

  return (
    <div className="bg-white dark:bg-black rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-900 overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.nav.transactions}</h3>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={14} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={t.form.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-[10px] font-black uppercase tracking-widest dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
          />
        </div>
      </div>
      
      {/* Mobile Card List View */}
      <div className="block sm:hidden divide-y divide-slate-50 dark:divide-zinc-900">
        {filteredAndSorted.length > 0 ? filteredAndSorted.map((item) => (
          <div key={item.id} className="p-5 flex items-center gap-4 group active:bg-slate-50 dark:active:bg-zinc-900 transition-colors">
            <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center ${item.type === TransactionType.INCOME ? 'bg-slate-100 dark:bg-zinc-800 text-black dark:text-white' : 'bg-slate-50 dark:bg-zinc-900 text-slate-400'}`}>
              {CATEGORY_ICONS[item.category]}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="font-black text-[11px] uppercase italic tracking-wider truncate leading-tight">{item.description}</p>
                <p className={`text-sm font-black italic tracking-tight whitespace-nowrap ${item.type === TransactionType.INCOME ? 'text-black dark:text-white' : 'text-slate-400'}`}>
                  {privacyMode 
                    ? '••••' 
                    : `${item.type === TransactionType.INCOME ? '+' : '-'} ${item.amount.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 })}`}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  <Tag size={8} /> {t.categories[item.category]}
                </span>
                <span className="text-slate-200 dark:text-zinc-800">•</span>
                <span className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={8} /> {new Date(item.date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}
                </span>
              </div>
            </div>

            <button 
              onClick={() => onDelete(item.id)} 
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
              aria-label="Delete transaction"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )) : (
          <div className="px-8 py-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Keine Ergebnisse gefunden</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-950">
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.form.category}</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.form.description}</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.form.date}</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.form.amount}</th>
              <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
            {filteredAndSorted.length > 0 ? filteredAndSorted.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-100 dark:bg-zinc-800 text-black dark:text-white rounded-xl">{CATEGORY_ICONS[item.category]}</div>
                    <span className="font-black text-xs uppercase italic tracking-wider">{t.categories[item.category]}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">{item.description}</td>
                <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</td>
                <td className="px-8 py-6 text-right">
                  <span className={`text-sm font-black italic tracking-tight ${item.type === TransactionType.INCOME ? 'text-black dark:text-white' : 'text-slate-400'}`}>
                    {privacyMode 
                      ? '••••' 
                      : `${item.type === TransactionType.INCOME ? '+' : '-'} ${item.amount.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 })}`}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <button onClick={() => onDelete(item.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Keine Ergebnisse gefunden</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
