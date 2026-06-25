import { useState, useEffect, useRef } from 'react';
import { useBanking } from '../context/BankingContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function TransactionModal({ isOpen, initialAction, onClose }) {
  const { current, deposit, withdraw, transfer } = useBanking();
  const showToast = useToast();

  const [action, setAction] = useState(initialAction);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  const amountRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setAction(initialAction);
      setAmount('');
      setRecipient('');
      setError('');
    }
  }, [isOpen, initialAction]);

  const openFor = (act) => {
    setAction(act);
    setAmount('');
    setRecipient('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!current) {
      setError('No account selected');
      return;
    }
    try {
      if (action === 'deposit') {
        showToast(deposit(parsed));
      } else if (action === 'withdraw') {
        showToast(withdraw(parsed));
      } else if (action === 'transfer') {
        const num = recipient.trim().toUpperCase();
        if (!num || !num.startsWith('SB')) {
          setError('Enter a valid account number (SB...)');
          return;
        }
        showToast(transfer(parsed, num));
      }
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const isTransfer = action === 'transfer';

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="modalActionTitle">
      <div className="flex gap-1.5 sm:gap-2 px-4 sm:px-[1.4rem] pt-3 sm:pt-[1rem] pb-0 border-b border-ink-2 bg-ink-1/50">
        {['deposit', 'withdraw', 'transfer'].map((act) => (
          <button
            key={act}
            className={`px-2.5 sm:px-3 py-1 rounded-[6px] text-[0.75rem] sm:text-[0.78rem] font-semibold transition-all duration-140 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 cursor-pointer ${
              action === act
                ? 'bg-midnight text-white'
                : 'bg-ink-1 text-ink-5 border border-ink-2 hover:bg-ink-2'
            }`}
            onClick={() => openFor(act)}
          >
            {act === 'deposit' ? 'Deposit' : act === 'withdraw' ? 'Withdraw' : 'Transfer'}
          </button>
        ))}
      </div>

      <form className="p-4 sm:p-[1.4rem]" onSubmit={handleSubmit} noValidate>
        <div className="mb-[1rem] sm:mb-[1.1rem]">
          <label htmlFor="amountInput" className="block text-[0.75rem] sm:text-[0.78rem] font-semibold text-ink-6 mb-[0.35rem] sm:mb-[0.4rem] tracking-wide">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4 text-[0.85rem] sm:text-[0.9rem] font-medium pointer-events-none z-10" aria-hidden="true">$</span>
            <input
              ref={amountRef}
              type="number"
              id="amountInput"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              autoComplete="off"
              aria-required="true"
              className="w-full pl-7 pr-3 py-[0.6rem] sm:py-[0.65rem] border-[1.5px] border-ink-3 rounded-[6px] font-sans text-[0.85rem] sm:text-[0.9rem] text-ink-7 bg-white outline-none transition-all duration-140 focus:border-midnight focus:shadow-[0_0_0_3px_rgba(13,27,42,0.08)] placeholder:text-ink-3 placeholder:text-[0.8rem] sm:placeholder:text-[0.85rem] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {isTransfer && (
          <div className="mb-[1rem] sm:mb-[1.1rem]">
            <label htmlFor="recipientInput" className="block text-[0.75rem] sm:text-[0.78rem] font-semibold text-ink-6 mb-[0.35rem] sm:mb-[0.4rem] tracking-wide">Recipient Account Number</label>
            <input
              type="text"
              id="recipientInput"
              value={recipient}
              onChange={(e) => { setRecipient(e.target.value); setError(''); }}
              placeholder="e.g. SB1234567890"
              autoComplete="off"
              spellCheck="false"
              className="w-full px-3 py-[0.6rem] sm:py-[0.65rem] border-[1.5px] border-ink-3 rounded-[6px] font-sans text-[0.85rem] sm:text-[0.9rem] text-ink-7 bg-white outline-none transition-all duration-140 focus:border-midnight focus:shadow-[0_0_0_3px_rgba(13,27,42,0.08)] placeholder:text-ink-3 placeholder:text-[0.8rem] sm:placeholder:text-[0.85rem]"
            />
          </div>
        )}

        {error && (
          <p className="text-red text-[0.75rem] sm:text-[0.78rem] font-medium mb-3">{error}</p>
        )}

        <div className="flex gap-[0.6rem] mt-3 sm:mt-4">
          <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1 justify-center">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1 justify-center">
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
}
