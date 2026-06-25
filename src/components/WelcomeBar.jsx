import { useBanking } from '../context/BankingContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { initials } from '../lib/BankAccount.js';
import { SwitchIcon } from '../lib/icons.jsx';

export default function WelcomeBar({ onOpenSwitch }) {
  const { current, accounts } = useBanking();
  const showToast = useToast();

  const handleSwitch = () => {
    if (accounts.length <= 1) {
      showToast("Open another account first", "error");
      return;
    }
    onOpenSwitch();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-[#e2e8f0] rounded-[10px] px-3 sm:px-[1.1rem] py-2.5 sm:py-3 mb-4 sm:mb-5 gap-2 sm:gap-4 shadow-[0_1px_2px_rgba(13,27,42,0.06)] animate-[slideDown_380ms_cubic-bezier(0.16,1,0.3,1)_both]">
      <div className="flex items-center gap-[0.5rem] sm:gap-[0.65rem] min-w-0 w-full sm:w-auto">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-navy-light to-midnight flex items-center justify-center flex-shrink-0 text-gold-light text-[0.65rem] sm:text-[0.72rem] font-bold" aria-hidden="true">
          {current ? initials(current.holder) : 'Q'}
        </div>
        <span className="text-[0.8rem] sm:text-[0.85rem] font-medium text-ink-6 whitespace-nowrap overflow-hidden text-ellipsis">
          {current ? `Welcome back, ${current.holder.split(' ')[0]}` : 'Welcome to QUANTIO Bank'}
        </span>
      </div>
      <button
        className="inline-flex items-center gap-[6px] px-[0.65rem] py-[0.3rem] rounded-[6px] font-sans text-[0.72rem] sm:text-[0.75rem] font-semibold cursor-pointer whitespace-nowrap transition-all duration-140 ease-[cubic-bezier(0.4,0,0.2,1)] border border-transparent bg-transparent text-ink-5 hover:bg-ink-1 hover:text-ink-7 active:translate-y-px focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 self-end sm:self-auto"
        onClick={handleSwitch}
        aria-label="Switch account"
      >
        <SwitchIcon aria-hidden="true" />
        Switch Account
      </button>
    </div>
  );
}
