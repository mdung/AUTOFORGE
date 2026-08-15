import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRepairOrders } from '../hooks/useApi';
import { useAuth } from '../App';
import { LayoutGrid, Clock, Wrench, CheckCircle2, AlertTriangle, UserCheck, ShieldAlert, Plus, Search, Filter, Play, Check, ChevronRight, User, Package, ShieldCheck } from 'lucide-react';

const STATUS_COLUMNS = [
  { id: 'READY_FOR_WORK', title: 'Sẵn Sàng Sửa Chữa', icon: Clock, color: 'var(--info)' },
  { id: 'IN_PROGRESS', title: 'Đang Thi Công', icon: Wrench, color: 'var(--primary)' },
  { id: 'WAITING_PARTS', title: 'Chờ Vật Tư', icon: AlertTriangle, color: 'var(--warning)' },
  { id: 'QC_CHECK', title: 'Kiểm Tra QC', icon: ShieldCheck, color: '#a855f7' },
  { id: 'COMPLETED', title: 'Hoàn Thành & Giao Xe', icon: CheckCircle2, color: 'var(--success)' }
];

interface MockRO {
  id: string;
  roNumber: string;
  vehicleDesc: string;
  licensePlate: string;
  customerName: string;
  status: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  bayNumber: string;
  technician: string;
  estimatedTimeLeft: string;
  jobsCount: number;
  completedJobs: number;
  totalAmount: number;
}

export default function WorkshopBoardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: repairOrders = [], isLoading, isError, updateROStatus } = useRepairOrders(user?.token);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRO, setSelectedRO] = useState<MockRO | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  // Enriched local state for high-tech workshop cards
  const [localROs, setLocalROs] = useState<MockRO[]>([
    {
      id: 'ro-1',
      roNumber: 'RO-2026-0001',
      vehicleDesc: 'Toyota Camry 2.5Q (2022)',
      licensePlate: '30A-12345',
      customerName: 'Nguyễn Văn Hùng',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      bayNumber: 'Bay #02 (Cầu nâng 2 trụ)',
      technician: 'KTV Trần Minh Hoàng',
      estimatedTimeLeft: '45 phút',
      jobsCount: 4,
      completedJobs: 3,
      totalAmount: 3450000
    },
    {
      id: 'ro-2',
      roNumber: 'RO-2026-0002',
      vehicleDesc: 'Honda CR-V 2.4 Turbo',
      licensePlate: '30F-56789',
      customerName: 'Trần Thị Mai',
      status: 'READY_FOR_WORK',
      priority: 'MEDIUM',
      bayNumber: 'Bay #01 (Khu chẩn đoán)',
      technician: 'KTV Lê Văn Tùng',
      estimatedTimeLeft: '1 giờ 30 phút',
      jobsCount: 3,
      completedJobs: 0,
      totalAmount: 1850000
    },
    {
      id: 'ro-3',
      roNumber: 'RO-2026-0003',
      vehicleDesc: 'VinFast VF8 Plus EV',
      licensePlate: '29A-67890',
      customerName: 'Lê Hoàng Nam',
      status: 'WAITING_PARTS',
      priority: 'HIGH',
      bayNumber: 'Bay #04 (Khu xe điện EV)',
      technician: 'KTV Phạm Quốc Bảo',
      estimatedTimeLeft: 'Đang chờ giao má phanh',
      jobsCount: 5,
      completedJobs: 2,
      totalAmount: 5200000
    },
    {
      id: 'ro-4',
      roNumber: 'RO-2026-0004',
      vehicleDesc: 'Mercedes E300 AMG',
      licensePlate: '30H-99999',
      customerName: 'Đặng Tuấn Anh',
      status: 'QC_CHECK',
      priority: 'HIGH',
      bayNumber: 'Bay #05 (Khoang QC & Chạy thử)',
      technician: 'Master Tech Nguyễn Đức Anh',
      estimatedTimeLeft: '15 phút',
      jobsCount: 6,
      completedJobs: 6,
      totalAmount: 12800000
    },
    {
      id: 'ro-5',
      roNumber: 'RO-2026-0005',
      vehicleDesc: 'Mazda CX-5 2.5 AWD',
      licensePlate: '30E-43210',
      customerName: 'Phạm Thanh Hương',
      status: 'COMPLETED',
      priority: 'LOW',
      bayNumber: 'Khu Vực Bãi Chờ Giao Xe',
      technician: 'KTV Trần Minh Hoàng',
      estimatedTimeLeft: 'Sẵn sàng giao xe',
      jobsCount: 2,
      completedJobs: 2,
      totalAmount: 950000
    }
  ]);

  const handleMoveStatus = async (roId: string, newStatus: string) => {
    setLocalROs(localROs.map(ro => ro.id === roId ? { ...ro, status: newStatus } : ro));
    try {
      await updateROStatus({ roId, status: newStatus });
    } catch (e) {
      // Keep optimistic update
    }
  };

  const filteredROs = localROs.filter(ro => 
    ro.roNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ro.vehicleDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ro.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ro.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBaysCount = localROs.filter(ro => ro.status === 'IN_PROGRESS' || ro.status === 'QC_CHECK').length;
  const totalROsCount = localROs.length;
  const urgentCount = localROs.filter(ro => ro.priority === 'HIGH' && ro.status !== 'COMPLETED').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title Header Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutGrid size={28} style={{ color: 'var(--primary)' }} /> {t('workshop.title')} - Command Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Bảng điều phối kỹ thuật xưởng thời gian thực (Real-time Workshop Kanban & Bay Allocation)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Quick Search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              className="input-field" 
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm số RO, biển số, KTV..."
            />
          </div>

          <button className="btn btn-primary">
            <Plus size={16} /> Tiếp Nhận & Phân Bay Mới
          </button>
        </div>
      </div>

      {/* Workshop Bay Utilization KPI Header */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Công Suất Cầu Nâng (Bays)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{activeBaysCount} / 6 Bay Đang Thi Công</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>Tải xưởng: {Math.round((activeBaysCount / 6) * 100)}% Capacity</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Lệnh Ưu Tiên Gấp (High Priority)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>{urgentCount} Lệnh SC</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cần hoàn thành trong ca làm việc</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>KTV Đang Làm Việc</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>4 KTV Chính</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>100% KTV đã nhận việc</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Lệnh SC Trong Ca</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{totalROsCount} Lệnh SC</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>Tỷ lệ đúng hạn: 96%</div>
          </div>
        </div>
      </div>

      {/* 5-Column Workshop Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'start' }}>
        {STATUS_COLUMNS.map(col => {
          const ColumnIcon = col.icon;
          const columnROs = filteredROs.filter(ro => ro.status === col.id);

          return (
            <div 
              key={col.id}
              className="card"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '16px',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `3px solid ${col.color}`, paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <ColumnIcon size={18} style={{ color: col.color }} />
                  <span>{col.title}</span>
                </div>
                <span style={{ backgroundColor: col.color, color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                  {columnROs.length}
                </span>
              </div>

              {/* Work Cards in Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                {columnROs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
                    Chưa có xe trong bước này
                  </div>
                ) : (
                  columnROs.map(ro => (
                    <div 
                      key={ro.id}
                      onClick={() => { setSelectedRO(ro); setShowDetailDrawer(true); }}
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: ro.priority === 'HIGH' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {/* Card Row 1: RO Number & Priority Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--primary)' }}>{ro.roNumber}</span>
                        {ro.priority === 'HIGH' && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: 'var(--danger)', color: '#fff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                            🔴 ƯU TIÊN GẤP
                          </span>
                        )}
                      </div>

                      {/* Card Row 2: Vehicle & Customer */}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{ro.vehicleDesc}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Biển số: <strong>{ro.licensePlate}</strong> • {ro.customerName}
                        </div>
                      </div>

                      {/* Card Row 3: Bay Allocation & Technician */}
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div>📍 {ro.bayNumber}</div>
                        <div style={{ marginTop: '2px', color: 'var(--text-primary)', fontWeight: 600 }}>👨‍🔧 {ro.technician}</div>
                      </div>

                      {/* Card Row 4: Jobs Progress & Time Left */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          Hạng mục: <strong style={{ color: 'var(--text-primary)' }}>{ro.completedJobs}/{ro.jobsCount}</strong>
                        </div>
                        <div style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {ro.estimatedTimeLeft}
                        </div>
                      </div>

                      {/* Card Row 5: Action Transition Buttons */}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px', borderTop: '1px stroke var(--border-color)', paddingTop: '8px' }}>
                        {STATUS_COLUMNS.filter(s => s.id !== col.id).map(nextCol => (
                          <button
                            key={nextCol.id}
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '0.7rem', flexGrow: 1, justifyContent: 'center' }}
                            onClick={(e) => { e.stopPropagation(); handleMoveStatus(ro.id, nextCol.id); }}
                          >
                            → {nextCol.title.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REPAIR ORDER DETAIL DRAWER MODAL */}
      {showDetailDrawer && selectedRO && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>CHI TIẾT LỆNH SỬA CHỮA XƯỞNG</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>{selectedRO.roNumber} - {selectedRO.vehicleDesc}</h3>
              </div>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowDetailDrawer(false)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Biển số xe:</span>
                <div style={{ fontWeight: 800 }}>{selectedRO.licensePlate}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Khách hàng:</span>
                <div style={{ fontWeight: 800 }}>{selectedRO.customerName}</div>
              </div>
            </div>

            <div className="input-group">
              <span className="input-label">Điều Phối Bay Làm Việc</span>
              <select className="input-field" value={selectedRO.bayNumber} onChange={(e) => setSelectedRO({ ...selectedRO, bayNumber: e.target.value })}>
                <option value="Bay #01 (Khu chẩn đoán)">Bay #01 (Khu chẩn đoán chẩn đoán nhanh)</option>
                <option value="Bay #02 (Cầu nâng 2 trụ)">Bay #02 (Cầu nâng 2 trụ gầm phanh)</option>
                <option value="Bay #03 (Cầu nâng 4 trụ)">Bay #03 (Cầu nâng 4 trụ cân chỉnh thước lái)</option>
                <option value="Bay #04 (Khu xe điện EV)">Bay #04 (Khu vực sửa chữa pin EV)</option>
              </select>
            </div>

            <div className="input-group">
              <span className="input-label">Phân Công Kỹ Thuật Viên Phụ Trách</span>
              <select className="input-field" value={selectedRO.technician} onChange={(e) => setSelectedRO({ ...selectedRO, technician: e.target.value })}>
                <option value="KTV Trần Minh Hoàng">KTV Trần Minh Hoàng (Master Tech)</option>
                <option value="KTV Lê Văn Tùng">KTV Lê Văn Tùng (Gầm Phanh)</option>
                <option value="KTV Phạm Quốc Bảo">KTV Phạm Quốc Bảo (Chuyên Xe Điện EV)</option>
                <option value="Master Tech Nguyễn Đức Anh">Master Tech Nguyễn Đức Anh (Động Cơ)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tổng Giá Trị Lệnh SC</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(selectedRO.totalAmount)}</div>
              </div>

              <button className="btn btn-primary" onClick={() => setShowDetailDrawer(false)}>
                Lưu Thay Đổi Điều Phối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
