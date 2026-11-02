import React from 'react';
import { Dot } from './Dot';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'lg',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-ui font-bold select-none transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3.5 py-2 min-h-[36px] rounded-full gap-1.5',
      md: 'text-xs sm:text-sm px-5 py-2.5 min-h-[44px] rounded-full gap-2',
      lg: 'text-sm sm:text-base px-6 py-3 min-h-[48px] rounded-full gap-2.5',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-red text-white border-[1.5px] border-ink shadow-hard hover:shadow-hard-hover hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-hard-pressed active:translate-x-0.5 active:translate-y-0.5',
      secondary:
        'bg-card text-ink border-[1.5px] border-ink hover:bg-paper-sunk active:bg-paper',
      ghost:
        'bg-transparent text-ink hover:text-red hover:underline underline-offset-4 border-none shadow-none',
      danger:
        'bg-red-ink text-white border-[1.5px] border-ink shadow-hard hover:bg-red',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Dot tone={variant === 'secondary' || variant === 'ghost' ? 'ink' : 'paper'} pulse size="xs" />
            <span>Processing...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
