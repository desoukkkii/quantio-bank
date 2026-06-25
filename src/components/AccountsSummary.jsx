import { useBanking } from '../context/BankingContext.jsx';
import AccountCard from './AccountCard.jsx';

export default function AccountsSummary() {
  const { accounts, current, switchTo } = useBanking();

  if (accounts.length <= 1) return null;

  return (
    <div
      className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-[1.25rem_1.5rem] mb-5 shadow-card animate-[fadeUp_380ms_cubic-bezier(0.16,1,0.3,1)_both]"
      aria-label="All accounts"
    >
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <h3 className="text-[0.85rem] sm:text-[0.88rem] font-semibold text-ink-7">Your Accounts</h3>
        <span className="text-[0.68rem] sm:text-[0.72rem] font-semibold text-ink-5 bg-ink-1 border border-ink-2 px-1.5 sm:px-2 py-[0.1rem] rounded-full">{accounts.length} accounts</span>
      </div>
      <div className="flex gap-2 sm:gap-3 flex-wrap">
        {accounts.map((a) => (
          <AccountCard
            key={a.number}
            account={a}
            isActive={current?.number === a.number}
            onSwitch={switchTo}
          />
        ))}
      </div>
    </div>
  );
}
