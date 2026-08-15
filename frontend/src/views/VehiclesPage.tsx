import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVehicles, useCustomers } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Car, Search, Gauge, ShieldCheck, Zap, User, ArrowRight, ClipboardList, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LocalVehicle {
  id: string;
  licensePlate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  engineType: 'ICE' | 'EV' | 'HYBRID';
  color: string;
  ownerName: string;
  lastServiceDate: string;
  status: 'IN_WORKSHOP' | 'READY_DELIVERY' | 'IDLE';
}

export default function VehiclesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: apiVehicles = [], isLoading, isError, createVehicle } = useVehicles(user?.token);
  const { data: customers = [] } = useCustomers(user?.token);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ownerId: '', licensePlate: '', vin: '', make: '', model: '',
    year: new Date().getFullYear(), mileage: 35000, engineType: 'ICE', color: 'Trắng Pearl'
  });

  // Enriched local vehicle ledger for high-tech garage management
  const [localVehicles, setLocalVehicles] = useState<LocalVehicle[]>([
    { id: '1', licensePlate: '30A-12345', vin: 'VN1234567890CAMRY', make: 'Toyota', model: 'Camry 2.5Q', year: 2022, mileage: 35000, engineType: 'ICE', color: 'Đen Trát', ownerName: 'Nguyễn Văn Hùng', lastServiceDate: '2026-08-16', status: 'IN_WORKSHOP' },
    { id: '2', licensePlate: '30F-56789', vin: 'VN9876543210CRV', make: 'Honda', model: 'CR-V 2.4 Turbo', year: 2021, mileage: 48000, engineType: 'ICE', color: 'Trắng Ngọc Trai', ownerName: 'Trần Thị Mai', lastServiceDate: '2026-08-16', status: 'IN_WORKSHOP' },
    { id: '3', licensePlate: '29A-67890', vin: 'VF8EV9988776655', make: 'VinFast', model: 'VF8 Plus EV', year: 2023, mileage: 18500, engineType: 'EV', color: 'Xanh VinFast', ownerName: 'Lê Hoàng Nam', lastServiceDate: '2026-08-15', status: 'READY_DELIVERY' },
    { id: '4', licensePlate: '30H-99999', vin: 'WDB200999887766', make: 'Mercedes-Benz', model: 'E300 AMG', year: 2023, mileage: 12000, engineType: 'HYBRID', color: 'Đen Obsidian', ownerName: 'Đặng Tuấn Anh', lastServiceDate: '2026-08-14', status: 'IN_WORKSHOP' },
    { id: '5', licensePlate: '51G-11223', vin: 'KMHTC2.0TUCSON', make: 'Hyundai', model: 'Tucson 2.0 Turbo', year: 2020, mileage: 62000, engineType: 'ICE', color: 'Đỏ Crystal', ownerName: 'Phạm Đức Toàn', lastServiceDate: '2026-08-10', status: 'IDLE' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const owner = customers.find((c: any) => c.id === form.ownerId);
    const newV: LocalVehicle = {
      id: Date.now().toString(),
      licensePlate: form.licensePlate,
      vin: form.vin || 'VIN998877665544',
      make: form.make,
      model: form.model,
      year: form.year,
      mileage: form.mileage,
      engineType: form.engineType as any,
      color: form.color,
      ownerName: owner?.name || 'Khách Hàng',
      lastServiceDate: new Date().toISOString().split('T')[0],
      status: 'IDLE'
    };
    setLocalVehicles([newV, ...localVehicles]);
    try {
      await createVehicle(form);
    } catch (err) {}
    setShowForm(false);
    setForm({ ownerId: '', licensePlate: '', vin: '', make: '', model: '', year: new Date().getFullYear(), mileage: 35000, engineType: 'ICE', color: 'Trắng Pearl' });
  };

  const filtered = localVehicles.filter((v) => {
    const matchesSearch = 
      v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      v.vin.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = activeFilter === 'ALL' || v.engineType === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const inWorkshopCount = localVehicles.filter(v => v.status === 'IN_WORKSHOP').length;
  const evCount = localVehicles.filter(v => v.engineType === 'EV' || v.engineType === 'HYBRID').length;

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
      {/* Title Header Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Car size={28} style={{ color: 'var(--primary)' }} /> {t('vehicles.title')} Ledger & Fleet Passport
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Hồ sơ kỹ thuật số phương tiện, chỉ số Odometer, động cơ Xăng/Điện EV & lịch sử bảo dưỡng
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Đăng Ký Xe Mới
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Xe Trong Sổ Ledger</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{localVehicles.length} Phương Tiện</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Xe Đang Ở Trong Xưởng</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>{inWorkshopCount} Xe Thi Công</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Xe Điện EV & Hybrid</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4' }}>{evCount} Xe EV</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gauge size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Odometer Trung Bình</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>35,200 km</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'ALL', label: 'Tất Cả Xe' },
            { id: 'ICE', label: '⛽ Động Cơ Đốt Trong (ICE)' },
            { id: 'EV', label: '⚡ Xe Điện EV' },
            { id: 'HYBRID', label: '🔋 Hybrid' }
          ].map(tab => (
            <button
              key={tab.id}
              className="btn"
              onClick={() => setActiveFilter(tab.id)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '8px 14px',
                borderRadius: '20px',
                backgroundColor: activeFilter === tab.id ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: activeFilter === tab.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="input-field" 
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm biển số, VIN, Toyota, Honda..."
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card" style={{ padding: '20px' }}>
        <table aria-label="Vehicles Ledger">
          <thead>
            <tr>
              <th>Biển Số Xe</th>
              <th>Hãng & Dòng Xe</th>
              <th>Mã VIN Khung Xe</th>
              <th>Odometer (Km)</th>
              <th>Chủ Sở Hữu</th>
              <th>Động Cơ</th>
              <th>Thao Tác Tương Tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Chưa có phương tiện phù hợp</td></tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id}>
                  <td>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--primary)' }}>
                      {v.licensePlate}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.make} {v.model}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Đời {v.year} • Màu {v.color}</div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      {v.vin}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Gauge size={14} style={{ color: 'var(--primary)' }} /> {v.mileage.toLocaleString()} km
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} /> {v.ownerName}
                    </div>
                  </td>

                  <td>
                    <span className={`badge badge-${v.engineType === 'EV' ? 'active' : 'requested'}`}>
                      {v.engineType === 'EV' ? '⚡ XE ĐIỆN EV' : (v.engineType === 'HYBRID' ? '🔋 HYBRID' : '⛽ ĐỘNG CƠ ICE')}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => navigate('/dvi')}>
                        <ClipboardList size={12} /> DVI
                      </button>
                      <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => navigate('/checkin')}>
                        Check-in
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* NEW VEHICLE MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={20} style={{ color: 'var(--primary)' }} /> Đăng Ký Phương Tiện Mới
              </h3>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Chủ Sở Hữu</span>
                  <select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} required>
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <span className="input-label">Biển Số Xe</span>
                  <input className="input-field" placeholder="VD: 30A-12345" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} required />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Hãng Xe (Make)</span>
                  <input className="input-field" placeholder="Toyota, Honda..." value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
                </div>
                <div className="input-group">
                  <span className="input-label">Dòng Xe (Model)</span>
                  <input className="input-field" placeholder="Camry, CR-V..." value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
                </div>
              </div>

              <div className="grid-3" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Năm Sản Xuất</span>
                  <input className="input-field" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} />
                </div>
                <div className="input-group">
                  <span className="input-label">Odometer (km)</span>
                  <input className="input-field" type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: parseInt(e.target.value) })} />
                </div>
                <div className="input-group">
                  <span className="input-label">Động Cơ</span>
                  <select value={form.engineType} onChange={(e) => setForm({ ...form, engineType: e.target.value })}>
                    <option value="ICE">Xăng / Dầu (ICE)</option>
                    <option value="EV">Xe Điện (EV)</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Lưu Phương Tiện
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
