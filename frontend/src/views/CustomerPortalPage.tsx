import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, Clock, FileText, PhoneCall, ShieldCheck } from 'lucide-react';

export default function CustomerPortalPage() {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.portal')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Cổng thông tin khách hàng theo dõi tiến độ sửa chữa xe trực tuyến theo thời gian thực (Live Customer Portal)
          </p>
        </div>
      </div>

      {/* Live Repair Status Banner */}
      <div className="card" style={{ marginBottom: '24px', borderLeft: '6px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>Đang Tiến Hành Sửa Chữa</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>Toyota Camry 2.5Q • 30A-12345</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Cố vấn dịch vụ: <strong>Minh Tran (0912-345-678)</strong> | Hạn giao xe dự kiến: <strong>17:00 Hôm nay</strong>
          </div>
        </div>
        <span className="badge badge-in_progress" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
          ĐANG THỰC HIỆN (IN_PROGRESS)
        </span>
      </div>

      {/* Workflow Step Progress Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Quy Trình Sửa Chữa Trực Tuyến</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
          {[
            { label: 'Check-in Xe', done: true },
            { label: 'Kiểm Tra DVI', done: true },
            { label: 'Duyệt Báo Giá', done: true },
            { label: 'Thi Công Sửa Chữa', done: true, active: true },
            { label: 'Bàn Giao Xe', done: false }
          ].map((st, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: st.active ? 'var(--primary)' : (st.done ? 'var(--success-glow)' : 'var(--bg-surface-elevated)'),
                color: st.active ? '#fff' : (st.done ? 'var(--success)' : 'var(--text-muted)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                border: st.active ? '2px solid var(--primary)' : '1px solid var(--border-color)'
              }}>
                {st.done && !st.active ? <CheckCircle size={18} /> : idx + 1}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: st.active ? 700 : 500, color: st.active ? 'var(--primary)' : 'var(--text-secondary)' }}>
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspection & Approved Quote Summary */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: 'var(--success)' }} /> Kết Quả Kiểm Tra (DVI)
          </h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>🟢 Dầu động cơ 5W-30 Full Synthetic (Đạt)</div>
            <div>🟢 Lọc gió động cơ & cabin (Thay mới)</div>
            <div>🔴 Má phanh trước mòn nặng (Khách đã duyệt thay)</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: 'var(--info)' }} /> Tổng Chi Phí Duyệt
          </h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>
            1,290,000 ₫
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Giá đã bao gồm VAT & giảm giá 10% gói khách hàng thân thiết.
          </div>
          <button className="btn btn-secondary" style={{ marginTop: '12px', width: '100%', fontSize: '0.8rem' }}>
            <PhoneCall size={14} /> Liên Hệ Cố Vấn Dịch Vụ
          </button>
        </div>
      </div>
    </div>
  );
}
