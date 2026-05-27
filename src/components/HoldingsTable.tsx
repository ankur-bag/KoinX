"use client";

import React, { useState, useMemo } from 'react';
import { useHarvesting } from '@/hooks/useHarvesting';
import { HoldingRow } from './HoldingRow';
import { Checkbox } from './Checkbox';
import type { SelectAllState, Holding } from '@/lib/types';

type SortKey = 'stcg' | 'ltcg';
type SortDir = 'asc' | 'desc';

export const HoldingsTable: React.FC = () => {
  const { holdings, selectedIds, dispatch, showAll } = useHarvesting();
  const [sortKey, setSortKey] = useState<SortKey | null>('stcg');
  const [sortDir, setSortDir] = useState<SortDir | null>('desc');

  const sortedHoldings = useMemo(() => {
    if (!sortKey || !sortDir) return holdings;

    return [...holdings].sort((a, b) => {
      const valA = Math.abs(a[sortKey].gain);
      const valB = Math.abs(b[sortKey].gain);

      if (sortDir === 'asc') return valA - valB;
      return valB - valA;
    });
  }, [holdings, sortKey, sortDir]);

  const displayedHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, 5);

  const selectAllState: SelectAllState =
    selectedIds.size === 0 ? 'none' :
    selectedIds.size === holdings.length ? 'all' :
    'indeterminate';

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDir === 'desc' ? ' ↑' : ' ↓';
  };

  const handleSelectAll = () => {
    if (selectAllState === 'all') {
      dispatch({ type: 'DESELECT_ALL' });
    } else {
      dispatch({ type: 'SELECT_ALL' });
    }
  };

  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE_HOLDING', payload: id });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-medium tracking-tight">Holdings</h2>
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest bg-white/5 py-1.5 px-4 rounded-full border border-white/5">
          {holdings.length} Assets Found
        </div>
      </div>

      <div className="bg-[#171823] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#0A0A11] border-b border-white/5">
                <th className="py-5 px-4 pl-8 w-14">
                  <Checkbox 
                    checked={selectAllState === 'all'} 
                    indeterminate={selectAllState === 'indeterminate'}
                    onChange={handleSelectAll} 
                    ariaLabel="Select all holdings"
                  />
                </th>
                <th className="py-5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] select-none">Asset</th>
                <th className="py-5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] hidden md:table-cell select-none">Holdings</th>
                <th className="py-5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] hidden lg:table-cell select-none">Current Price</th>
                <th 
                  className="py-5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] cursor-pointer select-none hover:text-white transition-colors"
                  onClick={() => handleSort('stcg')}
                >
                  Short-term{getSortIcon('stcg')}
                </th>
                <th 
                  className="py-5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] cursor-pointer select-none hover:text-white transition-colors"
                  onClick={() => handleSort('ltcg')}
                >
                  Long-term{getSortIcon('ltcg')}
                </th>
                <th className="py-5 px-4 pr-8 text-right text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] select-none">Amount TO SELL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {displayedHoldings.map((h) => {
                const id = `${h.coin}__${h.coinName}`;
                return (
                  <HoldingRow 
                    key={id} 
                    holding={h} 
                    isSelected={selectedIds.has(id)}
                    onToggle={() => handleToggle(id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 flex justify-center border-t border-white/5 bg-white/[0.01]">
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_SHOW_ALL' })}
            className="text-xs font-medium text-[#3B82F6] hover:text-[#60A5FA] uppercase tracking-[0.2em] transition-all flex items-center gap-2 group"
          >
            {showAll ? 'View less' : 'View all assets'}
            <span className={`transform transition-transform duration-300 ${showAll ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};
