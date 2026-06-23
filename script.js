/* ==========================================
   QUANTIO Bank — Banking System v2
   ========================================== */

/* ── BankAccount ── */
class BankAccount {
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

/* ── BankingSystem ── */
class BankingSystem {
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

/* ── Helpers ── */
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const $ = (id) => document.getElementById(id);

function initials(name) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("") || "?"
  );
}

/* ── State ── */
const bank = new BankingSystem();
let activeAction = null;
let toastTimer = null;

/* ── DOM refs ── */
const dom = {
  balance: $("balanceDisplay"),
  accountNum: $("accountNumberDisplay"),
  txns: $("transactionsList"),
  welcome: $("welcomeMessage"),
  avatar: $("welcomeAvatar"),
  summary: $("accountSummary"),
  accountsList: $("accountsList"),
  accountsCount: $("accountsCount"),
  actionModal: $("actionModal"),
  createModal: $("createAccountModal"),
  switchModal: $("switchAccountModal"),
  modalTitle: $("modalTitle"),
  transferField: $("transferField"),
  amount: $("amountInput"),
  recipient: $("recipientInput"),
  txForm: $("transactionForm"),
  createForm: $("createAccountForm"),
  switchList: $("switchAccountsList"),
  toast: $("toast"),
};

/* ── Toast ── */
function showToast(msg, type = "success") {
  const t = dom.toast;
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.className = "toast";
  }, 3000);
}

/* ── Render ── */
function render() {
  const acc = bank.current;
  if (acc) {
    dom.balance.textContent = fmt(acc.balance);
    dom.accountNum.innerHTML =
      `<span class="status-dot" aria-hidden="true"></span>` +
      `<span class="account-num-text">****${acc.number.slice(-4)}</span>`;
    dom.welcome.textContent = `Welcome back, ${acc.holder.split(" ")[0]}`;
    dom.avatar.textContent = initials(acc.holder);
  } else {
    dom.balance.textContent = "$0.00";
    dom.accountNum.innerHTML =
      `<span class="status-dot" aria-hidden="true"></span>` +
      `<span class="account-num-text">No Account</span>`;
    dom.welcome.textContent = "Welcome to QUANTIO Bank";
    dom.avatar.textContent = "Q";
  }
  renderTxns();
  renderAccounts();
}

/* ── Transaction icons ── */
function txIcon(type) {
  const icons = {
    DEPOSIT: {
      cls: "credit",
      svg: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none"><path d="M7 2v10M2.5 7.5 7 12l4.5-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    WITHDRAWAL: {
      cls: "debit",
      svg: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none"><path d="M7 12V2M2.5 6.5 7 2l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    "TRANSFER SENT": {
      cls: "debit",
      svg: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none"><path d="M2 5h10M9 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    "TRANSFER RECEIVED": {
      cls: "credit",
      svg: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none"><path d="M12 9H2M5 6l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    "INITIAL DEPOSIT": {
      cls: "neutral",
      svg: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M7 4.5v5M4.5 7h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    },
  };
  return icons[type] || icons["INITIAL DEPOSIT"];
}

function renderTxns() {
  const acc = bank.current;
  if (!acc || acc.txns.length === 0) {
    dom.txns.innerHTML = `
      <div class="tx-empty" role="listitem">
        <div class="tx-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
            <rect x="6" y="10" width="28" height="22" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            <path d="M12 18h16M12 23h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
          </svg>
        </div>
        <p>No transactions yet</p>
        <span>Deposit or transfer to get started</span>
      </div>`;
    return;
  }

  dom.txns.innerHTML = acc
    .recent(15)
    .map((t) => {
      const icon = txIcon(t.type);
      let amountCls = "tx-credit",
        sign = "+",
        label = t.type;

      if (t.type === "WITHDRAWAL") {
        amountCls = "tx-debit";
        sign = "−";
      } else if (t.type === "TRANSFER SENT") {
        amountCls = "tx-debit";
        sign = "−";
        label = `To ${t.relatedHolder || t.related}`;
      } else if (t.type === "TRANSFER RECEIVED") {
        label = `From ${t.relatedHolder || t.related}`;
      } else if (t.type === "INITIAL DEPOSIT") {
        label = "Account opened";
      } else if (t.type === "DEPOSIT") {
        label = "Deposit";
      }

      return `
        <div class="tx-item" role="listitem">
          <div class="tx-info">
            <div class="tx-icon ${icon.cls}" aria-hidden="true">${icon.svg}</div>
            <div class="tx-details">
              <div class="tx-label">${escHtml(label)}</div>
              <div class="tx-meta">${t.date} · ${t.time}</div>
            </div>
          </div>
          <div class="tx-amount ${amountCls}" aria-label="${sign}${fmt(t.amount)}">${sign}${fmt(t.amount)}</div>
        </div>`;
    })
    .join("");
}

function renderAccounts() {
  const all = bank.all();
  if (all.length > 1) {
    dom.summary.hidden = false;
    dom.accountsCount.textContent = `${all.length} accounts`;
    dom.accountsList.innerHTML = all
      .map((a) => {
        const isActive = bank.current && a.number === bank.current.number;
        return `
          <div class="acc-card${isActive ? " active" : ""}"
               data-switch="${escAttr(a.number)}"
               role="button"
               tabindex="0"
               aria-label="Switch to ${escAttr(a.holder)}'s account, balance ${fmt(a.balance)}"
               aria-pressed="${isActive}">
            <div class="acc-name">${escHtml(a.holder)}</div>
            <div class="acc-number">${escHtml(a.number)}</div>
            <div class="acc-balance">${fmt(a.balance)}</div>
          </div>`;
      })
      .join("");
  } else {
    dom.summary.hidden = true;
  }
}

/* ── Escape helpers ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escAttr(str) {
  return String(str).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ── Modals ── */
function openModal(id) {
  const el = $(id);
  el.classList.add("is-open");
  el.style.display = "flex";
  // Focus first focusable element
  requestAnimationFrame(() => {
    const first = el.querySelector("input, button:not(.modal-close)");
    first?.focus();
  });
}

function closeModals() {
  ["actionModal", "createAccountModal", "switchAccountModal"].forEach((id) => {
    const el = $(id);
    el.style.display = "none";
    el.classList.remove("is-open");
  });
  activeAction = null;
}

function openAction(action) {
  activeAction = action;
  dom.amount.value = "";
  dom.recipient.value = "";
  if (action === "transfer") {
    dom.modalTitle.textContent = "Send Money";
    dom.transferField.hidden = false;
    dom.recipient.required = true;
  } else {
    dom.modalTitle.textContent =
      action === "deposit" ? "Deposit Funds" : "Withdraw Funds";
    dom.transferField.hidden = true;
    dom.recipient.required = false;
  }
  openModal("actionModal");
}

/* ── Actions ── */
function handleConfirm() {
  const amount = parseFloat(dom.amount.value);
  if (!amount || amount <= 0) return showToast("Enter a valid amount", "error");

  const acc = bank.current;
  if (!acc) return showToast("No account selected", "error");

  try {
    if (activeAction === "deposit") {
      showToast(acc.deposit(amount));
    } else if (activeAction === "withdraw") {
      showToast(acc.withdraw(amount));
    } else if (activeAction === "transfer") {
      const num = dom.recipient.value.trim().toUpperCase();
      if (!num || !num.startsWith("SB"))
        return showToast("Enter a valid account number (SB...)", "error");
      const target = bank.find(num);
      if (!target) return showToast("Account not found", "error");
      if (target.number === acc.number)
        return showToast("Cannot transfer to the same account", "error");
      showToast(acc.transfer(amount, target));
    }
    bank._save();
    render();
    closeModals();
  } catch (e) {
    showToast(e.message, "error");
  }
}

function handleCreate(e) {
  e.preventDefault();
  const name = $("newAccountHolder").value.trim();
  const deposit = parseFloat($("initialDeposit").value) || 0;
  if (!name) return showToast("Enter an account holder name", "error");
  try {
    const a = bank.create(name, deposit);
    bank.switchTo(a.number);
    showToast(`Account opened for ${a.holder}`);
    dom.createForm.reset();
    closeModals();
    render();
  } catch (e) {
    showToast(e.message, "error");
  }
}

function handleReset() {
  if (
    confirm(
      "Reset this account to $1,247.89? All transaction history will be cleared.",
    )
  ) {
    bank.resetCurrent();
    render();
    showToast("Account reset to default state");
  }
}

function showSwitch() {
  const all = bank.all();
  if (all.length <= 1) return showToast("Open another account first", "error");
  dom.switchList.innerHTML = all
    .map((a) => {
      const isCurrent = bank.current?.number === a.number;
      return `
        <div class="switch-item${isCurrent ? " active" : ""}"
             data-switch="${escAttr(a.number)}"
             role="listitem"
             tabindex="0"
             aria-label="Switch to ${escAttr(a.holder)}">
          <div>
            <div class="switch-name">${escHtml(a.holder)}</div>
            <div class="switch-num">${escHtml(a.number)}</div>
          </div>
          <div class="switch-balance">${fmt(a.balance)}</div>
        </div>`;
    })
    .join("");
  openModal("switchAccountModal");
}

function switchTo(num) {
  if (bank.switchTo(num)) {
    render();
    showToast(`Switched to ${bank.current.holder}`);
    closeModals();
  }
}

/* ── Event delegation ── */
document.addEventListener("click", (e) => {
  // Data-switch targets (account cards, switch items)
  const switchTarget = e.target.closest("[data-switch]");
  if (switchTarget) {
    switchTo(switchTarget.dataset.switch);
    return;
  }

  const id = e.target.id || "";

  switch (id) {
    case "depositBtn":
      openAction("deposit");
      break;
    case "withdrawBtn":
      openAction("withdraw");
      break;
    case "transferBtn":
      openAction("transfer");
      break;
    case "resetBtn":
      handleReset();
      break;
    case "createAccountBtn":
      openModal("createAccountModal");
      break;
    case "switchAccountBtn":
      showSwitch();
      break;
    case "closeModalBtn":
    case "cancelModalBtn":
    case "cancelCreateBtn":
    case "cancelSwitchBtn":
      closeModals();
      break;
  }

  // Close on overlay click or close buttons
  if (
    e.target.classList.contains("modal-overlay") ||
    e.target.classList.contains("modal-close") ||
    e.target.classList.contains("close-create") ||
    e.target.classList.contains("close-switch")
  ) {
    closeModals();
  }
});

/* Keyboard: Enter on card elements */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModals();
    return;
  }
  if (e.key === "Enter" && e.target.closest("[data-switch]")) {
    const el = e.target.closest("[data-switch]");
    if (el) switchTo(el.dataset.switch);
  }
});

/* ── Form submits ── */
dom.txForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleConfirm();
});
dom.createForm.addEventListener("submit", handleCreate);

/* ── Init ── */
render();

// Ensure a second demo account exists
requestAnimationFrame(() => {
  if (bank.all().length === 1) {
    try {
      bank.create("Jane Smith", 500);
      render();
    } catch (_) {}
  }
});
