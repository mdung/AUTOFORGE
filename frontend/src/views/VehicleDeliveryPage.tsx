import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ShieldCheck, UserCheck, Key, FileText, Sparkles, Printer, Share2, AlertTriangle, Gauge, Fuel, Award, Send } from 'lucide-react';

export default function VehicleDeliveryPage() {
  const { t } = useTranslation();

  const [selectedVehicle, setSelectedVehicle] = useState('camry-30a12345');
  const [odometer, setOdometer] = useState(125350);
  const [fuelLevel, setFuelLevel] = useState('50%');
  const [signature, setSignature] = useState('Nguyễn Văn Hùng');
  const [delivered, setDelivered] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Handover protocol checklist state
  const [protocolChecks, setProtocolChecks] = useState({
    washed: true,
    scratchRechecked: true,
    keysReturned: true,
    invoiceIssued: true,
    odometerVerified: true,
    recommendationsExplained: true
  });

  const [deferredList] = useState<string[]>([
    "Thay thế bộ lốp trước bên phải sau 5,000 km (Gai lốp mòn nhẹ bên phải)",
    "Bảo dưỡng định kỳ dầu hộp số tự động ở mốc 130,000 km"
  ]);

  const toggleCheck = (key: keyof typeof protocolChecks) => {
    setProtocolChecks({ ...protocolChecks, [key]: !protocolChecks[key] });
  };

  const handleDelivery = async () => {
    if (!signature.trim()) {
      alert("Vui lòng yêu cầu khách hàng ký tên nhận bàn giao xe!");
      return;
    }
    setDelivered(true);
    setShowReceiptModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={28} style={{ color: 'var(--success)' }} /> {t('delivery.title')} Protocol
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quy trình bàn giao xe chuyên nghiệp cho khách hàng, xác nhận 6 bước kiểm định & biên bản chữ ký điện tử
          </p>
        </div>

        {delivered && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setShowReceiptModal(true)}>
              <Printer size={16} /> In Biên Bản Bàn Giao
            </button>
            <button className="btn btn-primary" onClick={() => setShowReceiptModal(true)}>
              <Share2 size={16} /> Gửi Biên Bản Zalo/SMS
            </button>
          </div>
        )}
      </div>

      {/* Vehicle Delivery Context Selector */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phương Tiện Hoàn Tất Sẵn Sàng Bàn Giao</span>
            <select 
              value={selectedVehicle} 
              onChange={(e) => setSelectedVehicle(e.target.value)}
              style={{ fontSize: '1.1rem', fontWeight: 800, backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'block', marginTop: '4px' }}
            >
              <option value="camry-30a12345">Toyota Camry 2.5Q • 30A-12345 (Nguyễn Văn Hùng - Lệnh RO-2026-0001)</option>
              <option value="crv-30f56789">Honda CR-V 2.4 • 30F-56789 (Trần Thị Mai - Lệnh RO-2026-0002)</option>
              <option value="vf8-29a67890">VinFast VF8 Plus • 29A-67890 (Lê Hoàng Nam - Lệnh RO-2026-0003)</option>
            </select>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Kiểm định viên QC: <strong>Master Tech Nguyễn Đức Anh (QC PASSED)</strong> | Hóa đơn: <strong>{formatCurrency(3450000)} (Đã thanh toán)</strong>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--success-glow)', border: '1px solid var(--success)', color: 'var(--success)', padding: '8px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} /> ĐÃ HOÀN THÀNH QC
          </div>
        </div>
      </div>

      {/* 6-Step Handover Protocol Inspection Checklist */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} /> 6 Bước Quy Trình Kiểm Định Bàn Giao (Protocol Checklist)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {[
            { key: 'washed', title: '🧼 Rửa Xe & Hút Bụi Nội Thất', desc: 'Xe đã được rửa sạch bóng và hút bụi khoang cabin sạch sẽ' },
            { key: 'scratchRechecked', title: '🛡️ Kiểm Tra Trầy Xước Thân Xe', desc: 'Xác nhận lại với khách hàng đúng sơ đồ vết hại lúc check-in' },
            { key: 'keysReturned', title: '🔑 Bàn Giao Chìa Khóa & Đồ Đạc', desc: 'Bàn giao đủ 02 chìa khóa + trả nguyên vẹn vật dụng cá nhân' },
            { key: 'invoiceIssued', title: '📑 Xuất Hóa Đơn & Tem Bảo Dưỡng', desc: 'Đã dán tem nhắc bảo dưỡng mốc kế tiếp & giao hóa đơn GTGT' },
            { key: 'odometerVerified', title: '⛽ Nhiên Liệu & Odometer Bàn Giao', desc: 'Xác nhận số Km khi ra khỏi xưởng & mức xăng/điện' },
            { key: 'recommendationsExplained', title: '📝 Giải Thích Hạng Mục Lưu Ý', desc: 'Tư vấn các hạng mục cần thay thế/bảo dưỡng ở lần tới' }
          ].map((step) => {
            const isChecked = protocolChecks[step.key as keyof typeof protocolChecks];
            return (
              <div 
                key={step.key}
                onClick={() => toggleCheck(step.key as keyof typeof protocolChecks)}
                style={{
                  backgroundColor: isChecked ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  border: isChecked ? '1px solid var(--success)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: isChecked ? 'var(--success)' : 'transparent',
                  border: isChecked ? 'none' : '2px solid var(--border-color)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {isChecked && '✓'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{step.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Odometer, Fuel & Deferred Recommendations Section */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Left: Odometer & Fuel Input */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gauge size={18} style={{ color: 'var(--primary)' }} /> Thông Số Xe Khi Bàn Giao
          </h3>

          <div className="input-group">
            <span className="input-label">Số Odometer Khi Ra Khỏi Xưởng (km)</span>
            <input 
              className="input-field" 
              type="number" 
              value={odometer} 
              onChange={(e) => setOdometer(parseInt(e.target.value))} 
            />
          </div>

          <div className="input-group">
            <span className="input-label">Mức Nhiên Liệu Xăng / Điện</span>
            <select value={fuelLevel} onChange={(e) => setFuelLevel(e.target.value)}>
              <option value="1/4 (25%)">1/4 Tank (25%)</option>
              <option value="1/2 (50%)">1/2 Tank (50%)</option>
              <option value="3/4 (75%)">3/4 Tank (75%)</option>
              <option value="Full (100%)">Full Tank (100%)</option>
            </select>
          </div>
        </div>

        {/* Right: Deferred Recommendations */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Khuyên Dùng Bảo Dưỡng Lần Kế Tiếp
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {deferredList.map((def, idx) => (
              <div key={idx} style={{ fontSize: '0.82rem', padding: '10px 12px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '8px', borderLeft: '4px solid var(--warning)' }}>
                <strong>• {def}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Digital Customer Signature Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={20} style={{ color: 'var(--primary)' }} /> Ký Xác Nhận Bàn Giao Của Khách Hàng
        </h3>

        {!delivered ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-group">
              <span className="input-label">Họ tên người ký nhận bàn giao xe</span>
              <input 
                className="input-field" 
                style={{ fontSize: '1rem', fontWeight: 700 }}
                placeholder="Nhập họ tên khách hàng ký nhận..." 
                value={signature} 
                onChange={(e) => setSignature(e.target.value)} 
              />
            </div>

            {/* Signature Preview Canvas */}
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '24px', borderRadius: '12px', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>MẪU CHỮ KÝ ĐIỆN TỬ KHÁCH HÀNG (DIGITAL SIGNATURE STAMP)</div>
              <div style={{ fontFamily: "'Outfit', cursive, sans-serif", fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', fontStyle: 'italic', letterSpacing: '2px' }}>
                {signature || 'Ký tên tại đây'}
              </div>
            </div>

            <button className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem', justifyContent: 'center' }} onClick={handleDelivery}>
              <CheckCircle2 size={20} /> Hoàn Tất Bàn Giao Xe Cho Khách Hàng
            </button>
          </div>
        ) : (
          <div style={{ padding: '20px', backgroundColor: 'var(--success-glow)', border: '1px solid var(--success)', borderRadius: '12px', color: 'var(--success)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={28} />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Bàn Giao Phương Tiện Thành Công!</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Đã lập Biên Bản Bàn Giao Điện Tử cho khách hàng <strong>{signature}</strong>.
            </div>

            <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={() => setShowReceiptModal(true)}>
              Xem & In Biên Bản Bàn Giao
            </button>
          </div>
        )}
      </div>

      {/* HANDOVER RECEIPT MODAL */}
      {showReceiptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} /> BIÊN BẢN BÀN GIAO XE ĐIỆN TỬ
              </span>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowReceiptModal(false)}>✕</button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Khách hàng ký nhận:</span>
                <span style={{ fontWeight: 800 }}>{signature}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phương tiện:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Toyota Camry 2.5Q (30A-12345)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Odometer bàn giao:</span>
                <span>{odometer.toLocaleString()} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Quy trình 6 bước:</span>
                <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ 100% ĐẠT TIÊU CHUẨN</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={() => alert("Đã gửi biên bản qua Zalo/SMS thành công!")}>
                <Send size={16} /> Gửi SMS / Zalo Cho Khách
              </button>
              <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => { window.print(); setShowReceiptModal(false); }}>
                <Printer size={16} /> In Biên Bản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
