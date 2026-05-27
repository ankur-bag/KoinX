import { capitalGainsData } from "./mockCapitalGains";
import { holdingsData } from "./mockHoldings";
import type { CapitalGainsResponse, Holding } from "./types";

export const fetchCapitalGains = (): Promise<CapitalGainsResponse> =>
  new Promise((resolve) => setTimeout(() => resolve(capitalGainsData), 800));

export const fetchHoldings = (): Promise<Holding[]> =>
  new Promise((resolve) => setTimeout(() => resolve(holdingsData), 800));
