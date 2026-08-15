import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, CheckCircle2, AlertTriangle, XCircle, Camera, Send } from 'lucide-react';

interface InspectionItem {
  id: number;
  category: string;
  name: string;
  status: 'GREEN' | 'YELLOW' | 'RED';
  notes: string;
}

export default function DviInspectionPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<InspectionItem[]>([
    { id: 1, category: 'Hệ Thống Phanh', name: 'Độ dày má phanh trước (Brake Pads)', status: 'RED', notes: 'Má phanh mòn nặng còn 1.5mm, cần thay ngay' },
    { id: 2, category: 'Hệ Thống Phanh', name: 'Đĩa phanh & Dầu phanh', status: 'YELLOW', notes: 'Dầu phanh có dấu hiệu đục nhẹ' },
    { id: 3, category: 'Hệ Thống Treo & Lốp', name: 'Độ sâu gai lốp (Tire Tread Depth)', status: 'YELLOW', notes: 'Gai lốp mòn không đều bên phải' },
    { id: 4, category: 'Hệ Thống Treo & Lốp', name: 'Giảm xóc & Thấy rò rỉ dầu', status: 'GREEN', notes: 'Hoạt động tốt, không có rò rỉ' },
    { id: 5, category: 'Động Cơ & Chất Lỏng', name: 'Mức dầu động cơ & Chất lượng oil', status: 'GREEN', notes: 'Dầu mới thay, đúng mức tiêu chuẩn' },
    { id: 6, category: 'Hệ Thống Điện & Bình Ắc Quy', name: 'Điện áp bình ắc quy (Battery Health)', status: 'RED', notes: 'Ắc quy yếu, điện áp sụt còn 11.2V' },
  ]);

  const [sentReport, setSentReport] = useState(false);

  const updateStatus = (id: number, status: 'GREEN' | 'YELLOW' | 'RED') => {
    setItems(items.map(item => item.id === id ? { ...item, status } : item));
  };

  const updateNotes = (id: number, notes: string) => {
    setItems(items.map(item => item.id === id ? { ...item, notes } : item));
  };

  const handleSendReport = () => {
    setSentReport(true);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.dvi')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Báo cáo kiểm tra tổng thể phương tiện (Digital Vehicle Inspection) đính kèm trạng thái Đỏ / Vàng / Xanh & ảnh chụp thực tế
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSendReport}>
          <Send size={16} /> Gửi Báo Cáo DVI Cho Khách
        </button>
      </div>

      {sentReport && (
        <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--success-glow)', border: '1px solid var(--success)', color: 'var(--success)', textAlign: 'center' }}>
          🎉 Đã gửi báo cáo DVI trực tuyến kèm liên kết xem ảnh chụp cho khách hàng thành công!
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Đạt Tiêu Chuẩn (Xanh)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{items.filter(i => i.status === 'GREEN').length}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={32} style={{ color: 'var(--warning)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cần Theo Dõi (Vàng)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{items.filter(i => i.status === 'YELLOW').length}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <XCircle size={32} style={{ color: 'var(--danger)' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cần Thay Gấp (Đỏ)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{items.filter(i => i.status === 'RED').length}</div>
          </div>
        </div>
      </div>

      {/* DVI Checklist Items */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3>Danh Mục Kiểm Tra DVI Thực Tế</h3>

        {items.map(item => (
          <div 
            key={item.id} 
            style={{ 
              padding: '16px', 
              backgroundColor: 'var(--bg-surface-elevated)', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{item.category}</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
              </div>

              {/* Status Selector */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  className="btn"
                  onClick={() => updateStatus(item.id, 'GREEN')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    backgroundColor: item.status === 'GREEN' ? 'var(--success)' : 'transparent',
                    color: item.status === 'GREEN' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  🟢 Đạt
                </button>
                <button 
                  className="btn"
                  onClick={() => updateStatus(item.id, 'YELLOW')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    backgroundColor: item.status === 'YELLOW' ? 'var(--warning)' : 'transparent',
                    color: item.status === 'YELLOW' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  🟡 Theo dõi
                </button>
                <button 
                  className="btn"
                  onClick={() => updateStatus(item.id, 'RED')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    backgroundColor: item.status === 'RED' ? 'var(--danger)' : 'transparent',
                    color: item.status === 'RED' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  🔴 Thay gấp
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                className="input-field" 
                style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                value={item.notes} 
                onChange={(e) => updateNotes(item.id, e.target.value)}
                placeholder="Ghi chú nhận xét của KTV..."
              />
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                <Camera size={14} /> Đính Ảnh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
