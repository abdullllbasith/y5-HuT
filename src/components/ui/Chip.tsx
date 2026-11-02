import React from 'react';
import { Dot } from './Dot';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label: React.ReactNode;
  count?: number | string;
  size?: 'sm' | 'md';
  showDotOnActive?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  label,
  count,
  size = 'md',
  showDotOnActive = true,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-1 min-h-[34px] gap-1.5 rounded-md',
    md: 'text-xs px-3.5 py-2 min-h-[44px] gap-2 rounded-lg',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      className={`
        inline-flex items-center justify-center font-data select-none border transition-all duration-150 cursor-pointer
        ${sizeStyles[size]}
        ${
          active
            ? 'bg-ink text-paper border-ink shadow-2xs font-bold'
            : 'bg-card text-ink-soft border-line hover:border-ink hover:text-ink hover:bg-paper-sunk'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed border-line/40' : ''}
        ${className}
      `}
      {...props}
    >
      {active && showDotOnActive && <Dot tone="red" size="xs" />}
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={`font-data text-[10px] tabular-nums font-semibold ml-0.5 px-1.5 py-0.2 rounded ${
            active ? 'bg-paper/20 text-paper' : 'bg-paper-sunk text-ink-soft'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
  badge?: string | number;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={`inline-flex items-center p-1 bg-paper-sunk rounded-xl border border-line ${className}`}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`
              relative flex items-center justify-center gap-1.5 font-data rounded-lg transition-all duration-150 cursor-pointer
              ${size === 'sm' ? 'px-2.5 py-1 text-[11px] min-h-[32px]' : 'px-3.5 py-1.5 text-xs min-h-[38px]'}
              ${
                selected
                  ? 'bg-ink text-paper font-bold shadow-2xs'
                  : 'text-ink-soft hover:text-ink hover:bg-paper/50 font-medium'
              }
            `}
          >
            {selected && <Dot tone="red" size="xs" />}
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span className={`text-[10px] ml-1 font-normal ${selected ? 'text-paper-sunk' : 'text-ink-soft'}`}>
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

