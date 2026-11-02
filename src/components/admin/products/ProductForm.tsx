import React, { useMemo, useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Product } from '../../../types';
import {
  CATEGORY_LABELS,
  ProductForm as FormState,
  SELECTABLE_CATEGORIES,
  hasErrors,
  isHttpUrl,
  productFromForm,
  validateProductForm,
} from '../../../lib/productForm';
import { hasVariants } from '../../../lib/variants';
import { VariantEditor } from './VariantEditor';

interface Props {
  initial: FormState;
  existing?: Product; // undefined = adding a new model
  onDone: () => void;
}

const field = (bad?: string) =>
  `w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm min-h-[42px] ${
    bad ? 'border-rose-400 bg-rose-50 text-rose-900' : 'border-ink/15 bg-paper text-ink'
  } focus:outline-none focus:border-red transition-colors`;

const Step: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <section className="bg-paper-card rounded-2xl border border-ink/10 p-4 sm:p-5 shadow-paper space-y-3.5 text-left">
    <h3 className="flex items-center gap-2.5 text-sm font-bold text-ink font-display">
      <span className="w-6 h-6 rounded-full bg-red text-paper text-xs font-mono font-bold flex items-center justify-center shrink-0">
        {n}
      </span>
      <span>{title}</span>
    </h3>
    {children}
  </section>
);

export const ProductForm: React.FC<Props> = ({ initial, existing, onDone }) => {
  const { products, upsertProduct } = useStore();
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const simple = !!existing && !hasVariants(existing);
  const isNew = !existing;

  const errors = useMemo(() => validateProductForm(form, products, simple), [form, products, simple]);
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const show = submitted ? errors : { fields: {}, variants: {} };
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  const imageOk = form.imageUrl.trim() !== '' && isHttpUrl(form.imageUrl.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;
    upsertProduct(productFromForm(form, existing));
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <h2 className="text-lg font-black text-ink font-display">{isNew ? 'Add new model' : `Edit ${existing!.name}`}</h2>
        <p className="text-xs text-ink-muted">
          {isNew ? '1. Describe the model → 2. Add its variants → 3. Publish. ' : ''}
          Demo only: saved in this browser. Products are hidden (archived), never deleted.
        </p>
      </div>

      {submitted && hasErrors(errors) && (
        <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs text-rose-800">
          Please fix the highlighted fields before saving.
        </div>
      )}

      <Step n={1} title="Model details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-ink md:col-span-2">
            Model name *
            <input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Apple iPhone 16" aria-invalid={!!show.fields.name} className={field(show.fields.name)} />
            {show.fields.name && <span role="alert" className="text-[11px] text-rose-600 font-medium">{show.fields.name}</span>}
          </label>
          <label className="text-xs font-bold text-ink">
            Brand *
            <input list="brand-options" value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder="Choose or type a brand" aria-invalid={!!show.fields.brand} className={field(show.fields.brand)} />
            <datalist id="brand-options">{brands.map((b) => <option key={b} value={b} />)}</datalist>
            {show.fields.brand && <span role="alert" className="text-[11px] text-rose-600 font-medium">{show.fields.brand}</span>}
          </label>
          <label className="text-xs font-bold text-ink">
            Category
            <select value={form.category} onChange={(e) => set({ category: e.target.value as FormState['category'] })} className={field()}>
              {SELECTABLE_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-ink md:col-span-2">
            Description
            <textarea value={form.description} onChange={(e) => set({ description: e.target.value })} rows={3} className={field(show.fields.description)} />
            {show.fields.description && <span role="alert" className="text-[11px] text-rose-600 font-medium">{show.fields.description}</span>}
          </label>
          <label className="text-xs font-bold text-ink md:col-span-2">
            Image link (optional)
            <input value={form.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="https://… (no upload; leave empty to use the built-in picture)" aria-invalid={!!show.fields.imageUrl} className={field(show.fields.imageUrl)} />
            {show.fields.imageUrl && <span role="alert" className="text-[11px] text-rose-600 font-medium">{show.fields.imageUrl}</span>}
          </label>
          {imageOk && (
            <div className="md:col-span-2 flex items-center gap-3 text-[11px] text-ink-muted">
              <img src={form.imageUrl.trim()} alt="Preview" referrerPolicy="no-referrer" className="h-20 w-20 object-contain rounded-xl border border-ink/10 bg-paper-sunk" onError={(e) => (e.currentTarget.style.display = 'none')} />
              Preview. If it does not load, the storefront falls back to the built-in picture.
            </div>
          )}
          <label className="text-xs font-bold text-ink">
            Low-stock warning at (units)
            <input value={form.lowStockThreshold} inputMode="numeric" onChange={(e) => set({ lowStockThreshold: e.target.value })} className={field(show.fields.lowStockThreshold)} />
            {show.fields.lowStockThreshold && <span role="alert" className="text-[11px] text-rose-600 font-medium">{show.fields.lowStockThreshold}</span>}
          </label>
        </div>
      </Step>

      <Step n={2} title="Variants (storage, colour, SKU, price, stock)">
        {simple ? (
          <p className="text-xs text-ink-muted bg-paper-sunk border border-ink/10 rounded-xl p-3">
            This sample product has no variants. Change its price in <strong className="text-ink">Price Manager</strong> and its stock in <strong className="text-ink">Inventory</strong>.
          </p>
        ) : (
          <>
            <VariantEditor variants={form.variants} errors={show} onChange={(variants) => set({ variants })} />
            <p className="text-[11px] text-ink-muted">
              Prices are in LKR. For new variants the USD shown on the storefront is an illustrative estimate (Rs. 300 = $1) and is not kept in sync.
            </p>
          </>
        )}
      </Step>

      <Step n={3} title={isNew ? 'Publish' : 'Visibility'}>
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input type="checkbox" checked={!form.archived} onChange={(e) => set({ archived: !e.target.checked })} className="w-4 h-4 accent-red" />
          Show on the storefront
        </label>
        <p className="text-[11px] text-ink-muted">
          {form.archived ? 'Hidden: customers cannot see or buy it. You can publish it later.' : 'Visible: customers can see it in this browser right after you save.'}
        </p>
      </Step>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onDone}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-ink/15 bg-paper-card text-xs font-bold text-ink hover:bg-paper-sunk cursor-pointer min-h-[44px] flex items-center justify-center transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red text-paper text-xs font-bold hover:bg-red/90 cursor-pointer min-h-[44px] flex items-center justify-center shadow-sm transition-colors"
        >
          {isNew ? (form.archived ? 'Save hidden demo product' : 'Publish demo product') : 'Save changes'}
        </button>
      </div>
    </form>
  );
};
