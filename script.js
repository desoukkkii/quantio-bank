// Banking System - Complete JavaScript Logic

// Bank Account Class
class BankAccount {
  constructor(accountHolder, accountNumber, balance = 0) {
    this.accountHolder = accountHolder;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.transactions = [];
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    this.balance += amount;
    this.addTransaction("DEPOSIT", amount);
    return `Successfully deposited $${amount.toFixed(2)}`;
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    this.addTransaction("WITHDRAWAL", amount);
    return `Successfully withdrew $${amount.toFixed(2)}`;
  }

  transfer(amount, targetAccount) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (amount > this.balance) {
      throw new Error("Insufficient funds for transfer");
    }
    this.balance -= amount;
    targetAccount.balance += amount;

    this.addTransaction("TRANSFER SENT", amount, targetAccount.accountNumber);
    targetAccount.addTransaction(
      "TRANSFER RECEIVED",
      amount,
      this.accountNumber,
    );

    return `Successfully transferred $${amount.toFixed(2)} to account ${targetAccount.accountNumber}`;
  }

  addTransaction(type, amount, relatedAccount = null) {
    const transaction = {
      id: Date.now(),
      type: type,
      amount: amount,
      date: new Date().toLocaleString(),
      relatedAccount: relatedAccount,
    };
    this.transactions.unshift(transaction);

    // Keep only last 50 transactions
    if (this.transactions.length > 50) {
      this.transactions.pop();
    }
  }

  getRecentTransactions(limit = 10) {
    return this.transactions.slice(0, limit);
  }
}

// Banking System Manager
class BankingSystem {
  constructor() {
    this.accounts = new Map();
    this.currentAccount = null;
    this.loadFromStorage();
  }

  createAccount(accountHolder, initialDeposit = 0) {
    if (!accountHolder || accountHolder.trim() === "") {
      throw new Error("Account holder name is required");
    }

    const accountNumber = this.generateAccountNumber();
    const newAccount = new BankAccount(
      accountHolder,
      accountNumber,
      initialDeposit,
    );
    this.accounts.set(accountNumber, newAccount);
    this.currentAccount = newAccount;
    this.saveToStorage();

    if (initialDeposit > 0) {
      newAccount.addTransaction("INITIAL DEPOSIT", initialDeposit);
    }

    return newAccount;
  }

  generateAccountNumber() {
    const prefix = "SB";
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return prefix + randomNum;
  }

  findAccount(accountNumber) {
    return this.accounts.get(accountNumber);
  }

  saveToStorage() {
    const data = {
      accounts: Array.from(this.accounts.entries()),
      currentAccountNumber: this.currentAccount
        ? this.currentAccount.accountNumber
        : null,
    };
    localStorage.setItem("bankingSystem", JSON.stringify(data));
  }

  loadFromStorage() {
    const savedData = localStorage.getItem("bankingSystem");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.accounts.clear();

      for (const [accNum, accData] of data.accounts) {
        const account = new BankAccount(
          accData.accountHolder,
          accData.accountNumber,
          accData.balance,
        );
        account.transactions = accData.transactions;
        this.accounts.set(accNum, account);

        if (accData.accountNumber === data.currentAccountNumber) {
          this.currentAccount = account;
        }
      }
    }
  }

  clearAllData() {
    this.accounts.clear();
    this.currentAccount = null;
    this.saveToStorage();
  }
}

// Initialize Banking System
const bank = new BankingSystem();

// DOM Elements
const accountHolderEl = document.getElementById("accountHolder");
const accountNumberEl = document.getElementById("accountNumber");
const balanceEl = document.getElementById("balance");
const transactionListEl = document.getElementById("transactionList");
const createAccountBtn = document.getElementById("createAccountBtn");
const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const transferBtn = document.getElementById("transferBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Modal Elements
const modal = document.getElementById("modal");
const createAccountModal = document.getElementById("createAccountModal");
const modalTitle = document.getElementById("modalTitle");
const transactionForm = document.getElementById("transactionForm");
const createAccountForm = document.getElementById("createAccountForm");
const transferAccountField = document.getElementById("transferAccountField");
const amountInput = document.getElementById("amount");
const transferAccountInput = document.getElementById("transferAccount");

// Current transaction type
let currentTransactionType = "";

// Toast Notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

// Update UI
function updateUI() {
  if (bank.currentAccount) {
    accountHolderEl.textContent = bank.currentAccount.accountHolder;
    const maskedNumber = "****" + bank.currentAccount.accountNumber.slice(-4);
    accountNumberEl.textContent = maskedNumber;
    balanceEl.textContent = `$${bank.currentAccount.balance.toFixed(2)}`;
    updateTransactionHistory();

    // Enable buttons
    depositBtn.disabled = false;
    withdrawBtn.disabled = false;
    transferBtn.disabled = false;
    clearHistoryBtn.disabled = false;
  } else {
    accountHolderEl.textContent = "No Account";
    accountNumberEl.textContent = "****0000";
    balanceEl.textContent = "$0.00";
    transactionListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-plus"></i>
                <p>No account found</p>
                <small>Click "Create New Account" to get started</small>
            </div>
        `;

    // Disable buttons
    depositBtn.disabled = true;
    withdrawBtn.disabled = true;
    transferBtn.disabled = true;
    clearHistoryBtn.disabled = true;
  }
}

// Update Transaction History
function updateTransactionHistory() {
  if (!bank.currentAccount || bank.currentAccount.transactions.length === 0) {
    transactionListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
                <small>Make a deposit to get started</small>
            </div>
        `;
    return;
  }

  const transactions = bank.currentAccount.getRecentTransactions(10);
  transactionListEl.innerHTML = transactions
    .map((trans) => {
      let icon = "fa-circle-dollar";
      let typeClass = "transaction-deposit";

      if (trans.type === "DEPOSIT" || trans.type === "INITIAL DEPOSIT") {
        icon = "fa-arrow-down";
        typeClass = "transaction-deposit";
      } else if (trans.type === "WITHDRAWAL") {
        icon = "fa-arrow-up";
        typeClass = "transaction-withdraw";
      } else {
        icon = "fa-exchange-alt";
        typeClass = "transaction-transfer";
      }

      let amountText = `+$${trans.amount.toFixed(2)}`;
      if (trans.type === "WITHDRAWAL")
        amountText = `-$${trans.amount.toFixed(2)}`;
      if (trans.type === "TRANSFER SENT")
        amountText = `-$${trans.amount.toFixed(2)}`;
      if (trans.type === "TRANSFER RECEIVED")
        amountText = `+$${trans.amount.toFixed(2)}`;

      let details = "";
      if (trans.relatedAccount) {
        details = `<small>${trans.type === "TRANSFER SENT" ? "To:" : "From:"} ${trans.relatedAccount}</small>`;
      }

      return `
            <div class="transaction-item ${typeClass}">
                <div>
                    <i class="fas ${icon}"></i>
                    <strong>${trans.type}</strong>
                    ${details}
                    <div class="transaction-date">${trans.date}</div>
                </div>
                <div class="transaction-amount">${amountText}</div>
            </div>
        `;
    })
    .join("");
}

// Open Modal
function openModal(type) {
  currentTransactionType = type;
  if (type === "transfer") {
    modalTitle.textContent = "Transfer Money";
    transferAccountField.style.display = "block";
  } else if (type === "deposit") {
    modalTitle.textContent = "Deposit Money";
    transferAccountField.style.display = "none";
  } else if (type === "withdraw") {
    modalTitle.textContent = "Withdraw Money";
    transferAccountField.style.display = "none";
  }
  amountInput.value = "";
  if (transferAccountInput) transferAccountInput.value = "";
  modal.style.display = "block";
}

// Close Modal
function closeModal() {
  modal.style.display = "none";
  createAccountModal.style.display = "none";
  currentTransactionType = "";
}

// Handle Transactions
function handleTransaction(e) {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    showToast("Please enter a valid amount", "error");
    return;
  }

  try {
    if (currentTransactionType === "deposit") {
      const result = bank.currentAccount.deposit(amount);
      showToast(result);
      bank.saveToStorage();
      updateUI();
      closeModal();
    } else if (currentTransactionType === "withdraw") {
      const result = bank.currentAccount.withdraw(amount);
      showToast(result);
      bank.saveToStorage();
      updateUI();
      closeModal();
    } else if (currentTransactionType === "transfer") {
      const targetAccountNumber = transferAccountInput.value.trim();
      if (!targetAccountNumber) {
        showToast("Please enter target account number", "error");
        return;
      }

      const targetAccount = bank.findAccount(targetAccountNumber);
      if (!targetAccount) {
        showToast("Target account not found", "error");
        return;
      }

      if (targetAccount.accountNumber === bank.currentAccount.accountNumber) {
        showToast("Cannot transfer to your own account", "error");
        return;
      }

      const result = bank.currentAccount.transfer(amount, targetAccount);
      showToast(result);
      bank.saveToStorage();
      updateUI();
      closeModal();
    }
  } catch (error) {
    showToast(error.message, "error");
  }
}

// Create New Account
function handleCreateAccount(e) {
  e.preventDefault();
  const accountHolder = document
    .getElementById("newAccountHolder")
    .value.trim();
  const initialDeposit = parseFloat(
    document.getElementById("initialDeposit").value,
  );

  if (!accountHolder) {
    showToast("Please enter account holder name", "error");
    return;
  }

  try {
    const newAccount = bank.createAccount(accountHolder, initialDeposit || 0);
    showToast(
      `Account created successfully! Account Number: ${newAccount.accountNumber}`,
    );
    updateUI();
    createAccountModal.style.display = "none";
    document.getElementById("createAccountForm").reset();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// Clear Transaction History
function clearHistory() {
  if (
    bank.currentAccount &&
    confirm("Are you sure you want to clear all transaction history?")
  ) {
    bank.currentAccount.transactions = [];
    bank.saveToStorage();
    updateUI();
    showToast("Transaction history cleared");
  }
}

// Event Listeners
depositBtn.addEventListener("click", () => openModal("deposit"));
withdrawBtn.addEventListener("click", () => openModal("withdraw"));
transferBtn.addEventListener("click", () => openModal("transfer"));
clearHistoryBtn.addEventListener("click", clearHistory);
createAccountBtn.addEventListener("click", () => {
  createAccountModal.style.display = "block";
});

transactionForm.addEventListener("submit", handleTransaction);
createAccountForm.addEventListener("submit", handleCreateAccount);

// Close modals
document
  .querySelectorAll(".close, .close-create, .cancel-btn, .cancel-create")
  .forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
  if (e.target === createAccountModal) closeModal();
});

// Initialize UI
updateUI();

// If no account exists, prompt to create one
if (!bank.currentAccount) {
  setTimeout(() => {
    if (
      confirm("Welcome to SecureBank! Would you like to create a new account?")
    ) {
      createAccountModal.style.display = "block";
    }
  }, 500);
}
