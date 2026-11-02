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
  showHole = true,
  elevation = 'raised',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={onClick}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              rotate: [0, -1.8, 1.8, 0],
              transition: { duration: 0.45, ease: 'easeInOut' },
            }
      }
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      style={{ transformOrigin: 'top center' }}
      className={`
        group relative flex flex-col bg-card rounded-[14px] border-[1.5px] border-ink overflow-hidden transition-all duration-200
        ${elevation === 'raised' ? 'hover:shadow-hard shadow-2xs' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Top Hanging Hole & String Detail */}
      {showHole && (
        <div className="pt-3 pb-1 flex items-center justify-center relative z-20">
          <div className="tag-hole" title="Authentic store price tag" />
        </div>
      )}

      {children}
    </motion.div>
  );
};

export const TagPerforation: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-full py-1.5 flex items-center justify-between overflow-hidden select-none ${className}`}>
    {/* Left Notch */}
    <div className="w-3.5 h-3.5 rounded-r-full bg-paper border-r-[1.5px] border-y-[1.5px] border-ink -ml-[2px] shrink-0" />
    
    {/* Dashed Tear Line */}
    <div className="flex-1 border-b-[1.5px] border-dashed border-ink/30 mx-1.5" />
    
    {/* Right Notch */}
    <div className="w-3.5 h-3.5 rounded-l-full bg-paper border-l-[1.5px] border-y-[1.5px] border-ink -mr-[2px] shrink-0" />
  </div>
);
