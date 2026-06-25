export function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function initials(name) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("") || "?"
  );
}

export default class BankAccount {
  constructor(holder, number, balance = 0) {
    this.holder = holder;
    this.number = number;
    this.balance = balance;
    this.txns = [];
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be greater than zero");
    this.balance += amount;
    this._record("DEPOSIT", amount);
    return `Deposited ${fmt(amount)}`;
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Amount must be greater than zero");
    if (amount > this.balance)
      throw new Error(`Insufficient funds. Balance: ${fmt(this.balance)}`);
    this.balance -= amount;
    this._record("WITHDRAWAL", amount);
    return `Withdrew ${fmt(amount)}`;
  }

  transfer(amount, target) {
    if (amount <= 0) throw new Error("Amount must be greater than zero");
    if (amount > this.balance)
      throw new Error(`Insufficient funds. Balance: ${fmt(this.balance)}`);
    this.balance -= amount;
    target.balance += amount;
    this._record("TRANSFER SENT", amount, target.number, target.holder);
    target._record("TRANSFER RECEIVED", amount, this.number, this.holder);
    return `Sent ${fmt(amount)} to ${target.holder}`;
  }

  _record(type, amount, related, relatedHolder) {
    const now = new Date();
    this.txns.unshift({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      amount,
      date: now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      related,
      relatedHolder,
    });
    if (this.txns.length > 50) this.txns.pop();
  }

  recent(limit = 15) {
    return this.txns.slice(0, limit);
  }
}
