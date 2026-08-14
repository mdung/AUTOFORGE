import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVehicles, useCustomers } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Wrench, Search } from 'lucide-react';

export default function VehiclesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: vehicles = [], isLoading, isError, createVehicle } = useVehicles(user?.token);
  const { data: customers = [] } = useCustomers(user?.token);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    ownerId: '', licensePlate: '', vin: '', make: '', model: '',
    year: new Date().getFullYear(), mileage: 0, engineType: 'ICE', color: ''
  });

  if (isLoading) {
    return (
      <section aria-label={t('vehicles.title')} aria-busy="true">
        <h2>{t('vehicles.title')}</h2>
        <p>{t('common.loading')}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label={t('vehicles.title')}>
        <h2>{t('vehicles.title')}</h2>
        <p role="alert" className="text-error">{t('common.error')}</p>
      </section>
    );
  }

  const filtered = vehicles.filter((v: any) =>
    v.licensePlate?.toLowerCase().includes(search.toLowerCase()) ||
    v.vin?.toLowerCase().includes(search.toLowerCase()) ||
    v.make?.toLowerCase().includes(search.toLowerCase()) ||
    v.model?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVehicle(form);
    setShowForm(false);
    setForm({ ownerId: '', licensePlate: '', vin: '', make: '', model: '', year: new Date().getFullYear(), mileage: 0, engineType: 'ICE', color: '' });
  };

  return (
    <section aria-label={t('vehicles.title')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2><Wrench size={20} aria-hidden="true" /> {t('vehicles.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          aria-label={t('vehicles.addVehicle')}
        >
          <Plus size={16} /> {t('vehicles.addVehicle')}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder={t('vehicles.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('vehicles.searchPlaceholder')}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {showForm && (
        <article className="card" style={{ marginBottom: '16px' }} aria-label={t('vehicles.addVehicle')}>
          <h3>{t('vehicles.addVehicle')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
              <div>
                <label htmlFor="veh-owner">{t('vehicles.owner')}</label>
                <select
                  id="veh-owner"
                  value={form.ownerId}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                  required
                  aria-required="true"
                >
                  <option value="">{t('vehicles.selectOwner')}</option>
                  {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="veh-plate">{t('vehicles.licensePlate')}</label>
                <input
                  id="veh-plate"
                  type="text"
                  value={form.licensePlate}
                  onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="veh-vin">{t('vehicles.vin')}</label>
                <input
                  id="veh-vin"
                  type="text"
                  value={form.vin}
                  onChange={(e) => setForm({ ...form, vin: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="veh-make">{t('vehicles.make')}</label>
                <input
                  id="veh-make"
                  type="text"
                  value={form.make}
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="veh-model">{t('vehicles.model')}</label>
                <input
                  id="veh-model"
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="veh-year">{t('vehicles.year')}</label>
                <input
                  id="veh-year"
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="veh-mileage">{t('vehicles.mileage')}</label>
                <input
                  id="veh-mileage"
                  type="number"
                  value={form.mileage}
                  onChange={(e) => setForm({ ...form, mileage: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="veh-color">{t('vehicles.color')}</label>
                <input
                  id="veh-color"
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
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
        <table aria-label={t('vehicles.title')} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>{t('vehicles.licensePlate')}</th>
              <th>{t('vehicles.make')}</th>
              <th>{t('vehicles.model')}</th>
              <th>{t('vehicles.year')}</th>
              <th>{t('vehicles.mileage')}</th>
              <th>{t('vehicles.owner')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}>{t('vehicles.noVehicles')}</td></tr>
            ) : (
              filtered.map((v: any) => (
                <tr key={v.id}>
                  <td>{v.licensePlate}</td>
                  <td>{v.make}</td>
                  <td>{v.model}</td>
                  <td>{v.year}</td>
                  <td>{v.mileage?.toLocaleString()} km</td>
                  <td>{v.ownerName || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
