import { useBanking } from '../context/BankingContext.jsx';
import BalanceCard from './BalanceCard.jsx';
import Button from './Button.jsx';
import { ArrowUpIcon, ArrowDownIcon, TransferIcon, PlusIcon, CardIcon } from '../lib/icons.jsx';

export default function AccountPanel({ onOpenAction, onOpenCreate }) {
  const { current } = useBanking();

  return (
    <section
      className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 sm:p-6 shadow-card"
      aria-labelledby="accountPanelTitle"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-ink-2">
        <CardIcon className="text-navy-light flex-shrink-0" />
        <h2 id="accountPanelTitle" className="text-[0.85rem] sm:text-[0.88rem] font-semibold tracking-wide text-ink-7 flex-1">My Account</h2>
      </div>

      <BalanceCard current={current} />

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Account actions">
        <Button variant="primary" size="md" onClick={() => onOpenAction('deposit')} className="grow basis-[calc(50%-0.25rem)] sm:basis-0 justify-center">
          <ArrowUpIcon aria-hidden="true" />
          Deposit
        </Button>
        <Button variant="secondary" size="md" onClick={() => onOpenAction('withdraw')} className="grow basis-[calc(50%-0.25rem)] sm:basis-0 justify-center">
          <ArrowDownIcon aria-hidden="true" />
          Withdraw
        </Button>
        <Button variant="secondary" size="md" onClick={() => onOpenAction('transfer')} className="grow basis-full sm:basis-0 justify-center">
          <TransferIcon aria-hidden="true" />
          Transfer
        </Button>
      </div>

      <Button variant="open-account" size="md" onClick={onOpenCreate}>
        <PlusIcon aria-hidden="true" />
        Open New Account
      </Button>
    </section>
  );
}
