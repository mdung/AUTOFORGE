import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Play, Pause, CheckSquare, Wrench, AlertTriangle, Package } from 'lucide-react';

export default function TechnicianPwaPage() {
  const { t } = useTranslation();
  const [activeJobId, setActiveJobId] = useState<number | null>(1);
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(2450); // 40m 50s elapsed

  const [jobs, setJobs] = useState([
    { id: 1, roNumber: 'RO-2026-0001', vehicle: 'Toyota Camry (30A-12345)', jobName: 'Thay dầu động cơ & lọc dầu', laborHours: 0.75, status: 'IN_PROGRESS' },
    { id: 2, roNumber: 'RO-2026-0001', vehicle: 'Toyota Camry (30A-12345)', jobName: 'Thay lọc gió động cơ & lọc gió điều hòa', laborHours: 0.5, status: 'PENDING' },
    { id: 3, roNumber: 'RO-2026-0002', vehicle: 'Honda CR-V (30F-56789)', jobName: 'Kiểm tra & thay má phanh trước', laborHours: 1.2, status: 'PENDING' }
  ]);

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
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.tech')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Giao diện chấm công kỹ thuật viên (Punch-Clock Timer), nhận việc & theo dõi tiến độ sửa chữa
          </p>
        </div>
      </div>

      {/* Active Work Timer Card */}
      <div className="card" style={{ marginBottom: '24px', border: '2px solid var(--primary)', textAlign: 'center', padding: '30px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Đồng Hồ Bấm Giờ Thi Công Trực Tiếp
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'monospace', margin: '12px 0', color: isRunning ? 'var(--success)' : 'var(--text-primary)' }}>
          {formatTimer(seconds)}
        </div>
        
        {activeJobId ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn btn-primary" onClick={toggleTimer} style={{ padding: '10px 20px' }}>
              {isRunning ? <><Pause size={18} /> Tạm Dừng Đồng Hồ</> : <><Play size={18} /> Tiếp Tục Tính Giờ</>}
            </button>
            <button className="btn btn-success" onClick={() => completeJob(activeJobId)} style={{ padding: '10px 20px' }}>
              <CheckSquare size={18} /> Hoàn Thành Công Việc
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Chưa có công việc nào được chọn để tính giờ.</p>
        )}
      </div>

      {/* Assigned Jobs List */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Danh Sách Công Việc Được Giao</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {jobs.map(job => (
            <div 
              key={job.id} 
              style={{ 
                padding: '16px', 
                backgroundColor: activeJobId === job.id ? 'var(--primary-glow)' : 'var(--bg-surface-elevated)', 
                border: activeJobId === job.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--info)' }}>{job.roNumber} • {job.vehicle}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{job.jobName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Thời lượng ước tính: {job.laborHours} giờ công</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`badge badge-${job.status.toLowerCase()}`}>
                  {job.status}
                </span>

                {job.status !== 'COMPLETED' && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => { setActiveJobId(job.id); setIsRunning(true); }}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <Play size={14} /> Chạy Giờ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
