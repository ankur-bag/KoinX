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
  const formatValue = (val: number) => {
    return `${negative && val > 0 ? '-' : ''}${formatINR(Math.abs(val))}`;
  };

  return (
    <div className="flex justify-between items-center py-1 transition-colors">
      <span className={`text-sm tracking-tight ${bold ? 'font-semibold opacity-100' : 'font-medium opacity-60'}`}>{label}</span>
      <div className="flex gap-12 sm:gap-16">
        <div className="w-[100px] text-right">
          <span className={`text-sm tabular font-semibold ${negative && shortTerm !== 0 ? 'text-red-500' : ''}`}>
            {formatValue(shortTerm)}
          </span>
        </div>
        <div className="w-[100px] text-right">
          <span className={`text-sm tabular font-semibold ${negative && longTerm !== 0 ? 'text-red-500' : ''}`}>
            {formatValue(longTerm)}
          </span>
        </div>
      </div>
    </div>
  );
};
