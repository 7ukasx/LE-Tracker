
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="fixed bottom-8 right-8 z-[100] p-4 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] hover:scale-110 active:scale-95 transition-all duration-500 group overflow-hidden"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 transition-all duration-700 transform ${
            isDarkMode ? 'translate-y-10 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100 text-black'
          }`} 
          size={24} 
        />
        <Moon 
          className={`absolute inset-0 transition-all duration-700 transform ${
            isDarkMode ? 'translate-y-0 rotate-0 opacity-100 text-white' : '-translate-y-10 -rotate-90 opacity-0'
          }`} 
          size={24} 
        />
      </div>
      
      {/* Decorative inner glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent ${isDarkMode ? 'via-white/5' : 'via-black/5'} to-transparent`} />
    </button>
  );
};

export default ThemeToggle;
