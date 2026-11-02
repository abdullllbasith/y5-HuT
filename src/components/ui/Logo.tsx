import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  showTagline = false,
  inverted = false,
}) => {
  const discSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const discSize = discSizes[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG recreation of the authentic y5HuT emblem */}
      <svg
        width={discSize}
        height={discSize}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
        aria-hidden="true"
      >
        {/* Offset delicate thin accent ring */}
        <circle
          cx="24"
          cy="19"
          r="19"
          stroke={inverted ? 'var(--color-paper)' : 'var(--color-red)'}
          strokeWidth="1.2"
          strokeOpacity="0.35"
          strokeDasharray="1 0"
        />

        {/* Solid Red Sun disc */}
        <circle
          cx="21"
          cy="22"
          r="18"
          fill="var(--color-red)"
        />

        {/* Serif 'y' */}
        <text
          x="16.5"
          y="28"
          fill="#FFFFFF"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="21"
          fontWeight="700"
          fontStyle="italic"
          textAnchor="middle"
        >
          y
        </text>

        {/* Superscript '5' */}
        <text
          x="27"
          y="17"
          fill="#FFFFFF"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="12"
          fontWeight="800"
          textAnchor="middle"
        >
          5
        </text>
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none text-left">
          <div className="flex items-baseline">
            <span
              className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                inverted ? 'text-paper' : 'text-ink'
              }`}
            >
              y5<span className="text-red">HuT</span>
            </span>
            <span
              className={`font-data text-[10px] sm:text-[11px] font-semibold ml-0.5 ${
                inverted ? 'text-paper-sunk' : 'text-ink-soft'
              }`}
            >
              .lk
            </span>
          </div>
          {showTagline && (
            <span
              className={`font-data text-[8px] uppercase tracking-wider font-semibold mt-0.5 ${
                inverted ? 'text-paper-sunk opacity-75' : 'text-ink-soft'
              }`}
            >
              Sri Lanka's Tech Store
            </span>
          )}
        </div>
      )}
    </div>
  );
};

