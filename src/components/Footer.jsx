export default function Footer() {
  return (
    <footer className="pt-5 sm:pt-6 border-t border-[#e2e8f0] mt-3 sm:mt-4" role="contentinfo">
      <div className="flex items-center gap-[0.5rem] sm:gap-[0.6rem] justify-center flex-wrap">
        <div className="font-serif text-[0.9rem] sm:text-[1rem] text-ink-4 select-none" aria-hidden="true">Q</div>
        <p className="text-center text-ink-4 text-[0.65rem] sm:text-[0.7rem] tracking-wide">
          &copy; 2025 QUANTIO Bank, N.A. &mdash; Member FDIC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
