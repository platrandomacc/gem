import { useEffect, useRef, useState } from 'react';

const WALLET_STORAGE_KEY = 'wallet-balance';

export function useWallet(initialBalance = 1000) {
  const initialBalanceRef = useRef(initialBalance);
  const [balance, setBalance] = useState<number>(() => {
    const stored = window.localStorage.getItem(WALLET_STORAGE_KEY);
    return stored && !Number.isNaN(Number(stored)) ? Number(stored) : initialBalanceRef.current;
  });

  useEffect(() => {
    window.localStorage.setItem(WALLET_STORAGE_KEY, balance.toString());
    // notify other same-tab listeners about the balance change
    try {
      window.dispatchEvent(new CustomEvent('wallet-balance-changed', { detail: { balance } }));
    } catch (e) {
      // ignore in environments that don't support CustomEvent
    }
  }, [balance]);

  // Listen for storage events so multiple hook instances stay in sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== WALLET_STORAGE_KEY) return;
      if (e.newValue == null) return;
      const val = Number(e.newValue);
      if (!Number.isNaN(val)) setBalance(val);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Listen for same-tab custom events to keep multiple instances in sync
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ balance: number }>;
      if (custom?.detail?.balance != null) {
        const val = Number(custom.detail.balance);
        if (!Number.isNaN(val)) setBalance(val);
      }
    };
    window.addEventListener('wallet-balance-changed', handler as EventListener);
    return () => window.removeEventListener('wallet-balance-changed', handler as EventListener);
  }, []);

  const canAfford = (amount: number) => amount <= balance;
  const adjustBalance = (amount: number) => setBalance((current) => Number((current + amount).toFixed(2)));
  const deduct = (amount: number) => setBalance((current) => Number((current - amount).toFixed(2)));
  const resetBalance = () => setBalance(initialBalanceRef.current);

  return {
    balance,
    canAfford,
    adjustBalance,
    deduct,
    resetBalance,
    initialBalance: initialBalanceRef.current,
  };
}
