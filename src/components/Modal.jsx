import { useEffect, useRef, useCallback } from 'react';

export default function Modal({ isOpen, onClose, title, titleId, children }) {
  const dialogRef = useRef(null);
  const prevFocusRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement;
      document.addEventListener('keydown', handleKeyDown);
      requestAnimationFrame(() => {
        const focusable = dialogRef.current?.querySelector('input, button, textarea, [tabindex]:not([tabindex="-1"])');
        focusable?.focus();
      });
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!isOpen && prevFocusRef.current) {
        prevFocusRef.current?.focus();
        prevFocusRef.current = null;
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(13,27,42,0.55)] backdrop-blur-[3px] flex justify-center items-start sm:items-center z-50 p-4 sm:p-6 animate-[overlayIn_220ms_cubic-bezier(0.16,1,0.3,1)_both] overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={dialogRef}
        className="relative bg-white w-full max-w-[420px] rounded-t-[14px] rounded-b-[10px] sm:rounded-[14px] shadow-[0_12px_40px_rgba(13,27,42,0.14),0_4px_12px_rgba(13,27,42,0.08)] overflow-hidden animate-[modalIn_380ms_cubic-bezier(0.16,1,0.3,1)_both] my-auto"
      >
        <div className="flex justify-between items-center px-4 sm:px-[1.4rem] py-[1rem] sm:py-[1.1rem] border-b border-ink-2 bg-ink-1">
          <h3 id={titleId} className="font-serif text-[1rem] sm:text-[1.1rem] font-normal text-midnight truncate pr-2">{title}</h3>
          <button
            type="button"
            className="flex-shrink-0 w-7 h-7 rounded-full bg-none border-none cursor-pointer text-[1.3rem] leading-none text-ink-4 flex items-center justify-center transition-colors duration-140 hover:bg-ink-2 hover:text-ink-7 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 font-sans"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
