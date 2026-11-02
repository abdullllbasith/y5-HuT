import React from 'react';

export type DotTone = 'red' | 'go' | 'low' | 'ink' | 'paper';

interface DotProps {
  tone?: DotTone;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Dot: React.FC<DotProps> = ({
  tone = 'red',
  pulse = false,
  size = 'sm',
  className = '',
  label,
}) => {
  const sizeMap = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2', // 8px default
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const colorMap: Record<DotTone, { bg: string; ring: string }> = {
    red: { bg: 'bg-red', ring: 'bg-red/30' },
    go: { bg: 'bg-go', ring: 'bg-go/30' },
    low: { bg: 'bg-low', ring: 'bg-low/30' },
    ink: { bg: 'bg-ink', ring: 'bg-ink/20' },
    paper: { bg: 'bg-paper', ring: 'bg-paper/30' },
  };

  const { bg, ring } = colorMap[tone];
  const s = sizeMap[size];

  return (
    <span className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <span className="relative flex items-center justify-center shrink-0">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ring}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${s} ${bg}`} />
      </span>
      {label && <span className="font-data text-xs">{label}</span>}
    </span>
  );
};

