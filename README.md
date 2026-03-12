# MaxiLotto Retail Agent Web

This repository holds the primary interface used by on-site Retail Agents operating inside physical shop locations. It is a swift, tailored Vue 3 ecosystem enabling tellers to process bets rapidly, validate scanned tickets, and oversee brief end-of-day balances for their particular terminal.

## Features

- **Rapid Point-of-Sale**: Fast entry capabilities for selecting game stakes on behalf of walk-in customers.
- **Receipt/Ticket Validation**: Over-the-counter barcode/serial validation ensuring tickets generated locally can be tracked and instantly processed for winnings.
- **Agent Balances**: Real-time insights highlighting shop balances.
- **Transaction Logs**: Localized filtering of daily betting volumes per active terminal.
- **Terminal Linking**: Hardware-to-software authentication, ensuring bets can only be processed by authorized sub-agent accounts assigned to established machines.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API & Type Support mapped via `vue-tsc`)
- **Tooling**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Date Handling**: Native usage of `date-fns` scaling alongside `vue-datepicker-next`.
- **API Linkage**: Driven by `Axios` reaching out to the heavy-duty endpoints furnished by `MAXILOTTOBACKEND.RETAIL`.

## Getting Started

### Recommended Environment
It is highly recommended to use **VSCode** alongside the **Volar** extension for native `.vue` IntelliSense and typing features. Use TypeScript files explicitly with `setup` tags to capitalize on compiler insights.

### Installation

1. Ensure Node.js is updated.
2. Install dependencies:
   ```bash
   npm install
   ```

### Execution

1. Build a local dev context providing robust Hot Module Replacement (HMR):
   ```bash
   npm run dev
   ```
2. The agent application typically connects to Localhost during development. Assure `MAXILOTTOBACKEND.RETAIL` is functional locally or proxy the variables into the Vite `.env`.

### Deployment

Because TypeScript cannot always seamlessly handle `.vue` typings mid-build dynamically, we employ `run-p` scripts:
```bash
npm run build
```
*This internally executes `vue-tsc --build --force` checking strict TS logic prior to running `vite build`.*
