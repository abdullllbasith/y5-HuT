import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  showHole?: boolean;
  elevation?: 'flat' | 'raised';
}

export const Tag: React.FC<TagProps> = ({
  children,
  className = '',
  onClick,
  showHole = false,
  elevation = 'raised',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`
        group relative flex flex-col bg-surface rounded-2xl border border-line overflow-hidden transition-all duration-200
        ${elevation === 'raised' ? 'shadow-xs hover:shadow-md hover:border-ink/20' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {showHole && (
        <div className="pt-2 pb-0.5 flex items-center justify-center relative z-20">
          <div className="w-1.5 h-1.5 rounded-full bg-line" />
        </div>
      )}

      {children}
    </motion.div>
  );
};

export const TagPerforation: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-full py-1 border-t border-line/60 ${className}`} />
);

