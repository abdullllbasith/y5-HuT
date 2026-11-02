import React from 'react';

export type StickerType =
  | 'HOT'
  | 'SALE'
  | 'NEW'
  | 'GENUINE'
  | 'BESTSELLER'
  | 'INSTALLMENT_0'
  | 'FEATURED';

interface StickerProps {
  type?: StickerType;
  text?: string;
  rotation?: number; // degrees, -6 to 6
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Sticker: React.FC<StickerProps> = ({
  type = 'HOT',
  text,
  rotation = 0,
  size = 'md',
  className = '',
}) => {
  const configMap: Record<
    StickerType,
    { label: string; bg: string; textCol: string; border: string }
  > = {
    HOT: {
      label: 'HOT',
      bg: 'bg-red text-white',
      textCol: 'text-white',
      border: 'border-transparent',
    },
    SALE: {
      label: 'SALE',
      bg: 'bg-red-wash',
      textCol: 'text-red font-bold',
      border: 'border-red/20',
    },
    NEW: {
      label: 'NEW',
      bg: 'bg-soft-surface',
      textCol: 'text-ink font-semibold',
      border: 'border-line',
    },
    GENUINE: {
      label: 'VERIFIED',
      bg: 'bg-ink',
      textCol: 'text-white',
      border: 'border-ink',
    },
    BESTSELLER: {
      label: 'TOP PICK',
      bg: 'bg-red text-white',
      textCol: 'text-white font-bold',
      border: 'border-transparent',
    },
    INSTALLMENT_0: {
      label: '0% SPLIT',
      bg: 'bg-soft-surface',
      textCol: 'text-ink font-semibold',
      border: 'border-line',
    },
    FEATURED: {
      label: 'SPOTLIGHT',
      bg: 'bg-signal-blue/40',
      textCol: 'text-ink font-bold',
      border: 'border-signal-blue',
    },
  };

  const conf = configMap[type] || configMap.HOT;
  const displayText = text || conf.label;

  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 min-w-[32px] rounded',
    md: 'text-[10px] px-2.5 py-0.5 min-w-[38px] rounded-md',
    lg: 'text-xs px-3 py-1 min-w-[46px] rounded-md',
  };

  return (
    <span
      style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
      className={`inline-flex items-center justify-center font-data uppercase tracking-wider border select-none transition-all ${conf.bg} ${conf.textCol} ${conf.border} ${sizeStyles[size]} ${className}`}
    >
      <span className="leading-none">{displayText}</span>
    </span>
  );
};

