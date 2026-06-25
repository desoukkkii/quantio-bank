export default function Button({ variant = 'primary', size, className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-[6px] rounded-[6px] font-sans font-semibold cursor-pointer whitespace-nowrap transition-all duration-140 ease-[cubic-bezier(0.4,0,0.2,1)] border active:translate-y-px focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 -webkit-tap-highlight-color-transparent';

  const variants = {
    primary:
      'bg-midnight text-white border-midnight hover:bg-navy-mid hover:border-navy-mid hover:shadow-[0_2px_8px_rgba(13,27,42,0.08),0_1px_2px_rgba(13,27,42,0.04)]',
    secondary:
      'bg-ink-1 text-ink-6 border-ink-2 hover:bg-ink-2 hover:border-ink-3 hover:text-ink-7',
    ghost:
      'bg-transparent text-ink-5 border-transparent hover:bg-ink-1 hover:text-ink-7',
    link:
      'bg-transparent border-none text-navy-light text-[0.78rem] font-medium p-[0.2rem_0.4rem] ml-auto hover:text-midnight hover:underline',
    'open-account':
      'w-full justify-center bg-transparent border-[1.5px] border-dashed border-ink-3 text-ink-5 font-medium hover:border-solid hover:border-navy-light hover:text-navy-light hover:bg-[rgba(30,61,110,0.04)]',
  };

  const sizes = {
    sm: 'px-[0.65rem] py-[0.3rem] text-[0.75rem]',
    md: 'px-4 py-[0.6rem] text-[0.82rem]',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
