import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { CapitalGainsSection } from '@/components/CapitalGainsSection';
import { HoldingsTable } from '@/components/HoldingsTable';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ErrorState } from '@/components/ErrorState';
import { HarvestingProvider } from '@/context/HarvestingContext';
import { useHarvesting } from '@/hooks/useHarvesting';
import { fetchCapitalGains, fetchHoldings } from '@/lib/api';

const MainContent: React.FC = () => {
  const { dispatch, isLoadingGains, isLoadingHoldings, error } = useHarvesting();

  const loadData = async () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING_GAINS', payload: true });
    dispatch({ type: 'SET_LOADING_HOLDINGS', payload: true });
    
    try {
      const [gains, holdings] = await Promise.all([
        fetchCapitalGains(),
        fetchHoldings()
      ]);
      
      dispatch({ type: 'SET_CAPITAL_GAINS', payload: gains.capitalGains });
      dispatch({ type: 'SET_HOLDINGS', payload: holdings });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tax data. Please check your connection and try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING_GAINS', payload: false });
      dispatch({ type: 'SET_LOADING_HOLDINGS', payload: false });
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (isLoadingGains || isLoadingHoldings) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white">Tax Harvesting</h1>
        </div>
        <SkeletonLoader />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white">Tax Harvesting</h1>
          <a href="#" className="text-sm font-semibold text-black dark:text-white hover:opacity-80 transition-all underline underline-offset-4 decoration-black/30 dark:decoration-white/30">How it works?</a>
        </div>
      </div>

      <DisclaimerBanner />
      <CapitalGainsSection />
      <HoldingsTable />
    </main>
  );
};

function App() {
  return (
    <HarvestingProvider>
      <div className="antialiased selection:bg-blue-500/30">
        <Header />
        <MainContent />
      </div>
    </HarvestingProvider>
  );
}

export default App;
