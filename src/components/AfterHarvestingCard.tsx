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
    <div className="bg-[#0052FE] rounded-2xl p-8 flex flex-col h-full shadow-lg relative overflow-hidden group border border-[#0052FE] transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex flex-col">
          <h3 className="text-white uppercase tracking-widest text-[11px] font-semibold opacity-80">Result</h3>
          <h3 className="text-2xl font-semibold tracking-tight text-white mt-1">After Harvesting</h3>
        </div>
      </div>
      
      <div className="flex justify-end gap-12 sm:gap-16 mb-4 relative z-10">
        <div className="w-[100px] text-right">
          <span className="text-[11px] font-semibold text-white uppercase tracking-widest opacity-80">Short-term</span>
        </div>
        <div className="w-[100px] text-right">
          <span className="text-[11px] font-semibold text-white uppercase tracking-widest opacity-80">Long-term</span>
        </div>
      </div>

      <div className="space-y-4 flex-grow relative z-10 text-white">
        <CapitalGainsRow label="Profits" shortTerm={stcg.profits} longTerm={ltcg.profits} lightTheme={false} />
        <CapitalGainsRow label="Losses" shortTerm={stcg.losses} longTerm={ltcg.losses} negative lightTheme={false} />
        <div className="mt-4 pt-4 border-t border-white/20">
          <CapitalGainsRow label="Net Capital Gains" shortTerm={netStcg} longTerm={netLtcg} bold lightTheme={false} />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/20 flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-white">Effective Capital Gains:</span>
          <span className="text-3xl font-semibold tabular text-white ml-4">
            {formatINR(totalEffective)}
          </span>
        </div>
        
        {savings > 0 && (
          <div className="relative group/tooltip flex items-center gap-2 mt-4 bg-white/15 py-3 px-5 rounded-xl w-fit cursor-help border border-white/10 shadow-lg active:scale-95 transition-all">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-semibold text-white truncate">
              You are going to save upto <span className="text-white font-semibold">{formatINR(savings)}</span>
            </span>

            {/* Tooltip Breakdown */}
            <div className="absolute bottom-full left-0 mb-4 opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-none z-50 translate-y-2 group-hover/tooltip:translate-y-0">
              <div className="bg-[#0A0A11] border border-white/10 p-5 rounded-2xl shadow-2xl min-w-[220px]">
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Savings Breakdown</p>
                <div className="space-y-3">
                  <div className="flex justify-between gap-8">
                    <span className="text-xs text-white/70 font-semibold">STCG Offset</span>
                    <span className="text-xs font-semibold text-green-400">{formatINR(stcgSavings)}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-xs text-white/70 font-semibold">LTCG Offset</span>
                    <span className="text-xs font-semibold text-green-400">{formatINR(ltcgSavings)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between gap-8">
                  <span className="text-xs font-semibold text-white">Total Savings</span>
                  <span className="text-xs font-semibold text-white">{formatINR(savings)}</span>
                </div>
              </div>
              <div className="w-3 h-3 bg-[#0A0A11] border-r border-b border-white/10 rotate-45 ml-6 -mt-1.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};