import BankAccount from './BankAccount.js';

export default class BankingSystem {
  constructor() {
    this.accounts = new Map();
    this.current = null;
    this._load();
  }

  _genNumber() {
    return "SB" + (Math.floor(Math.random() * 9e9) + 1e9);
  }

  create(name, deposit = 0) {
    const trimmed = name?.trim();
    if (!trimmed) throw new Error("Account holder name is required");
    for (const acc of this.accounts.values()) {
      if (acc.holder.toLowerCase() === trimmed.toLowerCase())
        throw new Error(`An account for "${trimmed}" already exists`);
    }
    const num = this._genNumber();
    const acc = new BankAccount(trimmed, num, deposit);
    if (deposit > 0) acc._record("INITIAL DEPOSIT", deposit);
    this.accounts.set(num, acc);
    this._save();
    return acc;
  }

  find(num) {
    return this.accounts.get(num);
  }

  all() {
    return Array.from(this.accounts.values());
  }

  switchTo(num) {
    const acc = this.find(num);
    if (acc) {
      this.current = acc;
      this._save();
      return true;
    }
    return false;
  }

  resetCurrent() {
    if (!this.current) return false;
    this.current.balance = 1247.89;
    this.current.txns = [];
    this.current._record("INITIAL DEPOSIT", 1247.89);
    this._save();
    return true;
  }

  _save() {
    try {
      const data = {
        accounts: Array.from(this.accounts.values()).map((a) => ({
          holder: a.holder,
          number: a.number,
          balance: a.balance,
          txns: a.txns,
        })),
        current: this.current?.number ?? null,
      };
      localStorage.setItem("quantioBank_v2", JSON.stringify(data));
    } catch (_) {}
  }

  _load() {
    try {
      const saved =
        localStorage.getItem("quantioBank_v2") ||
        localStorage.getItem("quantioBank");
      if (saved) {
        const data = JSON.parse(saved);
        for (const d of data.accounts) {
          const a = new BankAccount(d.holder, d.number, d.balance);
          a.txns = d.txns || [];
          this.accounts.set(d.number, a);
          if (d.number === data.current) this.current = a;
        }
        if (!this.current && this.accounts.size > 0) {
          this.current = this.accounts.values().next().value;
        }
      }
    } catch (_) {}
    if (this.accounts.size === 0) {
      this.current = this.create("John Doe", 1247.89);
    }
  }
}
