import { useTranslation } from 'react-i18next';
import { useAppointments, useRepairOrders, useCustomers, useVehicles } from '../hooks/useApi';
import { useAuth } from '../App';
import { TrendingUp, Users, Calendar, Wrench } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: appointments = [], isLoading: loadingAppts } = useAppointments(user?.token);
  const { data: repairOrders = [], isLoading: loadingROs } = useRepairOrders(user?.token);
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers(user?.token);
  const { data: vehicles = [] } = useVehicles(user?.token);

  const isLoading = loadingAppts || loadingROs || loadingCustomers;

  if (isLoading) {
    return (
      <section aria-label={t('dashboard.title')} aria-busy="true">
        <h2>{t('dashboard.title')}</h2>
        <p>{t('common.loading')}</p>
      </section>
    );
  }

  const todayAppts = appointments.filter((a: any) => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const activeROs = repairOrders.filter((ro: any) => ro.status === 'IN_PROGRESS');

  return (
    <section aria-label={t('dashboard.title')}>
      <h2>{t('dashboard.title')}</h2>

      <div className="grid-4" role="list" aria-label={t('dashboard.kpiSection')}>
        <article className="card" role="listitem" aria-label={t('dashboard.todayAppointments')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={24} className="text-primary" aria-hidden="true" />
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t('dashboard.todayAppointments')}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{todayAppts.length}</div>
            </div>
          </div>
        </article>

        <article className="card" role="listitem" aria-label={t('dashboard.activeRepairOrders')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wrench size={24} className="text-primary" aria-hidden="true" />
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t('dashboard.activeRepairOrders')}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{activeROs.length}</div>
            </div>
          </div>
        </article>

        <article className="card" role="listitem" aria-label={t('dashboard.totalCustomers')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={24} className="text-primary" aria-hidden="true" />
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t('dashboard.totalCustomers')}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{customers.length}</div>
            </div>
          </div>
        </article>

        <article className="card" role="listitem" aria-label={t('dashboard.totalVehicles')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp size={24} className="text-primary" aria-hidden="true" />
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t('dashboard.totalVehicles')}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{vehicles.length}</div>
            </div>
          </div>
        </article>
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <article className="card" aria-label={t('dashboard.recentAppointments')}>
          <h3>{t('dashboard.recentAppointments')}</h3>
          {appointments.length === 0 ? (
            <p>{t('dashboard.noAppointments')}</p>
          ) : (
            <table aria-label={t('dashboard.recentAppointments')} style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>{t('common.customer')}</th>
                  <th>{t('common.vehicle')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appt: any) => (
                  <tr key={appt.id}>
                    <td>{appt.customerName}</td>
                    <td>{appt.vehicleDesc}</td>
                    <td><span className={`badge badge-${appt.status?.toLowerCase()}`}>{String(t(`status.${appt.status}`, appt.status || ''))}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="card" aria-label={t('dashboard.activeWork')}>
          <h3>{t('dashboard.activeWork')}</h3>
          {repairOrders.length === 0 ? (
            <p>{t('dashboard.noActiveWork')}</p>
          ) : (
            <table aria-label={t('dashboard.activeWork')} style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>{t('workshop.roNumber')}</th>
                  <th>{t('common.vehicle')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {repairOrders.slice(0, 5).map((ro: any) => (
                  <tr key={ro.id}>
                    <td>{ro.roNumber}</td>
                    <td>{ro.vehicleDesc}</td>
                    <td><span className={`badge badge-${ro.status?.toLowerCase()}`}>{String(t(`status.${ro.status}`, ro.status || ''))}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </div>
    </section>
  );
}
