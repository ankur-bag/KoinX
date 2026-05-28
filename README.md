# KoinX Tax Loss Harvesting Tool (Assessment project)

A sophisticated, responsive React application built for crypto investors to simulate and optimize their tax liabilities through strategic tax-loss harvesting.

![KoinX Logo](src/assets/koinx-logo.png)

## 🚀 Overview

The **Tax Loss Harvesting (TLH)** tool helps users identify underperforming assets in their portfolio that, if sold, can offset realized capital gains. This project focuses on an impeccable user interface, real-time calculations, and a seamless data-driven experience across both light and dark themes.

## ✨ Key Features

- **Real-time Tax Simulation**: Interactively select holdings to see how "After Harvesting" values (Profits, Losses, Net Gains) update instantly.
- **Advanced Holdings Table**:
  - Multi-select capability with "Select All" and indeterminate states.
  - Interactive sorting for Short-term and Long-term gains (Descending → Ascending → Reset).
  - Collapsible data view ("View All" toggle).
- **Impeccable UI/UX**:
   - **Theme System**: Supports both light and dark mode with `data-theme` driven styling and synchronized Tailwind `dark:` variants.
   - **Typography**: Uses **Google Sans** / **Google Sans Flex** with medium-first weights for cleaner readability.
   - **Precision Alignment**: All financial data is aligned using fixed-width containers and tabular figures.
- **Adaptive Design**: Fully responsive across mobile, tablet, and desktop viewports.
- **Collapsible Disclaimers**: Integrated accordion for important regulatory notes and disclaimers.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (using OKLCH colors & CSS-first configuration)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: CSS transitions and utility-based motion styles

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/koinx-tax-harvesting.git
   cd koinx-tax-harvesting
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```text
src/
├── assets/         # static assets (KoinX logo, coin icons)
├── components/     # Reusable UI components (Cards, Tables, Rows)
├── context/        # React Context for state management
├── hooks/          # Custom hooks (useHarvesting)
├── lib/            # API mocks, types, and business logic
├── utils/          # Formatter functions (INR, Coin balance)
└── App.tsx         # Main entry point and layout
```

## 📝 Implementation Details

- **State Management**: Uses React `useReducer` and `useContext` for robust, predictable state transitions.
- **Performance**: High-performance rendering with `useMemo` for derived tax calculations and sorting operations.
- **Theming**: `ThemeProvider` sets `data-theme` on the root document element, and global tokens in `src/index.css` control surface/background/text colors.
- **Typography Philosophy**: Prioritizes medium and light weights to maintain a distinctive, non-generic bold experience.

## ✅ Recent Updates

- Fixed light theme text visibility by wiring Tailwind `dark:` utilities to `[data-theme='dark']` via a custom variant.
- Updated global font stack to Google Sans and reduced heavy font weights across the UI.
- Resolved TypeScript build blockers:
   - Removed unused `Holding` type import in `src/components/CapitalGainsSection.tsx`.
   - Converted `ReactNode` to a type-only import in `src/context/HarvestingContext.tsx`.
- Verified production build with `npm run build`.

## ⚖️ Disclaimer

Tax-loss harvesting regulations vary by country. This tool is a simulation and should not be considered financial or tax advice. Always consult with a qualified tax professional.


