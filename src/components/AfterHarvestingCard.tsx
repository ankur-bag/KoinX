"use client";

import React, { useEffect } from 'react';
import type { StcgLtcg } from '@/lib/types';
import { formatINR } from '@/utils/formatters';
import { CapitalGainsRow } from './CapitalGainsRow';
import { useHarvesting } from '@/hooks/useHarvesting';
import confetti from 'canvas-confetti';

interface AfterHarvestingCardProps {
  stcg: StcgLtcg;
  ltcg: StcgLtcg;
  savings: number;
  stcgSavings: number;
  ltcgSavings: number;
}

export const AfterHarvestingCard: React.FC<AfterHarvestingCardProps> = ({ 
  stcg, 
  ltcg, 
  savings,
  stcgSavings,
  ltcgSavings
}) => {
  const { hasCelebrated, dispatch } = useHarvesting();
  const netStcg = stcg.profits - stcg.losses;
  const netLtcg = ltcg.profits - ltcg.losses;
  const totalEffective = netStcg + netLtcg;

  useEffect(() => {
    if (savings > 0 && !hasCelebrated) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#60A5FA', '#3B82F6'],
      });
      dispatch({ type: 'SET_CELEBRATED', payload: true });
    }
  }, [savings, hasCelebrated, dispatch]);

  return (
    <div className="bg-[#0052FE] rounded-xl p-8 flex flex-col h-full shadow-lg relative overflow-hidden group border border-[#0052FE]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <h3 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest text-xs opacity-60">Result</h3>
        <h3 className="text-xl font-bold tracking-tight text-white mb-2">After Harvesting</h3>
      </div>
      
      <div className="flex justify-end gap-12 sm:gap-16 mb-6 relative z-10">
        <div className="w-[100px] text-right">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Short-term</span>
        </div>
        <div className="w-[100px] text-right">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Long-term</span>
        </div>
      </div>

      <div className="space-y-4 flex-grow relative z-10 text-white">
        <CapitalGainsRow label="Profits" shortTerm={stcg.profits} longTerm={ltcg.profits} />
        <CapitalGainsRow label="Losses" shortTerm={stcg.losses} longTerm={ltcg.losses} negative />
        <div className="mt-4 pt-4 border-t border-white/20">
          <CapitalGainsRow label="Net Capital Gains" shortTerm={netStcg} longTerm={netLtcg} bold />
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-white/20 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-bold text-white">Effective Capital Gains:</span>
          <span className="text-3xl font-bold tabular text-white ml-4">
            {formatINR(totalEffective)}
          </span>
        </div>
        
        {savings > 0 && (
          <div className="flex items-center gap-2 mt-2 bg-white/10 py-2 px-4 rounded-lg w-fit">
            <span className="text-lg">??</span>
            <span className="text-sm font-bold text-white truncate">
              You are going to save upto <span className="text-white">{formatINR(savings)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
