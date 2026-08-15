import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Play, Pause, CheckSquare, Wrench, AlertTriangle, Package, ChevronRight, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TechnicianPwaPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeJobId, setActiveJobId] = useState<number | null>(1);
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(2450); // 40m 50s elapsed
  const [showPartReqModal, setShowPartReqModal] = useState(false);

  const [jobs, setJobs] = useState([
    { id: 1, roNumber: 'RO-2026-0001', vehicle: 'Toyota Camry (30A-12345)', jobName: 'Thay dầu động cơ & lọc dầu', laborHours: 0.75, status: 'IN_PROGRESS' },
    { id: 2, roNumber: 'RO-2026-0001', vehicle: 'Toyota Camry (30A-12345)', jobName: 'Thay lọc gió động cơ & lọc gió điều hòa', laborHours: 0.5, status: 'PENDING' },
    { id: 3, roNumber: 'RO-2026-0002', vehicle: 'Honda CR-V (30F-56789)', jobName: 'Kiểm tra & thay má phanh trước', laborHours: 1.2, status: 'PENDING' }
  ]);

  // Live timer tick effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && activeJobId !== null) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeJobId]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const completeJob = (id: number) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'COMPLETED' } : j));
    if (activeJobId === id) {
      setActiveJobId(null);
      setIsRunning(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.tech')} PWA & Punch-Clock Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Giao diện chấm công thi công trực tiếp cho KTV (Mobile/Tablet PWA) & yêu cầu vật tư phụ tùng
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => setShowPartReqModal(true)}>
            <Package size={16} /> Yêu Cầu Vật Tư
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/workshop')}>
            Bảng Điều Phối Xưởng →
          </button>
        </div>
      </div>

      {/* Active Work Timer Card */}
      <div className="card" style={{ marginBottom: '24px', border: '2px solid var(--primary)', textAlign: 'center', padding: '30px', backgroundColor: 'var(--bg-surface-elevated)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800 }}>
          👨‍🔧 KTV TRẦN MINH HOÀNG • ĐỒNG HỒ BẤM GIỜ THI CÔNG TRỰC TIẾP
        </div>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'monospace', margin: '14px 0', color: isRunning ? 'var(--success)' : 'var(--text-primary)', letterSpacing: '3px' }}>
          {formatTimer(seconds)}
        </div>
        
        {activeJobId ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={toggleTimer} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              {isRunning ? <><Pause size={18} /> Tạm Dừng Tính Giờ</> : <><Play size={18} /> Tiếp Tục Tính Giờ</>}
            </button>
            <button className="btn btn-success" onClick={() => completeJob(activeJobId)} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <CheckSquare size={18} /> Hoàn Thành Công Việc Này
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Vui lòng chọn một công việc bên dưới để bắt đầu tính giờ.</p>
        )}
      </div>

      {/* Assigned Jobs List */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wrench size={20} style={{ color: 'var(--warning)' }} /> Danh Sách Hạng Mục Công Việc Được Phân Công
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {jobs.map(job => (
            <div 
              key={job.id} 
              style={{ 
                padding: '18px', 
                backgroundColor: activeJobId === job.id ? 'var(--primary-glow)' : 'var(--bg-surface-elevated)', 
                border: activeJobId === job.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>{job.roNumber} • {job.vehicle}</div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '2px' }}>{job.jobName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Thời lượng tiêu chuẩn: <strong>{job.laborHours} giờ công</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`badge badge-${job.status.toLowerCase()}`}>
                  {job.status === 'IN_PROGRESS' ? '🔴 ĐANG THI CÔNG' : (job.status === 'COMPLETED' ? '🟢 ĐÃ HOÀN THÀNH' : '🟡 CHỜ THI CÔNG')}
                </span>

                {job.status !== 'COMPLETED' && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => { setActiveJobId(job.id); setIsRunning(true); }}
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    <Play size={14} /> Chạy Giờ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PART REQUISITION MODAL */}
      {showPartReqModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} style={{ color: 'var(--primary)' }} /> Yêu Cầu Xuất Phụ Tùng Từ Kho
              </h3>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowPartReqModal(false)}>✕</button>
            </div>

            <div className="input-group">
              <span className="input-label">Chọn phụ tùng cần lấy từ kho</span>
              <select className="input-field">
                <option>Má phanh trước Ceramic Brembo (BRK-PAD-001)</option>
                <option>Dầu động cơ Castrol Edge 5W-30 (OIL-5W30-001)</option>
                <option>Cốc lọc dầu Toyota OEM (FLT-OIL-001)</option>
              </select>
            </div>

            <div className="input-group">
              <span className="input-label">Số lượng cần xuất</span>
              <input className="input-field" type="number" defaultValue={1} />
            </div>

            <button className="btn btn-primary" onClick={() => { alert("Đã gửi yêu cầu lấy vật tư cho Thủ Kho thành công!"); setShowPartReqModal(false); }}>
              Gửi Yêu Cầu Cho Thủ Kho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
