"use client";

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-[#F3F7FF] dark:bg-blue-500/5 border border-[#CCDEFF] dark:border-blue-500/20 rounded-xl overflow-hidden shadow-sm transition-all">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-[#0052FE]/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-[#0052FE] rounded-full p-1">
                            <Info className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-black dark:text-white tracking-tight">Important Notes & Disclaimers</span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-black dark:text-white/60" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-black dark:text-white/60" />
                    )}
                </button>

                {isExpanded && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <ul className="space-y-3 pl-8">
                            {[
                                "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
                                "Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.",
                                "Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.",
                                "Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.",
                                "Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted."
                            ].map((text, i) => (
                                <li key={i} className="list-disc text-xs font-medium text-black dark:text-white/80 leading-relaxed text-balance">
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};