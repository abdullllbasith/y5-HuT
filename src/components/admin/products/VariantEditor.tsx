import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormErrors, VariantForm, newVariantRow } from '../../../lib/productForm';

interface Props {
  variants: VariantForm[];
  errors: FormErrors;
  onChange: (variants: VariantForm[]) => void;
}

const input = (bad?: string) =>
  `w-full px-3 py-2 rounded-lg border text-xs min-h-[40px] ${
    bad ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'
  } focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 transition-colors`;

export const VariantEditor: React.FC<Props> = ({ variants, errors, onChange }) => {
  const set = (key: string, patch: Partial<VariantForm>) =>
    onChange(variants.map((v) => (v.key === key ? { ...v, ...patch } : v)));

  return (
    <div className="space-y-3">
      {variants.map((v, i) => {
        const e = errors.variants[v.key] ?? {};
        return (
          <div key={v.key} className="rounded-xl border border-slate-200 bg-[#F7F8FA] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Variant {i + 1}</span>
              <button
                type="button"
                onClick={() => onChange(variants.filter((x) => x.key !== v.key))}
                disabled={variants.length === 1}
                aria-label={`Remove variant ${i + 1}`}
                title={variants.length === 1 ? 'A model needs at least one variant' : 'Remove variant'}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              <label className="text-[11px] font-bold text-slate-700 space-y-1 block">
                <span>Storage</span>
                <input value={v.storage} onChange={(ev) => set(v.key, { storage: ev.target.value })} placeholder="e.g. 128GB" className={input(e.combo)} />
              </label>
              <label className="text-[11px] font-bold text-slate-700 space-y-1 block">
                <span>Colour</span>
                <input value={v.color} onChange={(ev) => set(v.key, { color: ev.target.value })} placeholder="e.g. Blue" className={input(e.combo)} />
              </label>
              <label className="text-[11px] font-bold text-slate-700 space-y-1 block sm:col-span-2 lg:col-span-1">
                <span>SKU *</span>
                <input value={v.sku} onChange={(ev) => set(v.key, { sku: ev.target.value })} placeholder="e.g. APL-IP16-128-BLU" aria-invalid={!!e.sku} className={`${input(e.sku)} font-mono`} />
              </label>
              <label className="text-[11px] font-bold text-slate-700 space-y-1 block">
                <span>Price (LKR) *</span>
                <input value={v.price} inputMode="decimal" onChange={(ev) => set(v.key, { price: ev.target.value })} placeholder="245000" aria-invalid={!!e.price} className={`${input(e.price)} font-mono text-right`} />
              </label>
              <label className="text-[11px] font-bold text-slate-700 space-y-1 block">
                <span>Stock *</span>
                <input value={v.stock} inputMode="numeric" onChange={(ev) => set(v.key, { stock: ev.target.value })} aria-invalid={!!e.stock} className={`${input(e.stock)} font-mono text-right`} />
              </label>
            </div>
            {(e.sku || e.price || e.stock || e.combo) && (
              <ul role="alert" className="mt-1 text-[11px] font-semibold text-rose-600 space-y-0.5 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {[e.sku && `SKU: ${e.sku}`, e.price && `Price: ${e.price}`, e.stock && `Stock: ${e.stock}`, e.combo].filter(Boolean).map((m) => (
                  <li key={m as string}>• {m}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      {errors.fields.variants && <p role="alert" className="text-[11px] font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">{errors.fields.variants}</p>}
      <button
        type="button"
        onClick={() => onChange([...variants, newVariantRow()])}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-[#E11D48] text-xs font-bold text-[#E11D48] hover:bg-rose-50 cursor-pointer min-h-[44px] transition-colors"
      >
        <Plus className="w-4 h-4" /> Add variant
      </button>
    </div>
  );
};
