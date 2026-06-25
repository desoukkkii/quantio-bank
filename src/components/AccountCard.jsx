import { fmt, escHtml } from '../lib/BankAccount.js';

export default function AccountCard({ account, isActive, onSwitch }) {
  return (
    <div
      className={`flex-1 min-w-[150px] sm:min-w-[170px] rounded-[10px] p-3 sm:p-[1rem_1.1rem] cursor-pointer border-[1.5px] transition-all duration-140 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-card focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ${
        isActive
          ? 'border-midnight bg-[rgba(13,27,42,0.04)] shadow-[0_1px_2px_rgba(13,27,42,0.06)]'
          : 'border-ink-2 bg-ink-1 hover:border-navy-light hover:bg-[rgba(30,61,110,0.04)]'
      }`}
      onClick={() => onSwitch(account.number)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSwitch(account.number); }}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${account.holder}'s account, balance ${fmt(account.balance)}`}
      aria-pressed={isActive}
    >
      <div className="font-semibold text-[0.82rem] sm:text-[0.85rem] text-ink-7 mb-[2px] truncate">{escHtml(account.holder)}</div>
      <div className="text-[0.62rem] sm:text-[0.65rem] text-ink-4 font-mono mb-1.5 sm:mb-2 truncate">{account.number}</div>
      <div className="font-bold text-[0.9rem] sm:text-[0.95rem] text-green font-mono">{fmt(account.balance)}</div>
    </div>
  );
}
