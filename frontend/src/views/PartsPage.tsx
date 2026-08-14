import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParts } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Package, Search } from 'lucide-react';

export default function PartsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: parts = [], isLoading, isError, createPart, updatePartStock } = useParts(user?.token);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    sku: '', name: '', brand: '', cost: 0, sellingPrice: 0, stockQty: 0
  });

  if (isLoading) {
    return (
      <section aria-label={t('parts.title')} aria-busy="true">
        <h2>{t('parts.title')}</h2>
        <p>{t('common.loading')}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label={t('parts.title')}>
        <h2>{t('parts.title')}</h2>
        <p role="alert" className="text-error">{t('common.error')}</p>
      </section>
    );
  }

  const filtered = parts.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPart({ ...form, reservedQty: 0 });
    setShowForm(false);
    setForm({ sku: '', name: '', brand: '', cost: 0, sellingPrice: 0, stockQty: 0 });
  };

  const handleStockAdjust = async (partId: string, qty: number) => {
    await updatePartStock({ partId, qtyChange: qty });
  };

  const lowStockParts = parts.filter((p: any) => p.stockQty <= 5);

  return (
    <section aria-label={t('parts.title')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2><Package size={20} aria-hidden="true" /> {t('parts.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          aria-label={t('parts.addPart')}
        >
          <Plus size={16} /> {t('parts.addPart')}
        </button>
      </div>

      {lowStockParts.length > 0 && (
        <article className="card" style={{ marginBottom: '16px', borderLeft: '4px solid var(--warning)' }} role="alert" aria-label={t('parts.lowStockAlert')}>
          <strong>{t('parts.lowStockAlert')}</strong>
          <p>{lowStockParts.map((p: any) => p.name).join(', ')}</p>
        </article>
      )}

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder={t('parts.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('parts.searchPlaceholder')}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {showForm && (
        <article className="card" style={{ marginBottom: '16px' }} aria-label={t('parts.addPart')}>
          <h3>{t('parts.addPart')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
              <div>
                <label htmlFor="part-sku">{t('parts.sku')}</label>
                <input
                  id="part-sku"
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="part-name">{t('parts.partName')}</label>
                <input
                  id="part-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="part-brand">{t('parts.brand')}</label>
                <input
                  id="part-brand"
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="part-cost">{t('parts.cost')}</label>
                <input
                  id="part-cost"
                  type="number"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="part-price">{t('parts.sellingPrice')}</label>
                <input
                  id="part-price"
                  type="number"
                  value={form.sellingPrice}
                  onChange={(e) => setForm({ ...form, sellingPrice: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="part-stock">{t('parts.stockQty')}</label>
                <input
                  id="part-stock"
                  type="number"
                  value={form.stockQty}
                  onChange={(e) => setForm({ ...form, stockQty: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" aria-label={t('common.save')}>
              {t('common.save')}
            </button>
          </form>
        </article>
      )}

      <article className="card">
        <table aria-label={t('parts.title')} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>{t('parts.sku')}</th>
              <th>{t('parts.partName')}</th>
              <th>{t('parts.brand')}</th>
              <th>{t('parts.cost')}</th>
              <th>{t('parts.sellingPrice')}</th>
              <th>{t('parts.stockQty')}</th>
              <th>{t('parts.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}>{t('parts.noParts')}</td></tr>
            ) : (
              filtered.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.cost?.toLocaleString()}₫</td>
                  <td>{p.sellingPrice?.toLocaleString()}₫</td>
                  <td>
                    <span style={{ color: p.stockQty <= 5 ? 'var(--error)' : 'inherit', fontWeight: p.stockQty <= 5 ? 700 : 400 }}>
                      {p.stockQty}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', marginRight: '4px' }}
                      onClick={() => handleStockAdjust(p.id, 5)}
                      aria-label={`${t('parts.addStock')} ${p.name}`}
                    >
                      +5
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => handleStockAdjust(p.id, -1)}
                      aria-label={`${t('parts.removeStock')} ${p.name}`}
                    >
                      -1
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
