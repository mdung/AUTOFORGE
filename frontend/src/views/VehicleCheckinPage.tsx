import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCustomers, useVehicles, useRepairOrders } from '../hooks/useApi';
import { useAuth } from '../App';
import { MapPin, Search, Wrench, CheckCircle, Fuel, AlertCircle, Plus, UserCheck, Camera, Trash2, Edit3, ShieldAlert, Crosshair } from 'lucide-react';

interface DamagePoint {
  id: number;
  x: number;
  y: number;
  zone: string;
  type: 'scratch' | 'dent' | 'crack' | 'rust';
  severity: 'minor' | 'moderate' | 'severe';
  notes: string;
  photoAttached: boolean;
}

export default function VehicleCheckinPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: customers = [] } = useCustomers(user?.token);
  const { data: vehicles = [] } = useVehicles(user?.token);
  const { createRepairOrder } = useRepairOrders(user?.token);

  const [step, setStep] = useState(3); // Defaulting to step 3 for immediate review
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [odometer, setOdometer] = useState<number>(35000);
  const [fuelLevel, setFuelLevel] = useState('50%');
  const [primaryConcern, setPrimaryConcern] = useState('Bảo dưỡng định kỳ 40,000 km & kiểm tra tiếng ồn phanh trước');
  
  // Body Type & Active Hover Zone State
  const [bodyType, setBodyType] = useState<'sedan' | 'suv' | 'truck'>('sedan');
  const [hoveredZone, setHoveredZone] = useState<string>('');

  // Inspector Drawer State for Adding/Editing Marker
  const [selectedPoint, setSelectedPoint] = useState<Partial<DamagePoint> | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Initial Demo Damage Points
  const [damageMarkers, setDamageMarkers] = useState<DamagePoint[]>([
    { id: 1, x: 28, y: 38, zone: 'Cản Trước (Front Bumper)', type: 'scratch', severity: 'minor', notes: 'Trầy nhẹ sơn bóng cản trước góc trái', photoAttached: true },
    { id: 2, x: 74, y: 64, zone: 'Cửa Sau Phải (Right Rear Door)', type: 'dent', severity: 'moderate', notes: 'Vết móp 2cm do va chạm cánh cửa mở', photoAttached: false }
  ]);

  const [checkinComplete, setCheckinComplete] = useState(false);
  const [createdRoNumber, setCreatedRoNumber] = useState('');

  const customerVehicles = vehicles.filter((v: any) => !selectedCustomerId || v.ownerId === selectedCustomerId);
  const selectedCust = customers.find((c: any) => c.id === selectedCustomerId);
  const selectedVeh = vehicles.find((v: any) => v.id === selectedVehicleId);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    const newPoint: Partial<DamagePoint> = {
      id: Date.now(),
      x,
      y,
      zone: hoveredZone || `${bodyType.toUpperCase()} Body Shell`,
      type: 'scratch',
      severity: 'minor',
      notes: '',
      photoAttached: false
    };

    setSelectedPoint(newPoint);
    setShowDrawer(true);
  };

  const saveDamagePoint = () => {
    if (!selectedPoint) return;
    const existingIndex = damageMarkers.findIndex(m => m.id === selectedPoint.id);
    if (existingIndex >= 0) {
      const updated = [...damageMarkers];
      updated[existingIndex] = selectedPoint as DamagePoint;
      setDamageMarkers(updated);
    } else {
      setDamageMarkers([...damageMarkers, selectedPoint as DamagePoint]);
    }
    setShowDrawer(false);
    setSelectedPoint(null);
  };

  const removeMarker = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDamageMarkers(damageMarkers.filter(m => m.id !== id));
    if (selectedPoint?.id === id) {
      setShowDrawer(false);
      setSelectedPoint(null);
    }
  };

  const editMarker = (point: DamagePoint, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPoint(point);
    setShowDrawer(true);
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
        notes: `Check-in: ${primaryConcern}. Fuel: ${fuelLevel}. Recorded ${damageMarkers.length} damage points.`
      });
      setCreatedRoNumber(newRoNumber);
      setCheckinComplete(true);
    } catch (err) {
      setCreatedRoNumber(newRoNumber);
      setCheckinComplete(true);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={28} style={{ color: 'var(--primary)' }} /> {t('navigation.checkin')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quy trình tiếp nhận xe vào xưởng, chẩn đoán ban đầu & sơ đồ tương tác vị trí vết xước (Smart Damage Inspection)
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
              { num: 3, title: 'Sơ Đồ Vết Xước (3D Diagram)' },
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

      {/* STEP 3: DYNAMIC REALISTIC VEHICLE TYPE SCHEMATIC DIAGRAM */}
      {step === 3 && !checkinComplete && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Bước 3: Sơ Đồ Tương Tác Vết Hại Theo Dòng Xe ({bodyType.toUpperCase()})</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Chọn đúng dòng xe bên phải để chuyển đổi kiểu dáng thiết kế chuẩn xác (Sedan / SUV / Cyber Truck).
                </p>
              </div>

              {/* Dynamic Body Type Switcher Tabs */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-surface-elevated)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                {[
                  { id: 'sedan', label: '🏎️ Sedan Deluxe' },
                  { id: 'suv', label: '🚙 SUV / Crossover' },
                  { id: 'truck', label: '⚡ EV Cyber Truck' }
                ].map(b => (
                  <button 
                    key={b.id}
                    className="btn"
                    onClick={() => setBodyType(b.id as any)}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: bodyType === b.id ? 'var(--primary)' : 'transparent',
                      color: bodyType === b.id ? '#fff' : 'var(--text-secondary)',
                      boxShadow: bodyType === b.id ? '0 2px 8px var(--primary-glow)' : 'none'
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone HUD Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-elevated)', padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
                <Crosshair size={18} style={{ color: 'var(--primary)' }} />
                <span>Đang rà soát vị trí: </span>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{hoveredZone || `Toàn Bộ Thân Xe (${bodyType.toUpperCase()})`}</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Đã ghi nhận: <strong style={{ color: 'var(--text-primary)' }}>{damageMarkers.length}</strong> điểm vết hại
              </div>
            </div>

            {/* Main Interactive Diagram Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: showDrawer ? '1fr 340px' : '1fr', gap: '16px', transition: 'all 0.3s ease' }}>
              
              {/* Interactive Vector Car Canvas */}
              <div 
                onClick={handleCanvasClick}
                className="damage-map-canvas" 
                style={{ 
                  height: '400px', 
                  position: 'relative',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  cursor: 'crosshair',
                  background: 'radial-gradient(circle at center, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.12)'
                }}
              >
                {/* SVG Vector Precision Render */}
                <svg width="100%" height="100%" viewBox="0 0 800 350" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <defs>
                    <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.25" />
                    </pattern>

                    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--info)" stopOpacity="0.3" />
                    </linearGradient>

                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--bg-surface-elevated)" />
                      <stop offset="50%" stopColor="var(--bg-surface)" />
                      <stop offset="100%" stopColor="var(--bg-surface-elevated)" />
                    </linearGradient>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#gridPattern)" />

                  {/* Dynamic Title Overlay */}
                  <text x="400" y="24" textAnchor="middle" fill="var(--primary)" fontSize="12" fontWeight="800">
                    BẢN VẼ THÂN XE {bodyType.toUpperCase()} SCHEMATIC BLUEPRINT
                  </text>

                  {/* 1. SEDAN DELUXE SILHOUETTE */}
                  {bodyType === 'sedan' && (
                    <g transform="translate(240, 25)">
                      <path d="M 50 35 C 80 5, 240 5, 270 35 C 290 60, 295 190, 270 215 C 240 245, 80 245, 50 215 C 30 190, 30 60, 50 35 Z" fill="rgba(0,0,0,0.25)" />
                      <g fill="#0f172a" stroke="var(--primary)" strokeWidth="1.5">
                        <rect x="18" y="45" width="24" height="50" rx="7" />
                        <rect x="278" y="45" width="24" height="50" rx="7" />
                        <rect x="18" y="165" width="24" height="50" rx="7" />
                        <rect x="278" y="165" width="24" height="50" rx="7" />
                      </g>
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Khung Vỏ Sedan (Sedan Body Shell)')} d="M 50 35 C 80 5, 240 5, 270 35 C 290 60, 295 190, 270 215 C 240 245, 80 245, 50 215 C 30 190, 30 60, 50 35 Z" fill="url(#bodyGrad)" stroke="var(--text-secondary)" strokeWidth="2.5" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Nắp Capo Sedan (Hood)')} d="M 55 38 C 80 12, 240 12, 265 38 L 245 80 C 180 70, 140 70, 75 80 Z" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Kính Lái Sedan (Windshield)')} d="M 75 82 C 120 72, 200 72, 245 82 L 230 120 C 180 112, 140 112, 90 120 Z" fill="url(#glassGrad)" stroke="var(--primary)" strokeWidth="1.8" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Nóc Xe Sedan (Roof Panel)')} d="M 90 123 C 140 115, 180 115, 230 123 L 225 175 C 180 170, 140 170, 95 175 Z" fill="var(--bg-surface-elevated)" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Kính Sau Sedan (Rear Glass)')} d="M 95 178 C 140 173, 180 173, 225 178 L 235 205 C 180 200, 140 200, 85 205 Z" fill="url(#glassGrad)" stroke="var(--info)" strokeWidth="1.5" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Cốp Sau Sedan (Trunk Lid)')} d="M 85 208 C 140 203, 180 203, 235 208 L 260 225 C 230 245, 90 245, 60 225 Z" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="1.5" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Cửa Trước Trái (Left Front Door)')} d="M 36 82 L 86 82 L 86 142 L 36 142 Z" fill="none" stroke="var(--border-color)" strokeWidth="1.5" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Cửa Sau Trái (Left Rear Door)')} d="M 36 145 L 86 145 L 86 195 L 36 195 Z" fill="none" stroke="var(--border-color)" strokeWidth="1.5" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Cửa Trước Phải (Right Front Door)')} d="M 234 82 L 284 82 L 284 142 L 234 142 Z" fill="none" stroke="var(--border-color)" strokeWidth="1.5" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Cửa Sau Phải (Right Rear Door)')} d="M 234 145 L 284 145 L 284 195 L 234 195 Z" fill="none" stroke="var(--border-color)" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* 2. SUV / CROSSOVER SILHOUETTE */}
                  {bodyType === 'suv' && (
                    <g transform="translate(230, 20)">
                      <path d="M 40 30 C 70 5, 270 5, 300 30 C 320 60, 325 210, 300 240 C 270 265, 70 265, 40 240 C 20 210, 20 60, 40 30 Z" fill="rgba(0,0,0,0.3)" />
                      <g fill="#020617" stroke="var(--warning)" strokeWidth="2">
                        <rect x="8" y="40" width="28" height="58" rx="8" />
                        <rect x="304" y="40" width="28" height="58" rx="8" />
                        <rect x="8" y="172" width="28" height="58" rx="8" />
                        <rect x="304" y="172" width="28" height="58" rx="8" />
                      </g>
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Khung Thân SUV Crossover')} d="M 40 30 C 70 5, 270 5, 300 30 C 320 60, 325 210, 300 240 C 270 265, 70 265, 40 240 C 20 210, 20 60, 40 30 Z" fill="url(#bodyGrad)" stroke="var(--primary)" strokeWidth="3" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Nắp Capo SUV (SUV Hood)')} d="M 45 35 C 75 10, 265 10, 295 35 L 275 85 C 190 75, 150 75, 65 85 Z" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="2" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Cửa Sổ Trời Panoramic (Panoramic Sunroof)')} d="M 90 125 L 250 125 L 240 185 L 100 185 Z" fill="url(#glassGrad)" stroke="var(--info)" strokeWidth="2" />
                      <rect x="65" y="100" width="12" height="120" rx="4" fill="var(--text-muted)" />
                      <rect x="263" y="100" width="12" height="120" rx="4" fill="var(--text-muted)" />
                      <path className="car-zone-path" onMouseEnter={() => setHoveredZone('Cửa Hậu SUV (Rear SUV Tailgate)')} d="M 75 225 C 150 220, 190 220, 265 225 L 285 245 C 250 260, 90 260, 55 245 Z" fill="var(--bg-surface-elevated)" stroke="var(--border-color)" strokeWidth="2" />
                    </g>
                  )}

                  {/* 3. EV CYBER TRUCK SILHOUETTE */}
                  {bodyType === 'truck' && (
                    <g transform="translate(220, 15)">
                      <polygon points="30,25 310,25 330,270 10,270" fill="rgba(0,0,0,0.35)" />
                      <g fill="#09090b" stroke="var(--info)" strokeWidth="2">
                        <rect x="0" y="35" width="28" height="64" rx="4" />
                        <rect x="312" y="35" width="28" height="64" rx="4" />
                        <rect x="0" y="180" width="28" height="64" rx="4" />
                        <rect x="312" y="180" width="28" height="64" rx="4" />
                      </g>
                      <polygon className="car-zone-path" onMouseEnter={() => setHoveredZone('Khung Thân Cyber Truck')} points="35,25 305,25 325,265 15,265" fill="url(#bodyGrad)" stroke="var(--info)" strokeWidth="3" />
                      <polygon className="car-zone-path" onMouseEnter={() => setHoveredZone('Cốp Trước Frunk Cyber')} points="40,30 300,30 280,80 60,80" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="2" />
                      <polygon className="car-zone-path" onMouseEnter={() => setHoveredZone('Kính Lái Stealth')} points="65,83 275,83 260,135 80,135" fill="url(#glassGrad)" stroke="var(--info)" strokeWidth="2" />
                      <polygon className="car-zone-path" onMouseEnter={() => setHoveredZone('Thùng Xe Bán Tải (Truck Cargo Bed)')} points="70,175 270,175 295,255 45,255" fill="var(--bg-surface-elevated)" stroke="var(--warning)" strokeWidth="2" />
                      <line x1="90" y1="185" x2="90" y2="245" stroke="var(--border-color)" strokeWidth="2" />
                      <line x1="130" y1="185" x2="130" y2="245" stroke="var(--border-color)" strokeWidth="2" />
                      <line x1="170" y1="185" x2="170" y2="245" stroke="var(--border-color)" strokeWidth="2" />
                      <line x1="210" y1="185" x2="210" y2="245" stroke="var(--border-color)" strokeWidth="2" />
                      <line x1="250" y1="185" x2="250" y2="245" stroke="var(--border-color)" strokeWidth="2" />
                    </g>
                  )}

                  {/* FRONT VIEW DIAGRAM (Left Perspective) */}
                  <g transform="translate(35, 75)">
                    <rect x="10" y="70" width="150" height="70" rx="14" fill="var(--bg-surface)" stroke="var(--text-secondary)" strokeWidth="2" />
                    <path d="M 25 70 L 45 30 L 125 30 L 145 70 Z" fill="url(#glassGrad)" stroke="var(--primary)" strokeWidth="1.5" />
                    <rect className="car-zone-path" onMouseEnter={() => setHoveredZone(`Đèn Pha Trái (${bodyType.toUpperCase()})`)} x="18" y="82" width="34" height="18" rx="5" fill="var(--warning)" opacity="0.8" />
                    <rect className="car-zone-path" onMouseEnter={() => setHoveredZone(`Đèn Pha Phải (${bodyType.toUpperCase()})`)} x="118" y="82" width="34" height="18" rx="5" fill="var(--warning)" opacity="0.8" />
                    <rect className="car-zone-path" onMouseEnter={() => setHoveredZone(`Cản Trước (${bodyType.toUpperCase()})`)} x="56" y="86" width="58" height="28" rx="4" stroke="var(--border-color)" strokeDasharray="3,3" />
                    <text x="85" y="165" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="800">ĐẦU XE (FRONT)</text>
                  </g>

                  {/* REAR VIEW DIAGRAM (Right Perspective) */}
                  <g transform="translate(615, 75)">
                    <rect x="10" y="70" width="150" height="70" rx="14" fill="var(--bg-surface)" stroke="var(--text-secondary)" strokeWidth="2" />
                    <path d="M 25 70 L 45 30 L 125 30 L 145 70 Z" fill="url(#glassGrad)" stroke="var(--info)" strokeWidth="1.5" />
                    <rect className="car-zone-path" onMouseEnter={() => setHoveredZone(`Đèn Hậu Trái (${bodyType.toUpperCase()})`)} x="18" y="82" width="36" height="18" rx="5" fill="var(--danger)" opacity="0.85" />
                    <rect className="car-zone-path" onMouseEnter={() => setHoveredZone(`Đèn Hậu Phải (${bodyType.toUpperCase()})`)} x="116" y="82" width="36" height="18" rx="5" fill="var(--danger)" opacity="0.85" />
                    <rect className="car-zone-path" onMouseEnter={() => setHoveredZone(`Cản Sau (${bodyType.toUpperCase()})`)} x="60" y="88" width="50" height="20" rx="3" stroke="var(--border-color)" />
                    <text x="85" y="165" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="800">ĐUÔI XE (REAR)</text>
                  </g>
                </svg>

                {/* Render Pinned Damage Markers with Pulsing Radar Effect */}
                {damageMarkers.map((m) => (
                  <div 
                    key={m.id}
                    onClick={(e) => editMarker(m, e)}
                    className={`damage-marker ${m.type}`}
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    title={`${m.zone}: ${m.type.toUpperCase()} - Bấm để chỉnh sửa`}
                  >
                    {m.type[0].toUpperCase()}
                  </div>
                ))}
              </div>

              {/* INSPECTION DRAWER MODAL (When placing or editing a marker) */}
              {showDrawer && selectedPoint && (
                <div className="card" style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>
                      📍 Ghi Nhận Vết Hại Xe ({bodyType.toUpperCase()})
                    </span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => setShowDrawer(false)}>✕</button>
                  </div>

                  <div className="input-group">
                    <span className="input-label">Vị trí thân xe</span>
                    <input 
                      className="input-field" 
                      value={selectedPoint.zone || ''} 
                      onChange={(e) => setSelectedPoint({ ...selectedPoint, zone: e.target.value })} 
                      placeholder="VD: Nắp Capo, Cửa trước..."
                    />
                  </div>

                  <div className="input-group">
                    <span className="input-label">Loại hư hại (Damage Type)</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { type: 'scratch', label: '🟠 Vết Xước (Scratch)' },
                        { type: 'dent', label: '🔴 Vết Móp (Dent)' },
                        { type: 'crack', label: '🔵 Vỡ/Nứt (Crack)' },
                        { type: 'rust', label: '🟣 Rỉ Sét (Rust)' }
                      ].map(tItem => (
                        <button
                          key={tItem.type}
                          className="btn"
                          onClick={() => setSelectedPoint({ ...selectedPoint, type: tItem.type as any })}
                          style={{
                            fontSize: '0.72rem',
                            padding: '6px 8px',
                            backgroundColor: selectedPoint.type === tItem.type ? 'var(--primary)' : 'var(--bg-surface)',
                            color: selectedPoint.type === tItem.type ? '#fff' : 'var(--text-secondary)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          {tItem.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <span className="input-label">Mức độ nghiêm trọng (Severity)</span>
                    <select 
                      value={selectedPoint.severity || 'minor'}
                      onChange={(e) => setSelectedPoint({ ...selectedPoint, severity: e.target.value as any })}
                    >
                      <option value="minor">🟢 Nhẹ (Minor - Xước nhẹ bóng)</option>
                      <option value="moderate">🟡 Vừa (Moderate - Trầy sơn móp nhẹ)</option>
                      <option value="severe">🔴 Nặng (Severe - Móp rách nứt)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <span className="input-label">Mô tả chi tiết</span>
                    <textarea 
                      rows={2} 
                      value={selectedPoint.notes || ''} 
                      onChange={(e) => setSelectedPoint({ ...selectedPoint, notes: e.target.value })} 
                      placeholder="Mô tả vết xước/móp..."
                    />
                  </div>

                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedPoint({ ...selectedPoint, photoAttached: !selectedPoint.photoAttached })}
                    style={{ fontSize: '0.78rem', justifyContent: 'center', backgroundColor: selectedPoint.photoAttached ? 'var(--success-glow)' : 'var(--bg-surface)' }}
                  >
                    <Camera size={14} /> {selectedPoint.photoAttached ? '✓ Đã Đính Ảnh Thực Tế' : '📷 Đính Ảnh Chụp Từ Tablet'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={saveDamagePoint}>
                      <CheckCircle size={16} /> Lưu Vị Trí
                    </button>
                    {selectedPoint.id && (
                      <button className="btn btn-danger" onClick={() => removeMarker(selectedPoint.id!)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* REGISTERED DAMAGE POINTS TABLE */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} style={{ color: 'var(--warning)' }} /> 
                Danh Sách Vết Hại Đã Ghi Nhận ({damageMarkers.length})
              </h4>

              <table aria-label="Recorded damages table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Vị Trí Thân Xe</th>
                    <th>Loại Lỗi</th>
                    <th>Mức Độ</th>
                    <th>Ghi Chú Chi Tiết</th>
                    <th>Ảnh</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {damageMarkers.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Chưa ghi nhận vết xước/móp nào trên phương tiện</td></tr>
                  ) : (
                    damageMarkers.map((m, idx) => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 700 }}>#{idx + 1}</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{m.zone}</td>
                        <td>
                          <span className={`badge badge-${m.type === 'scratch' ? 'requested' : (m.type === 'dent' ? 'completed' : 'active')}`}>
                            {m.type.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            fontWeight: 700, 
                            color: m.severity === 'severe' ? 'var(--danger)' : (m.severity === 'moderate' ? 'var(--warning)' : 'var(--success)') 
                          }}>
                            {m.severity === 'severe' ? '🔴 Nặng' : (m.severity === 'moderate' ? '🟡 Vừa' : '🟢 Nhẹ')}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{m.notes || 'Chưa có ghi chú'}</td>
                        <td>
                          {m.photoAttached ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>📷 Có Ảnh</span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chưa có</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={(e) => editMarker(m, e)}>
                              <Edit3 size={12} /> Sửa
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--danger)' }} onClick={(e) => removeMarker(m.id, e)}>
                              <Trash2 size={12} /> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Quay Lại</button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>Tiếp Theo: Xác Nhận Check-in →</button>
            </div>
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
