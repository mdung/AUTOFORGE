import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2, AlertTriangle, UserCheck, Wrench, ArrowRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QcInspectionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState('camry-30a12345');
  const [checklist, setChecklist] = useState([
    { id: 1, name: "Thử phanh khẩn cấp & Độ cân bằng lực phanh", category: "Phanh & An Toàn", passed: true },
    { id: 2, name: "Độ chụm bánh xe & Thước lái (Road Alignment)", category: "Hệ Thống Treo", passed: true },
    { id: 3, name: "Mức dầu động cơ, dầu phanh & kiểm tra rò rỉ", category: "Động Cơ & Chất Lỏng", passed: true },
    { id: 4, name: "Kiểm tra hệ thống đèn pha, tín hiệu & còi điện", category: "Điện & Đèn", passed: true },
    { id: 5, name: "Chạy thử đường thực tế 5km (Road Test Run)", category: "Vận Hành Thực Tế", passed: true }
  ]);
  const [inspector, setInspector] = useState('Master Tech Nguyễn Đức Anh');
  const [qcStatus, setQcStatus] = useState<'PENDING' | 'PASSED' | 'FAILED'>('PASSED');

  const toggleCheck = (id: number) => {
    const updated = checklist.map(c => c.id === id ? { ...c, passed: !c.passed } : c);
    setChecklist(updated);
    setQcStatus(updated.every(c => c.passed) ? 'PASSED' : 'PENDING');
  };

  const submitQcReport = () => {
    const allPassed = checklist.every(c => c.passed);
    if (!allPassed) {
      alert("Hồ sơ QC chưa đạt! Vui lòng hoàn thành kiểm tra và khắc phục tất cả các mục lỗi.");
      setQcStatus('FAILED');
      return;
    }
    setQcStatus('PASSED');
    alert("Duyệt chất lượng (QC Passed) thành công! Xe đã sẵn sàng chuyển sang bước Bàn Giao.");
    navigate('/delivery');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={28} style={{ color: 'var(--primary)' }} /> {t('qc.title')} Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quy trình kiểm định chất lượng nghiêm ngặt trước khi xuất xưởng & chạy thử đường (Road Test Run)
          </p>
        </div>

        {qcStatus === 'PASSED' && (
          <button className="btn btn-primary" onClick={() => navigate('/delivery')}>
            Chuyển Sang Bàn Giao Xe →
          </button>
        )}
      </div>

      {/* Vehicle Context Card */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Phương Tiện Thẩm Định QC</span>
            <select 
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              style={{ fontSize: '1.1rem', fontWeight: 800, backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'block', marginTop: '4px' }}
            >
              <option value="camry-30a12345">Toyota Camry 2.5Q • 30A-12345 (Lệnh RO-2026-0001)</option>
              <option value="crv-30f56789">Honda CR-V 2.4 • 30F-56789 (Lệnh RO-2026-0002)</option>
            </select>
          </div>

          <div style={{ backgroundColor: 'var(--success-glow)', border: '1px solid var(--success)', color: 'var(--success)', padding: '8px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
            🏆 QC PASSED CERTIFIED
          </div>
        </div>
      </div>

      {/* QC Checklist Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('qc.checklist')}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {checklist.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleCheck(item.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '14px 18px', 
                backgroundColor: item.passed ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)', 
                border: item.passed ? '1px solid var(--success)' : '1px solid var(--border-color)', 
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{item.category}</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>{item.name}</div>
              </div>

              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: item.passed ? 'var(--success)' : 'var(--bg-surface)',
                border: item.passed ? 'none' : '2px solid var(--border-color)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                {item.passed ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="input-group">
          <span className="input-label">Tên Chuyên Viên Thẩm Định QC</span>
          <input className="input-field" type="text" value={inspector} onChange={(e) => setInspector(e.target.value)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div>
            Trạng Thái QC: 
            <span style={{ fontWeight: 800, marginLeft: '8px', fontSize: '1rem', color: qcStatus === 'PASSED' ? 'var(--success)' : 'var(--danger)' }}>
              {qcStatus === 'PASSED' ? '🟢 ĐÃ ĐẠT TIÊU CHUẨN (QC PASSED)' : '🔴 CHƯA ĐẠT (PENDING)'}
            </span>
          </div>

          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }} onClick={submitQcReport}>
            <Award size={18} /> Duyệt Báo Cáo QC & Chuyển Giao Xe
          </button>
        </div>
      </div>
    </div>
  );
}
