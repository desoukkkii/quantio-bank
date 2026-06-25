export function LogoIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="9" width="26" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <rect x="7" y="13" width="4" height="9" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="14" y="13" width="4" height="9" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="21" y="13" width="4" height="9" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="4" y="4" width="24" height="3.5" rx="1.2" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

export function SwitchIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" {...props}>
      <path d="M2 5h12M2 11h12M10 2l3 3-3 3M6 14l-3-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CardIcon(props) {
  return (
    <svg viewBox="0 0 18 18" width="15" height="15" fill="none" {...props}>
      <rect x="1" y="3" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="7.5" width="2.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.45" />
      <rect x="7.75" y="7.5" width="2.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.45" />
      <rect x="11.5" y="7.5" width="2.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 18 18" width="15" height="15" fill="none" {...props}>
      <rect x="2" y="2" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" {...props}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowUpIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" {...props}>
      <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" {...props}>
      <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TransferIcon(props) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" {...props}>
      <path d="M3 5h10M10 2l3 3-3 3M13 11H3M6 8l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyIcon(props) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" {...props}>
      <rect x="6" y="10" width="28" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M12 18h16M12 23h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function TxDepositIcon(props) {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" {...props}>
      <path d="M7 2v10M2.5 7.5 7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TxWithdrawIcon(props) {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" {...props}>
      <path d="M7 12V2M2.5 6.5 7 2l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TxTransferSentIcon(props) {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" {...props}>
      <path d="M2 5h10M9 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TxTransferReceivedIcon(props) {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" {...props}>
      <path d="M12 9H2M5 6l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TxInitialIcon(props) {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" {...props}>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
