import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XIcon } from 'lucide-react';
import { uid } from '../../utils/cn';

type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  action?: {label: string;onClick: () => void;};
}

interface ToastContextValue {
  push: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({ push: () => undefined });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastTone, React.ReactNode> = {
  success: <CheckCircle2Icon className="w-4 h-4 text-ok" />,
  error: <AlertTriangleIcon className="w-4 h-4 text-bad" />,
  info: <InfoIcon className="w-4 h-4 text-brand" />
};

export function ToastProvider({ children }: {children: React.ReactNode;}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = uid('toast');
      setToasts((t) => [...t, { ...toast, id }]);
      window.setTimeout(() => remove(id), 5200);
    },
    [remove]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) =>
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="bg-surface border border-line rounded-lg shadow-pop px-3.5 py-3 flex gap-2.5">
            
              <div className="mt-0.5 shrink-0">{ICONS[t.tone]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-ink">{t.title}</p>
                {t.description && <p className="text-[12.5px] text-ink2 mt-0.5 leading-relaxed">{t.description}</p>}
                {t.action &&
              <button
                onClick={() => {
                  t.action?.onClick();
                  remove(t.id);
                }}
                className="mt-1.5 text-[12.5px] font-medium text-brand hover:text-brandInk transition-colors duration-150 ease-out">
                
                    {t.action.label}
                  </button>
              }
              </div>
              <button onClick={() => remove(t.id)} aria-label="Dismiss" className="text-ink3 hover:text-ink transition-colors duration-150 ease-out">
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>);

}