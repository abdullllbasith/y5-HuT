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
  rotation,
  size = 'md',
  className = '',
}) => {
  // Deterministic slight angle per type if rotation not explicitly provided
  const defaultRotations: Record<StickerType, number> = {
    HOT: -3.5,
    SALE: 4,
    NEW: -2.5,
    GENUINE: 2,
    BESTSELLER: -4.5,
    INSTALLMENT_0: 3,
    FEATURED: -1.5,
  };

  const angle = rotation !== undefined ? rotation : defaultRotations[type] ?? -3;

  const configMap: Record<
    StickerType,
    { label: string; bg: string; textCol: string; border: string; corner: string }
  > = {
    HOT: {
      label: 'HOT',
      bg: 'bg-red',
      textCol: 'text-white',
      border: 'border-red-ink',
      corner: 'border-t-red-ink border-l-red-ink',
    },
    SALE: {
      label: 'SALE',
      bg: 'bg-highlighter',
      textCol: 'text-ink font-black',
      border: 'border-ink/20',
      corner: 'border-t-ink/30 border-l-ink/30',
    },
    NEW: {
      label: 'NEW',
      bg: 'bg-card',
      textCol: 'text-red font-bold',
      border: 'border-line',
      corner: 'border-t-ink/10 border-l-ink/10',
    },
    GENUINE: {
      label: 'VERIFIED',
      bg: 'bg-ink',
      textCol: 'text-paper',
      border: 'border-ink',
      corner: 'border-t-paper/30 border-l-paper/30',
    },
    BESTSELLER: {
      label: 'TOP PICK',
      bg: 'bg-red',
      textCol: 'text-white font-extrabold',
      border: 'border-red-ink',
      corner: 'border-t-red-ink border-l-red-ink',
    },
    INSTALLMENT_0: {
      label: '0% × 3',
      bg: 'bg-highlighter',
      textCol: 'text-ink font-bold',
      border: 'border-ink/20',
      corner: 'border-t-ink/20 border-l-ink/20',
    },
    FEATURED: {
      label: 'SPOTLIGHT',
      bg: 'bg-red-wash',
      textCol: 'text-red-ink font-bold',
      border: 'border-red/20',
      corner: 'border-t-red/30 border-l-red/30',
    },
  };

  const conf = configMap[type] || configMap.HOT;
  const displayText = text || conf.label;

  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 min-w-[36px]',
    md: 'text-[10px] px-2.5 py-1 min-w-[42px]',
    lg: 'text-xs px-3 py-1.5 min-w-[50px]',
  };

  return (
    <span
      style={{ transform: `rotate(${angle}deg)` }}
      className={`relative inline-flex items-center justify-center font-data uppercase tracking-wider rounded-full border shadow-2xs select-none transition-transform hover:scale-110 duration-150 ${conf.bg} ${conf.textCol} ${conf.border} ${sizeStyles[size]} ${className}`}
    >
      {/* Tiny peeled corner detail on top-right */}
      <span
        className="absolute -top-[1px] -right-[1px] w-2 h-2 pointer-events-none rounded-tr-full overflow-hidden opacity-30"
        aria-hidden="true"
      >
        <span className="block w-full h-full bg-ink rotate-45 transform origin-bottom-left" />
      </span>

      <span className="relative z-10 leading-none">{displayText}</span>
    </span>
  );
};

