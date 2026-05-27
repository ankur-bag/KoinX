"use client";

import React from 'react';
import type { StcgLtcg } from '@/lib/types';
import { formatINR } from '@/utils/formatters';
import { CapitalGainsRow } from './CapitalGainsRow';

interface PreHarvestingCardProps {
  stcg: StcgLtcg;
  ltcg: StcgLtcg;
}

export const PreHarvestingCard: React.FC<PreHarvestingCardProps> = ({ stcg, ltcg }) => {
  const netStcg = stcg.profits - stcg.losses;
  const netLtcg = ltcg.profits - ltcg.losses;
  const totalRealised = netStcg + netLtcg;

  return (
    <div className="bg-pre-card rounded-2xl p-7 flex flex-col h-full border border-white/5 shadow-2xl relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-white/5 group-hover:bg-white/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-xl font-medium tracking-tight">Pre Harvesting</h3>
      </div>
      
      <div className="flex justify-end gap-4 sm:gap-6 mb-4">
        <div className="w-[120px] sm:w-[160px] text-right">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em]">Short-term</span>
        </div>
        <div className="w-[120px] sm:w-[160px] text-right">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em]">Long-term</span>
        </div>
      </div>

      <div className="space-y-2 flex-grow">
        <CapitalGainsRow label="Profits" shortTerm={stcg.profits} longTerm={ltcg.profits} />
        <CapitalGainsRow label="Losses" shortTerm={stcg.losses} longTerm={ltcg.losses} negative />
        <div className="mt-5 pt-5 border-t border-white/10">
          <CapitalGainsRow label="Net Capital Gains" shortTerm={netStcg} longTerm={netLtcg} bold />
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-white/10 flex justify-between items-baseline">
        <span className="text-lg font-medium text-muted-foreground">Realised Capital Gains</span>
        <span className="text-5xl font-medium tabular">{formatINR(totalRealised)}</span>
      </div>
    </div>
  );
};
