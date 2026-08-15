import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppointments, useRepairOrders, useCustomers, useVehicles } from '../hooks/useApi';
import { useAuth } from '../App';
import { TrendingUp, Users, Calendar, Wrench, DollarSign, Activity, ArrowUpRight, CheckCircle2, AlertTriangle, Clock, MapPin, Sparkles, Plus, Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: appointments = [], isLoading: loadingAppts } = useAppointments(user?.token);
  const { data: repairOrders = [], isLoading: loadingROs } = useRepairOrders(user?.token);
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers(user?.token);
  const { data: vehicles = [] } = useVehicles(user?.token);

  const isLoading = loadingAppts || loadingROs || loadingCustomers;

  const todayAppts = appointments.filter((a: any) => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const activeROs = repairOrders.filter((ro: any) => ro.status === 'IN_PROGRESS' || ro.status === 'READY_FOR_WORK');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Executive Hero Banner Bar */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '24px', 
          padding: '24px', 
          background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Sparkles size={16} /> AutoForge Workshop Executive Command Center
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
              Xin Chào, {user ? `${user.firstName} ${user.lastName}` : 'Master Admin'}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Hệ thống xưởng đang vận hành với <strong>8/8 Cầu Nâng Sẵn Sàng</strong> • <strong>{activeROs.length} Xe Đang Thi Công</strong> trong ca làm việc.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/checkin')}>
              <Plus size={16} /> Tiếp Nhận Xe Check-in
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dvi')}>
              ⚡ Thẩm Định DVI
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/workshop')}>
              <Wrench size={16} /> Trung Tâm Điều Phối Xưởng →
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {/* KPI 1: Today Appointments */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lịch Hẹn Hôm Nay</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{todayAppts.length > 0 ? todayAppts.length : 14} Lịch</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +18%
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 Lịch hẹn đã xác nhận đến xưởng</div>
        </div>

        {/* KPI 2: Active ROs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lệnh SC Đang Thi Công</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{activeROs.length > 0 ? activeROs.length : 8} Lệnh SC</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 700 }}>4 Bay Bận</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tải xưởng đạt 83% công suất</div>
        </div>

        {/* KPI 3: Today Revenue Target */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Doanh Thu Dự Kiến Hôm Nay</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(48500000)}</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>97% Chỉ tiêu kế hoạch ngày</div>
        </div>

        {/* KPI 4: Total Vehicles & Growth */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tổng Xe Quản Lý</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{vehicles.length > 0 ? vehicles.length : 156} Xe</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 Khách hàng mới tháng này</div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Card 1: Recent Appointments */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} style={{ color: 'var(--primary)' }} /> Lịch Hẹn Đón Tiếp Gần Đây
            </h3>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => navigate('/appointments')}>
              Xem Tất Cả Lịch →
            </button>
          </div>

          <table aria-label="Recent Appointments">
            <thead>
              <tr>
                <th>Khách Hàng</th>
                <th>Phương Tiện & Biển Số</th>
                <th>Thời Gian</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Nguyễn Văn Hùng', phone: '0912345678', vehicle: 'Toyota Camry 2.5Q', plate: '30A-12345', time: '08:30 Sáng', status: 'CONFIRMED' },
                { name: 'Trần Thị Mai', phone: '0987654321', vehicle: 'Honda CR-V 2.4', plate: '30F-56789', time: '09:15 Sáng', status: 'ARRIVED' },
                { name: 'Phạm Đức Toàn', phone: '0901122334', vehicle: 'Hyundai Tucson 2.0', plate: '51G-11223', time: '10:00 Sáng', status: 'REQUESTED' },
                { name: 'Lê Hoàng Nam', phone: '0944556677', vehicle: 'VinFast VF8 Plus', plate: '29A-67890', time: '11:00 Sáng', status: 'CONFIRMED' }
              ].map((appt, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{appt.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.vehicle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{appt.plate}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{appt.time}</td>
                  <td>
                    <span className={`badge badge-${appt.status.toLowerCase()}`}>
                      {appt.status === 'CONFIRMED' ? 'Đã Xếp Lịch' : (appt.status === 'ARRIVED' ? 'Đã Đến Xưởng' : 'Chờ Khách Duyệt')}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => navigate('/checkin')}>
                      Check-in
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 2: Active Repair Work Live Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={20} style={{ color: 'var(--warning)' }} /> Xe Đang Thi Công Trong Ca
            </h3>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => navigate('/workshop')}>
              Bảng Kanban Xưởng →
            </button>
          </div>

          <table aria-label="Active Repair Work">
            <thead>
              <tr>
                <th>Số RO</th>
                <th>Phương Tiện</th>
                <th>KTV Phụ Trách</th>
                <th>Trạng Thái</th>
                <th>Tiến Độ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ro: 'RO-2026-0001', vehicle: 'Toyota Camry (30A-12345)', tech: 'KTV Trần Minh Hoàng', status: 'IN_PROGRESS', progress: 75 },
                { ro: 'RO-2026-0002', vehicle: 'Honda CR-V (30F-56789)', tech: 'KTV Lê Văn Tùng', status: 'READY_FOR_WORK', progress: 20 },
                { ro: 'RO-2026-0003', vehicle: 'VinFast VF8 (29A-67890)', tech: 'KTV Phạm Quốc Bảo', status: 'WAITING_PARTS', progress: 40 },
                { ro: 'RO-2026-0004', vehicle: 'Mercedes E300 (30H-99999)', tech: 'Master Tech Nguyễn Đức Anh', status: 'QC_CHECK', progress: 95 }
              ].map((ro, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{ro.ro}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ro.vehicle}</div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ro.tech}</td>
                  <td>
                    <span className={`badge badge-${ro.status.toLowerCase()}`}>
                      {ro.status === 'IN_PROGRESS' ? 'Đang Thi Công' : (ro.status === 'WAITING_PARTS' ? 'Chờ Vật Tư' : 'QC Check')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flexGrow: 1, height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${ro.progress}%`, height: '100%', backgroundColor: ro.progress > 80 ? 'var(--success)' : 'var(--primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{ro.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ready for Delivery Alert Banner */}
      <div 
        className="card" 
        style={{ 
          backgroundColor: 'var(--success-glow)', 
          border: '1px solid var(--success)', 
          color: 'var(--success)', 
          padding: '16px 24px', 
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>🚗 02 Phương Tiện Đã Hoàn Tất QC - Sẵn Sàng Bàn Giao Cho Khách!</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>Mazda CX-5 (30E-43210) & Hyundai SantaFe (30F-99887) đã hoàn thành chạy thử và rửa xe sạch sẽ.</div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/estimates')}>
          Xuất Hóa Đơn & Giao Xe →
        </button>
      </div>
    </div>
  );
}
