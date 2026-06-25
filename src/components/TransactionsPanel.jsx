import { useBanking } from '../context/BankingContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import TransactionItem from './TransactionItem.jsx';
import Button from './Button.jsx';
import { CheckIcon, EmptyIcon } from '../lib/icons.jsx';

export default function TransactionsPanel() {
  const { current, transactions, resetCurrent } = useBanking();
  const showToast = useToast();

  const handleReset = () => {
    if (!confirm('Reset this account to $1,247.89? All transaction history will be cleared.')) return;
    resetCurrent();
    showToast('Account reset to default state');
  };

  return (
    <section
      className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 sm:p-6 shadow-card flex flex-col"
      aria-labelledby="txPanelTitle"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-ink-2">
        <CheckIcon className="text-navy-light flex-shrink-0" />
        <h2 id="txPanelTitle" className="text-[0.85rem] sm:text-[0.88rem] font-semibold tracking-wide text-ink-7 flex-1">Activity</h2>
        <Button variant="link" size="sm" onClick={handleReset} aria-label="Reset account to default state">
          Reset
        </Button>
      </div>

      <div
        className="flex-1 max-h-[50vh] min-h-[200px] overflow-y-auto mx-[-0.5rem] px-[0.5rem] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-ink-3 [&::-webkit-scrollbar-thumb]:rounded-[4px]"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cdd5e0 transparent' }}
        role="list"
        aria-label="Transaction history"
        aria-live="polite"
      >
        {!current || transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 gap-2 text-ink-4 text-center">
            <div className="mb-1 text-ink-3" aria-hidden="true">
              <EmptyIcon />
            </div>
            <p className="font-semibold text-[0.85rem] sm:text-[0.88rem] text-ink-5">No transactions yet</p>
            <span className="text-[0.75rem]">Deposit or transfer to get started</span>
          </div>
        ) : (
          transactions.map((t, i) => (
            <TransactionItem key={t.id} txn={t} index={i} />
          ))
        )}
      </div>
    </section>
  );
}
