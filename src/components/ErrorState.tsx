"use client";

import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 flex flex-col items-center justify-center text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-xl font-medium mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-8 max-w-md">{message}</p>
      <button 
        onClick={onRetry}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
      >
        <RefreshCcw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
};
