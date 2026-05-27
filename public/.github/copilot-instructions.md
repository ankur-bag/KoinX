# GitHub Copilot Instructions
## KoinX — Tax Loss Harvesting Tool

> Place this file at `.github/copilot-instructions.md` in the root of your repo.
> Copilot will automatically use it as context for every suggestion in this workspace.

---

## Project Overview

This is a **React + TypeScript** frontend application for a Tax Loss Harvesting tool built for KoinX. It helps Indian crypto investors simulate how selling certain holdings today could reduce their capital gains tax liability for the financial year.

There is **no real backend**. All data is seeded inside `src/lib/`. The app is entirely client-side and deployed on Vercel or Netlify.

---

## Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **State management:** React Context + useReducer
- **No component library** — all UI is custom-built
- **No external API calls** — all data comes from `src/lib/`

---

## Folder Structure

```
src/
├── lib/
│   ├── types.ts                  # All shared TypeScript interfaces
│   ├── mockCapitalGains.ts       # Seeded capital gains data
│   ├── mockHoldings.ts           # Seeded holdings array (25 assets)
│   └── api.ts                    # Promise-based mock fetch functions
├── context/
│   └── HarvestingContext.tsx     # Global state: Context + useReducer
├── components/
│   ├── Header.tsx
│   ├── DisclaimerBanner.tsx
│   ├── CapitalGainsSection.tsx
│   ├── PreHarvestingCard.tsx
│   ├── AfterHarvestingCard.tsx
│   ├── CapitalGainsRow.tsx
│   ├── HoldingsTable.tsx
│   ├── HoldingRow.tsx
│   ├── Checkbox.tsx
│   ├── CoinLogo.tsx
│   ├── SkeletonLoader.tsx
│   └── ErrorState.tsx
├── hooks/
│   └── useHarvesting.ts          # Custom hook to consume HarvestingContext
├── utils/
│   └── formatters.ts             # Number formatting helpers
└── App.tsx
```

---

## TypeScript Interfaces

Always import types from `src/lib/types.ts`. Never redefine them inline.

```typescript
// src/lib/types.ts

export interface StcgLtcg {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  capitalGains: {
    stcg: StcgLtcg;
    ltcg: StcgLtcg;
  };
}

export interface GainEntry {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainEntry;
  ltcg: GainEntry;
}

export type SelectAllState = 'all' | 'none' | 'indeterminate';
```

---

## Mock API Layer

All data lives in `src/lib/`. Never fetch from a real URL. Never use `axios`. Use the mock functions from `src/lib/api.ts` as if they were real API calls.

```typescript
// src/lib/api.ts
import { capitalGainsData } from "./mockCapitalGains";
import { holdingsData } from "./mockHoldings";
import { CapitalGains, Holding } from "./types";

export const fetchCapitalGains = (): Promise<CapitalGains> =>
  new Promise((resolve) => setTimeout(() => resolve(capitalGainsData), 800));

export const fetchHoldings = (): Promise<Holding[]> =>
  new Promise((resolve) => setTimeout(() => resolve(holdingsData), 800));
```

Always call both in parallel using `Promise.all`:

```typescript
Promise.all([fetchCapitalGains(), fetchHoldings()])
  .then(([gains, holdings]) => { ... })
  .catch((err) => setError(err.message));
```

---

## Global State

All shared state lives in `HarvestingContext`. Never use prop drilling beyond 2 levels. Always consume state via the `useHarvesting` hook.

### State shape

```typescript
interface HarvestingState {
  capitalGains: CapitalGains['capitalGains'] | null;
  holdings: Holding[];
  selectedIds: Set<string>;        // key = `${coin}__${coinName}`
  isLoadingGains: boolean;
  isLoadingHoldings: boolean;
  error: string | null;
  showAll: boolean;
}
```

### Actions

```typescript
type Action =
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGains['capitalGains'] }
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'TOGGLE_HOLDING'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'TOGGLE_SHOW_ALL' }
  | { type: 'SET_LOADING_GAINS'; payload: boolean }
  | { type: 'SET_LOADING_HOLDINGS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
```

### Derived values (never store these — compute them)

```typescript
// After harvesting gains — recompute on every render from state
const computeAfterHarvesting = (
  base: CapitalGains['capitalGains'],
  holdings: Holding[],
  selectedIds: Set<string>
) => {
  let stcgProfits = base.stcg.profits;
  let stcgLosses = base.stcg.losses;
  let ltcgProfits = base.ltcg.profits;
  let ltcgLosses = base.ltcg.losses;

  holdings.forEach((h) => {
    const id = `${h.coin}__${h.coinName}`;
    if (!selectedIds.has(id)) return;

    if (h.stcg.gain > 0) stcgProfits += h.stcg.gain;
    else stcgLosses += Math.abs(h.stcg.gain);

    if (h.ltcg.gain > 0) ltcgProfits += h.ltcg.gain;
    else ltcgLosses += Math.abs(h.ltcg.gain);
  });

  return { stcg: { profits: stcgProfits, losses: stcgLosses },
           ltcg: { profits: ltcgProfits, losses: ltcgLosses } };
};

// Net gains
const netStcg = (g: StcgLtcg) => g.profits - g.losses;
const netLtcg = (g: StcgLtcg) => g.profits - g.losses;
const realisedGains = (stcg: StcgLtcg, ltcg: StcgLtcg) =>
  netStcg(stcg) + netLtcg(ltcg);
```

---

## Business Logic Rules

These rules are non-negotiable. Do not deviate.

### Holding selection key
Always identify holdings with a composite key to handle duplicate coin tickers (e.g., two USDC entries):
```typescript
const holdingKey = (h: Holding) => `${h.coin}__${h.coinName}`;
```

### After Harvesting adjustment
For each selected holding:
- `stcg.gain > 0` → add to `stcg.profits`
- `stcg.gain < 0` → add `Math.abs(gain)` to `stcg.losses`
- `ltcg.gain > 0` → add to `ltcg.profits`
- `ltcg.gain < 0` → add `Math.abs(gain)` to `ltcg.losses`

### Savings message
Only show "🎉 You are going to save upto ₹X" when:
```typescript
const preRealised = realisedGains(base.stcg, base.ltcg);
const postRealised = realisedGains(after.stcg, after.ltcg);
const showSavings = preRealised > postRealised;
const savings = preRealised - postRealised;
```
Never show a negative savings value. Never show the message when `showSavings` is false.

### Select All state
```typescript
const selectAllState: SelectAllState =
  selectedIds.size === 0 ? 'none' :
  selectedIds.size === holdings.length ? 'all' :
  'indeterminate';
```

---

## Number Formatting

All formatting lives in `src/utils/formatters.ts`. Never format numbers inline in components.

```typescript
// Indian currency format with ₹ prefix
export const formatINR = (value: number): string => {
  if (Math.abs(value) < 0.01) return '< ₹0.01';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

// Coin balance (up to 6 significant digits, no scientific notation)
export const formatCoinBalance = (value: number): string => {
  if (Math.abs(value) < 1e-6) return '~0';
  return parseFloat(value.toPrecision(6)).toLocaleString('en-IN');
};

// Signed gain display (e.g. "+₹500.00" or "-₹200.00")
export const formatGain = (value: number): string => {
  const formatted = formatINR(Math.abs(value));
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
};
```

Never render raw scientific notation (e.g. `3.46e-17`) in the UI. Always pass values through `formatCoinBalance` or `formatINR`.

---

## Component Rules

### General
- Every component must be a **typed functional component**: `const Foo: React.FC<Props> = ...`
- Props interfaces go at the top of the file, before the component
- No inline styles — use Tailwind classes only
- No `any` types anywhere

### CoinLogo
Always handle broken image URLs with an `onError` fallback:
```typescript
<img
  src={logo}
  alt={coin}
  onError={(e) => {
    (e.target as HTMLImageElement).src =
      'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
  }}
/>
```

### Checkbox
Must support three states and proper `aria` attributes:
```typescript
interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
}
```
Set `indeterminate` via a `ref` (cannot be set via HTML attribute):
```typescript
useEffect(() => {
  if (ref.current) ref.current.indeterminate = !!indeterminate;
}, [indeterminate]);
```

### SkeletonLoader
Use Tailwind's `animate-pulse` class. Render placeholder shapes that match the real content dimensions.

### ErrorState
Always render a visible error message and a **Retry** button that accepts an `onRetry: () => void` prop.

---

## Styling Conventions

Use these Tailwind color classes consistently. Do not hardcode hex values in className strings.

| Purpose | Tailwind class |
|---|---|
| Pre Harvesting card bg | `bg-[#1A1D2E]` |
| After Harvesting card bg | `bg-[#1A6FEF]` |
| Positive gain text | `text-green-500` |
| Negative gain text | `text-red-500` |
| Selected row highlight | `bg-blue-50` (light) / `bg-blue-900/20` (dark) |
| Page background | `bg-gray-50` (light) / `bg-[#0F1117]` (dark) |

---

## Holdings Table

- Default: show **first 5 rows** only
- "View all" expands to all 25; "View less" collapses back
- Default sort: descending by `Math.abs(stcg.gain)` — highest impact first
- On mobile (`< 768px`): hide all columns except **Asset** and **Holdings**
- Amount to Sell column: show `totalHolding + " " + coin` when selected, `—` when not

---

## What Copilot Should NOT Do

- Do not add `axios` or any HTTP client — use only the mock functions in `src/lib/api.ts`
- Do not create new TypeScript interfaces — import from `src/lib/types.ts`
- Do not store derived/computed values in state — compute them inline
- Do not use `any` as a type
- Do not use `Math.random()` or generate dynamic data — data is always static seeded data
- Do not add `console.log` statements
- Do not use `useEffect` for calculations — only for data fetching and DOM side effects
- Do not add routing (React Router, etc.) — this is a single page, no navigation needed
- Do not use `localStorage` or `sessionStorage`
- Do not install any UI component libraries (no shadcn, MUI, Radix, etc.)
- Do not use `default export` for components — always use named exports

---

## Patterns to Follow

### Data fetching pattern
```typescript
useEffect(() => {
  dispatch({ type: 'SET_LOADING_GAINS', payload: true });
  dispatch({ type: 'SET_LOADING_HOLDINGS', payload: true });

  Promise.all([fetchCapitalGains(), fetchHoldings()])
    .then(([gains, holdings]) => {
      dispatch({ type: 'SET_CAPITAL_GAINS', payload: gains.capitalGains });
      dispatch({ type: 'SET_HOLDINGS', payload: holdings });
    })
    .catch((err) => dispatch({ type: 'SET_ERROR', payload: err.message }))
    .finally(() => {
      dispatch({ type: 'SET_LOADING_GAINS', payload: false });
      dispatch({ type: 'SET_LOADING_HOLDINGS', payload: false });
    });
}, []);
```

### Conditional rendering pattern
```typescript
if (isLoading) return <SkeletonLoader />;
if (error) return <ErrorState message={error} onRetry={refetch} />;
if (!data) return null;
return <ActualComponent data={data} />;
```

### Named export pattern
```typescript
// ✅ correct
export const PreHarvestingCard: React.FC<Props> = ({ ... }) => { ... };

// ❌ wrong
export default function PreHarvestingCard() { ... }
```