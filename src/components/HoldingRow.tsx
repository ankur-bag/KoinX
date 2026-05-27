"use client";

import React from 'react';
import type { Holding } from '@/lib/types';
import { formatINR, formatCoinBalance, formatGain } from '@/utils/formatters';
import { Checkbox } from './Checkbox';
import { CoinLogo } from './CoinLogo';

interface HoldingRowProps {
  holding: Holding;
  isSelected: boolean;
  onToggle: () => void;
}

export const HoldingRow: React.FC<HoldingRowProps> = ({ holding, isSelected, onToggle }) => {
  const totalValue = holding.totalHolding * holding.currentPrice;

  return (
    <tr 
      className={`border-b border-white/[0.03] transition-all cursor-pointer group/row ${isSelected ? 'bg-blue-500/[0.04]' : 'hover:bg-white/[0.02]'}`}
      onClick={onToggle}
    >
      <td className="py-5 px-4 pl-8" onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={isSelected} 
          onChange={onToggle} 
          ariaLabel={`Select ${holding.coinName}`}
        />
      </td>
      
      <td className="py-5 px-4">
        <div className="flex items-center gap-4">
          <CoinLogo src={holding.logo} coin={holding.coin} size={32} />
          <div className="flex flex-col">
            <span className="font-medium text-base tracking-tight">{holding.coinName}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{holding.coin}</span>
          </div>
        </div>
      </td>

      <td className="py-5 px-4 hidden md:table-cell">
        <div className="flex flex-col">
          <span className="text-sm tabular font-medium">{formatCoinBalance(holding.totalHolding)} {holding.coin}</span>
          <span className="text-xs font-medium text-muted-foreground tabular uppercase tracking-wider">{formatINR(holding.averageBuyPrice)}/unit</span>
        </div>
      </td>

      <td className="py-5 px-4 hidden lg:table-cell">
        <span className="text-sm tabular font-medium">{formatINR(totalValue)}</span>
      </td>

      <td className="py-5 px-4">
        <div className="flex flex-col">
          <span className={`text-base tabular font-medium ${holding.stcg.gain > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatGain(holding.stcg.gain)}
          </span>
          <span className="text-xs font-medium text-muted-foreground tabular uppercase tracking-wider">{formatCoinBalance(holding.stcg.balance)} {holding.coin}</span>
        </div>
      </td>

      <td className="py-5 px-4">
        <div className="flex flex-col">
          <span className={`text-base tabular font-medium ${holding.ltcg.gain > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatGain(holding.ltcg.gain)}
          </span>
          <span className="text-xs font-medium text-muted-foreground tabular uppercase tracking-wider">{formatCoinBalance(holding.ltcg.balance)} {holding.coin}</span>
        </div>
      </td>

      <td className="py-5 px-4 pr-8 text-right">
        <span className={`text-base tabular font-medium transition-all ${isSelected ? 'text-white' : 'text-white/20'}`}>
          {isSelected ? `${formatCoinBalance(holding.totalHolding)} ${holding.coin}` : '—'}
        </span>
      </td>
    </tr>
  );
};
