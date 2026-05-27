"use client";

import React from 'react';
import { formatINR } from '@/utils/formatters';

interface CapitalGainsRowProps {
  label: string;
  shortTerm: number;
  longTerm: number;
  bold?: boolean;
  negative?: boolean;
}

export const CapitalGainsRow: React.FC<CapitalGainsRowProps> = ({ 
  label, 
  shortTerm, 
  longTerm, 
  bold = false,
  negative = false
}) => {
  return (
    <div className={`flex justify-between items-center py-3 transition-colors`}>
      <span className={`text-base tracking-tight ${bold ? 'text-white' : 'text-white/60'}`}>{label}</span>
      <div className="flex gap-4 sm:gap-6">
        <div className="w-[120px] sm:w-[160px] text-right">
          <span className={`text-base tabular font-medium ${negative && shortTerm !== 0 ? 'text-red-400' : ''}`}>
            {negative && shortTerm > 0 ? '-' : ''}{formatINR(Math.abs(shortTerm))}
          </span>
        </div>
        <div className="w-[120px] sm:w-[160px] text-right">
          <span className={`text-base tabular font-medium ${negative && longTerm !== 0 ? 'text-red-400' : ''}`}>
            {negative && longTerm > 0 ? '-' : ''}{formatINR(Math.abs(longTerm))}
          </span>
        </div>
      </div>
    </div>
  );
};
