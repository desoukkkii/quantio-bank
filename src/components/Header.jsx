import { LogoIcon } from '../lib/icons.jsx';

export default function Header() {
  return (
    <header className="mb-5 sm:mb-7" role="banner">
      <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2 sm:gap-3" aria-label="QUANTIO Bank">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-midnight rounded-[6px] flex items-center justify-center flex-shrink-0 shadow-card" aria-hidden="true">
            <LogoIcon className="text-gold w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="flex items-baseline gap-[0.25rem] sm:gap-[0.35rem]">
            <span className="font-serif text-[1.2rem] sm:text-[1.4rem] leading-none tracking-tight text-midnight">QUANTIO</span>
            <span className="font-sans text-[0.7rem] sm:text-[0.8rem] tracking-wider text-ink-5 max-[380px]:hidden">Bank</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-[6px] text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-wider text-ink-6 bg-ink-1 border border-ink-2 px-2.5 sm:px-3 py-[0.25rem] sm:py-[0.3rem] rounded-full max-sm:hidden" aria-label="FDIC Insured">
            <span className="w-[5px] h-[5px] rounded-full bg-green flex-shrink-0" aria-hidden="true"></span>
            FDIC Insured
          </div>
        </div>
      </div>
    </header>
  );
}
