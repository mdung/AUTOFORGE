import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Truck, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';

export default function FleetManagerPage() {
  const { t } = useTranslation();

  const fleetVehicles = [
    { plate: '30L-99001', model: 'Hyundai Accent', company: 'Logistics Express Vietnam', mileage: 110000, nextPM: '115,000 km', status: 'DUE_FOR_SERVICE' },
    { plate: '30L-99002', model: 'Toyota Vios', company: 'Logistics Express Vietnam', mileage: 85000, nextPM: '90,000 km', status: 'HEALTHY' },
    { plate: '51K-88112', model: 'VinFast VF5', company: 'Grab Vietnam Fleet', mileage: 5000, nextPM: '12,000 km', status: 'HEALTHY' },
    { plate: '51K-88113', model: 'Kia Morning', company: 'Grab Vietnam Fleet', mileage: 62000, nextPM: '65,000 km', status: 'IN_WORKSHOP' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.fleet')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý bảo dưỡng hệ thống xe doanh nghiệp (B2B Fleet Manager) & theo dõi chỉ số chi phí vận hành
          </p>
        </div>
      </div>

      {/* Fleet KPI Overview */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Truck size={32} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tổng Đội Xe Quản Lý</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{fleetVehicles.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Xe Đạt Tiêu Chuẩn</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>2</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={32} style={{ color: 'var(--warning)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tới Hạn Bảo Dưỡng</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>1</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DollarSign size={32} style={{ color: 'var(--info)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chi Phí / km</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>1,250₫</div>
          </div>
        </div>
      </div>

      {/* Fleet Vehicles Table */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Danh Sách Phương Tiện Trong Đội Xe</h3>
        <table aria-label="Fleet vehicles list">
          <thead>
            <tr>
              <th>Biển Số</th>
              <th>Dòng Xe</th>
              <th>Công Ty Chủ Quản</th>
              <th>Odometer (km)</th>
              <th>Bảo Dưỡng Tiếp Theo</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {fleetVehicles.map((fv, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700 }}>{fv.plate}</td>
                <td>{fv.model}</td>
                <td>{fv.company}</td>
                <td>{fv.mileage.toLocaleString()} km</td>
                <td>{fv.nextPM}</td>
                <td>
                  <span className={`badge ${fv.status === 'HEALTHY' ? 'badge-completed' : (fv.status === 'DUE_FOR_SERVICE' ? 'badge-requested' : 'badge-in_progress')}`}>
                    {fv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
