"use client";

import { useContext } from 'react';
import { HarvestingContext } from '@/context/HarvestingContext';

export const useHarvesting = () => {
  const context = useContext(HarvestingContext);
  if (context === undefined) {
    throw new Error('useHarvesting must be used within a HarvestingProvider');
  }
  return context;
};
