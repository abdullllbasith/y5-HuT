import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Currency } from '../../types';

interface PriceProps {
  amountLKR: number;
  amountUSD?: number;
  originalLKR?: number;
  originalUSD?: number;
  currency?: Currency;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showInstallments?: boolean;
  showDiscountPill?: boolean;
  className?: string;
}

export const Price: React.FC<PriceProps> = ({
  amountLKR,
  amountUSD,
  originalLKR,
  originalUSD,
  currency = 'LKR',
  size = 'md',
  showInstallments = false,
  showDiscountPill = true,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const prevAmountRef = useRef(amountLKR);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (prevAmountRef.current !== amountLKR) {
      setHasChanged(true);
      const t = setTimeout(() => setHasChanged(false), 800);
      prevAmountRef.current = amountLKR;
      return () => clearTimeout(t);
    }
  }, [amountLKR]);

  const isLKR = currency === 'LKR';
  const currentPrice = isLKR ? amountLKR : amountUSD ?? Math.round(amountLKR / 300);
  const originalPrice = isLKR ? originalLKR : originalUSD;

  const hasDiscount = originalPrice !== undefined && originalPrice > currentPrice;
  const discountDelta = hasDiscount ? originalPrice - currentPrice : 0;

  const formattedCurrent = isLKR
    ? `Rs. ${currentPrice.toLocaleString('en-LK')}`
    : `$${currentPrice.toLocaleString('en-US')}`;

  const formattedOriginal = originalPrice
    ? isLKR
      ? `Rs. ${originalPrice.toLocaleString('en-LK')}`
      : `$${originalPrice.toLocaleString('en-US')}`
    : null;

  const sizeClasses = {
    sm: {
      current: 'text-sm font-bold font-data',
      original: 'text-[11px] text-ink-soft',
      delta: 'text-[9px] px-1.5 py-0.5',
    },
    md: {
      current: 'text-lg sm:text-xl font-bold font-display',
      original: 'text-xs text-ink-soft',
      delta: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      current: 'text-2xl sm:text-3xl font-bold font-display tracking-tight',
      original: 'text-xs sm:text-sm text-ink-soft',
      delta: 'text-[11px] px-2 py-0.5',
    },
    xl: {
      current: 'price-xl font-bold text-ink',
      original: 'text-sm sm:text-base text-ink-soft',
      delta: 'text-xs px-2.5 py-1',
    },
  };

  const sz = sizeClasses[size];

  return (
    <div className={`inline-flex flex-col text-left ${className}`}>
      {/* Was / Now & Down Rs. X Callout */}
      <div className="flex flex-wrap items-baseline gap-2">
        <motion.span
          key={currentPrice}
          initial={shouldReduceMotion || !hasChanged ? false : { y: -8, opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className={`tabular-nums text-ink ${sz.current}`}
        >
          {formattedCurrent}
        </motion.span>

        {formattedOriginal && (
          <span className={`line-through tabular-nums opacity-60 ${sz.original}`}>
            {formattedOriginal}
          </span>
        )}

        {showDiscountPill && hasDiscount && isLKR && (
          <span
            className={`font-data font-semibold uppercase rounded bg-red-wash text-red select-none ${sz.delta}`}
          >
            Save Rs. {discountDelta.toLocaleString('en-LK')}
          </span>
        )}
      </div>

      {/* 3-month Installment Notice */}
      {showInstallments && isLKR && currentPrice > 10000 && (
        <span className="font-data text-[10px] text-ink-soft mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-go inline-block" />
          <span>Koko 3× Rs. {Math.round(currentPrice / 3).toLocaleString('en-LK')}</span>
        </span>
      )}
    </div>
  );
};

