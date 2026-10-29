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
  <div className="bg-white rounded-2xl border border-dashed border-rose-200 p-8 sm:p-12 text-center shadow-xs">
    <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-[#E11D48] flex items-center justify-center">
      <Icon className="w-7 h-7" />
    </div>
    <span className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full">
      <Hammer className="w-3 h-3" />
      Coming in Phase {phase}
    </span>
    <h2 className="mt-3 text-xl font-black text-slate-900 font-sans">{title}</h2>
    <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">{summary}</p>
    <ul className="mt-5 text-xs text-slate-600 max-w-sm mx-auto text-left space-y-1.5">
      {planned.map((p) => (
        <li key={p} className="flex gap-2">
          <span className="text-[#E11D48] font-bold">•</span>
          <span>{p}</span>
        </li>
      ))}
    </ul>
    <p className="mt-5 text-[11px] text-slate-400">Not built yet — nothing on this page is functional.</p>
    {onBack && (
      <button
        onClick={onBack}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
      >
        {backLabel} <ArrowRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);
