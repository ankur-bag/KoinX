"use client";

import React from 'react';
import type { StcgLtcg } from '@/lib/types';
import { formatINR } from '@/utils/formatters';
import { CapitalGainsRow } from './CapitalGainsRow';

interface AfterHarvestingCardProps {
  stcg: StcgLtcg;
  ltcg: StcgLtcg;
  savings: number;
}

export const AfterHarvestingCard: React.FC<AfterHarvestingCardProps> = ({ stcg, ltcg, savings }) => {
  const netStcg = stcg.profits - stcg.losses;
  const netLtcg = ltcg.profits - ltcg.losses;
  const totalEffective = netStcg + netLtcg;

  return (
    <div className="bg-[#1D4ED8] rounded-2xl p-7 flex flex-col h-full shadow-2xl relative overflow-hidden group">
      {/* Precision grain texture or subtle pattern could go here */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <h3 className="text-xl font-medium tracking-tight">After Harvesting</h3>
      </div>
      
      <div className="flex justify-end gap-4 sm:gap-6 mb-4 relative z-10">
        <div className="w-[120px] sm:w-[160px] text-right">
          <span className="text-sm font-medium text-white/50 uppercase tracking-[0.2em]">Short-term</span>
        </div>
        <div className="w-[120px] sm:w-[160px] text-right">
          <span className="text-sm font-medium text-white/50 uppercase tracking-[0.2em]">Long-term</span>
        </div>
      </div>

      <div className="space-y-2 flex-grow relative z-10">
        <CapitalGainsRow label="Profits" shortTerm={stcg.profits} longTerm={ltcg.profits} />
        <CapitalGainsRow label="Losses" shortTerm={stcg.losses} longTerm={ltcg.losses} negative />
        <div className="mt-5 pt-5 border-t border-white/10">
          <CapitalGainsRow label="Net Capital Gains" shortTerm={netStcg} longTerm={netLtcg} bold />
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-white/20 flex flex-col gap-6 relative z-10">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-medium text-white/80">Effective Capital Gains</span>
          <span className="text-5xl font-medium tabular">{formatINR(totalEffective)}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex items-center gap-4 self-start px-6 py-3 bg-white/10 rounded-lg animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-sm font-medium uppercase tracking-wider text-white/90">Estimated Tax Savings</span>
            <span className="text-xl font-medium tabular text-white">{formatINR(savings)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
