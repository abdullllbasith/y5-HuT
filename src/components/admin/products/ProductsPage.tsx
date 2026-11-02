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
    `px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer min-h-[32px] flex items-center ${
      on ? 'bg-red text-paper border-red' : 'bg-paper-card text-ink-muted border-ink/15 hover:border-red hover:text-ink'
    }`;
  const iconBtn =
    'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-ink/15 text-xs font-bold text-ink hover:border-red hover:text-red transition-colors cursor-pointer min-h-[38px] flex-1 sm:flex-initial';

  return (
    <>
      {!canEdit && (
        <div className="rounded-xl border border-ink/10 bg-paper-sunk px-4 py-2.5 text-xs text-ink-muted">
          View only for the simulated <strong className="text-ink">{currentUser.role.replace('_', ' ')}</strong> role. Roles are a demo simulation and are not real security.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <p className="text-xs text-ink-muted">
          Add a model, add its variants, then publish it. Archiving hides a product from the storefront without deleting it.
        </p>
        <button
          onClick={() => setEditing({ form: emptyProductForm() })}
          disabled={!canEdit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red text-paper text-xs font-bold hover:bg-red/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[44px] shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Add new model
        </button>
      </div>

      <div className="bg-paper-card rounded-2xl border border-ink/10 p-3.5 space-y-3 shadow-paper text-left">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search model name or SKU…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink/15 bg-paper text-xs text-ink focus:outline-none focus:border-red min-h-[42px]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button className={chip(brand === 'all')} onClick={() => setBrand('all')}>All brands</button>
          {brands.map((b) => <button key={b} className={chip(brand === b)} onClick={() => setBrand(b)}>{b}</button>)}
          <span className="mx-1 text-ink/20">|</span>
          {(['active', 'archived', 'all'] as StatusFilter[]).map((s) => (
            <button key={s} className={chip(status === s)} onClick={() => setStatus(s)}>
              {s === 'active' ? 'Visible' : s === 'archived' ? 'Archived' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-paper-card rounded-2xl border border-dashed border-ink/20 p-10 text-center text-xs text-ink-muted">
          No products match. {status === 'archived' ? 'Nothing is archived yet.' : 'Try clearing the search or filters.'}
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((p) => {
            const range = getPriceRangeLKR(p);
            return (
              <li key={p.id} className={`bg-paper-card rounded-2xl border p-4 shadow-paper flex flex-col md:flex-row md:items-center gap-3 text-left ${p.archived ? 'border-ink/10 bg-paper-sunk/60 opacity-80' : 'border-ink/10'}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-ink">{p.name}</span>
                    {p.archived && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-paper-sunk text-ink-muted border border-ink/10">Archived · hidden</span>}
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    {p.brand} · {CATEGORY_LABELS[p.category] ?? p.category} · {hasVariants(p) ? `${p.variants!.length} variant${p.variants!.length === 1 ? '' : 's'}` : 'no variants (sample product)'}
                  </div>
                </div>
                <div className="text-xs font-data tabular-nums text-ink md:text-right">
                  <div className="font-bold text-ink">{range.min === range.max ? formatLKR(range.min) : `${formatLKR(range.min)} – ${formatLKR(range.max)}`}</div>
                  <div className="text-[11px] text-ink-muted font-sans mt-0.5">{p.stock} in stock</div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 md:pt-0 border-t border-ink/5 md:border-t-0">
                  <button className={iconBtn} disabled={!canEdit} onClick={() => setEditing({ form: toProductForm(p), existing: p })}><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  <button className={iconBtn} disabled={!canEdit || !hasVariants(p)} title={hasVariants(p) ? 'Create a hidden copy' : 'Only products with variants can be duplicated'} onClick={() => setEditing({ form: duplicateForm(p, takenSkus(products)) })}><Copy className="w-3.5 h-3.5" /> Duplicate</button>
                  <button className={iconBtn} disabled={!canEdit} onClick={() => setProductArchived(p.id, !p.archived)}>
                    {p.archived ? <><ArchiveRestore className="w-3.5 h-3.5" /> Unarchive</> : <><Archive className="w-3.5 h-3.5" /> Archive</>}
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
