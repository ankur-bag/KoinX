"use client";

import React from "react";
import { useHarvesting } from "@/hooks/useHarvesting";
import { HoldingRow } from "./HoldingRow";
import { Checkbox } from "./Checkbox";
import type { SelectAllState } from "@/lib/types";
import { Sparkles, ArrowUpDown, Info } from "lucide-react";
import { formatCoinBalance, formatINR, formatGain } from "@/utils/formatters";
import { CoinLogo } from "./CoinLogo";
import { useState, useMemo, useEffect, useCallback } from "react";

type SortKey = "stcg" | "ltcg";
type SortDir = "asc" | "desc";

export const HoldingsTable: React.FC = () => {
  const { holdings, selectedIds, dispatch, showAll } = useHarvesting();
  const [sortKey, setSortKey] = useState<SortKey | null>("stcg");
  const [sortDir, setSortDir] = useState<SortDir | null>("desc");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const sortedHoldings = useMemo(() => {
    if (!sortKey || !sortDir) return holdings;

    return [...holdings].sort((a, b) => {
      const valA = Math.abs(a[sortKey].gain);
      const valB = Math.abs(b[sortKey].gain);

      if (sortDir === "asc") return valA - valB;
      return valB - valA;
    });
  }, [holdings, sortKey, sortDir]);

  const displayedHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, 5);

  const selectAllState: SelectAllState =
    selectedIds.size === 0
      ? "none"
      : selectedIds.size === holdings.length
      ? "all"
      : "indeterminate";

  const handleToggle = useCallback(
    (id: string, index: number, isShift?: boolean) => {
      if (isShift && lastSelectedIndex !== null) {
        const start = Math.min(index, lastSelectedIndex);
        const end = Math.max(index, lastSelectedIndex);
        const idsInRange = displayedHoldings
          .slice(start, end + 1)
          .map((h) => `${h.coin}__${h.coinName}`);

        const isSelecting = !selectedIds.has(id);

        idsInRange.forEach((rangeId) => {
          if (isSelecting && !selectedIds.has(rangeId)) {
            dispatch({ type: "TOGGLE_HOLDING", payload: rangeId });
          } else if (!isSelecting && selectedIds.has(rangeId)) {
            dispatch({ type: "TOGGLE_HOLDING", payload: rangeId });
          }
        });
      } else {
        dispatch({ type: "TOGGLE_HOLDING", payload: id });
      }
      setLastSelectedIndex(index);
    },
    [dispatch, displayedHoldings, lastSelectedIndex, selectedIds]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusedIndex === -1) {
        if (e.key === "ArrowDown") {
          setFocusedIndex(0);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          setFocusedIndex((prev) =>
            Math.min(prev + 1, displayedHoldings.length - 1)
          );
          e.preventDefault();
          break;
        case "ArrowUp":
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          e.preventDefault();
          break;
        case " ":
          const h = displayedHoldings[focusedIndex];
          handleToggle(`${h.coin}__${h.coinName}`, focusedIndex, e.shiftKey);
          e.preventDefault();
          break;
        case "Escape":
          setFocusedIndex(-1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, displayedHoldings, handleToggle]);

  const handleSelectRecommended = () => {
    dispatch({ type: "SELECT_RECOMMENDED" });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 opacity-20" />;
    return sortDir === "desc" ? <ArrowUpDown className="w-3 h-3 text-blue-500 rotate-180" /> : <ArrowUpDown className="w-3 h-3 text-blue-500" />;
  };

  const handleSelectAll = () => {
    if (selectAllState === "all") {
      dispatch({ type: "DESELECT_ALL" });
    } else {
      dispatch({ type: "SELECT_ALL" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0F1629] dark:text-white">Holdings</h2>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleSelectRecommended}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Select recommended
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
            <Info className="w-3 h-3" />
            Speciality: Auto-selects all assets with harvestable losses to maximize tax savings instantly.
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-card-bg dark:bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-white/[0.02] border-b border-card-border">
                <th className="py-5 px-4 pl-8 w-14 border-b border-card-border">
                  <Checkbox
                    checked={selectAllState === "all"}
                    indeterminate={selectAllState === "indeterminate"}
                    onChange={handleSelectAll}
                    ariaLabel="Select all holdings"
                  />
                </th>
                <th className="py-5 px-4 text-xs font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest select-none border-b border-card-border">
                  Asset
                </th>
                <th className="py-5 px-4 text-xs font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest hidden md:table-cell select-none border-b border-card-border">
                  <div className="flex flex-col">
                    <span>Holdings</span>
                    <span className="text-[9px] lowercase font-medium opacity-60">Current Market Rate</span>
                  </div>
                </th>
                <th className="py-5 px-4 text-xs font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest hidden lg:table-cell select-none border-b border-card-border text-center">
                  Total Current Value
                </th>
                <th
                  className="py-5 px-4 text-xs font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest cursor-pointer select-none hover:text-foreground transition-colors group border-b border-card-border"
                  onClick={() => handleSort("stcg")}
                >
                  <div className="flex items-center gap-2">
                    Short-term {getSortIcon("stcg")}
                  </div>
                </th>
                <th
                  className="py-5 px-4 text-xs font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest cursor-pointer select-none hover:text-foreground transition-colors group border-b border-card-border"
                  onClick={() => handleSort("ltcg")}
                >
                  <div className="flex items-center gap-2">
                    Long-term {getSortIcon("ltcg")}
                  </div>
                </th>
                <th className="py-5 px-4 pr-8 text-right text-xs font-bold text-[#3E4D6E] dark:text-muted-foreground uppercase tracking-widest select-none border-b border-card-border">
                  Amount to Sell
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {displayedHoldings.map((holding, index) => {
                const id = `${holding.coin}__${holding.coinName}`;
                return (
                  <HoldingRow
                    key={id}
                    holding={holding}
                    isSelected={selectedIds.has(id)}
                    isFocused={focusedIndex === index}
                    onToggle={(e: any) => handleToggle(id, index, e?.shiftKey)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {displayedHoldings.map((holding, index) => {
          const id = `${holding.coin}__${holding.coinName}`;
          const isSelected = selectedIds.has(id);
          const potentialSavings = -(holding.stcg.gain + holding.ltcg.gain);
          const isZeroState = holding.stcg.gain === 0 && holding.ltcg.gain === 0;

          return (
            <div
              key={id}
              onClick={() => handleToggle(id, index)}
              className={`bg-card-bg border border-card-border rounded-2xl p-5 transition-all active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-background"
                  : ""
              } ${isZeroState ? "opacity-40 grayscale-[0.5]" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CoinLogo src={holding.logo} coin={holding.coin} size={32} />
                  <div className="flex flex-col">
                    <span className="font-bold text-base tracking-tight text-[#0F1629] dark:text-white">
                      {holding.coinName}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {holding.coin}
                    </span>
                  </div>
                </div>
                <Checkbox
                  checked={isSelected}
                  onChange={() => {}}
                  ariaLabel={`Select ${holding.coinName}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-card-border pt-4">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Holdings
                  </p>
                  <p className="text-sm font-semibold tabular text-[#0F1629] dark:text-white">
                    {formatCoinBalance(holding.totalHolding)} {holding.coin}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Current Value
                  </p>
                  <p className="text-sm font-semibold tabular text-[#0F1629] dark:text-white">
                    {formatINR(holding.totalHolding * holding.currentPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    STCG
                  </p>
                  <p
                    className={`text-sm font-semibold tabular ${
                      holding.stcg.gain > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatGain(holding.stcg.gain)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    LTCG
                  </p>
                  <p
                    className={`text-sm font-semibold tabular ${
                      holding.ltcg.gain > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatGain(holding.ltcg.gain)}
                  </p>
                </div>
              </div>

              {potentialSavings > 0 && !isSelected && (
                <div className="mt-4 bg-green-500/10 text-green-500 px-3 py-2 rounded-lg border border-green-500/20 text-[10px] font-bold uppercase tracking-widest text-center">
                  Saves {formatINR(potentialSavings)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => dispatch({ type: "TOGGLE_SHOW_ALL" })}
          className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors bg-transparent px-2 py-1 cursor-pointer"
        >
          {showAll ? "View less" : "View all"}
        </button>
      </div>
    </section>
  );
};
