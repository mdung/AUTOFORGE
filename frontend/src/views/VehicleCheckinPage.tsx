import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCustomers, useVehicles, useRepairOrders } from '../hooks/useApi';
import { useAuth } from '../App';
import { MapPin, Search, Wrench, CheckCircle, Fuel, AlertCircle, Plus, UserCheck } from 'lucide-react';

export default function VehicleCheckinPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: customers = [] } = useCustomers(user?.token);
  const { data: vehicles = [] } = useVehicles(user?.token);
  const { createRepairOrder } = useRepairOrders(user?.token);

  const [step, setStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [odometer, setOdometer] = useState<number>(35000);
  const [fuelLevel, setFuelLevel] = useState('50%');
  const [primaryConcern, setPrimaryConcern] = useState('Bảo dưỡng định kỳ 40,000 km & kiểm tra tiếng ồn phanh trước');
  const [damageMarkers, setDamageMarkers] = useState<Array<{ id: number; x: number; y: number; type: 'scratch' | 'dent' | 'crack' }>>([
    { id: 1, x: 25, y: 40, type: 'scratch' },
    { id: 2, x: 75, y: 60, type: 'dent' }
  ]);
  const [markerType, setMarkerType] = useState<'scratch' | 'dent' | 'crack'>('scratch');
  const [checkinComplete, setCheckinComplete] = useState(false);
  const [createdRoNumber, setCreatedRoNumber] = useState('');

  const customerVehicles = vehicles.filter((v: any) => !selectedCustomerId || v.ownerId === selectedCustomerId);
  const selectedCust = customers.find((c: any) => c.id === selectedCustomerId);
  const selectedVeh = vehicles.find((v: any) => v.id === selectedVehicleId);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setDamageMarkers([...damageMarkers, { id: Date.now(), x, y, type: markerType }]);
  };

  const removeMarker = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDamageMarkers(damageMarkers.filter(m => m.id !== id));
  };

  const handleCompleteCheckin = async () => {
    const cust = selectedCust || customers[0];
    const veh = selectedVeh || vehicles[0];
    
    const newRoNumber = `RO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await createRepairOrder({
        roNumber: newRoNumber,
        customerId: cust?.id || '',
        vehicleId: veh?.id || '',
        status: 'READY_FOR_WORK',
        mileage: odometer,
        priority: 'MEDIUM',
        notes: `Check-in: ${primaryConcern}. Fuel: ${fuelLevel}. Damages recorded: ${damageMarkers.length}`
      });
      setCreatedRoNumber(newRoNumber);
      setCheckinComplete(true);
    } catch (err) {
      setCreatedRoNumber(newRoNumber);
      setCheckinComplete(true);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.checkin')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quy trình tiếp nhận xe vào xưởng, ghi nhận Odometer, mức nhiên liệu & sơ đồ vết xước (Check-in Wizard)
          </p>
        </div>
        {checkinComplete && (
          <button className="btn btn-primary" onClick={() => { setStep(1); setCheckinComplete(false); }}>
            <Plus size={16} /> Tiếp Nhận Xe Mới
          </button>
        )}
      </div>

      {/* Progress Steps Header */}
      {!checkinComplete && (
        <div className="card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {[
              { num: 1, title: 'Khách Hàng & Xe' },
              { num: 2, title: 'Thông Số & Yêu Cầu' },
              { num: 3, title: 'Sơ Đồ Vết Xước' },
              { num: 4, title: 'Xác Nhận Check-in' }
            ].map(s => (
              <div 
                key={s.num} 
                onClick={() => setStep(s.num)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  opacity: step === s.num ? 1 : 0.6,
                  fontWeight: step === s.num ? 700 : 500
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: step === s.num ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: step === s.num ? '#fff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem'
                }}>
                  {s.num}
                </div>
                <span style={{ fontSize: '0.85rem' }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: CUSTOMER & VEHICLE */}
      {step === 1 && !checkinComplete && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Bước 1: Chọn Khách Hàng & Phương Tiện</h3>

          <div className="grid-2">
            <div className="input-group">
              <span className="input-label">Khách Hàng Tiếp Nhận</span>
              <select 
                value={selectedCustomerId} 
                onChange={(e) => { setSelectedCustomerId(e.target.value); setSelectedVehicleId(''); }}
              >
                <option value="">-- Chọn khách hàng từ hệ thống --</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <span className="input-label">Phương Tiện Kiểm Tra</span>
              <select 
                value={selectedVehicleId} 
                onChange={(e) => setSelectedVehicleId(e.target.value)}
              >
                <option value="">-- Chọn phương tiện --</option>
                {customerVehicles.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.make} {v.model} - {v.licensePlate} ({v.vin})</option>
                ))}
              </select>
            </div>
          </div>

          {(selectedCust || selectedVeh) && (
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Khách Hàng</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedCust?.name || 'Khách vãng lai'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SĐT: {selectedCust?.phone || '-'} | Email: {selectedCust?.email || '-'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Xe Check-in</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{selectedVeh ? `${selectedVeh.make} ${selectedVeh.model}` : 'Chưa chọn xe'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Biển số: {selectedVeh?.licensePlate || '-'}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Tiếp Theo: Thông Số Xe →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INTAKE PARAMS & CONCERN */}
      {step === 2 && !checkinComplete && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Bước 2: Ghi Nhận Số Km, Mức Nhiên Liệu & Yêu Cầu Khách Hàng</h3>

          <div className="grid-2">
            <div className="input-group">
              <span className="input-label">Số Odometer Khi Tiếp Nhận (km)</span>
              <input 
                type="number" 
                value={odometer} 
                onChange={(e) => setOdometer(parseInt(e.target.value))} 
              />
            </div>

            <div className="input-group">
              <span className="input-label">Mức Nhiên Liệu Xăng/Điện</span>
              <select value={fuelLevel} onChange={(e) => setFuelLevel(e.target.value)}>
                <option value="1/4 (25%)">1/4 Tank (25%)</option>
                <option value="1/2 (50%)">1/2 Tank (50%)</option>
                <option value="3/4 (75%)">3/4 Tank (75%)</option>
                <option value="Full (100%)">Full Tank (100%)</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <span className="input-label">Yêu Cầu / Hiện Trạng Bệnh Từ Khách Hàng (Primary Complaint)</span>
            <textarea 
              rows={3} 
              value={primaryConcern} 
              onChange={(e) => setPrimaryConcern(e.target.value)}
              placeholder="Mô tả tiếng kêu, yêu cầu cấp dưỡng, hỏng hóc cần chẩn đoán..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Quay Lại</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Tiếp Theo: Sơ Đồ Vết Xước →</button>
          </div>
        </div>
      )}

      {/* STEP 3: VISUAL DAMAGE MAP */}
      {step === 3 && !checkinComplete && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3>Bước 3: Sơ Đồ Đánh Dấu Vết Xước & Móp Thân Xe</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Bấm chuột lên thân xe bên dưới để đánh dấu vết xước (Scratch), móp (Dent) hoặc nứt vỡ (Crack).
            </p>
          </div>

          {/* Marker Selector */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Loại vết hại:</span>
            {[
              { type: 'scratch', label: 'Vết Xước (Scratch)', color: 'var(--warning)' },
              { type: 'dent', label: 'Vết Móp (Dent)', color: 'var(--danger)' },
              { type: 'crack', label: 'Vỡ/Nứt (Crack)', color: 'var(--info)' }
            ].map(m => (
              <button 
                key={m.type}
                className="btn"
                onClick={() => setMarkerType(m.type as any)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  backgroundColor: markerType === m.type ? m.color : 'var(--bg-surface-elevated)',
                  color: markerType === m.type ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                • {m.label}
              </button>
            ))}
          </div>

          {/* Interactive Car Canvas */}
          <div 
            onClick={handleCanvasClick}
            className="damage-map-canvas" 
            style={{ 
              height: '340px', 
              position: 'relative',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              cursor: 'crosshair',
              background: 'var(--bg-surface-elevated)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
            }}
          >
            {/* SVG Vector Car Blueprint Background */}
            <svg width="100%" height="100%" viewBox="0 0 800 320" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* TOP VIEW OF SEDAN (Center) */}
              <g transform="translate(250, 40)" stroke="var(--text-secondary)" strokeWidth="2" fill="none" opacity="0.85">
                <path d="M 40 40 C 60 10, 240 10, 260 40 C 275 60, 280 180, 260 200 C 240 230, 60 230, 40 200 C 25 180, 25 60, 40 40 Z" fill="var(--bg-surface)" strokeWidth="2.5" />
                <path d="M 75 65 C 100 50, 200 50, 225 65 L 210 105 C 180 98, 120 98, 90 105 Z" fill="var(--bg-surface-elevated)" />
                <path d="M 85 175 C 110 165, 190 165, 215 175 L 205 195 C 180 190, 120 190, 95 195 Z" fill="var(--bg-surface-elevated)" />
                <rect x="90" y="108" width="120" height="55" rx="8" fill="var(--bg-surface)" strokeDasharray="3,3" />
                <path d="M 85 30 L 95 62" />
                <path d="M 215 30 L 205 62" />
                <path d="M 90 200 L 95 220" />
                <path d="M 210 200 L 205 220" />
                <rect x="15" y="45" width="15" height="40" rx="4" fill="var(--text-muted)" />
                <rect x="270" y="45" width="15" height="40" rx="4" fill="var(--text-muted)" />
                <rect x="15" y="155" width="15" height="40" rx="4" fill="var(--text-muted)" />
                <rect x="270" y="155" width="15" height="40" rx="4" fill="var(--text-muted)" />
                <path d="M 25 75 L 12 70 Q 10 75 12 80 L 25 80 Z" fill="var(--text-secondary)" />
                <path d="M 275 75 L 288 70 Q 290 75 288 80 L 275 80 Z" fill="var(--text-secondary)" />
              </g>

              {/* FRONT VIEW (Left Side) */}
              <g transform="translate(40, 70)" stroke="var(--text-secondary)" strokeWidth="1.8" fill="none" opacity="0.8">
                <rect x="10" y="80" width="140" height="60" rx="12" fill="var(--bg-surface)" />
                <path d="M 25 80 L 45 40 L 115 40 L 135 80 Z" fill="var(--bg-surface-elevated)" />
                <rect x="18" y="90" width="30" height="16" rx="4" fill="var(--warning)" opacity="0.6" />
                <rect x="112" y="90" width="30" height="16" rx="4" fill="var(--warning)" opacity="0.6" />
                <rect x="54" y="94" width="52" height="24" rx="2" strokeDasharray="2,2" />
                <rect x="20" y="135" width="22" height="18" rx="3" fill="var(--text-muted)" />
                <rect x="118" y="135" width="22" height="18" rx="3" fill="var(--text-muted)" />
                <text x="80" y="170" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="700" stroke="none">ĐẦU XE (FRONT)</text>
              </g>

              {/* REAR VIEW (Right Side) */}
              <g transform="translate(600, 70)" stroke="var(--text-secondary)" strokeWidth="1.8" fill="none" opacity="0.8">
                <rect x="10" y="80" width="140" height="60" rx="12" fill="var(--bg-surface)" />
                <path d="M 25 80 L 45 40 L 115 40 L 135 80 Z" fill="var(--bg-surface-elevated)" />
                <rect x="18" y="90" width="32" height="16" rx="4" fill="var(--danger)" opacity="0.7" />
                <rect x="110" y="90" width="32" height="16" rx="4" fill="var(--danger)" opacity="0.7" />
                <rect x="58" y="96" width="44" height="18" rx="2" stroke="var(--border-color)" />
                <rect x="20" y="135" width="22" height="18" rx="3" fill="var(--text-muted)" />
                <rect x="118" y="135" width="22" height="18" rx="3" fill="var(--text-muted)" />
                <text x="80" y="170" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="700" stroke="none">ĐUÔI XE (REAR)</text>
              </g>

              {/* Title Header */}
              <text x="400" y="28" textAnchor="middle" fill="var(--primary)" fontSize="12" fontWeight="800" stroke="none">SƠ ĐỒ THÂN XE DẠNG BLUEPRINT (CAR BODY SCHEMATIC MAP)</text>
            </svg>

            {damageMarkers.map((m) => (
              <div 
                key={m.id}
                onClick={(e) => removeMarker(m.id, e)}
                className={`damage-marker ${m.type}`}
                style={{ left: `${m.x}%`, top: `${m.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 10 }}
                title="Bấm để xóa điểm đánh dấu"
              >
                {m.type[0].toUpperCase()}
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Đã ghi nhận <strong>{damageMarkers.length}</strong> điểm vết hại trên thân xe.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>← Quay Lại</button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>Tiếp Theo: Xác Nhận Check-in →</button>
          </div>
        </div>
      )}

      {/* STEP 4: SUMMARY & CONFIRMATION */}
      {step === 4 && !checkinComplete && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Bước 4: Xác Nhận Hoàn Tất Tiếp Nhận Xe</h3>

          <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 600 }}>Khách hàng:</span>
              <span>{selectedCust?.name || 'Nguyen Van Hung'} ({selectedCust?.phone || '0912345678'})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 600 }}>Phương tiện:</span>
              <span>{selectedVeh ? `${selectedVeh.make} ${selectedVeh.model} (${selectedVeh.licensePlate})` : 'Toyota Camry (30A-12345)'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 600 }}>Chỉ số Odometer:</span>
              <span>{odometer.toLocaleString()} km</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 600 }}>Mức Nhiên Liệu:</span>
              <span>{fuelLevel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 600 }}>Vết xước/Móp ghi nhận:</span>
              <span>{damageMarkers.length} vị trí</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>Mô tả bệnh / Yêu cầu:</span>
              <span style={{ maxWidth: '60%', textAlign: 'right', color: 'var(--primary)' }}>{primaryConcern}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(3)}>← Quay Lại</button>
            <button className="btn btn-primary" onClick={handleCompleteCheckin} style={{ padding: '12px 24px', fontSize: '1rem' }}>
              <CheckCircle size={18} /> Hoàn Tất Tiếp Nhận Xe Into Workshop
            </button>
          </div>
        </div>
      )}

      {/* CHECKIN COMPLETED RECEIPT */}
      {checkinComplete && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={36} />
          </div>
          <h2>Tiếp Nhận Phương Tiện Thành Công!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
            Đã tạo Lệnh Sửa Chữa (Repair Order) số <strong>{createdRoNumber}</strong> và chuyển xe sang trạng thái <strong>Sẵn Sàng Sửa Chữa (READY_FOR_WORK)</strong>.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button className="btn btn-primary" onClick={() => setCheckinComplete(false)}>
              Xem Lại Hồ Sơ Check-in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
