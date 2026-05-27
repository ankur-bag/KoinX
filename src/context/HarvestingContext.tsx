"use client";

import React, { createContext, useReducer, ReactNode, useMemo } from 'react';
import type { CapitalGainsResponse, Holding } from '@/lib/types';

interface HarvestingState {
  capitalGains: CapitalGainsResponse['capitalGains'] | null;
  holdings: Holding[];
  selectedIds: Set<string>; // key = `${coin}__${coinName}`
  isLoadingGains: boolean;
  isLoadingHoldings: boolean;
  error: string | null;
  showAll: boolean;
}

type Action =
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGainsResponse['capitalGains'] }
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'TOGGLE_HOLDING'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'TOGGLE_SHOW_ALL' }
  | { type: 'SET_LOADING_GAINS'; payload: boolean }
  | { type: 'SET_LOADING_HOLDINGS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: HarvestingState = {
  capitalGains: null,
  holdings: [],
  selectedIds: new Set(),
  isLoadingGains: false,
  isLoadingHoldings: false,
  error: null,
  showAll: false,
};

function harvestingReducer(state: HarvestingState, action: Action): HarvestingState {
  switch (action.type) {
    case 'SET_CAPITAL_GAINS':
      return { ...state, capitalGains: action.payload };
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload };
    case 'TOGGLE_HOLDING': {
      const newSelected = new Set(state.selectedIds);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selectedIds: newSelected };
    }
    case 'SELECT_ALL': {
      const allIds = state.holdings.map(h => `${h.coin}__${h.coinName}`);
      return { ...state, selectedIds: new Set(allIds) };
    }
    case 'DESELECT_ALL':
      return { ...state, selectedIds: new Set() };
    case 'TOGGLE_SHOW_ALL':
      return { ...state, showAll: !state.showAll };
    case 'SET_LOADING_GAINS':
      return { ...state, isLoadingGains: action.payload };
    case 'SET_LOADING_HOLDINGS':
      return { ...state, isLoadingHoldings: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface HarvestingContextType extends HarvestingState {
  dispatch: React.Dispatch<Action>;
}

export const HarvestingContext = createContext<HarvestingContextType | undefined>(undefined);

export const HarvestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(harvestingReducer, initialState);

  const value = useMemo(() => ({ ...state, dispatch }), [state]);

  return (
    <HarvestingContext.Provider value={value}>
      {children}
    </HarvestingContext.Provider>
  );
};
