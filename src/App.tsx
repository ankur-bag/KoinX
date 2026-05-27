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
      <main className="min-h-screen bg-[#0A0A11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
           <h1 className="text-3xl font-medium tracking-tight">Tax Harvesting</h1>
        </div>
        <SkeletonLoader />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-[#0A0A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-medium tracking-tight">Tax Harvesting</h1>
          <a href="#" className="text-sm font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors underline underline-offset-4 decoration-white/20">How it works?</a>
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
      <div className="antialiased text-white selection:bg-blue-500/30 selection:text-white">
        <Header />
        <MainContent />
      </div>
    </HarvestingProvider>
  );
}

export default App;