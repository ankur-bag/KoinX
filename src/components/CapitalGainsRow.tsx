"use client";

import React from 'react';
import { formatINR } from '@/utils/formatters';

interface CapitalGainsRowProps {
  label: string;
  shortTerm: number;
  longTerm: number;
  bold?: boolean;
  negative?: boolean;
  lightTheme?: boolean;
}

export const CapitalGainsRow: React.FC<CapitalGainsRowProps> = ({ 
  label, 
  shortTerm, 
  longTerm, 
  bold = false,
  negative = false,
  lightTheme = true
}) => {
  const formatValue = (val: number) => {
    return `${negative && val > 0 ? '-' : ''}${formatINR(Math.abs(val))}`;
  };

  const textColor = lightTheme ? 'text-black dark:text-white' : 'text-white';
  const labelOpacity = bold ? 'opacity-100' : 'opacity-80';

  return (
    <div className={`flex justify-between items-center py-1 transition-colors min-h-[28px]`}>
      <span className={`text-sm tracking-tight ${textColor} ${labelOpacity} font-semibold`}>{label}</span>
      <div className="flex gap-12 sm:gap-16">
        <div className="w-[100px] text-right">
          <span className={`text-sm tabular font-bold ${negative && shortTerm !== 0 ? 'text-[#E11D48] dark:text-red-400' : textColor}`}>
            {formatValue(shortTerm)}
          </span>
        </div>
        <div className="w-[100px] text-right">
          <span className={`text-sm tabular font-bold ${negative && longTerm !== 0 ? 'text-[#E11D48] dark:text-red-400' : textColor}`}>
            {formatValue(longTerm)}
          </span>
        </div>
      </div>
    </div>
  );
};