import { fmt, escHtml } from '../lib/BankAccount.js';
import { TxDepositIcon, TxWithdrawIcon, TxTransferSentIcon, TxTransferReceivedIcon, TxInitialIcon } from '../lib/icons.jsx';

const icons = {
  DEPOSIT: { cls: 'bg-green/10 text-green', Icon: TxDepositIcon },
  WITHDRAWAL: { cls: 'bg-red/10 text-red', Icon: TxWithdrawIcon },
  'TRANSFER SENT': { cls: 'bg-red/10 text-red', Icon: TxTransferSentIcon },
  'TRANSFER RECEIVED': { cls: 'bg-green/10 text-green', Icon: TxTransferReceivedIcon },
  'INITIAL DEPOSIT': { cls: 'bg-ink-1 text-ink-5', Icon: TxInitialIcon },
};

function getTxInfo(type) {
  const info = icons[type] || icons['INITIAL DEPOSIT'];
  let label, amountCls, sign;
  switch (type) {
    case 'WITHDRAWAL':
      label = 'Withdrawal';
      amountCls = 'text-red';
      sign = '−';
      break;
    case 'TRANSFER SENT':
      amountCls = 'text-red';
      sign = '−';
      break;
    case 'TRANSFER RECEIVED':
      amountCls = 'text-green';
      sign = '+';
      label = '';
      break;
    case 'INITIAL DEPOSIT':
      label = 'Account opened';
      amountCls = 'text-green';
      sign = '+';
      break;
    case 'DEPOSIT':
      label = 'Deposit';
      amountCls = 'text-green';
      sign = '+';
      break;
    default:
      label = type;
      amountCls = 'text-green';
      sign = '+';
  }
  return { ...info, label, amountCls, sign };
}

export default function TransactionItem({ txn, index }) {
  const { cls, Icon, label, amountCls, sign } = getTxInfo(txn.type);
  const displayLabel = label || (txn.type === 'TRANSFER SENT'
    ? `To ${txn.relatedHolder || txn.related}`
    : `From ${txn.relatedHolder || txn.related}`);

  return (
    <div
      className="flex justify-between items-center px-[0.6rem] py-3 border-t border-ink-2 first:border-t-0 only:border-t-0 first:rounded-t-[6px] last:rounded-b-[6px] only:rounded-[6px] transition-colors duration-140 cursor-default hover:bg-[#f7f9fc] animate-[fadeIn_220ms_cubic-bezier(0.16,1,0.3,1)_both]"
      role="listitem"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center gap-[0.7rem] min-w-0">
        <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 text-[0.75rem] ${cls}`} aria-hidden="true">
          <Icon />
        </div>
        <div className="min-w-0">
          <div className="text-[0.82rem] font-semibold text-ink-7 whitespace-nowrap overflow-hidden text-ellipsis">
            {escHtml(displayLabel)}
          </div>
          <div className="text-[0.68rem] text-ink-4 mt-px font-mono">
            {txn.date} · {txn.time}
          </div>
        </div>
      </div>
      <div className={`font-mono font-medium text-[0.9rem] whitespace-nowrap flex-shrink-0 ml-2 ${amountCls}`} aria-label={`${sign}${fmt(txn.amount)}`}>
        {sign}{fmt(txn.amount)}
      </div>
    </div>
  );
}
