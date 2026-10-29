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
  `w-full px-3 py-2 rounded-lg border text-sm ${bad ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30`;

const Step: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
      <span className="w-6 h-6 rounded-full bg-[#E11D48] text-white text-xs flex items-center justify-center">{n}</span>
      {title}
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
        <h2 className="text-lg font-black text-slate-900">{isNew ? 'Add new model' : `Edit ${existing!.name}`}</h2>
        <p className="text-xs text-slate-500">
          {isNew ? '1. Describe the model → 2. Add its variants → 3. Publish. ' : ''}
          Demo only: saved in this browser. Products are hidden (archived), never deleted.
        </p>
      </div>

      {submitted && hasErrors(errors) && (
        <div role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-xs text-rose-800">
          Please fix the highlighted fields before saving.
        </div>
      )}

      <Step n={1} title="Model details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-slate-700 md:col-span-2">
            Model name *
            <input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Apple iPhone 16" aria-invalid={!!show.fields.name} className={field(show.fields.name)} />
            {show.fields.name && <span role="alert" className="text-[11px] text-rose-600">{show.fields.name}</span>}
          </label>
          <label className="text-xs font-bold text-slate-700">
            Brand *
            <input list="brand-options" value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder="Choose or type a brand" aria-invalid={!!show.fields.brand} className={field(show.fields.brand)} />
            <datalist id="brand-options">{brands.map((b) => <option key={b} value={b} />)}</datalist>
            {show.fields.brand && <span role="alert" className="text-[11px] text-rose-600">{show.fields.brand}</span>}
          </label>
          <label className="text-xs font-bold text-slate-700">
            Category
            <select value={form.category} onChange={(e) => set({ category: e.target.value as FormState['category'] })} className={field()}>
              {SELECTABLE_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-700 md:col-span-2">
            Description
            <textarea value={form.description} onChange={(e) => set({ description: e.target.value })} rows={3} className={field(show.fields.description)} />
            {show.fields.description && <span role="alert" className="text-[11px] text-rose-600">{show.fields.description}</span>}
          </label>
          <label className="text-xs font-bold text-slate-700 md:col-span-2">
            Image link (optional)
            <input value={form.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="https://… (no upload; leave empty to use the built-in picture)" aria-invalid={!!show.fields.imageUrl} className={field(show.fields.imageUrl)} />
            {show.fields.imageUrl && <span role="alert" className="text-[11px] text-rose-600">{show.fields.imageUrl}</span>}
          </label>
          {imageOk && (
            <div className="md:col-span-2 flex items-center gap-3 text-[11px] text-slate-500">
              <img src={form.imageUrl.trim()} alt="Preview" referrerPolicy="no-referrer" className="h-20 w-20 object-contain rounded border border-slate-200 bg-slate-50" onError={(e) => (e.currentTarget.style.display = 'none')} />
              Preview. If it does not load, the storefront falls back to the built-in picture.
            </div>
          )}
          <label className="text-xs font-bold text-slate-700">
            Low-stock warning at (units)
            <input value={form.lowStockThreshold} inputMode="numeric" onChange={(e) => set({ lowStockThreshold: e.target.value })} className={field(show.fields.lowStockThreshold)} />
            {show.fields.lowStockThreshold && <span role="alert" className="text-[11px] text-rose-600">{show.fields.lowStockThreshold}</span>}
          </label>
        </div>
      </Step>

      <Step n={2} title="Variants (storage, colour, SKU, price, stock)">
        {simple ? (
          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
            This sample product has no variants. Change its price in <strong>Price Manager</strong> and its stock in <strong>Inventory</strong>.
          </p>
        ) : (
          <>
            <VariantEditor variants={form.variants} errors={show} onChange={(variants) => set({ variants })} />
            <p className="text-[11px] text-slate-500">
              Prices are in LKR. For new variants the USD shown on the storefront is an illustrative estimate (Rs. 300 = $1) and is not kept in sync.
            </p>
          </>
        )}
      </Step>

      <Step n={3} title={isNew ? 'Publish' : 'Visibility'}>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" checked={!form.archived} onChange={(e) => set({ archived: !e.target.checked })} className="w-4 h-4 accent-[#E11D48]" />
          Show on the storefront
        </label>
        <p className="text-[11px] text-slate-500">
          {form.archived ? 'Hidden: customers cannot see or buy it. You can publish it later.' : 'Visible: customers can see it in this browser right after you save.'}
        </p>
      </Step>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button type="button" onClick={onDone} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer">
          {isNew ? (form.archived ? 'Save hidden demo product' : 'Publish demo product') : 'Save changes'}
        </button>
      </div>
    </form>
  );
};
