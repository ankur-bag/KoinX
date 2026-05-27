"use client";

import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16 animate-pulse pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        <div className="bg-[#0F1629]/5 dark:bg-white/5 rounded-2xl h-80 border border-black/5 dark:border-white/5" />
        <div className="bg-[#0F1629]/5 dark:bg-white/5 rounded-2xl h-80 border border-black/5 dark:border-white/5" />
      </div>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-[#0F1629]/5 dark:bg-white/5 rounded-lg w-1/4" />
          <div className="h-8 bg-[#0F1629]/5 dark:bg-white/5 rounded-full w-32" />
        </div>
        <div className="bg-[#0F1629]/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl h-[500px]" />
      </div>
    </div>
  );
};
