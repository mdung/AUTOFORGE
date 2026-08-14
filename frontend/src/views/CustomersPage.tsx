import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCustomers } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Users, Search } from 'lucide-react';

export default function CustomersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: customers = [], isLoading, isError, createCustomer } = useCustomers(user?.token);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', type: 'INDIVIDUAL' });

  if (isLoading) {
    return (
      <section aria-label={t('customers.title')} aria-busy="true">
        <h2>{t('customers.title')}</h2>
        <p>{t('common.loading')}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label={t('customers.title')}>
        <h2>{t('customers.title')}</h2>
        <p role="alert" className="text-error">{t('common.error')}</p>
      </section>
    );
  }

  const filtered = customers.filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCustomer(form);
    setShowForm(false);
    setForm({ name: '', phone: '', email: '', address: '', type: 'INDIVIDUAL' });
  };

  return (
    <section aria-label={t('customers.title')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2><Users size={20} aria-hidden="true" /> {t('customers.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          aria-label={t('customers.addCustomer')}
        >
          <Plus size={16} /> {t('customers.addCustomer')}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder={t('customers.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('customers.searchPlaceholder')}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {showForm && (
        <article className="card" style={{ marginBottom: '16px' }} aria-label={t('customers.addCustomer')}>
          <h3>{t('customers.addCustomer')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
              <div>
                <label htmlFor="cust-name">{t('customers.name')}</label>
                <input
                  id="cust-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="cust-phone">{t('customers.phone')}</label>
                <input
                  id="cust-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="cust-email">{t('customers.email')}</label>
                <input
                  id="cust-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="cust-address">{t('customers.address')}</label>
                <input
                  id="cust-address"
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="cust-type">{t('customers.type')}</label>
                <select
                  id="cust-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="INDIVIDUAL">{t('customers.individual')}</option>
                  <option value="FLEET">{t('customers.fleet')}</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" aria-label={t('common.save')}>
              {t('common.save')}
            </button>
          </form>
        </article>
      )}

      <article className="card">
        <table aria-label={t('customers.title')} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>{t('customers.name')}</th>
              <th>{t('customers.phone')}</th>
              <th>{t('customers.email')}</th>
              <th>{t('customers.address')}</th>
              <th>{t('customers.type')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5}>{t('customers.noCustomers')}</td></tr>
            ) : (
              filtered.map((c: any) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{c.address}</td>
                  <td><span className="badge">{c.type}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
