
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  privacyMode?: boolean;
  trend?: number; // percentage change
  trendLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, privacyMode = false, trend, trendLabel }) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNeutral = trend === 0;

  return (
    <div className="bg-white dark:bg-black p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-900 flex flex-col justify-between group hover:border-black dark:hover:border-white transition-all duration-500">
      <div className="flex justify-between items-center mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors">
          {title}
        </span>
        <div className="text-slate-300 dark:text-slate-800 group-hover:text-black dark:group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-4xl font-black text-black dark:text-white tracking-tighter italic">
          {privacyMode ? '••••' : value}
        </h3>
        
        {trend !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
              isNeutral ? 'bg-slate-50 text-slate-400' :
              isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30'
            }`}>
              {!isNeutral && (isPositive ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />)}
              {Math.abs(trend).toFixed(1)}%
            </div>
            {trendLabel && (
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
