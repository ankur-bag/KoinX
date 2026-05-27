# Product Requirements Document
## KoinX — Tax Loss Harvesting Tool

**Version:** 1.0  
**Status:** Draft  
**Prepared for:** Frontend Engineering (Intern Assignment)  
**Last Updated:** May 2026

---

## 1. Overview

### 1.1 Purpose

This document defines the requirements for building a **Tax Loss Harvesting (TLH) interface** within the KoinX platform. The tool helps crypto investors understand how strategically selling underperforming assets can reduce their taxable capital gains for the financial year.

### 1.2 Background

Tax loss harvesting is the practice of selling assets at a loss to offset capital gains, thereby reducing tax liability. For crypto investors holding multiple assets across various chains, this tool surfaces actionable insights: which holdings, if sold today, would result in the most tax savings.

### 1.3 Scope

This document covers the frontend interface only. Backend integrations are mocked via static data. The deliverable is a standalone React application deployable on Vercel or Netlify.

---

## 2. Goals & Success Criteria

| Goal | Metric |
|---|---|
| User can understand their current tax liability at a glance | Pre-harvesting card displays correct computed values |
| User can simulate tax savings by selecting holdings | After Harvesting card updates in real-time on checkbox interaction |
| User can identify which assets to sell | Holdings table renders all assets with relevant gain/loss data |
| Interface is responsive across devices | Fully functional on mobile (375px) and desktop (1280px+) |

---

## 3. User Personas

**Primary User — Crypto Investor (India)**
- Holds multiple crypto assets across chains
- Filing ITR with crypto capital gains
- Wants to minimise tax outgo before the financial year ends
- Comfortable with financial terminology (STCG, LTCG, net gains)

---

## 4. Design References

- **Figma:** [KoinX Frontend Intern Assignment](https://www.figma.com/design/3YqHlvx1X59Nb3iP97BGkG/KoinX-Frontend-Intern-Assigment)
- **Light Theme (Desktop):** White page background, dark card for Pre Harvesting, blue card for After Harvesting
- **Dark Theme (Desktop):** Dark navy page background, same card treatments
- **Mobile:** Single-column stacked layout; Holdings table collapses to show Asset + Holdings only

---

## 5. Information Architecture

```
Tax Harvesting Page
├── Page Header
│   ├── KoinX Logo
│   └── "Tax Harvesting" heading + "How it works?" link
├── Important Notes & Disclaimers (collapsible banner)
├── Capital Gains Section
│   ├── Pre Harvesting Card (dark background)
│   └── After Harvesting Card (blue background)
└── Holdings Section
    ├── "Holdings" heading
    ├── Holdings Table
    │   ├── Table Header (with Select All checkbox)
    │   ├── Table Rows (one per holding)
    │   └── "View All" toggle
    └── (empty state / loader)
```

---

## 6. Functional Requirements

### 6.1 Page Header

- Display KoinX logo (top-left).
- Display page title: **"Tax Harvesting"**.
- Display a **"How it works?"** hyperlink beside the title (opens informational content; exact destination out of scope for this assignment — can be a `#` anchor).
- On mobile, show a hamburger menu icon (top-right); navigation behaviour is out of scope.

---

### 6.2 Important Notes & Disclaimers Banner

**Behaviour:**
- Displayed as a collapsible accordion below the header.
- Expanded by default on page load.
- Clicking the chevron/arrow toggles collapsed/expanded state.
- Icon: ℹ️ info icon on the left of the title row.

**Content (static copy):**
1. Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.
2. Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.
3. Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.
4. Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.
5. Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.

---

### 6.3 Pre Harvesting Card

**Data source:** Capital Gains API (mocked)

**Display:**

| Field | Value |
|---|---|
| Short-term Profits | `capitalGains.stcg.profits` |
| Short-term Losses | `capitalGains.stcg.losses` (displayed as negative) |
| Short-term Net Capital Gains | `stcg.profits - stcg.losses` |
| Long-term Profits | `capitalGains.ltcg.profits` |
| Long-term Losses | `capitalGains.ltcg.losses` (displayed as negative) |
| Long-term Net Capital Gains | `ltcg.profits - ltcg.losses` |
| **Realised Capital Gains** | `(stcg.profits - stcg.losses) + (ltcg.profits - ltcg.losses)` |

**Visual:**
- Dark background card (near-black or deep navy).
- Two columns: Short-term / Long-term.
- Realised Capital Gains shown in large bold text at the bottom of the card.
- This card is **read-only** — it never changes.

---

### 6.4 After Harvesting Card

**Data source:** Capital Gains API (base) + Holdings selections (dynamic adjustments)

**Initial state:** Mirrors Pre Harvesting exactly.

**On holding selection/deselection:**

For each **selected** holding, apply the following adjustments to the base capital gains data:

```
For stcg.gain of the holding:
  if gain > 0  → add gain to stcg.profits
  if gain < 0  → add |gain| to stcg.losses

For ltcg.gain of the holding:
  if gain > 0  → add gain to ltcg.profits
  if gain < 0  → add |gain| to ltcg.losses
```

Recalculate:
- Short-term Net = adjusted stcg.profits − adjusted stcg.losses
- Long-term Net = adjusted ltcg.profits − adjusted ltcg.losses
- **Effective Capital Gains** = Short-term Net + Long-term Net

**Savings message:**
- Display **"🎉 You are going to save upto ₹X"** only when:
  `Pre-Harvesting Realised Capital Gains > After-Harvesting Effective Capital Gains`
- `X = Pre-harvesting Realised Capital Gains − After-harvesting Effective Capital Gains`
- Do **not** display this message if no savings exist (i.e., selections have increased tax liability or kept it equal).

**Visual:**
- Bright blue background card.
- Same column structure as Pre Harvesting.
- Label changes: "Realised Capital Gains" → **"Effective Capital Gains"**
- Savings row shown below the Effective Capital Gains figure.

---

### 6.5 Holdings Table

**Data source:** Holdings API (mocked)

#### 6.5.1 Columns

| Column | Content | Notes |
|---|---|---|
| **Asset** | Coin logo, `coin` ticker (bold), `coinName` (subtitle) | Logo: `<img>` from `logo` field; fallback to default coin SVG |
| **Holdings / Current Market Rate** | `totalHolding` (top, formatted), `averageBuyPrice` formatted as `₹X/COIN` (subtitle) | Two lines |
| **Total Current Value** | `totalHolding × currentPrice` | Formatted in ₹ |
| **Short-term** | `stcg.gain` (top, colored), `stcg.balance` + coin ticker (subtitle) | Green if gain > 0, Red if gain < 0 |
| **Long-term** | `ltcg.gain` (top, colored), `ltcg.balance` + coin ticker (subtitle) | Green if gain > 0, Red if gain < 0 |
| **Amount to Sell** | Populated with `totalHolding` + coin ticker when row is selected | Shows `—` when row is not selected |

#### 6.5.2 Sorting

Default sort order (descending by absolute short-term gain value) — show most impactful assets first.

#### 6.5.3 Selection Behaviour

- Each row has a **checkbox** on the far left.
- The table header has a **"Select All" checkbox**:
  - Checked: all rows selected
  - Unchecked: all rows deselected
  - Indeterminate state: some rows selected
- Checking/unchecking any row triggers real-time recalculation of the After Harvesting card.
- Selected rows should have a **visual highlight** (e.g., light blue row background or left border accent).

#### 6.5.4 "View All" Functionality

- By default, show the first **N rows** (suggested: 5).
- A **"View all"** link/button at the bottom expands the table to show all holdings.
- Once expanded, the link changes to **"View less"** (or similar) to collapse.

#### 6.5.5 Number Formatting

- All currency values: formatted with `₹` prefix, 2 decimal places, comma separators (Indian numbering system preferred).
- Very small numbers (scientific notation in source data): display as `< ₹0.01` or rounded appropriately — do not render raw scientific notation.
- Coin balances: show up to 6 significant digits; use abbreviations for very large holdings (e.g., `696,324.31`).

---

## 7. API Specifications (Mock)

There is no real backend or external API URL. All data is seeded directly inside the codebase under `src/lib/`. The mock fetch functions simulate async behaviour using `Promise` + `setTimeout` so that loading states, error states, and real API patterns can all be exercised without any network dependency.

### 7.1 Folder Structure

```
src/
└── lib/
    ├── types.ts               # Shared TypeScript interfaces
    ├── mockCapitalGains.ts    # Seeded capital gains data
    ├── mockHoldings.ts        # Seeded holdings array (25 assets)
    └── api.ts                 # Mock fetch functions (Promise-based)
```

### 7.2 `types.ts`

Defines shared interfaces used across the app:

```typescript
export interface CapitalGains {
  capitalGains: {
    stcg: { profits: number; losses: number };
    ltcg: { profits: number; losses: number };
  };
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: { balance: number; gain: number };
  ltcg: { balance: number; gain: number };
}
```

### 7.3 `mockCapitalGains.ts`

Hardcoded seeded data. **Never changes at runtime.**

```typescript
import { CapitalGains } from "./types";

export const capitalGainsData: CapitalGains = {
  capitalGains: {
    stcg: { profits: 70200.88, losses: 1548.53 },
    ltcg: { profits: 5020, losses: 3050 },
  },
};
```

### 7.4 `mockHoldings.ts`

Hardcoded seeded array of 25 crypto assets. **Never changes at runtime.**

```typescript
import { Holding } from "./types";

export const holdingsData: Holding[] = [
  {
    coin: "USDC",
    coinName: "USDC",
    logo: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
    currentPrice: 85.41,
    totalHolding: 0.0015339999999994802,
    averageBuyPrice: 1.5863185433764244,
    stcg: { balance: 0.0015339999999994802, gain: 0.12858552735441697 },
    ltcg: { balance: 0, gain: 0 },
  },
  // ... remaining 24 assets (full list in assignment document)
];
```

### 7.5 `api.ts`

Mock fetch functions that wrap seeded data in Promises with a simulated ~800ms delay. This pattern keeps components identical to how they would work against a real API.

```typescript
import { capitalGainsData } from "./mockCapitalGains";
import { holdingsData } from "./mockHoldings";
import { CapitalGains, Holding } from "./types";

export const fetchCapitalGains = (): Promise<CapitalGains> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(capitalGainsData), 800)
  );

export const fetchHoldings = (): Promise<Holding[]> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(holdingsData), 800)
  );
```

### 7.6 Usage in Components

Import and call exactly like a real API:

```typescript
import { fetchCapitalGains, fetchHoldings } from "@/lib/api";

useEffect(() => {
  Promise.all([fetchCapitalGains(), fetchHoldings()])
    .then(([gains, holdings]) => {
      setCapitalGains(gains.capitalGains);
      setHoldings(holdings);
    })
    .catch((err) => setError(err.message));
}, []);
```

### 7.7 Swapping to a Real API Later

When a real backend is available, only `api.ts` needs to change — replace the Promise wrappers with `fetch()` calls. `types.ts`, all components, and all state logic remain untouched.

---

## 8. State Management

Recommended approach: **React Context + useReducer** (or equivalent).

### 8.1 Global State Shape

```typescript
{
  capitalGains: {
    stcg: { profits: number; losses: number };
    ltcg: { profits: number; losses: number };
  } | null;

  holdings: Holding[];
  selectedHoldingIds: Set<string>;   // keyed by coin+coinName (handle duplicates)

  isLoadingGains: boolean;
  isLoadingHoldings: boolean;
  error: string | null;

  showAllHoldings: boolean;
}
```

### 8.2 Derived State (computed, not stored)

- `afterHarvestingGains` — computed from base `capitalGains` + selected holdings' gains
- `savings` — computed from pre vs post realised gains
- `selectAllState` — `'all' | 'none' | 'indeterminate'`

---

## 9. Loading & Error States

### 9.1 Loading

- Display a **skeleton loader** or **spinner** in place of:
  - Both capital gains cards while Capital Gains API is resolving
  - Holdings table while Holdings API is resolving
- Both APIs should be fetched in **parallel** (Promise.all).

### 9.2 Error

- If either API fails, show an inline error message within the relevant section.
- Error message should include a **"Retry"** button that re-triggers the fetch.
- Do not crash the entire page if one API fails.

---

## 10. Responsive Behaviour

### Desktop (≥ 1024px)
- Pre Harvesting and After Harvesting cards sit **side by side** (2-column grid).
- Holdings table shows all 7 columns.

### Tablet (768px – 1023px)
- Cards remain side by side if space permits; else stack vertically.
- Holdings table may horizontally scroll.

### Mobile (< 768px)
- Cards **stack vertically** (Pre Harvesting above After Harvesting).
- Holdings table: show only **Asset** and **Holdings** columns; other columns hidden.
- Horizontal scroll on the holdings table is acceptable as a fallback.
- "View all" / "View less" remains functional.

---

## 11. Visual Design Specifications

### 11.1 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg-page` | `#F9FAFB` (light) / `#0F1117` (dark) | Page background |
| `--color-card-dark` | `#1A1D2E` | Pre Harvesting card |
| `--color-card-blue` | `#1A6FEF` | After Harvesting card |
| `--color-text-primary` | `#FFFFFF` (on dark/blue) / `#111827` (on light) | |
| `--color-gain-positive` | `#22C55E` | Green for positive gains |
| `--color-gain-negative` | `#EF4444` | Red for negative gains/losses |
| `--color-accent` | `#3B82F6` | Checkboxes, links, focus states |

### 11.2 Typography

- Headings: Bold, ~18–24px
- Card labels: Regular, ~13–14px
- Card values: Semibold/Bold, ~14–16px
- Realised/Effective Gains: Bold, ~22–28px
- Table headers: Semibold, ~12–13px, uppercase or slightly muted
- Table body: Regular, ~13–14px

### 11.3 Checkbox Styling

- Custom styled checkboxes (not native browser default).
- Checked state: Blue fill with white checkmark.
- Selected row: Subtle blue highlight on the row background.

---

## 12. Component Breakdown

| Component | Responsibility |
|---|---|
| `App` | Root, providers, page layout |
| `DisclaimerBanner` | Collapsible notes section |
| `CapitalGainsSection` | Side-by-side layout of both cards |
| `PreHarvestingCard` | Read-only display of base capital gains |
| `AfterHarvestingCard` | Dynamic display; shows savings message |
| `CapitalGainsRow` | Reusable row: label, short-term value, long-term value |
| `HoldingsTable` | Table with header, rows, view all toggle |
| `HoldingRow` | Single holding row with checkbox and all fields |
| `Checkbox` | Reusable styled checkbox (supports indeterminate) |
| `SkeletonLoader` | Placeholder during API loading |
| `ErrorState` | Inline error with retry CTA |
| `CoinLogo` | Image with fallback to default SVG |

---

## 13. Non-Functional Requirements

| Requirement | Specification |
|---|---|
| **Performance** | Initial render under 2s on average connection; no unnecessary re-renders on checkbox selection |
| **Accessibility** | Checkboxes have `aria-label`; table uses proper `<thead>/<tbody>/<th>` semantics; color is not the sole indicator of gain/loss (consider +/- sign) |
| **Browser support** | Chrome, Firefox, Safari — latest 2 versions |
| **Code quality** | No prop drilling beyond 2 levels; business logic separated from UI components; no magic numbers |

---

## 14. Out of Scope

- Actual trade execution or brokerage integration
- Authentication / user accounts
- Real-time price updates (WebSocket)
- Tax filing or export functionality
- "How it works?" modal/page content
- Backend server or database

---

## 15. Deliverables Checklist

- [ ] React application (Vite or Create React App)
- [ ] TypeScript (strongly recommended)
- [ ] Tailwind CSS or equivalent
- [ ] `src/lib/types.ts` — shared TypeScript interfaces
- [ ] `src/lib/mockCapitalGains.ts` — seeded capital gains data
- [ ] `src/lib/mockHoldings.ts` — seeded holdings data (25 assets)
- [ ] `src/lib/api.ts` — Promise-based mock fetch functions (~800ms simulated delay)
- [ ] Pre Harvesting card (correct computations)
- [ ] After Harvesting card (real-time updates on selection)
- [ ] Holdings table with checkboxes and Select All
- [ ] View All / View Less toggle
- [ ] Savings message conditional display
- [ ] Loading skeletons/spinners
- [ ] Error states with retry
- [ ] Mobile responsive layout
- [ ] Deployed link (Vercel / Netlify)
- [ ] GitHub repo with clear folder structure
- [ ] README with setup instructions, screenshots, assumptions

---

## 16. Assumptions & Edge Cases

| Scenario | Handling |
|---|---|
| Duplicate coin tickers (two USDC entries) | Use `coin + coinName` as composite key for selection state |
| Holdings with near-zero gains (scientific notation) | Round to 2 decimal places; show `₹0.00` or `< ₹0.01` |
| `averageBuyPrice = 0` | Display as `₹0.00`; do not divide by zero |
| All holdings selected | After Harvesting card reflects cumulative impact of all assets |
| Selecting assets that increase tax liability | Do not show savings message; no negative savings displayed |
| Logo URL returns 404 | Fallback to `DefaultCoin.svg` from KoinX CDN |
| Holdings API returns empty array | Show empty state in table: "No holdings found" |

## 17. Don't
- Don't use emojis , if required only- use react icons
- No extra .md files should be made