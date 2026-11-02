import React from 'react';
import { Dot } from './Dot';

export interface ReceiptItem {
  id: string;
  name: string;
  variantLabel?: string;
  sku?: string;
  quantity: number;
  priceLKR: number;
  priceUSD?: number;
}

interface ReceiptProps {
  items: ReceiptItem[];
  subtotalLKR: number;
  totalLKR: number;
  totalUSD?: number;
  currency?: 'LKR' | 'USD';
  orderNumber?: string;
  date?: string;
  barcodeSku?: string;
  footerNote?: string;
  className?: string;
  emptyMessage?: string;
  children?: React.ReactNode;
}

/** Draws an authentic Code-128 style thermal barcode from any SKU string */
const SvgBarcode: React.FC<{ value: string; className?: string }> = ({
  value,
  className = '',
}) => {
  // Deterministic bar widths from hash of SKU
  const bars: { width: number; space: number }[] = [];
  const clean = (value || 'Y5HUT-DEMO').replace(/[^a-zA-Z0-9]/g, '');
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    bars.push({
      width: (code % 3) + 1.2,
      space: ((code >> 1) % 2) + 1.2,
    });
  }

  return (
    <div className={`flex flex-col items-center gap-1 select-none ${className}`}>
      <svg
        height="36"
        viewBox="0 0 160 36"
        fill="currentColor"
        className="w-full max-w-[200px] text-ink opacity-85"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {bars.map((bar, i) => {
          const x = i * 8.5 + 4;
          return <rect key={i} x={x} y="0" width={bar.width} height="36" />;
        })}
      </svg>
      <span className="font-data text-[9px] tracking-widest text-ink-soft uppercase">
        *{value || 'Y5HUT-COUNTER'}*
      </span>
    </div>
  );
};

export const Receipt: React.FC<ReceiptProps> = ({
  items,
  subtotalLKR,
  totalLKR,
  currency = 'LKR',
  orderNumber,
  date,
  barcodeSku,
  footerNote,
  className = '',
  emptyMessage = 'Nothing scanned yet',
  children,
}) => {
  const isLKR = currency === 'LKR';
  const displayDate = date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const displayReceiptNo = orderNumber || `REC-${Math.abs((totalLKR * 31) % 90000 + 10000)}`;
  const primaryBarcode = barcodeSku || (items[0]?.sku) || 'Y5HUT-COLOMBO';

  return (
    <div
      className={`relative bg-card rounded-t-xl border-[1.5px] border-ink p-5 sm:p-6 font-data text-ink shadow-2xs select-none ${className}`}
    >
      {/* Receipt Header */}
      <div className="text-center pb-4 border-b-[1.5px] border-dashed border-ink/20 space-y-1">
        <div className="font-display font-bold text-lg text-ink tracking-tight">
          y5<span className="text-red">HuT</span>.lk
        </div>
        <div className="text-[10px] text-ink-soft uppercase tracking-wider">
          Thermal Counter Slip · Colombo 04
        </div>
        <div className="text-[10px] text-ink-soft flex items-center justify-center gap-3 pt-1">
          <span>{displayDate}</span>
          <span>•</span>
          <span className="font-bold">{displayReceiptNo}</span>
        </div>
      </div>

      {/* Line Items */}
      {items.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <Dot tone="ink" size="xs" />
          <p className="font-data text-xs text-ink-soft italic">{emptyMessage}</p>
        </div>
      ) : (
        <div className="py-4 space-y-3">
          {items.map((item) => {
            const itemTotal = (isLKR ? item.priceLKR : (item.priceUSD ?? Math.round(item.priceLKR / 300))) * item.quantity;
            return (
              <div key={item.id} className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="truncate font-semibold text-ink">
                    {item.quantity}× {item.name}
                  </div>
                  <div className="shrink-0 tabular-nums font-bold">
                    {isLKR ? `Rs. ${itemTotal.toLocaleString('en-LK')}` : `$${itemTotal.toLocaleString('en-US')}`}
                  </div>
                </div>
                {item.variantLabel && (
                  <div className="text-[10px] text-ink-soft truncate">
                    {item.variantLabel} {item.sku && `[${item.sku}]`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Totals Section */}
      {items.length > 0 && (
        <div className="pt-3 border-t-[1.5px] border-dashed border-ink/20 space-y-1.5">
          <div className="flex justify-between text-xs text-ink-soft">
            <span>Subtotal</span>
            <span className="tabular-nums">
              {isLKR ? `Rs. ${subtotalLKR.toLocaleString('en-LK')}` : `$${Math.round(subtotalLKR / 300).toLocaleString('en-US')}`}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2 border-t border-ink/10">
            <span className="font-ui font-bold text-sm uppercase tracking-wide">
              Total Due
            </span>
            <span className="font-display font-bold text-xl sm:text-2xl text-ink tabular-nums">
              {isLKR ? `Rs. ${totalLKR.toLocaleString('en-LK')}` : `$${Math.round(totalLKR / 300).toLocaleString('en-US')}`}
            </span>
          </div>

          {isLKR && totalLKR > 10000 && (
            <div className="text-[10px] text-ink-soft flex items-center justify-between pt-1">
              <span>Instalment (3×)</span>
              <span className="font-bold text-ink">
                Rs. {Math.round(totalLKR / 3).toLocaleString('en-LK')} / mo
              </span>
            </div>
          )}
        </div>
      )}

      {/* Barcode representation */}
      {items.length > 0 && (
        <div className="pt-5 border-t border-dashed border-ink/20 text-center">
          <SvgBarcode value={primaryBarcode} />
        </div>
      )}

      {/* Footer note */}
      {footerNote && (
        <p className="mt-3 text-center text-[10px] text-ink-soft italic leading-tight">
          {footerNote}
        </p>
      )}

      {/* Slotted Actions (e.g. Checkout button) */}
      {children && <div className="pt-4">{children}</div>}

      {/* Zigzag torn thermal bottom edge */}
      <div
        className="absolute -bottom-2 left-0 right-0 h-2 bg-card overflow-hidden"
        style={{
          maskImage: 'repeating-linear-gradient(45deg, #000 0px, #000 4px, transparent 4px, transparent 8px)',
          WebkitMaskImage: 'repeating-linear-gradient(45deg, #000 0px, #000 4px, transparent 4px, transparent 8px)',
        }}
        aria-hidden="true"
      />
    </div>
  );
};

