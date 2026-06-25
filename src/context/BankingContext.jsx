/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { bank } from '../lib/bank.js';

const BankingContext = createContext(null);

export function useBanking() {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error('useBanking must be used within BankingProvider');
  return ctx;
}

function useForceUpdate() {
  return useReducer(x => x + 1, 0)[1];
}

export function BankingProvider({ children }) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (bank.all().length === 1) {
      try {
        bank.create("Jane Smith", 500);
        forceUpdate();
      } catch (_) {}
    }
  }, [forceUpdate]);

  const current = bank.current;
  const accounts = bank.all();
  const transactions = current?.recent(15) || [];

  const deposit = useCallback((amount) => {
    if (!current) throw new Error("No account selected");
    const msg = current.deposit(amount);
    bank._save();
    forceUpdate();
    return msg;
  }, [current, forceUpdate]);

  const withdraw = useCallback((amount) => {
    if (!current) throw new Error("No account selected");
    const msg = current.withdraw(amount);
    bank._save();
    forceUpdate();
    return msg;
  }, [current, forceUpdate]);

  const transfer = useCallback((amount, targetNum) => {
    if (!current) throw new Error("No account selected");
    const target = bank.find(targetNum);
    if (!target) throw new Error("Account not found");
    if (target.number === current.number)
      throw new Error("Cannot transfer to the same account");
    const msg = current.transfer(amount, target);
    bank._save();
    forceUpdate();
    return msg;
  }, [current, forceUpdate]);

  const createAccount = useCallback((name, depositAmt = 0) => {
    const acc = bank.create(name, depositAmt);
    bank.switchTo(acc.number);
    bank._save();
    forceUpdate();
    return acc;
  }, [forceUpdate]);

  const switchTo = useCallback((num) => {
    if (bank.switchTo(num)) {
      forceUpdate();
      return true;
    }
    return false;
  }, [forceUpdate]);

  const resetCurrent = useCallback(() => {
    const ok = bank.resetCurrent();
    forceUpdate();
    return ok;
  }, [forceUpdate]);

  return (
    <BankingContext.Provider value={{
      current,
      accounts,
      transactions,
      deposit,
      withdraw,
      transfer,
      createAccount,
      switchTo,
      resetCurrent,
    }}>
      {children}
    </BankingContext.Provider>
  );
}
