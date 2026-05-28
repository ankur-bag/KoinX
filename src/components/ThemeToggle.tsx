"use client";

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-card-bg border border-card-border hover:bg-foreground/5 transition-colors group relative"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun 
          className={`w-5 h-5 transition-all duration-500 absolute ${
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        <Moon 
          className={`w-5 h-5 transition-all duration-500 absolute ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
      
      {/* Subtle tooltip on hover */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-[10px] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};