import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QcInspectionPage() {
  const { t } = useTranslation();
  const [checklist, setChecklist] = useState([
    { id: 1, name: "Thử phanh & Hiệu năng dừng", category: "Phanh", passed: false },
    { id: 2, name: "Độ chụm & Cân bằng bánh xe", category: "Hệ thống treo", passed: false },
    { id: 3, name: "Kiểm tra mức dầu động cơ & rò rỉ", category: "Động cơ", passed: false },
    { id: 4, name: "Kiểm tra ánh sáng & Hệ thống điện còi", category: "Điện", passed: false },
    { id: 5, name: "Chạy thử đường (Road Test)", category: "Vận hành", passed: false }
  ]);
  const [inspector, setInspector] = useState('Trần Minh Hoàng');
  const [qcStatus, setQcStatus] = useState('PENDING');

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(c => c.id === id ? { ...c, passed: !c.passed } : c));
  };

  const submitQcReport = () => {
    const allPassed = checklist.every(c => c.passed);
    if (!allPassed) {
      alert("Hồ sơ QC chưa đạt! Vui lòng hoàn thành kiểm tra và khắc phục tất cả các hạng mục lỗi.");
      setQcStatus('FAILED');
      return;
    }
    setQcStatus('PASSED');
    alert("Duyệt chất lượng (QC Passed) thành công! Xe đã sẵn sàng chuyển sang bước bàn giao.");
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('qc.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('qc.desc')}</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem' }}>{t('qc.checklist')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {checklist.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{item.category}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</span>
              </div>
              <input type="checkbox" checked={item.passed} onChange={() => toggleCheck(item.id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>
          ))}
        </div>

        <div className="input-group">
          <span className="input-label">{t('qc.inspector')}</span>
          <input className="input-field" type="text" value={inspector} onChange={(e) => setInspector(e.target.value)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            {t('qc.qcStatus')}: 
            <span style={{ 
              fontWeight: 700, 
              marginLeft: '6px', 
              color: qcStatus === 'PASSED' ? 'var(--success)' : (qcStatus === 'FAILED' ? 'var(--primary)' : 'var(--warning)') 
            }}>
              {qcStatus === 'PASSED' ? t('qc.passed') : (qcStatus === 'FAILED' ? t('qc.failed') : t('qc.pending'))}
            </span>
          </div>
          <button className="btn btn-primary" onClick={submitQcReport}>{t('qc.submit')}</button>
        </div>
      </div>
    </div>
  );
}
