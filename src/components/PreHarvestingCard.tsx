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
    <div className="bg-white dark:bg-card-bg border border-card-border rounded-xl p-8 flex flex-col h-full shadow-sm transition-colors group">
      <div className="flex justify-between items-start mb-10">
        <h3 className="text-xl font-bold tracking-tight text-[#0F1629] dark:text-white">Pre Harvesting</h3>
      </div>
      
      <div className="flex justify-end gap-12 sm:gap-16 mb-6">
        <div className="w-[100px] text-right">
          <span className="text-[10px] font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest">Short-term</span>
        </div>
        <div className="w-[100px] text-right">
          <span className="text-[10px] font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest">Long-term</span>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <CapitalGainsRow label="Profits" shortTerm={stcg.profits} longTerm={ltcg.profits} />
        <CapitalGainsRow label="Losses" shortTerm={stcg.losses} longTerm={ltcg.losses} negative />
        <div className="mt-4 pt-4 border-t border-card-border">
          <CapitalGainsRow label="Net Capital Gains" shortTerm={netStcg} longTerm={netLtcg} bold />
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-card-border flex items-baseline justify-between">
        <span className="text-base font-bold text-[#0F1629] dark:text-white">Realised Capital Gains:</span>
        <span className="text-3xl font-bold tabular text-[#0F1629] dark:text-white ml-4">
          {formatINR(totalRealised)}
        </span>
      </div>
    </div>
  );
};
