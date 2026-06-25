/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={
          `fixed bottom-4 sm:bottom-8 left-1/2 z-50 flex items-center gap-2 px-3 sm:px-4 py-[0.6rem] sm:py-[0.7rem] ` +
          `rounded-[10px] text-[0.8rem] sm:text-sm font-medium text-white shadow-[0_4px_20px_rgba(13,27,42,0.1),0_2px_6px_rgba(13,27,42,0.06)] ` +
          `max-w-[calc(100vw-2rem)] sm:max-w-[min(90vw,400px)] text-center break-words transition-all duration-220 ease-out ` +
          (toast
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none')
        }
        style={{
          transform: toast ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(12px)',
          background: toast?.type === 'error' ? '#7f1d1d' : '#0d1b2a',
          borderLeft: `3px solid ${toast?.type === 'error' ? '#d93025' : '#c9a84c'}`,
        }}
      >
        {toast?.msg}
      </div>
    </ToastContext.Provider>
  );
}
