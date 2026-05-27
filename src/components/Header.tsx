"use client";

import React from 'react';
import { Menu } from 'lucide-react';
import koinxLogo from '@/assets/koinx-logo.png';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-white/5 bg-[#0A0A11] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={koinxLogo} 
            alt="KoinX Logo" 
            className="h-8 w-auto"
          />
        </div>
        
        <div className="md:hidden">
          <Menu className="w-6 h-6 text-white/70" />
        </div>
      </div>
    </header>
  );
};
