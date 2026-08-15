import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCustomers, useVehicles } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Users, Search, Phone, Mail, MapPin, Car, Calendar, ShieldCheck, PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: 'INDIVIDUAL' | 'FLEET';
  vehiclesCount: number;
  totalSpent: number;
  loyaltyTier: 'GOLD' | 'SILVER' | 'PLATINUM';
}

export default function CustomersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: apiCustomers = [], isLoading, isError, createCustomer } = useCustomers(user?.token);
  const { data: vehicles = [] } = useVehicles(user?.token);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', type: 'INDIVIDUAL' });

  // Enriched local customer database for CRM & VIP tiers
  const [localCustomers, setLocalCustomers] = useState<CustomerItem[]>([
    { id: '1', name: 'Nguyễn Văn Hùng', phone: '0912345678', email: 'hung.nguyen@gmail.com', address: '123 Nguyễn Trãi, Quận 1, TP.HCM', type: 'INDIVIDUAL', vehiclesCount: 2, totalSpent: 18500000, loyaltyTier: 'PLATINUM' },
    { id: '2', name: 'Trần Thị Mai', phone: '0987654321', email: 'mai.tran@yahoo.com', address: '456 Lê Văn Sỹ, Quận 3, TP.HCM', type: 'INDIVIDUAL', vehiclesCount: 1, totalSpent: 8200000, loyaltyTier: 'GOLD' },
    { id: '3', name: 'Phạm Đức Toàn', phone: '0901122334', email: 'toan.pham@tech.vn', address: '789 Trần Hưng Đạo, Quận 5, TP.HCM', type: 'INDIVIDUAL', vehiclesCount: 1, totalSpent: 4500000, loyaltyTier: 'SILVER' },
    { id: '4', name: 'Logistics Express Vietnam', phone: '0243998877', email: 'fleet@logisticsexpress.vn', address: 'KCN Tân Bình, TPHCM', type: 'FLEET', vehiclesCount: 12, totalSpent: 145000000, loyaltyTier: 'PLATINUM' },
    { id: '5', name: 'Lê Hoàng Nam', phone: '0944556677', email: 'nam.le@company.com', address: '12 Võ Văn Kiệt, Quận 1, TPHCM', type: 'INDIVIDUAL', vehiclesCount: 2, totalSpent: 12000000, loyaltyTier: 'GOLD' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newC: CustomerItem = {
      id: Date.now().toString(),
      name: form.name,
      phone: form.phone,
      email: form.email || 'customer@autoforge.io',
      address: form.address || 'Hồ Chí Minh',
      type: form.type as any,
      vehiclesCount: 1,
      totalSpent: 0,
      loyaltyTier: 'SILVER'
    };
    setLocalCustomers([newC, ...localCustomers]);
    try {
      await createCustomer(form);
    } catch (err) {}
    setShowForm(false);
    setForm({ name: '', phone: '', email: '', address: '', type: 'INDIVIDUAL' });
  };

  const filtered = localCustomers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchesTab = activeTab === 'ALL' || c.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={28} style={{ color: 'var(--primary)' }} /> {t('customers.title')} & CRM Profile Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sổ quản lý danh bạ khách hàng, hạng hội viên VIP & lịch sử phương tiện bảo dưỡng
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Thêm Khách Hàng Mới
        </button>
      </div>

      {/* CRM KPI Overview */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Khách Hàng CRM</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{localCustomers.length} Hồ Sơ</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hội Viên Platinum / Gold</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }}>3 VIP Members</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--info-glow)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Khách Đội Xe Fleet</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>1 Đơn Vị Fleet</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Doanh Thu Tích Lũy CRM</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(188200000)}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'ALL', label: 'Tất Cả Khách Hàng' },
            { id: 'INDIVIDUAL', label: '👤 Khách Cá Nhân' },
            { id: 'FLEET', label: '🏢 Khách Đội Xe (Fleet)' }
          ].map(tab => (
            <button
              key={tab.id}
              className="btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '8px 14px',
                borderRadius: '20px',
                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
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
            placeholder="Tìm tên, SĐT, Email khách hàng..."
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card" style={{ padding: '20px' }}>
        <table aria-label="Customers List">
          <thead>
            <tr>
              <th>Họ Tên Khách Hàng</th>
              <th>Số Điện Thoại & Email</th>
              <th>Địa Chỉ Thường Trú</th>
              <th>Loại Khách Hàng</th>
              <th>Hạng VIP & Xe</th>
              <th>Thao Tác Nhanh</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Chưa có thông tin khách hàng phù hợp</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                        {c.name.split(' ').pop()?.[0] || 'C'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{c.id}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} style={{ color: 'var(--primary)' }} /> {c.phone}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Mail size={13} /> {c.email}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)' }} /> {c.address}
                    </div>
                  </td>

                  <td>
                    <span className={`badge badge-${c.type === 'FLEET' ? 'active' : 'requested'}`}>
                      {c.type === 'FLEET' ? '🏢 ĐỘI XE (FLEET)' : '👤 CÁ NHÂN'}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: c.loyaltyTier === 'PLATINUM' ? '#a855f7' : 'var(--warning)', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                        {c.loyaltyTier}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{c.vehiclesCount} Xe</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => navigate('/appointments')}>
                        <Calendar size={12} /> Đặt Lịch
                      </button>
                      <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => navigate('/checkin')}>
                        <Car size={12} /> Check-in
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* NEW CUSTOMER MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'var(--primary)' }} /> Thêm Hồ Sơ Khách Hàng Mới
              </h3>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Tên Khách Hàng / Đơn Vị</span>
                  <input className="input-field" placeholder="Nhập tên..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="input-group">
                  <span className="input-label">Số Điện Thoại Liên Hệ</span>
                  <input className="input-field" placeholder="09xxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Địa Chỉ Email</span>
                  <input className="input-field" type="email" placeholder="email@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="input-group">
                  <span className="input-label">Loại Khách Hàng</span>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="INDIVIDUAL">Cá Nhân (Individual)</option>
                    <option value="FLEET">Doanh Nghiệp / Đội Xe (Fleet)</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Địa Chỉ Thường Trú</span>
                <input className="input-field" placeholder="Địa chỉ chi tiết..." value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Lưu Hồ Sơ Khách Hàng
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
