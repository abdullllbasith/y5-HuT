import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import { TagPerforation } from '../ui/Tag';

export const PromiseBand: React.FC = () => {
  const promises = [
    {
      code: 'DEL-01',
      title: 'Islandwide Delivery',
      detail: '2–4 days express across Sri Lanka',
      icon: Truck,
      stamp: 'LOGISTICS',
    },
    {
      code: 'GEN-02',
      title: 'Genuine Devices',
      detail: 'Factory sealed with serial verification',
      icon: ShieldCheck,
      stamp: 'ORIGINAL',
    },
    {
      code: 'BNPL-03',
      title: '0% Installments',
      detail: 'Koko & Mintpay 3-month splits',
      icon: CreditCard,
      stamp: 'PAYMENT',
    },
    {
      code: 'SUP-04',
      title: 'Direct Hotline',
      detail: 'Live store WhatsApp & counter service',
      icon: Headphones,
      stamp: 'ASSIST',
    },
  ];

  return (
    <section className="py-6 sm:py-8 space-y-3 text-left">
      <div className="flex items-center justify-between text-[11px] font-data text-ink-soft">
        <span className="uppercase tracking-wider font-bold">Counter Promises</span>
        <span>Sample Terms · Demo Preview</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {promises.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.code}
              className="bg-card border border-line rounded-xl p-4 shadow-hard-sm hover:border-ink transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Row: Ticket Code & Stamp */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-data text-[10px] text-ink-soft font-bold tracking-wider">
                  {p.code}
                </span>
                <span className="font-data text-[9px] font-bold uppercase tracking-widest text-red bg-red-wash px-2 py-0.5 rounded border border-red/20">
                  {p.stamp}
                </span>
              </div>

              {/* Middle: Icon & Title */}
              <div className="flex items-start gap-3 my-1">
                <div className="w-9 h-9 rounded-lg bg-paper-sunk border border-line flex items-center justify-center shrink-0 text-ink">
                  <Icon className="w-4 h-4 text-red" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-ui font-bold text-sm text-ink">{p.title}</h4>
                  <p className="font-ui text-xs text-ink-soft mt-0.5 leading-snug">{p.detail}</p>
                </div>
              </div>

              {/* Perforation line */}
              <div className="my-2.5">
                <TagPerforation />
              </div>

              {/* Bottom: Simulated watermark note */}
              <div className="flex items-center justify-between font-data text-[9px] text-ink-soft/70">
                <span>Y5HUT COUNTER</span>
                <span>SAMPLE SPEC</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
