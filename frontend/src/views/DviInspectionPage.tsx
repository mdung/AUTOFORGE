import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, CheckCircle2, AlertTriangle, XCircle, Camera, Send, Eye, DollarSign, ShieldCheck, UserCheck, Wrench, Share2, Sparkles } from 'lucide-react';

interface InspectionItem {
  id: number;
  category: string;
  name: string;
  status: 'GREEN' | 'YELLOW' | 'RED';
  notes: string;
  estimatedCost: number;
  partRecommendation: string;
  photoUrl?: string;
  addedToEstimate: boolean;
}

export default function DviInspectionPage() {
  const { t } = useTranslation();

  const [selectedVehicle, setSelectedVehicle] = useState('Toyota Camry (30A-12345) - Nguyễn Văn Hùng');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const [items, setItems] = useState<InspectionItem[]>([
    { 
      id: 1, 
      category: 'Phanh & An Toàn', 
      name: 'Độ dày má phanh trước (Front Brake Pads)', 
      status: 'RED', 
      notes: 'Má phanh mòn nặng còn 1.5mm, có hiện tượng cọ đĩa kêu ken két', 
      estimatedCost: 850000, 
      partRecommendation: 'Thay bộ má phanh Ceramic Akebono trước',
      photoUrl: 'https://images.unsplash.com/photo-1600706432520-22c608f60b45?w=500&auto=format&fit=crop&q=60',
      addedToEstimate: true
    },
    { 
      id: 2, 
      category: 'Phanh & An Toàn', 
      name: 'Đĩa phanh & Dầu phanh (Brake Fluid)', 
      status: 'YELLOW', 
      notes: 'Dầu phanh có dấu hiệu đục nhẹ và độ ẩm 3.5%', 
      estimatedCost: 350000, 
      partRecommendation: 'Thay mới 1L dầu phanh DOT4 Bosch',
      photoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=60',
      addedToEstimate: false
    },
    { 
      id: 3, 
      category: 'Treo & Gai Lốp', 
      name: 'Độ sâu gai lốp (Tire Tread Depth)', 
      status: 'YELLOW', 
      notes: 'Gai lốp mòn không đều bên phải, độ sâu gai còn 2.2mm', 
      estimatedCost: 2200000, 
      partRecommendation: 'Thay 02 lốp Michelin 215/55R17 & Cân chỉnh thước lái',
      photoUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500&auto=format&fit=crop&q=60',
      addedToEstimate: false
    },
    { 
      id: 4, 
      category: 'Treo & Gai Lốp', 
      name: 'Giảm xóc trước/sau & Cao su tăm bông', 
      status: 'GREEN', 
      notes: 'Hoạt động tốt, ty giảm xóc khô ráo không có rò rỉ dầu', 
      estimatedCost: 0, 
      partRecommendation: 'Đạt tiêu chuẩn vận hành',
      addedToEstimate: false
    },
    { 
      id: 5, 
      category: 'Động Cơ & Dầu', 
      name: 'Mức dầu động cơ & Chất lượng Oil', 
      status: 'GREEN', 
      notes: 'Dầu Full Synthetic 5W-30 mới thay 2,000 km, mức dầu nằm ở vạch Max', 
      estimatedCost: 0, 
      partRecommendation: 'Đạt tiêu chuẩn',
      addedToEstimate: false
    },
    { 
      id: 6, 
      category: 'Điện & Ắc Quy', 
      name: 'Điện áp bình ắc quy (Battery Voltage & CCA)', 
      status: 'RED', 
      notes: 'Ắc quy sụt điện áp khi đề máy còn 10.8V, CCA sụt 45%', 
      estimatedCost: 1750000, 
      partRecommendation: 'Thay bình ắc quy khô Varta 65Ah chính hãng',
      photoUrl: 'https://images.unsplash.com/photo-1597762470488-3877b1f538c6?w=500&auto=format&fit=crop&q=60',
      addedToEstimate: true
    },
  ]);

  const categories = [
    { id: 'ALL', label: 'Tất Cả Mục' },
    { id: 'Phanh & An Toàn', label: '🛡️ Phanh & An Toàn' },
    { id: 'Treo & Gai Lốp', label: '🛞 Treo & Gai Lốp' },
    { id: 'Động Cơ & Dầu', label: '⚙️ Động Cơ & Dầu' },
    { id: 'Điện & Ắc Quy', label: '⚡ Điện & Ắc Quy' }
  ];

  const filteredItems = items.filter(item => activeCategory === 'ALL' || item.category === activeCategory);

  const greenCount = items.filter(i => i.status === 'GREEN').length;
  const yellowCount = items.filter(i => i.status === 'YELLOW').length;
  const redCount = items.filter(i => i.status === 'RED').length;
  const healthScore = Math.round(((greenCount * 1 + yellowCount * 0.5) / items.length) * 100);

  const totalEstimateAdded = items.filter(i => i.addedToEstimate).reduce((sum, item) => sum + item.estimatedCost, 0);

  const updateStatus = (id: number, status: 'GREEN' | 'YELLOW' | 'RED') => {
    setItems(items.map(item => item.id === id ? { ...item, status } : item));
  };

  const updateNotes = (id: number, notes: string) => {
    setItems(items.map(item => item.id === id ? { ...item, notes } : item));
  };

  const toggleAddToEstimate = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, addedToEstimate: !item.addedToEstimate } : item));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.dvi')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Báo cáo thẩm định kỹ thuật số tổng thể phương tiện (Digital Vehicle Inspection Studio) kèm ảnh thực tế & báo giá 1-Click
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setShowShareModal(true)}>
            <Share2 size={16} /> Xem Link Báo Cáo Khách
          </button>
          <button className="btn btn-primary" onClick={() => setShowShareModal(true)}>
            <Send size={16} /> Gửi DVI Cho Khách Hàng
          </button>
        </div>
      </div>

      {/* Vehicle Inspection Context Card */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phương Tiện Thẩm Định DVI</span>
            <select 
              value={selectedVehicle} 
              onChange={(e) => setSelectedVehicle(e.target.value)}
              style={{ fontSize: '1.1rem', fontWeight: 800, backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'block', marginTop: '4px' }}
            >
              <option value="Toyota Camry (30A-12345) - Nguyễn Văn Hùng">Toyota Camry 2.5Q • 30A-12345 (Nguyễn Văn Hùng)</option>
              <option value="Honda CR-V (30F-56789) - Trần Thị Mai">Honda CR-V 2.4 Turbo • 30F-56789 (Trần Thị Mai)</option>
              <option value="VinFast VF8 (29A-67890) - Lê Hoàng Nam">VinFast VF8 Plus • 29A-67890 (Lê Hoàng Nam)</option>
            </select>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              KTV Giám định: <strong>Trần Minh Hoàng (Master Tech)</strong> | Odometer: <strong>125,350 km</strong> | Lệnh SC: <strong>RO-2026-0001</strong>
            </div>
          </div>

          {/* Vehicle Overall Health Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-surface)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', background: `conic-gradient(${healthScore < 70 ? 'var(--danger)' : 'var(--success)'} ${healthScore}%, var(--border-color) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                {healthScore}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Chỉ Số Sức Khỏe Xe</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: healthScore < 70 ? 'var(--danger)' : 'var(--success)' }}>
                {healthScore < 70 ? '🔴 CẦN KHẮC PHỤC KHẨN CẤP' : '🟢 AN TOÀN VẬN HÀNH'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={28} style={{ color: 'var(--success)' }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Đạt Tiêu Chuẩn (Green)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{greenCount} Mục</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={28} style={{ color: 'var(--warning)' }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Cần Theo Dõi (Yellow)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{yellowCount} Mục</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <XCircle size={28} style={{ color: 'var(--danger)' }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Cần Thay Gấp (Red)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>{redCount} Mục</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DollarSign size={28} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Ước Tính Đưa Vào Báo Giá</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(totalEstimateAdded)}</div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className="btn"
            onClick={() => setActiveCategory(cat.id)}
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: activeCategory === cat.id ? 'var(--primary)' : 'var(--bg-surface-elevated)',
              color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* DVI Inspection Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className="card"
            style={{ 
              padding: '20px', 
              borderLeft: `6px solid ${item.status === 'GREEN' ? 'var(--success)' : (item.status === 'YELLOW' ? 'var(--warning)' : 'var(--danger)')}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: 'var(--bg-surface-elevated)'
            }}
          >
            {/* Row 1: Item Header & Status Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{item.category}</span>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '2px' }}>{item.name}</div>
              </div>

              {/* Status Selector Pills */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <button 
                  className="btn"
                  onClick={() => updateStatus(item.id, 'GREEN')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    backgroundColor: item.status === 'GREEN' ? 'var(--success)' : 'transparent',
                    color: item.status === 'GREEN' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  🟢 ĐẠT
                </button>
                <button 
                  className="btn"
                  onClick={() => updateStatus(item.id, 'YELLOW')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    backgroundColor: item.status === 'YELLOW' ? 'var(--warning)' : 'transparent',
                    color: item.status === 'YELLOW' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  🟡 THEO DÕI
                </button>
                <button 
                  className="btn"
                  onClick={() => updateStatus(item.id, 'RED')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    backgroundColor: item.status === 'RED' ? 'var(--danger)' : 'transparent',
                    color: item.status === 'RED' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  🔴 THAY GẤP
                </button>
              </div>
            </div>

            {/* Row 2: Part Recommendation & Cost Tag */}
            {item.status !== 'GREEN' && (
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Đề Xuất Vật Tư Thay Thế</span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>{item.partRecommendation}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chi Phí Dự Kiến</span>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{formatCurrency(item.estimatedCost)}</div>
                  </div>

                  <button 
                    className={`btn ${item.addedToEstimate ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => toggleAddToEstimate(item.id)}
                    style={{ fontSize: '0.78rem', padding: '8px 12px' }}
                  >
                    {item.addedToEstimate ? '✓ Đã Đưa Vào Báo Giá' : '+ Thêm Vào Báo Giá'}
                  </button>
                </div>
              </div>
            )}

            {/* Row 3: Notes & Photo Attachment Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: item.photoUrl ? '1fr 140px' : '1fr', gap: '12px', alignItems: 'center' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Nhận Xét Kỹ Thuật Viên (Technician Observation)</span>
                <input 
                  className="input-field" 
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                  value={item.notes} 
                  onChange={(e) => updateNotes(item.id, e.target.value)}
                  placeholder="Ghi chú chi tiết hỏng hóc hoặc lý do cần thay thế..."
                />
              </div>

              {item.photoUrl ? (
                <div 
                  onClick={() => setPreviewPhotoUrl(item.photoUrl!)}
                  style={{ 
                    position: 'relative', 
                    height: '60px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)'
                  }}
                  title="Bấm để phóng to ảnh kiểm tra"
                >
                  <img src={item.photoUrl} alt="Inspection Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', textAlign: 'center', padding: '2px' }}>
                    <Eye size={10} /> Phóng To Ảnh
                  </div>
                </div>
              ) : (
                <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap', justifyContent: 'center' }}>
                  <Camera size={14} /> Chụp Ảnh Thực Tế
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PHOTO PREVIEW MODAL */}
      {previewPhotoUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', maxWidth: '600px', width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 800 }}>📷 Ảnh Chụp Thực Tế Kiểm Tra DVI</span>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setPreviewPhotoUrl(null)}>✕</button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <img src={previewPhotoUrl} alt="Full Inspection Photo" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '12px', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}

      {/* SHARE REPORT MODAL */}
      {showShareModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} style={{ color: 'var(--primary)' }} /> Báo Cáo DVI Trực Tuyến Chờ Duyệt
              </h3>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowShareModal(false)}>✕</button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Đã khởi tạo đường dẫn xem báo cáo DVI trực tiếp dành cho khách hàng. Khách hàng có thể xem ảnh chụp thực tế và duyệt thay thế từng mục ngay trên điện thoại!
            </p>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              https://autoforge.io/dvi-report/7f9a2b-camry-30a12345
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => { alert("Đã sao chép liên kết báo cáo DVI!"); setShowShareModal(false); }}>
                Sao Chép Link Gửi Zalo/SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
