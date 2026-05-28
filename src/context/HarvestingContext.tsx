"use client";

import React, { createContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CapitalGainsResponse, Holding } from '@/lib/types';

interface HarvestingState {
  capitalGains: CapitalGainsResponse['capitalGains'] | null;
  holdings: Holding[];
  selectedIds: Set<string>; // key = `${coin}__${coinName}`
  isLoadingGains: boolean;
  isLoadingHoldings: boolean;
  error: string | null;
  showAll: boolean;
  hasCelebrated: boolean;
}

type Action =
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGainsResponse['capitalGains'] }
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'TOGGLE_HOLDING'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'SELECT_RECOMMENDED' }
  | { type: 'TOGGLE_SHOW_ALL' }
  | { type: 'SET_LOADING_GAINS'; payload: boolean }
  | { type: 'SET_LOADING_HOLDINGS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CELEBRATED'; payload: boolean }
  | { type: 'RESTORE_SELECTIONS'; payload: string[] };

const STORAGE_KEY = 'koinx_selected_holdings';

const initialState: HarvestingState = {
  capitalGains: null,
  holdings: [],
  selectedIds: new Set(),
  isLoadingGains: false,
  isLoadingHoldings: false,
  error: null,
  showAll: false,
  hasCelebrated: false,
};

function harvestingReducer(state: HarvestingState, action: Action): HarvestingState {
  let newState = state;

  switch (action.type) {
    case 'SET_CAPITAL_GAINS':
      newState = { ...state, capitalGains: action.payload };
      break;
    case 'SET_HOLDINGS':
      newState = { ...state, holdings: action.payload };
      break;
    case 'TOGGLE_HOLDING': {
      const newSelected = new Set(state.selectedIds);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      newState = { ...state, selectedIds: newSelected };
      break;
    }
    case 'SELECT_ALL': {
      const allIds = state.holdings.map(h => `${h.coin}__${h.coinName}`);
      newState = { ...state, selectedIds: new Set(allIds) };
      break;
    }
    case 'DESELECT_ALL':
      newState = { ...state, selectedIds: new Set() };
      break;
    case 'SELECT_RECOMMENDED': {
      const recommendedIds = state.holdings
        .filter(h => h.stcg.gain < 0 || h.ltcg.gain < 0)
        .map(h => `${h.coin}__${h.coinName}`);
      newState = { ...state, selectedIds: new Set(recommendedIds) };
      break;
    }
    case 'TOGGLE_SHOW_ALL':
      newState = { ...state, showAll: !state.showAll };
      break;
    case 'SET_LOADING_GAINS':
      newState = { ...state, isLoadingGains: action.payload };
      break;
    case 'SET_LOADING_HOLDINGS':
      newState = { ...state, isLoadingHoldings: action.payload };
      break;
    case 'SET_ERROR':
      newState = { ...state, error: action.payload };
      break;
    case 'SET_CELEBRATED':
      newState = { ...state, hasCelebrated: action.payload };
      break;
    case 'RESTORE_SELECTIONS':
      newState = { ...state, selectedIds: new Set(action.payload) };
      break;
    default:
      return state;
  }

  // Persist selections
  if (['TOGGLE_HOLDING', 'SELECT_ALL', 'DESELECT_ALL', 'SELECT_RECOMMENDED', 'RESTORE_SELECTIONS'].includes(action.type)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newState.selectedIds)));
  }

  return newState;
}

interface HarvestingContextType extends HarvestingState {
  dispatch: React.Dispatch<Action>;
}

export const HarvestingContext = createContext<HarvestingContextType | undefined>(undefined);

export const HarvestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(harvestingReducer, initialState);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'RESTORE_SELECTIONS', payload: parsed });
        }
      } catch (e) {
        console.error('Failed to restore selections', e);
      }
    }
  }, []);

  const value = useMemo(() => ({ ...state, dispatch }), [state]);

  return (
    <HarvestingContext.Provider value={value}>
      {children}
    </HarvestingContext.Provider>
  );
};
