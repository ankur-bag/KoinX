"use client";

import React from 'react';

interface CoinLogoProps {
  src: string;
  coin: string;
  size?: number;
}

export const CoinLogo: React.FC<CoinLogoProps> = ({ src, coin, size = 24 }) => {
  return (
    <div 
      className="relative flex items-center justify-center rounded-full overflow-hidden bg-white shadow-sm ring-1 ring-black/5"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={coin}
        width={size}
        height={size}
        className="object-contain p-1"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
        }}
      />
    </div>
  );
};
