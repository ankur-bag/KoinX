"use client";

import React from "react";
import { Check, Dot } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}) => {
  return (
    <button
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`
        w-[18px] h-[18px] rounded-md flex items-center justify-center transition-all cursor-pointer
        ${
          checked || indeterminate
            ? "bg-[#0052FE] border-[#0052FE]"
            : "bg-white dark:bg-transparent border-[#E5E7EB] dark:border-white/20 hover:border-[#0052FE] dark:hover:border-blue-500/50"
        }
        border-2
      `}
    >
      {checked && !indeterminate && <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />}
      {indeterminate && <Dot className="w-4 h-4 text-white stroke-[4]" />}
    </button>
  );
};