# QUANTIO Bank

A modern online banking dashboard built with React + Tailwind CSS (Vite).

## Features

- Deposit, withdraw, and transfer between accounts
- Multiple account management with balance tracking
- Transaction history with categorized entries
- Local storage persistence
- Responsive design (mobile to ultra-wide)
- Keyboard accessible and screen reader friendly
- Animated UI with reduced-motion support

## Tech Stack

- **React 19** — components, hooks, context API
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Vite 8** — dev server and production build

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Build for production       |
| `npm run preview` | Preview production build   |
| `npm run lint`    | Run Oxlint                 |

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── AccountPanel.jsx
│   ├── AccountCard.jsx
│   ├── AccountsSummary.jsx
│   ├── BalanceCard.jsx
│   ├── Button.jsx
│   ├── CreateAccountModal.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Modal.jsx
│   ├── SwitchAccountModal.jsx
│   ├── TransactionItem.jsx
│   ├── TransactionModal.jsx
│   ├── TransactionsPanel.jsx
│   └── WelcomeBar.jsx
├── context/        # React context providers
│   ├── BankingContext.jsx
│   └── ToastContext.jsx
├── lib/            # Core logic and utilities
│   ├── bank.js
│   ├── BankAccount.js
│   ├── BankingSystem.js
│   └── icons.jsx
├── App.jsx         # Root component
├── index.css       # Tailwind imports and custom theme
└── main.jsx        # Entry point
```

## License

MIT
