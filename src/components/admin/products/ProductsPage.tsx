import React, { useMemo, useState } from 'react';
import { Archive, ArchiveRestore, Copy, Pencil, Plus, Search } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Product } from '../../../types';
import { CATEGORY_LABELS, ProductForm as FormState, duplicateForm, emptyProductForm, takenSkus, toProductForm } from '../../../lib/productForm';
import { getPriceRangeLKR, hasVariants } from '../../../lib/variants';
import { formatLKR } from '../../../lib/priceValidation';
import { ProductForm } from './ProductForm';

type Editing = { form: FormState; existing?: Product } | null;
type StatusFilter = 'active' | 'archived' | 'all';

export const ProductsPage: React.FC = () => {
  const { products, currentUser, setProductArchived } = useStore();
  const [editing, setEditing] = useState<Editing>(null);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [status, setStatus] = useState<StatusFilter>('active');
  const canEdit = currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager';

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (status === 'active' && p.archived) return false;
      if (status === 'archived' && !p.archived) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (q && !(p.name.toLowerCase().includes(q) || p.variants?.some((v) => v.sku.toLowerCase().includes(q)) || p.id.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [products, search, brand, status]);

  if (editing) {
    return <ProductForm initial={editing.form} existing={editing.existing} onDone={() => setEditing(null)} />;
  }

  const chip = (on: boolean) =>
    `px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${on ? 'bg-[#E11D48] text-white border-[#E11D48]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#E11D48]'}`;
  const iconBtn = 'inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-[#E11D48] hover:text-[#E11D48] cursor-pointer';

  return (
    <>
      {!canEdit && (
        <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-700">
          View only for the simulated <strong>{currentUser.role.replace('_', ' ')}</strong> role. Roles are a demo simulation and are not real security.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-600">
          Add a model, add its variants, then publish it. Archiving hides a product from the storefront without deleting it.
        </p>
        <button
          onClick={() => setEditing({ form: emptyProductForm() })}
          disabled={!canEdit}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add new model
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or SKU…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className={chip(brand === 'all')} onClick={() => setBrand('all')}>All brands</button>
          {brands.map((b) => <button key={b} className={chip(brand === b)} onClick={() => setBrand(b)}>{b}</button>)}
          <span className="mx-1 text-slate-300">|</span>
          {(['active', 'archived', 'all'] as StatusFilter[]).map((s) => (
            <button key={s} className={chip(status === s)} onClick={() => setStatus(s)}>
              {s === 'active' ? 'Visible' : s === 'archived' ? 'Archived' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">
          No products match. {status === 'archived' ? 'Nothing is archived yet.' : 'Try clearing the search or filters.'}
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((p) => {
            const range = getPriceRangeLKR(p);
            return (
              <li key={p.id} className={`bg-white rounded-xl border p-3 shadow-xs flex flex-col md:flex-row md:items-center gap-3 ${p.archived ? 'border-slate-200 opacity-75' : 'border-slate-200'}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{p.name}</span>
                    {p.archived && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">Archived · hidden</span>}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {p.brand} · {CATEGORY_LABELS[p.category] ?? p.category} · {hasVariants(p) ? `${p.variants!.length} variant${p.variants!.length === 1 ? '' : 's'}` : 'no variants (sample product)'}
                  </div>
                </div>
                <div className="text-xs font-mono tabular-nums text-slate-700 md:text-right">
                  {range.min === range.max ? formatLKR(range.min) : `${formatLKR(range.min)} – ${formatLKR(range.max)}`}
                  <div className="text-[11px] text-slate-500 font-sans">{p.stock} in stock</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button className={iconBtn} disabled={!canEdit} onClick={() => setEditing({ form: toProductForm(p), existing: p })}><Pencil className="w-3 h-3" /> Edit</button>
                  <button className={iconBtn} disabled={!canEdit || !hasVariants(p)} title={hasVariants(p) ? 'Create a hidden copy' : 'Only products with variants can be duplicated'} onClick={() => setEditing({ form: duplicateForm(p, takenSkus(products)) })}><Copy className="w-3 h-3" /> Duplicate</button>
                  <button className={iconBtn} disabled={!canEdit} onClick={() => setProductArchived(p.id, !p.archived)}>
                    {p.archived ? <><ArchiveRestore className="w-3 h-3" /> Unarchive</> : <><Archive className="w-3 h-3" /> Archive</>}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
