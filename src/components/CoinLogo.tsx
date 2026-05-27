"use client";

import React from 'react';

interface CoinLogoProps {
  src: string;
  coin: string;
  size?: number;
}

export const CoinLogo: React.FC<CoinLogoProps> = ({ src, coin, size = 24 }) => {
  return (
    <img
      src={src}
      alt={coin}
      width={size}
      height={size}
      className="rounded-full bg-white/10"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
      }}
    />
  );
};
