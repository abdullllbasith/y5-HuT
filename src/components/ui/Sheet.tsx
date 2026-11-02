import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  mode?: 'responsive' | 'bottom' | 'drawer' | 'modal';
  maxWidth?: string;
  className?: string;
  showCloseButton?: boolean;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  mode = 'responsive',
  maxWidth = 'max-w-xl',
  className = '',
  showCloseButton = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Sheet Container */}
          <div
            className={`
              relative z-10 w-full flex
              ${
                mode === 'responsive'
                  ? 'items-end md:items-stretch md:justify-end'
                  : mode === 'bottom'
                  ? 'items-end'
                  : mode === 'modal'
                  ? 'items-center justify-center p-4'
                  : 'justify-end'
              }
            `}
          >
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : mode === 'modal'
                  ? { scale: 0.96, opacity: 0 }
                  : { y: '100%' }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : mode === 'modal'
                  ? { scale: 1, opacity: 1 }
                  : { y: 0, x: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : mode === 'modal'
                  ? { scale: 0.96, opacity: 0 }
                  : { y: '100%' }
              }
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              className={`
                bg-surface flex flex-col text-ink shadow-sheet
                ${
                  mode === 'modal'
                    ? `w-full ${maxWidth} rounded-2xl border border-line max-h-[90vh]`
                    : mode === 'drawer'
                    ? `w-full ${maxWidth} h-full border-l border-line`
                    : `w-full max-h-[92vh] rounded-t-3xl border-t border-x border-line md:max-h-full md:rounded-none md:rounded-l-3xl md:border-l md:border-t-0 md:border-r-0 md:${maxWidth} md:h-full`
                }
                ${className}
              `}
            >
              {/* Mobile Drag Handle */}
              <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
                <div className="w-10 h-1.5 rounded-full bg-line" />
              </div>

              {/* Sheet Header */}
              {(title || showCloseButton) && (
                <div className="px-5 sm:px-6 py-4 flex items-start justify-between border-b border-line shrink-0">
                  <div className="min-w-0 pr-4">
                    {title && (
                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink">
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <p className="font-data text-xs text-ink-soft mt-0.5">{subtitle}</p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close dialog"
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-line bg-surface text-ink hover:bg-soft-surface hover:border-ink transition-colors cursor-pointer shrink-0 min-w-[44px] min-h-[44px]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Sheet Content Body */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

