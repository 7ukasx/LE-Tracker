
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Category, TransactionType, Transaction } from '../types';
import { translations } from '../translations';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
  lang?: 'de' | 'en';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose, lang = 'de' }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const t = translations[lang].form;
  const categoriesT = translations[lang].categories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onAdd({ amount: parseFloat(amount), description, category, type, date });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-black w-full max-w-md rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-black italic uppercase tracking-tighter">{t.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-400"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' : 'text-slate-400'}`}>{t.expense}</button>
            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg ${type === TransactionType.INCOME ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' : 'text-slate-400'}`}>{t.income}</button>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.amount}</label>
            <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-sm font-bold dark:text-white" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.description}</label>
            <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-sm font-bold dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.category}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-xs font-bold dark:text-white">
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{categoriesT[cat]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.date}</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-xs font-bold dark:text-white" />
            </div>
          </div>
          <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-5 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl"><Plus size={18} /> {t.save}</button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
