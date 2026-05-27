"use client";

import React from 'react';
import type { Holding } from '@/lib/types';
import { formatINR, formatCoinBalance, formatGain } from '@/utils/formatters';
import { Checkbox } from './Checkbox';
import { CoinLogo } from './CoinLogo';

interface HoldingRowProps {
  holding: Holding;
  isSelected: boolean;
  onToggle: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  isFocused?: boolean;
}

export const HoldingRow: React.FC<HoldingRowProps> = ({ holding, isSelected, onToggle, isFocused }) => {
  const totalValue = holding.totalHolding * holding.currentPrice;
  const isZeroState = holding.stcg.gain === 0 && holding.ltcg.gain === 0;

  return (
    <tr 
      className={`border-b border-card-border transition-all cursor-pointer group/row 
        ${isSelected ? 'bg-blue-500/[0.04]' : 'hover:bg-foreground/[0.01]'} 
        ${isFocused ? 'bg-foreground/[0.02]' : ''}
        ${isZeroState ? 'opacity-40 grayscale-[0.5]' : ''}`}
      onClick={onToggle}
    >
      <td className="py-5 px-4 pl-8" onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={isSelected} 
          onChange={() => onToggle()} 
          ariaLabel={`Select ${holding.coinName}`}
        />
      </td>
      
      <td className="py-5 px-4">
        <div className="flex items-center gap-3">
          <CoinLogo src={holding.logo} coin={holding.coin} size={28} />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[#0F1629] dark:text-white tracking-tight">{holding.coinName}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{holding.coin}</span>
          </div>
        </div>
      </td>

      <td className="py-5 px-4 hidden md:table-cell">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#0F1629] dark:text-white tabular">{formatCoinBalance(holding.totalHolding)} {holding.coin}</span>
          <span className="text-[10px] font-medium text-muted-foreground tabular uppercase tracking-wider">${holding.currentPrice.toLocaleString()}/{holding.coin}</span>
        </div>
      </td>

      <td className="py-5 px-4 hidden lg:table-cell text-center">
        <span className="text-sm font-semibold text-[#0F1629] dark:text-white tabular">{formatINR(totalValue)}</span>
      </td>

      <td className="py-5 px-4">
        <div className="flex flex-col">
          <span className={`text-sm font-semibold tabular ${holding.stcg.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {holding.stcg.gain >= 0 ? '+' : ''}{formatGain(holding.stcg.gain)}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tabular">{formatCoinBalance(holding.stcg.balance)} {holding.coin}</span>
        </div>
      </td>

      <td className="py-5 px-4">
        <div className="flex flex-col">
          <span className={`text-sm font-semibold tabular ${holding.ltcg.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {holding.ltcg.gain >= 0 ? '+' : ''}{formatGain(holding.ltcg.gain)}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tabular">{formatCoinBalance(holding.ltcg.balance)} {holding.coin}</span>
        </div>
      </td>

      <td className="py-5 px-4 pr-8 text-right">
        <span className={`text-sm font-semibold transition-all ${isSelected ? 'text-[#0F1629] dark:text-white' : 'text-[#3E4D6E]/40 dark:text-white/20'}`}>
          {isSelected ? `${formatCoinBalance(holding.totalHolding)} ${holding.coin}` : '-'}
        </span>
      </td>
    </tr>
  );
};
