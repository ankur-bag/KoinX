"use client";

import React, { useEffect, useRef } from 'react';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked, 
  indeterminate, 
  onChange, 
  ariaLabel 
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className="relative flex items-center justify-center w-5 h-5 group">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange();
        }}
        aria-label={ariaLabel}
        className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      <div className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center 
        ${checked || indeterminate 
          ? 'bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
          : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}
      >
        {checked && (
          <svg className="w-3.5 h-3.5 text-white animate-in zoom-in-50 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {indeterminate && (
          <div className="w-2.5 h-0.5 bg-white rounded-full animate-in zoom-in-50 duration-200" />
        )}
      </div>
    </div>
  );
};
