// ======================== BANKING SYSTEM CLASSES ========================

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
      throw new Error(
        `Insufficient funds. Your balance is $${this.balance.toFixed(2)}`,
      );
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
      throw new Error(
        `Insufficient funds for transfer. Your balance is $${this.balance.toFixed(2)}`,
      );
    }

    // Perform the transfer
    this.balance -= amount;
    targetAccount.balance += amount;

    // Add transaction records for both accounts
    this.addTransaction(
      "TRANSFER SENT",
      amount,
      targetAccount.accountNumber,
      targetAccount.accountHolder,
    );
    targetAccount.addTransaction(
      "TRANSFER RECEIVED",
      amount,
      this.accountNumber,
      this.accountHolder,
    );

    return `Successfully transferred $${amount.toFixed(2)} to ${targetAccount.accountHolder} (${targetAccount.accountNumber})`;
  }

  addTransaction(type, amount, relatedAccount = null, relatedHolder = null) {
    const transaction = {
      id: Date.now() + Math.random(),
      type: type,
      amount: amount,
      date: new Date(),
      dateString: new Date().toLocaleDateString(),
      timeString: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      relatedAccount: relatedAccount,
      relatedHolder: relatedHolder,
    };
    this.transactions.unshift(transaction);

    // Keep only last 50 transactions
    if (this.transactions.length > 50) {
      this.transactions.pop();
    }
  }

  getRecentTransactions(limit = 15) {
    return this.transactions.slice(0, limit);
  }
}

class BankingSystem {
  constructor() {
    this.accounts = new Map();
    this.currentAccount = null;
    this.loadFromStorage();
  }

  generateAccountNumber() {
    const prefix = "SB";
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return prefix + randomNum;
  }

  createAccount(accountHolder, initialDeposit = 0) {
    if (!accountHolder || accountHolder.trim() === "") {
      throw new Error("Account holder name is required");
    }

    // Check if account holder already exists (optional)
    const existingAccount = Array.from(this.accounts.values()).find(
      (acc) =>
        acc.accountHolder.toLowerCase() === accountHolder.trim().toLowerCase(),
    );

    if (existingAccount) {
      throw new Error(
        `An account for "${accountHolder}" already exists. Please use a different name.`,
      );
    }

    const accountNumber = this.generateAccountNumber();
    const newAccount = new BankAccount(
      accountHolder.trim(),
      accountNumber,
      initialDeposit,
    );
    this.accounts.set(accountNumber, newAccount);

    if (initialDeposit > 0) {
      newAccount.addTransaction("INITIAL DEPOSIT", initialDeposit);
    }

    this.saveToStorage();
    return newAccount;
  }

  findAccount(accountNumber) {
    return this.accounts.get(accountNumber);
  }

  findAccountByName(accountHolder) {
    return Array.from(this.accounts.values()).find(
      (acc) => acc.accountHolder.toLowerCase() === accountHolder.toLowerCase(),
    );
  }

  getAllAccounts() {
    return Array.from(this.accounts.values());
  }

  switchAccount(accountNumber) {
    const account = this.findAccount(accountNumber);
    if (account) {
      this.currentAccount = account;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  saveToStorage() {
    const data = {
      accounts: Array.from(this.accounts.entries()).map(([key, acc]) => ({
        accountHolder: acc.accountHolder,
        accountNumber: acc.accountNumber,
        balance: acc.balance,
        transactions: acc.transactions,
      })),
      currentAccountNumber: this.currentAccount
        ? this.currentAccount.accountNumber
        : null,
    };
    localStorage.setItem("goldtrustBank", JSON.stringify(data));
  }

  loadFromStorage() {
    const savedData = localStorage.getItem("goldtrustBank");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.accounts.clear();

      for (const accData of data.accounts) {
        const account = new BankAccount(
          accData.accountHolder,
          accData.accountNumber,
          accData.balance,
        );
        account.transactions = accData.transactions || [];
        this.accounts.set(accData.accountNumber, account);

        if (accData.accountNumber === data.currentAccountNumber) {
          this.currentAccount = account;
        }
      }
    }

    // Create default account if no accounts exist
    if (this.accounts.size === 0) {
      const defaultAccount = this.createAccount("John Doe", 1247.89);
      this.currentAccount = defaultAccount;
      this.saveToStorage();
    }
  }

  resetCurrentAccount() {
    if (this.currentAccount) {
      this.currentAccount.balance = 1247.89;
      this.currentAccount.transactions = [];
      this.currentAccount.addTransaction("INITIAL DEPOSIT", 1247.89);
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

// ======================== INITIALIZE SYSTEM ========================
const bank = new BankingSystem();

// ======================== DOM ELEMENTS ========================
const balanceDisplay = document.getElementById("balanceDisplay");
const accountNumberDisplay = document.getElementById("accountNumberDisplay");
const transactionsList = document.getElementById("transactionsList");
const welcomeMessage = document.getElementById("welcomeMessage");
const accountSummaryDiv = document.getElementById("accountSummary");
const accountsListDiv = document.getElementById("accountsList");

// Buttons
const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const transferBtn = document.getElementById("transferBtn");
const resetBtn = document.getElementById("resetBtn");
const createAccountBtn = document.getElementById("createAccountBtn");
const switchAccountBtn = document.getElementById("switchAccountBtn");

// Modals
const actionModal = document.getElementById("actionModal");
const createAccountModal = document.getElementById("createAccountModal");
const switchAccountModal = document.getElementById("switchAccountModal");
const modalTitle = document.getElementById("modalTitle");
const transferField = document.getElementById("transferField");
const amountInput = document.getElementById("amountInput");
const recipientInput = document.getElementById("recipientInput");
const transactionForm = document.getElementById("transactionForm");
const createAccountForm = document.getElementById("createAccountForm");

let activeAction = null;

// ======================== HELPER FUNCTIONS ========================
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

function updateBalanceUI() {
  if (bank.currentAccount) {
    balanceDisplay.textContent = formatCurrency(bank.currentAccount.balance);
    const maskedNumber = "****" + bank.currentAccount.accountNumber.slice(-4);
    accountNumberDisplay.innerHTML = `<i class="fas fa-qrcode"></i> <span>${maskedNumber}</span>`;
    welcomeMessage.innerHTML = `<i class="fas fa-user-circle"></i> Welcome, ${bank.currentAccount.accountHolder}`;
  } else {
    balanceDisplay.textContent = "$0.00";
    accountNumberDisplay.innerHTML = `<i class="fas fa-qrcode"></i> <span>No Account</span>`;
    welcomeMessage.innerHTML = `<i class="fas fa-user-circle"></i> Welcome to Goldtrust Bank`;
  }
}

function renderTransactions() {
  if (!bank.currentAccount || bank.currentAccount.transactions.length === 0) {
    transactionsList.innerHTML = `
            <div class="empty-transaction">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
                <span>Use the actions above</span>
            </div>
        `;
    return;
  }

  const transactions = bank.currentAccount.getRecentTransactions(15);
  transactionsList.innerHTML = transactions
    .map((tx) => {
      let amountClass = "amount-positive";
      let sign = "+";
      let borderType = "transaction-deposit";
      let displayType = tx.type;

      if (tx.type === "WITHDRAWAL") {
        amountClass = "amount-negative";
        sign = "-";
        borderType = "transaction-withdraw";
      } else if (tx.type === "TRANSFER SENT") {
        amountClass = "amount-negative";
        sign = "-";
        borderType = "transaction-transfer-sent";
        displayType = `Transfer to ${tx.relatedHolder || tx.relatedAccount}`;
      } else if (tx.type === "TRANSFER RECEIVED") {
        amountClass = "amount-positive";
        sign = "+";
        borderType = "transaction-transfer-received";
        displayType = `Transfer from ${tx.relatedHolder || tx.relatedAccount}`;
      } else if (tx.type === "INITIAL DEPOSIT") {
        displayType = "Initial Deposit";
      }

      const detailText = `${tx.dateString} at ${tx.timeString}`;

      return `
            <div class="transaction-item ${borderType}">
                <div class="transaction-info">
                    <div class="transaction-type">${displayType}</div>
                    <div class="transaction-detail">${detailText}</div>
                </div>
                <div class="transaction-amount ${amountClass}">${sign}${formatCurrency(tx.amount)}</div>
            </div>
        `;
    })
    .join("");
}

function updateAccountSummary() {
  const allAccounts = bank.getAllAccounts();
  if (allAccounts.length > 1) {
    accountSummaryDiv.style.display = "block";
    accountsListDiv.innerHTML = allAccounts
      .map(
        (acc) => `
            <div class="account-summary-item ${bank.currentAccount && acc.accountNumber === bank.currentAccount.accountNumber ? "active" : ""}" 
                 onclick="switchToAccount('${acc.accountNumber}')">
                <div class="account-summary-name">${acc.accountHolder}</div>
                <div class="account-summary-number">${acc.accountNumber}</div>
                <div class="account-summary-balance">${formatCurrency(acc.balance)}</div>
            </div>
        `,
      )
      .join("");
  } else {
    accountSummaryDiv.style.display = "none";
  }
}

function switchToAccount(accountNumber) {
  if (bank.switchAccount(accountNumber)) {
    updateBalanceUI();
    renderTransactions();
    updateAccountSummary();
    showToast(
      `Switched to ${bank.currentAccount.accountHolder}'s account`,
      "success",
    );
    closeAllModals();
  }
}

function refreshUI() {
  updateBalanceUI();
  renderTransactions();
  updateAccountSummary();
}

// ======================== TRANSACTION HANDLERS ========================
function openModal(action) {
  activeAction = action;
  amountInput.value = "";
  recipientInput.value = "";

  if (action === "transfer") {
    modalTitle.innerText = "Send Money";
    transferField.classList.remove("hidden");
    recipientInput.required = true;
    recipientInput.placeholder =
      "Enter recipient account number (e.g., SB1234567890)";

    // Show available accounts for transfer
    const allAccounts = bank.getAllAccounts();
    const otherAccounts = allAccounts.filter(
      (acc) => acc.accountNumber !== bank.currentAccount?.accountNumber,
    );

    if (otherAccounts.length > 0) {
      showToast(
        `You have ${otherAccounts.length} other account(s) to transfer to`,
        "success",
      );
    }
  } else if (action === "deposit") {
    modalTitle.innerText = "Add Funds";
    transferField.classList.add("hidden");
    recipientInput.required = false;
  } else if (action === "withdraw") {
    modalTitle.innerText = "Cash Withdrawal";
    transferField.classList.add("hidden");
    recipientInput.required = false;
  }
  actionModal.style.display = "flex";
  amountInput.focus();
}

function closeAllModals() {
  actionModal.style.display = "none";
  createAccountModal.style.display = "none";
  switchAccountModal.style.display = "none";
  activeAction = null;
}

function handleConfirm() {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    showToast("Please enter a valid amount greater than zero", "error");
    return;
  }

  try {
    if (activeAction === "deposit") {
      const result = bank.currentAccount.deposit(amount);
      showToast(result);
      bank.saveToStorage();
      refreshUI();
      closeAllModals();
    } else if (activeAction === "withdraw") {
      const result = bank.currentAccount.withdraw(amount);
      showToast(result);
      bank.saveToStorage();
      refreshUI();
      closeAllModals();
    } else if (activeAction === "transfer") {
      const recipientNumber = recipientInput.value.trim().toUpperCase();

      if (!recipientNumber) {
        showToast("Please enter recipient account number", "error");
        return;
      }

      // Validate account number format
      if (!recipientNumber.startsWith("SB")) {
        showToast(
          'Invalid account number format. Account numbers start with "SB"',
          "error",
        );
        return;
      }

      const targetAccount = bank.findAccount(recipientNumber);

      if (!targetAccount) {
        // Show available accounts to help the user
        const allAccounts = bank.getAllAccounts();
        const otherAccounts = allAccounts.filter(
          (acc) => acc.accountNumber !== bank.currentAccount?.accountNumber,
        );

        if (otherAccounts.length > 0) {
          const accountList = otherAccounts
            .map((acc) => `${acc.accountHolder} (${acc.accountNumber})`)
            .join(", ");
          showToast(
            `Account not found! Available accounts: ${accountList}`,
            "error",
          );
        } else {
          showToast(
            "Account not found! Create another account first to transfer money.",
            "error",
          );
        }
        return;
      }

      if (targetAccount.accountNumber === bank.currentAccount.accountNumber) {
        showToast("Cannot transfer to your own account", "error");
        return;
      }

      // Confirm transfer details
      const confirmMessage = `Confirm transfer of ${formatCurrency(amount)} to ${targetAccount.accountHolder} (${targetAccount.accountNumber})?`;
      if (confirm(confirmMessage)) {
        const result = bank.currentAccount.transfer(amount, targetAccount);
        showToast(result);
        bank.saveToStorage();
        refreshUI();
        closeAllModals();
      }
    }
  } catch (error) {
    showToast(error.message, "error");
  }
}

function handleCreateAccount(e) {
  e.preventDefault();
  const accountHolder = document
    .getElementById("newAccountHolder")
    .value.trim();
  const initialDeposit =
    parseFloat(document.getElementById("initialDeposit").value) || 0;

  if (!accountHolder) {
    showToast("Please enter account holder name", "error");
    return;
  }

  try {
    const newAccount = bank.createAccount(accountHolder, initialDeposit);
    showToast(
      `Account created successfully! Account Number: ${newAccount.accountNumber}`,
      "success",
    );
    document.getElementById("createAccountForm").reset();
    createAccountModal.style.display = "none";
    refreshUI();
  } catch (error) {
    showToast(error.message, "error");
  }
}

function handleReset() {
  if (
    confirm(
      "⚠️ WARNING: This will reset ALL transactions and restore the default balance ($1,247.89). This action cannot be undone. Are you sure?",
    )
  ) {
    bank.resetCurrentAccount();
    refreshUI();
    showToast("Account has been reset to default state", "success");
  }
}

function showSwitchAccountModal() {
  const allAccounts = bank.getAllAccounts();
  if (allAccounts.length <= 1) {
    showToast("Only one account exists. Create more accounts first!", "error");
    return;
  }

  const switchList = document.getElementById("switchAccountsList");
  switchList.innerHTML = allAccounts
    .map(
      (acc) => `
        <div class="switch-account-item" onclick="switchToAccount('${acc.accountNumber}')">
            <div class="switch-account-info">
                <div class="switch-account-name">${acc.accountHolder}</div>
                <div class="switch-account-number">${acc.accountNumber}</div>
            </div>
            <div class="switch-account-balance">${formatCurrency(acc.balance)}</div>
        </div>
    `,
    )
    .join("");

  switchAccountModal.style.display = "flex";
}

// ======================== DEMO: Create a second account for testing ========================
function createDemoAccount() {
  const allAccounts = bank.getAllAccounts();
  if (allAccounts.length === 1) {
    // Create a second account for demo purposes
    try {
      const demoAccount = bank.createAccount("Jane Smith", 500.0);
      console.log("Demo account created:", demoAccount.accountNumber);
      refreshUI();
    } catch (error) {
      // Account might already exist
      console.log("Demo account already exists or error:", error.message);
    }
  }
}

// ======================== EVENT LISTENERS ========================
depositBtn.addEventListener("click", () => openModal("deposit"));
withdrawBtn.addEventListener("click", () => openModal("withdraw"));
transferBtn.addEventListener("click", () => openModal("transfer"));
resetBtn.addEventListener("click", handleReset);
createAccountBtn.addEventListener(
  "click",
  () => (createAccountModal.style.display = "flex"),
);
switchAccountBtn.addEventListener("click", showSwitchAccountModal);

// Modal close buttons
document
  .querySelectorAll(
    ".close-modal, #cancelModalBtn, #cancelCreateBtn, #cancelSwitchBtn",
  )
  .forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

document.querySelectorAll(".close-create, .close-switch").forEach((btn) => {
  btn.addEventListener("click", closeAllModals);
});

// Form submissions
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleConfirm();
});

createAccountForm.addEventListener("submit", handleCreateAccount);

// Click outside modal to close
window.addEventListener("click", (e) => {
  if (e.target === actionModal) closeAllModals();
  if (e.target === createAccountModal) closeAllModals();
  if (e.target === switchAccountModal) closeAllModals();
});

// Make switchToAccount available globally
window.switchToAccount = switchToAccount;

// ======================== INITIALIZE ========================
refreshUI();

// Create demo account for testing transfers
setTimeout(() => {
  createDemoAccount();
  refreshUI();
  if (bank.getAllAccounts().length > 1) {
    showToast(
      "💡 Tip: You can now transfer money between accounts!",
      "success",
    );
  }
}, 500);
