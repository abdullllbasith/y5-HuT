import React from 'react';
import { Hammer, ArrowRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  phase: number;
  icon: LucideIcon;
  summary: string;
  planned: string[];
  onBack?: () => void;
  backLabel?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  phase,
  icon: Icon,
  summary,
  planned,
  onBack,
  backLabel,
}) => (
  <div className="bg-paper-card rounded-2xl border border-dashed border-red/30 p-8 sm:p-12 text-center shadow-paper">
    <div className="w-14 h-14 mx-auto rounded-2xl bg-red/10 text-red flex items-center justify-center">
      <Icon className="w-7 h-7" />
    </div>
    <span className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-bold uppercase tracking-wider bg-red/10 text-red px-2.5 py-1 rounded-full font-mono">
      <Hammer className="w-3 h-3" />
      Coming in Phase {phase}
    </span>
    <h2 className="mt-3 text-xl font-black text-ink font-display">{title}</h2>
    <p className="mt-1 text-sm text-ink-muted max-w-md mx-auto">{summary}</p>
    <ul className="mt-5 text-xs text-ink-muted max-w-sm mx-auto text-left space-y-1.5 font-sans">
      {planned.map((p) => (
        <li key={p} className="flex gap-2">
          <span className="text-red font-bold">•</span>
          <span>{p}</span>
        </li>
      ))}
    </ul>
    <p className="mt-5 text-[11px] text-ink-muted/70 font-mono">Not built yet — nothing on this page is functional.</p>
    {onBack && (
      <button
        onClick={onBack}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-red hover:underline cursor-pointer"
      >
        {backLabel} <ArrowRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);
