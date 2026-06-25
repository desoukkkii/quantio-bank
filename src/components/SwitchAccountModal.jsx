import { useBanking } from '../context/BankingContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fmt, escHtml } from '../lib/BankAccount.js';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function SwitchAccountModal({ isOpen, onClose }) {
  const { accounts, current, switchTo } = useBanking();
  const showToast = useToast();

  const handleSwitch = (num) => {
    if (switchTo(num)) {
      showToast(`Switched to ${current?.holder}`);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Switch Account" titleId="switchModalTitle">
      <div className="py-2 sm:py-3 px-3 sm:px-4 max-h-[55vh] overflow-y-auto" role="list">
        {accounts.map((a) => {
          const isCurrent = current?.number === a.number;
          return (
            <div
              key={a.number}
              className={`flex justify-between items-center px-3 py-[0.75rem] sm:py-[0.85rem] rounded-[6px] cursor-pointer transition-colors duration-140 gap-3 sm:gap-4 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ${isCurrent ? 'bg-[rgba(13,27,42,0.04)]' : ''} hover:bg-[#f7f9fc]`}
              onClick={() => handleSwitch(a.number)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSwitch(a.number); }}
              role="listitem"
              tabIndex={0}
              aria-label={`Switch to ${a.holder}`}
            >
              <div className="min-w-0">
                <div className="font-semibold text-[0.82rem] sm:text-[0.85rem] text-ink-7 mb-[2px] truncate">{escHtml(a.holder)}</div>
                <div className="font-mono text-[0.64rem] sm:text-[0.67rem] text-ink-4 truncate">{a.number}</div>
              </div>
              <div className="font-mono font-semibold text-[0.85rem] sm:text-[0.88rem] text-green flex-shrink-0">{fmt(a.balance)}</div>
            </div>
          );
        })}
      </div>

      <div className="px-4 sm:px-[1.4rem] pb-4 sm:pb-[1.4rem]">
        <Button variant="secondary" size="md" onClick={onClose} className="w-full justify-center">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
