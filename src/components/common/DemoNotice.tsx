import React from 'react';
import { FlaskConical } from 'lucide-react';

interface DemoNoticeProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

/** Honest "this is simulated" flag, used wherever the demo fakes something. */
export const DemoNotice: React.FC<DemoNoticeProps> = ({ children, className = '', compact }) => (
  <div
    role="note"
    className={`flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 ${compact ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2.5 text-xs'} ${className}`}
  >
    <FlaskConical className="w-4 h-4 shrink-0 mt-0.5" />
    <p className="leading-relaxed">
      <strong className="font-black tracking-wide">DEMO</strong> {children}
    </p>
  </div>
);

export const DemoBadge: React.FC = () => (
  <span className="inline-block text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 align-middle">
    DEMO
  </span>
);
