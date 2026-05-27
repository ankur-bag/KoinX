"use client";

import React from 'react';
import { useHarvesting } from '@/hooks/useHarvesting';
import { PreHarvestingCard } from './PreHarvestingCard';
import { AfterHarvestingCard } from './AfterHarvestingCard';
import type { StcgLtcg, Holding } from '@/lib/types';

export const CapitalGainsSection: React.FC = () => {
  const { capitalGains, holdings, selectedIds } = useHarvesting();

  if (!capitalGains) return null;

  // Derived values — recompute on every render
  const afterHarvesting = (() => {
    let stcgProfits = capitalGains.stcg.profits;
    let stcgLosses = capitalGains.stcg.losses;
    let ltcgProfits = capitalGains.ltcg.profits;
    let ltcgLosses = capitalGains.ltcg.losses;

    holdings.forEach((h) => {
      const id = `${h.coin}__${h.coinName}`;
      if (!selectedIds.has(id)) return;

      if (h.stcg.gain > 0) {
        stcgProfits += h.stcg.gain;
      } else if (h.stcg.gain < 0) {
        stcgLosses += Math.abs(h.stcg.gain);
      }

      if (h.ltcg.gain > 0) {
        ltcgProfits += h.ltcg.gain;
      } else if (h.ltcg.gain < 0) {
        ltcgLosses += Math.abs(h.ltcg.gain);
      }
    });

    return { 
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses } 
    };
  })();

  const realisedGains = (stcg: StcgLtcg, ltcg: StcgLtcg) => 
    (stcg.profits - stcg.losses) + (ltcg.profits - ltcg.losses);

  const preRealised = realisedGains(capitalGains.stcg, capitalGains.ltcg);
  const postRealised = realisedGains(afterHarvesting.stcg, afterHarvesting.ltcg);
  
  const stcgReduction = (capitalGains.stcg.profits - capitalGains.stcg.losses) - (afterHarvesting.stcg.profits - afterHarvesting.stcg.losses);
  const ltcgReduction = (capitalGains.ltcg.profits - capitalGains.ltcg.losses) - (afterHarvesting.ltcg.profits - afterHarvesting.ltcg.losses);

  const showSavings = preRealised > postRealised;
  const savings = showSavings ? preRealised - postRealised : 0;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <PreHarvestingCard stcg={capitalGains.stcg} ltcg={capitalGains.ltcg} />
        <AfterHarvestingCard 
          stcg={afterHarvesting.stcg} 
          ltcg={afterHarvesting.ltcg} 
          savings={savings}
          stcgSavings={stcgReduction}
          ltcgSavings={ltcgReduction}
        />
      </div>
    </section>
  );
};
