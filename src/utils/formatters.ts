/**
 * Formats a number as INR (Indian Rupee) string
 * Example: 1234567.89 -> ₹12,34,567.89
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a crypto amount with symbol
 */
export const formatCrypto = (amount: number, symbol: string): string => {
  return `${amount.toLocaleString('en-IN', { maximumFractionDigits: 6 })} ${symbol.toUpperCase()}`;
};

/**
 * Formats a crypto balance
 */
export const formatCoinBalance = (amount: number): string => {
  return amount.toLocaleString('en-IN', { maximumFractionDigits: 6, minimumFractionDigits: 2 });
};

/**
 * Formats gain/loss with sign and currency
 */
export const formatGain = (amount: number): string => {
  const formatted = formatINR(Math.abs(amount));
  if (amount === 0) return formatted;
  return amount > 0 ? `+${formatted}` : `-${formatted}`;
};

/**
 * Formats a number with sign (+/-)
 */
export const formatWithSign = (amount: number): string => {
  const formatted = formatINR(Math.abs(amount));
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
};
