import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppointments, useCustomers, useVehicles } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Calendar } from 'lucide-react';

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: appointments = [], isLoading, isError, createAppointment } = useAppointments(user?.token);
  const { data: customers = [] } = useCustomers(user?.token);
  const { data: vehicles = [] } = useVehicles(user?.token);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerId: '', vehicleId: '', date: '', time: '', type: 'Periodic Maintenance' });

  if (isLoading) {
    return (
      <section aria-label={t('appointments.title')} aria-busy="true">
        <h2>{t('appointments.title')}</h2>
        <p>{t('common.loading')}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label={t('appointments.title')}>
        <h2>{t('appointments.title')}</h2>
        <p role="alert" className="text-error">{t('common.error')}</p>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c: any) => c.id === form.customerId);
    const vehicle = vehicles.find((v: any) => v.id === form.vehicleId);
    await createAppointment({
      customerName: customer?.name || '',
      vehicleDesc: `${vehicle?.make} ${vehicle?.model} (${vehicle?.licensePlate})`,
      date: form.date,
      time: form.time,
      type: form.type,
      status: 'REQUESTED'
    });
    setShowForm(false);
    setForm({ customerId: '', vehicleId: '', date: '', time: '', type: 'Periodic Maintenance' });
  };

  return (
    <section aria-label={t('appointments.title')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2><Calendar size={20} aria-hidden="true" /> {t('appointments.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          aria-label={t('appointments.newAppointment')}
        >
          <Plus size={16} /> {t('appointments.newAppointment')}
        </button>
      </div>

      {showForm && (
        <article className="card" style={{ marginBottom: '16px' }} aria-label={t('appointments.newAppointment')}>
          <h3>{t('appointments.newAppointment')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
              <div>
                <label htmlFor="appt-customer">{t('common.customer')}</label>
                <select
                  id="appt-customer"
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  required
                  aria-required="true"
                >
                  <option value="">{t('appointments.selectCustomer')}</option>
                  {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="appt-vehicle">{t('common.vehicle')}</label>
                <select
                  id="appt-vehicle"
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  required
                  aria-required="true"
                >
                  <option value="">{t('appointments.selectVehicle')}</option>
                  {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="appt-date">{t('appointments.date')}</label>
                <input
                  id="appt-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="appt-time">{t('appointments.time')}</label>
                <input
                  id="appt-time"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="appt-type">{t('appointments.serviceType')}</label>
                <select
                  id="appt-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Periodic Maintenance</option>
                  <option>AC Diagnostic</option>
                  <option>Brake Replacement</option>
                  <option>Engine Repair</option>
                  <option>Body & Paint</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" aria-label={t('appointments.create')}>
              {t('appointments.create')}
            </button>
          </form>
        </article>
      )}

      <article className="card">
        <table aria-label={t('appointments.title')} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>{t('common.customer')}</th>
              <th>{t('common.vehicle')}</th>
              <th>{t('appointments.date')}</th>
              <th>{t('appointments.time')}</th>
              <th>{t('appointments.serviceType')}</th>
              <th>{t('common.status')}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={6}>{t('appointments.noAppointments')}</td></tr>
            ) : (
              appointments.map((appt: any) => (
                <tr key={appt.id}>
                  <td>{appt.customerName}</td>
                  <td>{appt.vehicleDesc}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>{appt.type}</td>
                  <td><span className={`badge badge-${appt.status?.toLowerCase()}`}>{appt.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
