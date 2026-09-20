import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <motion.div
          className="fixed inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 4 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className={cn('relative w-full bg-surface border border-line rounded-xl shadow-pop my-auto', SIZES[size])}>
          
            <div className="flex items-start justify-between gap-6 px-5 py-4 border-b border-line2">
              <div>
                <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
                {description && <p className="text-[13px] text-ink2 mt-0.5">{description}</p>}
              </div>
              <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-ink3 hover:text-ink transition-colors duration-150 ease-out -mr-1">
              
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto scroll-thin">{children}</div>
            {footer && <div className="px-5 py-3.5 border-t border-line2 flex items-center justify-end gap-2">{footer}</div>}
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}