import { useState, useRef, useEffect } from 'react';
import { useBanking } from '../context/BankingContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function CreateAccountModal({ isOpen, onClose }) {
  const { createAccount } = useBanking();
  const showToast = useToast();

  const [name, setName] = useState('');
  const [deposit, setDeposit] = useState('0');
  const [error, setError] = useState('');
  const nameRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDeposit('0');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Enter an account holder name');
      return;
    }
    try {
      const acc = createAccount(trimmed, parseFloat(deposit) || 0);
      showToast(`Account opened for ${acc.holder}`);
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open New Account" titleId="createModalTitle">
      <form className="p-4 sm:p-[1.4rem]" onSubmit={handleSubmit} noValidate>
        <div className="mb-[1rem] sm:mb-[1.1rem]">
          <label htmlFor="newAccountHolder" className="block text-[0.75rem] sm:text-[0.78rem] font-semibold text-ink-6 mb-[0.35rem] sm:mb-[0.4rem] tracking-wide">Account Holder Name</label>
          <input
            ref={nameRef}
            type="text"
            id="newAccountHolder"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="Full legal name"
            required
            autoComplete="off"
            aria-required="true"
            className="w-full px-3 py-[0.6rem] sm:py-[0.65rem] border-[1.5px] border-ink-3 rounded-[6px] font-sans text-[0.85rem] sm:text-[0.9rem] text-ink-7 bg-white outline-none transition-all duration-140 focus:border-midnight focus:shadow-[0_0_0_3px_rgba(13,27,42,0.08)] placeholder:text-ink-3 placeholder:text-[0.8rem] sm:placeholder:text-[0.85rem]"
          />
        </div>

        <div className="mb-[1rem] sm:mb-[1.1rem]">
          <label htmlFor="initialDeposit" className="block text-[0.75rem] sm:text-[0.78rem] font-semibold text-ink-6 mb-[0.35rem] sm:mb-[0.4rem] tracking-wide">
            Initial Deposit <span className="font-normal text-ink-4">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4 text-[0.85rem] sm:text-[0.9rem] font-medium pointer-events-none z-10" aria-hidden="true">$</span>
            <input
              type="number"
              id="initialDeposit"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              step="0.01"
              min="0"
              placeholder="0.00"
              autoComplete="off"
              className="w-full pl-7 pr-3 py-[0.6rem] sm:py-[0.65rem] border-[1.5px] border-ink-3 rounded-[6px] font-sans text-[0.85rem] sm:text-[0.9rem] text-ink-7 bg-white outline-none transition-all duration-140 focus:border-midnight focus:shadow-[0_0_0_3px_rgba(13,27,42,0.08)] placeholder:text-ink-3 placeholder:text-[0.8rem] sm:placeholder:text-[0.85rem] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-red text-[0.75rem] sm:text-[0.78rem] font-medium mb-3">{error}</p>
        )}

        <div className="flex gap-[0.6rem] mt-3 sm:mt-4">
          <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1 justify-center">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1 justify-center">
            Open Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
