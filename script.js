/* ======== BANKING SYSTEM ======== */
class BankAccount {
  constructor(holder, number, balance = 0) {
    this.holder = holder;
    this.number = number;
    this.balance = balance;
    this.txns = [];
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    this.balance += amount;
    this._add("DEPOSIT", amount);
    return `Deposited $${amount.toFixed(2)}`;
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    if (amount > this.balance)
      throw new Error(`Insufficient funds. Balance: $${this.balance.toFixed(2)}`);
    this.balance -= amount;
    this._add("WITHDRAWAL", amount);
    return `Withdrew $${amount.toFixed(2)}`;
  }

  transfer(amount, target) {
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    if (amount > this.balance)
      throw new Error(`Insufficient funds. Balance: $${this.balance.toFixed(2)}`);
    this.balance -= amount;
    target.balance += amount;
    this._add("TRANSFER SENT", amount, target.number, target.holder);
    target._add("TRANSFER RECEIVED", amount, this.number, this.holder);
    return `Transferred $${amount.toFixed(2)} to ${target.holder}`;
  }

  _add(type, amount, related, relatedHolder) {
    const now = new Date();
    this.txns.unshift({
      id: Date.now() + Math.random(),
      type,
      amount,
      date: now.toLocaleDateString(),
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
    if (!name || !name.trim()) throw new Error("Account holder name is required");
    for (const acc of this.accounts.values()) {
      if (acc.holder.toLowerCase() === name.trim().toLowerCase())
        throw new Error(`An account for "${name}" already exists`);
    }
    const num = this._genNumber();
    const acc = new BankAccount(name.trim(), num, deposit);
    if (deposit > 0) acc._add("INITIAL DEPOSIT", deposit);
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
    this.current._add("INITIAL DEPOSIT", 1247.89);
    this._save();
    return true;
  }

  _save() {
    const data = {
      accounts: Array.from(this.accounts.entries()).map(([, a]) => ({
        holder: a.holder,
        number: a.number,
        balance: a.balance,
        txns: a.txns,
      })),
      current: this.current ? this.current.number : null,
    };
    localStorage.setItem("quantioBank", JSON.stringify(data));
  }

  _load() {
    try {
      const saved = localStorage.getItem("quantioBank");
      if (saved) {
        const data = JSON.parse(saved);
        for (const d of data.accounts) {
          const a = new BankAccount(d.holder, d.number, d.balance);
          a.txns = d.txns || [];
          this.accounts.set(d.number, a);
          if (d.number === data.current) this.current = a;
        }
      }
    } catch (_) {}
    if (this.accounts.size === 0) {
      this.current = this.create("John Doe", 1247.89);
    }
  }
}

/* ======== INIT ======== */
const bank = new BankingSystem();

/* ======== DOM REFS ======== */
const $ = (id) => document.getElementById(id);
const dom = {
  balance: $("balanceDisplay"),
  account: $("accountNumberDisplay"),
  txns: $("transactionsList"),
  welcome: $("welcomeMessage"),
  summary: $("accountSummary"),
  accountsList: $("accountsList"),
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

let activeAction = null;
let toastTimer = null;

/* ======== HELPERS ======== */
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function showToast(msg, type = "success") {
  const t = dom.toast;
  t.textContent = msg;
  t.className = "toast show " + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = "toast"), 3000);
}

/* ======== RENDER ======== */
function render() {
  const acc = bank.current;
  if (acc) {
    dom.balance.textContent = fmt(acc.balance);
    dom.account.innerHTML = `<span class="acct-dot"></span><span>****${acc.number.slice(-4)}</span>`;
    dom.welcome.textContent = `Welcome, ${acc.holder}`;
  } else {
    dom.balance.textContent = "$0.00";
    dom.account.innerHTML = `<span class="acct-dot"></span><span>No Account</span>`;
    dom.welcome.textContent = "Welcome to QUANTIO Bank";
  }
  renderTxns();
  renderAccounts();
}

function renderTxns() {
  const acc = bank.current;
  if (!acc || acc.txns.length === 0) {
    dom.txns.innerHTML =
      '<div class="tx-empty"><p>No transactions yet</p><span>Deposit or transfer to get started</span></div>';
    return;
  }

  dom.txns.innerHTML = acc
    .recent(15)
    .map((t) => {
      let cls = "tx-credit", sign = "+";
      let label = t.type;
      if (t.type === "WITHDRAWAL") {
        cls = "tx-debit";
        sign = "-";
      } else if (t.type === "TRANSFER SENT") {
        cls = "tx-debit";
        sign = "-";
        label = "To: " + (t.relatedHolder || t.related);
      } else if (t.type === "TRANSFER RECEIVED") {
        label = "From: " + (t.relatedHolder || t.related);
      } else if (t.type === "INITIAL DEPOSIT") {
        label = "Initial Deposit";
      }
      return (
        '<div class="tx-item">' +
        "<div>" +
        '<div class="tx-label">' + label + "</div>" +
        '<div class="tx-meta">' + t.date + " at " + t.time + "</div>" +
        "</div>" +
        '<div class="tx-amount ' + cls + '">' + sign + fmt(t.amount) + "</div>" +
        "</div>"
      );
    })
    .join("");
}

function renderAccounts() {
  const all = bank.all();
  if (all.length > 1) {
    dom.summary.hidden = false;
    dom.accountsList.innerHTML = all
      .map(
        (a) =>
          '<div class="acc-card' +
          (bank.current && a.number === bank.current.number ? " active" : "") +
          '" data-switch="' +
          a.number +
          '">' +
          '<div class="acc-name">' + a.holder + "</div>" +
          '<div class="acc-number">' + a.number + "</div>" +
          '<div class="acc-balance">' + fmt(a.balance) + "</div>" +
          "</div>"
      )
      .join("");
  } else {
    dom.summary.hidden = true;
  }
}

/* ======== MODALS ======== */
function openModal(action) {
  activeAction = action;
  dom.amount.value = "";
  dom.recipient.value = "";
  if (action === "transfer") {
    dom.modalTitle.textContent = "Send Money";
    dom.transferField.classList.remove("hidden");
    dom.recipient.required = true;
  } else {
    dom.modalTitle.textContent = action === "deposit" ? "Deposit" : "Withdraw";
    dom.transferField.classList.add("hidden");
    dom.recipient.required = false;
  }
  dom.actionModal.style.display = "flex";
  dom.amount.focus();
}

function closeModals() {
  dom.actionModal.style.display = "none";
  dom.createModal.style.display = "none";
  dom.switchModal.style.display = "none";
  activeAction = null;
}

/* ======== ACTIONS ======== */
function handleConfirm() {
  if (!activeAction) return;
  const amount = parseFloat(dom.amount.value);
  if (isNaN(amount) || amount <= 0) return showToast("Enter a valid amount", "error");

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
      if (target.number === acc.number) return showToast("Cannot transfer to yourself", "error");
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
  const name = document.getElementById("newAccountHolder").value.trim();
  const deposit = parseFloat(document.getElementById("initialDeposit").value) || 0;
  if (!name) return showToast("Enter account holder name", "error");
  try {
    const a = bank.create(name, deposit);
    showToast("Account opened for " + a.holder + " (" + a.number + ")");
    document.getElementById("createAccountForm").reset();
    dom.createModal.style.display = "none";
    render();
  } catch (e) {
    showToast(e.message, "error");
  }
}

function handleReset() {
  if (confirm("Reset account to $1,247.89? This will clear all transactions.")) {
    bank.resetCurrent();
    render();
    showToast("Account has been reset");
  }
}

function showSwitch() {
  const all = bank.all();
  if (all.length <= 1) return showToast("Create another account first", "error");
  dom.switchList.innerHTML = all
    .map(
      (a) =>
        '<div class="switch-item" data-switch="' +
        a.number +
        '">' +
        "<div>" +
        '<div style="font-weight:600;font-size:0.88rem">' + a.holder + "</div>" +
        '<div style="font-size:0.68rem;color:#a0aec0">' + a.number + "</div>" +
        "</div>" +
        '<div style="font-weight:700;color:#2f855a">' + fmt(a.balance) + "</div>" +
        "</div>"
    )
    .join("");
  dom.switchModal.style.display = "flex";
}

function switchTo(num) {
  if (bank.switchTo(num)) {
    render();
    showToast("Switched to " + bank.current.holder);
    closeModals();
  }
}

/* ======== EVENT DELEGATION ======== */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-switch]");
  if (t) {
    switchTo(t.dataset.switch);
    return;
  }

  switch (e.target.id) {
    case "depositBtn":
      openModal("deposit");
      break;
    case "withdrawBtn":
      openModal("withdraw");
      break;
    case "transferBtn":
      openModal("transfer");
      break;
    case "resetBtn":
      handleReset();
      break;
    case "createAccountBtn":
      dom.createModal.style.display = "flex";
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

  if (
    e.target.classList.contains("modal-overlay") ||
    e.target.classList.contains("modal-x") ||
    e.target.classList.contains("close-create") ||
    e.target.classList.contains("close-switch")
  ) {
    closeModals();
  }
});

/* ======== FORM SUBMITS ======== */
dom.txForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleConfirm();
});
dom.createForm.addEventListener("submit", handleCreate);

/* ======== KEYBOARD ======== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});

/* ======== STARTUP ======== */
render();

requestAnimationFrame(() => {
  if (bank.all().length === 1) {
    try {
      bank.create("Jane Smith", 500);
      render();
    } catch (_) {}
  }
});
