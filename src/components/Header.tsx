"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import koinxLogo from "@/assets/koinx-logo.png";

export const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="w-full border-b border-card-border bg-white dark:bg-[#0A0A11]/80 backdrop-blur-xl sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img 
                        src={koinxLogo} 
                        alt="KoinX Logo" 
                        className="h-6 w-auto object-contain"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] rounded-xl transition-all active:scale-95 border border-transparent hover:border-card-border group cursor-pointer"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-white group-hover:rotate-45 transition-transform" />
                        ) : (
                            <Moon className="w-5 h-5 text-[#3E4D6E] group-hover:-rotate-12 transition-transform" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
