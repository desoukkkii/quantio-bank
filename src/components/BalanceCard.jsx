import { fmt } from '../lib/BankAccount.js';

export default function BalanceCard({ current }) {
  return (
    <div
      className="relative overflow-hidden rounded-[10px] p-5 sm:p-6 mb-5 text-white min-h-[130px] sm:min-h-[148px] flex flex-col justify-between"
      role="region"
      aria-label="Account balance"
      style={{
        background: 'linear-gradient(150deg, #0d1b2a 0%, #1a3050 55%, #1e3d6e 100%)',
      }}
    >
      <div
        className="absolute top-[-40%] right-[-20%] w-[180px] sm:w-[200px] h-[180px] sm:h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-30%] left-[-10%] w-[140px] sm:w-[160px] h-[140px] sm:h-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(74,158,255,0.1) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-widest text-white/50 mb-[0.3rem] sm:mb-[0.4rem]">
          Available Balance
        </div>
        <div className="font-serif text-[2rem] sm:text-[2.5rem] font-normal tracking-tight leading-tight mb-3 sm:mb-4 break-words">
          {current ? fmt(current.balance) : '$0.00'}
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-end gap-2">
        <div className="flex items-center gap-[6px] font-mono text-[0.68rem] sm:text-[0.72rem] text-white/55 min-w-0">
          <span className="w-[5px] h-[5px] rounded-full bg-[#4ade80] shadow-[0_0_6px_rgba(74,222,128,0.6)] flex-shrink-0" aria-hidden="true"></span>
          <span className="truncate">
            {current ? `****${current.number.slice(-4)}` : 'No Account'}
          </span>
        </div>
        <div className="font-serif text-[1.5rem] sm:text-[1.8rem] text-gold opacity-35 leading-none select-none flex-shrink-0" aria-hidden="true">
          Q
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
