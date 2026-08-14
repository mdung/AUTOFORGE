import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEstimates, useInvoices } from '../hooks/useApi';
import { useAuth } from '../App';
import { FileText, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function EstimatesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: estimates = [], isLoading, isError } = useEstimates(user?.token);
  const { data: invoices = [] } = useInvoices(user?.token);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);

  if (isLoading) {
    return (
      <section aria-label="Estimates & Billing" aria-busy="true">
        <h2>Báo Giá & Hóa Đơn</h2>
        <p>{t('common.loading')}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="Estimates & Billing">
        <h2>Báo Giá & Hóa Đơn</h2>
        <p role="alert" className="text-error">{t('common.error')}</p>
      </section>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; icon: any }> = {
      'DRAFT': { bg: 'var(--table-row-stripe)', color: 'var(--text-secondary)', icon: Clock },
      'SENT': { bg: 'var(--info-glow)', color: 'var(--info)', icon: FileText },
      'APPROVED': { bg: 'var(--success-glow)', color: 'var(--success)', icon: CheckCircle },
      'PARTIALLY_APPROVED': { bg: 'var(--warning-glow)', color: 'var(--warning)', icon: AlertTriangle },
      'DECLINED': { bg: 'var(--danger-glow)', color: 'var(--danger)', icon: XCircle },
    };
    const s = styles[status] || styles['DRAFT'];
    const Icon = s.icon;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <section aria-label="Estimates & Billing">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} aria-hidden="true" /> Báo Giá & Hóa Đơn
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý báo giá sửa chữa và theo dõi thanh toán
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <article className="card" aria-label="Tổng báo giá">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--info-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} style={{ color: 'var(--info)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tổng Báo Giá</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{estimates.length}</div>
            </div>
          </div>
        </article>
        <article className="card" aria-label="Đã duyệt">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--success-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={22} style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Đã Duyệt</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{estimates.filter((e: any) => e.status === 'APPROVED' || e.status === 'PARTIALLY_APPROVED').length}</div>
            </div>
          </div>
        </article>
        <article className="card" aria-label="Chờ duyệt">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--warning-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} style={{ color: 'var(--warning)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chờ Duyệt</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{estimates.filter((e: any) => e.status === 'DRAFT' || e.status === 'SENT').length}</div>
            </div>
          </div>
        </article>
        <article className="card" aria-label="Hóa đơn">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hóa Đơn</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{invoices.length}</div>
            </div>
          </div>
        </article>
      </div>

      {/* Estimates Table */}
      <article className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Danh Sách Báo Giá</h3>
        <table aria-label="Estimates list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Lệnh SC</th>
              <th>Trạng Thái</th>
              <th>Thuế (%)</th>
              <th>Giảm Giá</th>
              <th>Tổng Tiền</th>
              <th>Ngày Tạo</th>
            </tr>
          </thead>
          <tbody>
            {estimates.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có báo giá nào</td></tr>
            ) : (
              estimates.map((est: any) => (
                <tr key={est.id} onClick={() => setSelectedEstimate(est)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{est.id?.substring(0, 8)}...</td>
                  <td style={{ fontWeight: 600, color: 'var(--info)' }}>{est.repairOrderId?.substring(0, 8)}...</td>
                  <td>{getStatusBadge(est.status)}</td>
                  <td>{((est.taxRate || 0) * 100).toFixed(0)}%</td>
                  <td>{formatCurrency(est.discountAmount || 0)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(est.totalPrice || 0)}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {est.createdAt ? new Date(est.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>

      {/* Invoices Table */}
      <article className="card">
        <h3 style={{ marginBottom: '16px' }}>Hóa Đơn Đã Phát Hành</h3>
        <table aria-label="Invoices list">
          <thead>
            <tr>
              <th>Số Hóa Đơn</th>
              <th>Lệnh SC</th>
              <th>Trạng Thái</th>
              <th>Tạm Tính</th>
              <th>Thuế</th>
              <th>Tổng Cộng</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có hóa đơn nào</td></tr>
            ) : (
              invoices.map((inv: any) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{inv.repairOrderId?.substring(0, 8)}...</td>
                  <td>{getStatusBadge(inv.status)}</td>
                  <td>{formatCurrency(inv.subtotal || 0)}</td>
                  <td>{formatCurrency(inv.tax || 0)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(inv.total || 0)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
