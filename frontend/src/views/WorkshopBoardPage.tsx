import { useTranslation } from 'react-i18next';
import { useRepairOrders } from '../hooks/useApi';
import { useAuth } from '../App';
import { CheckSquare } from 'lucide-react';

const STATUS_COLUMNS = ['READY_FOR_WORK', 'IN_PROGRESS', 'WAITING_PARTS', 'QC_CHECK', 'COMPLETED'];

export default function WorkshopBoardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: repairOrders = [], isLoading, isError, updateROStatus } = useRepairOrders(user?.token);

  if (isLoading) {
    return (
      <section aria-label={t('workshop.title')} aria-busy="true">
        <h2>{t('workshop.title')}</h2>
        <p>{t('common.loading')}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label={t('workshop.title')}>
        <h2>{t('workshop.title')}</h2>
        <p role="alert" className="text-error">{t('common.error')}</p>
      </section>
    );
  }

  const handleStatusChange = async (roId: string, newStatus: string) => {
    await updateROStatus({ roId, status: newStatus });
  };

  return (
    <section aria-label={t('workshop.title')}>
      <h2><CheckSquare size={20} aria-hidden="true" /> {t('workshop.title')}</h2>

      <div className="grid-4" style={{ marginTop: '16px', alignItems: 'start' }} role="list" aria-label={t('workshop.kanbanBoard')}>
        {STATUS_COLUMNS.map((status) => {
          const columnROs = repairOrders.filter((ro: any) => ro.status === status);
          return (
            <article
              key={status}
              className="card"
              style={{ minHeight: '200px' }}
              role="listitem"
              aria-label={t(`workshop.status.${status}`)}
            >
              <h4 style={{ marginBottom: '12px', borderBottom: '2px solid var(--primary)', paddingBottom: '8px' }}>
                {t(`workshop.status.${status}`)} ({columnROs.length})
              </h4>
              {columnROs.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('workshop.noOrders')}</p>
              ) : (
                columnROs.map((ro: any) => (
                  <div
                    key={ro.id}
                    className="card"
                    style={{ marginBottom: '8px', padding: '10px', background: 'var(--bg-secondary, #f8f9fa)' }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ro.roNumber}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ro.vehicleDesc}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ro.customerName}</div>
                    {ro.jobs && (
                      <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                        {ro.jobs.length} {t('workshop.jobs')}
                      </div>
                    )}
                    <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {STATUS_COLUMNS.filter(s => s !== status).slice(0, 2).map((nextStatus) => (
                        <button
                          key={nextStatus}
                          className="btn btn-secondary"
                          style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                          onClick={() => handleStatusChange(ro.id, nextStatus)}
                          aria-label={`${t('workshop.moveTo')} ${t(`workshop.status.${nextStatus}`)}`}
                        >
                          → {t(`workshop.status.${nextStatus}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
