export type StcgLtcg = {
  profits: number;
  losses: number;
};

export const _dummy = true;

export type CapitalGainsResponse = {
  capitalGains: {
    stcg: StcgLtcg;
    ltcg: StcgLtcg;
  };
};

export type GainEntry = {
  balance: number;
  gain: number;
};

export type Holding = {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainEntry;
  ltcg: GainEntry;
};

export type SelectAllState = 'all' | 'none' | 'indeterminate';
