import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppointments, useCustomers, useVehicles } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Calendar, Clock, CheckCircle2, AlertTriangle, Search, Filter, Phone, UserCheck, ArrowRight, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LocalAppt {
  id: string;
  customerName: string;
  phone: string;
  vehicleDesc: string;
  licensePlate: string;
  date: string;
  time: string;
  type: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'ARRIVED' | 'CANCELLED';
}

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: apiAppointments = [], isLoading, isError, createAppointment } = useAppointments(user?.token);
  const { data: customers = [] } = useCustomers(user?.token);
  const { data: vehicles = [] } = useVehicles(user?.token);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerId: '', vehicleId: '', date: '', time: '09:00', type: 'Periodic Maintenance' });

  // Enriched local state for interactive status changes & demo richness
  const [localAppts, setLocalAppts] = useState<LocalAppt[]>([
    { id: '1', customerName: 'Nguyễn Văn Hùng', phone: '0912345678', vehicleDesc: 'Toyota Camry 2.5Q', licensePlate: '30A-12345', date: '2026-08-16', time: '08:30', type: 'Periodic Maintenance', status: 'CONFIRMED' },
    { id: '2', customerName: 'Trần Thị Mai', phone: '0987654321', vehicleDesc: 'Honda CR-V 2.4 Turbo', licensePlate: '30F-56789', date: '2026-08-16', time: '10:00', type: 'Brake Inspection', status: 'ARRIVED' },
    { id: '3', customerName: 'Phạm Đức Toàn', phone: '0901122334', vehicleDesc: 'Hyundai Tucson 2.0', licensePlate: '51G-11223', date: '2026-08-16', time: '11:00', type: 'A/C Diagnostic & Repair', status: 'REQUESTED' },
    { id: '4', customerName: 'Lê Hoàng Nam', phone: '0944556677', vehicleDesc: 'VinFast VF8 Plus EV', licensePlate: '29A-67890', date: '2026-08-16', time: '14:00', type: 'EV Battery Check', status: 'CONFIRMED' },
    { id: '5', customerName: 'Hoàng Minh Đức', phone: '0933445566', vehicleDesc: 'Mercedes-Benz C200', licensePlate: '30H-78901', date: '2026-08-17', time: '08:00', type: 'Periodic Maintenance', status: 'REQUESTED' },
    { id: '6', customerName: 'Bùi Thanh Sơn', phone: '0977889900', vehicleDesc: 'Kia Seltos 1.4 Premium', licensePlate: '51F-22334', date: '2026-08-17', time: '10:30', type: 'Tire Replacement', status: 'CONFIRMED' },
    { id: '7', customerName: 'Logistics Express Vietnam', phone: '0243998877', vehicleDesc: 'Hyundai Accent Fleet', licensePlate: '301-99001', date: '2026-08-17', time: '07:30', type: 'Fleet Maintenance', status: 'REQUESTED' },
    { id: '8', customerName: 'Vũ Thị Lan Anh', phone: '0911223344', vehicleDesc: 'Ford Ranger Wildtrak', licensePlate: '51C-33445', date: '2026-08-18', time: '09:00', type: 'Engine Diagnosis', status: 'ARRIVED' }
  ]);

  const updateStatus = (id: string, newStatus: LocalAppt['status']) => {
    setLocalAppts(localAppts.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c: any) => c.id === form.customerId);
    const vehicle = vehicles.find((v: any) => v.id === form.vehicleId);

    const newAppt: LocalAppt = {
      id: Date.now().toString(),
      customerName: customer?.name || 'Khách Hàng Mới',
      phone: customer?.phone || '0900000000',
      vehicleDesc: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Phương Tiện Check-in',
      licensePlate: vehicle?.licensePlate || '30A-99999',
      date: form.date || new Date().toISOString().split('T')[0],
      time: form.time,
      type: form.type,
      status: 'REQUESTED'
    };

    setLocalAppts([newAppt, ...localAppts]);

    try {
      await createAppointment({
        customerName: newAppt.customerName,
        vehicleDesc: `${newAppt.vehicleDesc} (${newAppt.licensePlate})`,
        date: newAppt.date,
        time: newAppt.time,
        type: newAppt.type,
        status: 'REQUESTED'
      });
    } catch (err) {}

    setShowForm(false);
    setForm({ customerId: '', vehicleId: '', date: '', time: '09:00', type: 'Periodic Maintenance' });
  };

  const filteredAppts = localAppts.filter(a => {
    const matchesSearch = 
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.vehicleDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery);

    const matchesFilter = activeFilter === 'ALL' || a.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const arrivedCount = localAppts.filter(a => a.status === 'ARRIVED').length;
  const confirmedCount = localAppts.filter(a => a.status === 'CONFIRMED').length;
  const requestedCount = localAppts.filter(a => a.status === 'REQUESTED').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={28} style={{ color: 'var(--primary)' }} /> {t('appointments.title')} - Booking & Reception Dispatch
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý lịch hẹn đặt trước, đón tiếp phương tiện vào xưởng & tiếp nhận nhanh
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Đặt Lịch Hẹn Đón Tiếp Mới
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Lịch Hẹn Đã Đặt</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{localAppts.length} Lịch Hẹn</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Xe Đã Đến Xưởng</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>{arrivedCount} Xe</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--info-glow)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Lịch Đã Xác Nhận</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{confirmedCount} Lịch</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Chờ Xác Nhận</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>{requestedCount} Lịch</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'ALL', label: 'Tất Cả Lịch' },
            { id: 'REQUESTED', label: '🟡 Chờ Duyệt (Requested)' },
            { id: 'CONFIRMED', label: '🔵 Đã Xác Nhận (Confirmed)' },
            { id: 'ARRIVED', label: '🟢 Đã Đến Xưởng (Arrived)' }
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
                border: '1px solid var(--border-color)',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="input-field" 
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, SĐT, biển số..."
          />
        </div>
      </div>

      {/* Appointments List Table */}
      <div className="card" style={{ padding: '20px' }}>
        <table aria-label="Appointments Schedule List">
          <thead>
            <tr>
              <th>Khách Hàng</th>
              <th>Phương Tiện & Biển Số</th>
              <th>Ngày & Khung Giờ</th>
              <th>Hạng Mục Yêu Cầu</th>
              <th>Trạng Thái</th>
              <th>Thao Tác Đón Tiếp</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppts.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Không tìm thấy lịch hẹn phù hợp</td></tr>
            ) : (
              filteredAppts.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{appt.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Phone size={12} /> {appt.phone}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{appt.vehicleDesc}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                      {appt.licensePlate}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--primary)' }} /> {appt.date}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock size={12} /> Khung giờ: <strong>{appt.time}</strong>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, backgroundColor: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      {appt.type}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                      <span className={`badge badge-${appt.status.toLowerCase()}`} style={{ fontSize: '0.75rem' }}>
                        {appt.status === 'CONFIRMED' ? '🔵 Đã Xác Nhận' : (appt.status === 'ARRIVED' ? '🟢 Đã Đến Xưởng' : '🟡 Chờ Xác Nhận')}
                      </span>

                      {/* Quick status switcher */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        {appt.status !== 'CONFIRMED' && (
                          <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.68rem' }} onClick={() => updateStatus(appt.id, 'CONFIRMED')}>
                            ✓ Duyệt
                          </button>
                        )}
                        {appt.status !== 'ARRIVED' && (
                          <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.68rem' }} onClick={() => updateStatus(appt.id, 'ARRIVED')}>
                            🚗 Đến Xưởng
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                      onClick={() => navigate('/checkin')}
                    >
                      Check-in Ngay →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* NEW APPOINTMENT MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} style={{ color: 'var(--primary)' }} /> Đặt Lịch Hẹn Đón Tiếp Mới
              </h3>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="input-group">
                <span className="input-label">Khách Hàng Đặt Lịch</span>
                <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required>
                  <option value="">-- Chọn khách hàng từ danh sách --</option>
                  {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
              </div>

              <div className="input-group">
                <span className="input-label">Phương Tiện Check-in</span>
                <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} required>
                  <option value="">-- Chọn phương tiện --</option>
                  {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
                </select>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Ngày Khám Xe</span>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="input-group">
                  <span className="input-label">Giờ Đón Tiếp</span>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Hạng Mục Sửa Chữa / Cấp Dưỡng</span>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="Periodic Maintenance">Bảo Dưỡng Định Kỳ (Periodic Maintenance)</option>
                  <option value="A/C Diagnostic & Repair">Sửa Chữa Điều Hòa (A/C Repair)</option>
                  <option value="Brake Inspection">Kiểm Tra Phanh (Brake Inspection)</option>
                  <option value="Engine Diagnosis">Chẩn Đoán Động Cơ (Engine Diagnosis)</option>
                  <option value="EV Battery Check">Kiểm Tra Pin Xe Điện (EV Check)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                  Tạo Lịch Hẹn Đón Tiếp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
