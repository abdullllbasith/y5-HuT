import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Undo2, X } from 'lucide-react';

interface UndoToastProps {
  isOpen: boolean;
  message: string;
  durationMs?: number;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  isOpen,
  message,
  durationMs = 10000,
  onUndo,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setProgress(1);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1 - elapsed / durationMs);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, durationMs, onDismiss]);

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-32px)]"
        >
          <div className="bg-ink text-paper rounded-2xl p-4 border-[1.5px] border-ink shadow-hard flex items-center justify-between gap-3">
            {/* Circular Progress Ring */}
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 28 28">
                <circle
                  cx="14"
                  cy="14"
                  r={radius}
                  stroke="rgba(243, 238, 228, 0.2)"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="14"
                  cy="14"
                  r={radius}
                  stroke="var(--color-red)"
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-75"
                />
              </svg>
              <span className="absolute font-data text-[9px] font-bold text-paper">
                {Math.ceil(progress * (durationMs / 1000))}
              </span>
            </div>

            {/* Message */}
            <div className="min-w-0 flex-1 text-left">
              <p className="font-data text-xs text-paper leading-snug truncate">{message}</p>
              <span className="font-data text-[10px] text-paper-sunk opacity-70">
                Click Undo to revert immediately
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onUndo}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red text-white font-ui text-xs font-bold hover:bg-red-ink transition-colors cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="w-7 h-7 rounded-full flex items-center justify-center text-paper-sunk hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

