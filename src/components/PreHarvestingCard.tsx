"use client";

import React from "react";
import type { StcgLtcg } from "@/lib/types";
import { formatINR } from "@/utils/formatters";
import { CapitalGainsRow } from "./CapitalGainsRow";
import { useTheme } from "@/context/ThemeContext";

interface PreHarvestingCardProps {
  stcg: StcgLtcg;
  ltcg: StcgLtcg;
}

export const PreHarvestingCard: React.FC<PreHarvestingCardProps> = ({ stcg, ltcg }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const netStcg = stcg.profits - stcg.losses;
  const netLtcg = ltcg.profits - ltcg.losses;
  const totalRealised = netStcg + netLtcg;

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 flex flex-col h-full shadow-sm border border-[#E5E7EB] dark:border-white/5 transition-colors">
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h3 className="text-[#0052FE] dark:text-blue-400 uppercase tracking-widest text-[11px] font-semibold">Baseline</h3>
          <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-white mt-1">Pre-Harvesting</h3>
        </div>
      </div>
      
      <div className="flex justify-end gap-12 sm:gap-16 mb-4">
        <div className="w-[100px] text-right">
          <span className="text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-widest">Short-term</span>
        </div>
        <div className="w-[100px] text-right">
          <span className="text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-widest">Long-term</span>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <CapitalGainsRow label="Profits" shortTerm={stcg.profits} longTerm={ltcg.profits} lightTheme={isLight} />
        <CapitalGainsRow label="Losses" shortTerm={stcg.losses} longTerm={ltcg.losses} negative lightTheme={isLight} />
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-white/10">
          <CapitalGainsRow label="Net Capital Gains" shortTerm={netStcg} longTerm={netLtcg} bold lightTheme={isLight} />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-[#E5E7EB] dark:border-white/10 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-black dark:text-white/60">Realised Capital Gains:</span>
          <span className="text-3xl font-semibold tabular text-black dark:text-white ml-4">
            {formatINR(totalRealised)}
          </span>
        </div>
        <div className="h-[44px]" /> 
      </div>
    </div>
  );
};