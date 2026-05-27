"use client";

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const notes = [
    "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
    "Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.",
    "Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.",
    "Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.",
    "Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted."
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.04] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-medium text-sm tracking-tight text-white/90">Important Notes & Disclaimers</span>
          </div>
          <div className={`p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-all ${isExpanded ? 'rotate-180' : ''}`}>
             <ChevronDown className="w-4 h-4 text-white/40" />
          </div>
        </button>
        
        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="px-16 pb-6 pt-2">
              <ul className="space-y-3">
                {notes.map((note, index) => (
                  <li key={index} className="text-sm text-white/50 leading-relaxed relative before:content-[''] before:absolute before:-left-5 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-white/10 before:rounded-full">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
