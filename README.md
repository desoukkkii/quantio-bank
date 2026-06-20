# QUANTIO Bank — Online Banking Application

A complete banking web application built with HTML, CSS, and JavaScript. Features account management, deposits, withdrawals, and transfers with persistent local storage.

## Features

- Create bank accounts with initial deposits
- Deposit and withdraw funds
- Transfer money between accounts
- Real-time transaction history
- Multi-account switching
- Data persistence via localStorage

## Getting Started

1. Place `index.html`, `style.css`, and `script.js` in the same directory
2. Open `index.html` in any modern browser
3. A default account is created automatically — use the interface to manage it

## Project Structure

```
├── index.html   # Application markup
├── style.css    # Styling and layout
└── script.js    # Banking logic and UI
```

## Operations

| Action     | Description                                |
| ---------- | ------------------------------------------ |
| Deposit    | Add funds to the current account           |
| Withdraw   | Remove funds (overdraft protection active) |
| Transfer   | Send funds to another account              |
| Switch     | Change between multiple accounts           |
| Reset      | Restore default balance and clear history  |

## Design

Clean, professional banking interface with a navy blue color scheme, light background, and clear typography. Built with a focus on usability and readability.

- **Colors:** Navy (#1a365d) primary, blue (#2b6cb0) accent, light gray background
- **Typography:** Inter (UI), Playfair Display (logo)
- **Icons:** Inline SVGs — no external dependencies

## License

MIT — see [LICENSE](LICENSE).
