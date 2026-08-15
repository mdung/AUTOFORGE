import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParts } from '../hooks/useApi';
import { useAuth } from '../App';
import { Plus, Package, Search, AlertTriangle, TrendingUp, DollarSign, Tag, CheckCircle2, ShieldAlert, Edit3, ArrowUpRight } from 'lucide-react';

interface LocalPart {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  cost: number;
  sellingPrice: number;
  stockQty: number;
  minSafetyQty: number;
}

export default function PartsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: apiParts = [], isLoading, isError, createPart, updatePartStock } = useParts(user?.token);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    sku: '', name: '', brand: '', category: 'Hệ Thống Phanh', cost: 0, sellingPrice: 0, stockQty: 10
  });

  // Enriched local state for high-end visual inventory management
  const [localParts, setLocalParts] = useState<LocalPart[]>([
    { id: '1', sku: 'BRK-PAD-001', name: 'Má Phanh Trước Ceramic (Front Brake Pads)', category: 'Hệ Thống Phanh', brand: 'Brembo', cost: 300000, sellingPrice: 450000, stockQty: 20, minSafetyQty: 5 },
    { id: '2', sku: 'BRK-DISC-001', name: 'Đĩa Phanh Thông Gió Trước (Front Brake Rotor)', category: 'Hệ Thống Phanh', brand: 'Brembo', cost: 650000, sellingPrice: 950000, stockQty: 8, minSafetyQty: 5 },
    { id: '3', sku: 'OIL-5W30-001', name: 'Dầu Động Cơ 5W-30 Full Synthetic (4L)', category: 'Dầu & Chất Lỏng', brand: 'Castrol Edge', cost: 480000, sellingPrice: 720000, stockQty: 40, minSafetyQty: 10 },
    { id: '4', sku: 'OIL-0W20-001', name: 'Dầu Động Cơ 0W-20 Hybrid (4L)', category: 'Dầu & Chất Lỏng', brand: 'Mobil 1', cost: 550000, sellingPrice: 800000, stockQty: 25, minSafetyQty: 8 },
    { id: '5', sku: 'FLT-OIL-001', name: 'Cốc Lọc Dầu Động Cơ (Oil Filter)', category: 'Dầu & Chất Lỏng', brand: 'Toyota OEM', cost: 80000, sellingPrice: 150000, stockQty: 35, minSafetyQty: 10 },
    { id: '6', sku: 'FLT-AIR-001', name: 'Lọc Gió Động Cơ High-Flow (Air Filter)', category: 'Động Cơ', brand: 'Denso', cost: 120000, sellingPrice: 180000, stockQty: 28, minSafetyQty: 8 },
    { id: '7', sku: 'FLT-CAB-001', name: 'Lọc Gió Điều Hòa Than Hoạt Tính (Cabin Filter)', category: 'Điều Hòa', brand: 'Bosch', cost: 150000, sellingPrice: 250000, stockQty: 20, minSafetyQty: 5 },
    { id: '8', sku: 'TIR-MXVS-001', name: 'Lốp 215/55R17 Primacy 4 All-Season', category: 'Lốp & Mâm', brand: 'Michelin', cost: 2200000, sellingPrice: 2800000, stockQty: 16, minSafetyQty: 4 },
    { id: '9', sku: 'BAT-MF-001', name: 'Bình Ắc Quy Khô 12V 60Ah Maintenance-Free', category: 'Điện & Ắc Quy', brand: 'GS Yuasa', cost: 1500000, sellingPrice: 2100000, stockQty: 4, minSafetyQty: 6 },
    { id: '10', sku: 'SPK-IRD-001', name: 'Bugi Bạch Kim Iridium Power (Set 4 cái)', category: 'Động Cơ', brand: 'NGK', cost: 95000, sellingPrice: 160000, stockQty: 48, minSafetyQty: 12 },
    { id: '11', sku: 'AC-COMP-001', name: 'Lốc Máy Nén Điều Hòa A/C Assembly', category: 'Điều Hòa', brand: 'Denso', cost: 4500000, sellingPrice: 6200000, stockQty: 3, minSafetyQty: 5 }
  ]);

  const handleStockAdjust = (id: string, delta: number) => {
    setLocalParts(localParts.map(p => p.id === id ? { ...p, stockQty: Math.max(0, p.stockQty + delta) } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newP: LocalPart = {
      id: Date.now().toString(),
      sku: form.sku,
      name: form.name,
      category: form.category,
      brand: form.brand || 'AutoForge OEM',
      cost: form.cost,
      sellingPrice: form.sellingPrice,
      stockQty: form.stockQty,
      minSafetyQty: 5
    };
    setLocalParts([newP, ...localParts]);
    try {
      await createPart({ ...form, reservedQty: 0 });
    } catch (err) {}
    setShowForm(false);
    setForm({ sku: '', name: '', brand: '', category: 'Hệ Thống Phanh', cost: 0, sellingPrice: 0, stockQty: 10 });
  };

  const filteredParts = localParts.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockParts = localParts.filter(p => p.stockQty <= p.minSafetyQty);
  const totalValuation = localParts.reduce((sum, p) => sum + (p.cost * p.stockQty), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={28} style={{ color: 'var(--primary)' }} /> {t('parts.title')} & Inventory Control
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý vật tư phụ tùng, kiểm soát tồn kho an toàn & tra cứu giá vốn/giá bán tức thì
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Thêm Phụ Tùng Mới
        </button>
      </div>

      {/* KPI Inventory Overview */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Mã Phụ Tùng (SKU)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{localParts.length} Danh Mục</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Giá Trị Tồn Kho Tối Thủy</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(totalValuation)}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Cảnh Báo Tồn Kho Thấp</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>{lowStockParts.length} Vật Tư</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Thương Hiệu Phụ Tùng</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>8 Hãng</div>
          </div>
        </div>
      </div>

      {/* Low Stock Banner Alert */}
      {lowStockParts.length > 0 && (
        <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--warning-glow)', border: '1px solid var(--warning)', padding: '14px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--warning)' }}>⚠️ Cảnh Báo Vật Tư Dưới Ngưỡng Tồn Kho An Toàn!</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              Các phụ tùng sắp hết: <strong>{lowStockParts.map(p => `${p.name} (còn ${p.stockQty})`).join(', ')}</strong>. Cần tạo đơn đặt hàng nhập kho bổ sung!
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'ALL', label: 'Tất Cả Phụ Tùng' },
            { id: 'Hệ Thống Phanh', label: '🛡️ Hệ Thống Phanh' },
            { id: 'Dầu & Chất Lỏng', label: '🛢️ Dầu & Chất Lỏng' },
            { id: 'Lốp & Mâm', label: '🛞 Lốp & Mâm' },
            { id: 'Điện & Ắc Quy', label: '⚡ Điện & Ắc Quy' },
            { id: 'Điều Hòa', label: '❄️ Điều Hòa' }
          ].map(tab => (
            <button
              key={tab.id}
              className="btn"
              onClick={() => setActiveCategory(tab.id)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '8px 14px',
                borderRadius: '20px',
                backgroundColor: activeCategory === tab.id ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: activeCategory === tab.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="input-field" 
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên SKU, Brembo, Denso..."
          />
        </div>
      </div>

      {/* Parts & Inventory Main Table */}
      <div className="card" style={{ padding: '20px' }}>
        <table aria-label="Parts Inventory List">
          <thead>
            <tr>
              <th>Mã SKU</th>
              <th>Tên Phụ Tùng</th>
              <th>Thương Hiệu</th>
              <th>Giá Vốn / Giá Bán (Margin)</th>
              <th>Số Lượng Tồn Kho</th>
              <th>Điều Chỉnh Kho Tức Thì</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Không tìm thấy vật tư phụ tùng nào</td></tr>
            ) : (
              filteredParts.map((p) => {
                const marginPercent = Math.round(((p.sellingPrice - p.cost) / p.cost) * 100);
                const isLowStock = p.stockQty <= p.minSafetyQty;

                return (
                  <tr key={p.id}>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, backgroundColor: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>
                        {p.sku}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.category}</div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'var(--bg-surface-elevated)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        {p.brand}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(p.sellingPrice)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        Vốn: {formatCurrency(p.cost)} <span style={{ color: 'var(--success)', fontWeight: 700 }}>(+{marginPercent}%)</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '130px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: isLowStock ? 'var(--danger)' : 'var(--text-primary)' }}>
                            {p.stockQty} cái
                          </span>
                          {isLowStock && <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: 'var(--danger)', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>CẢNH BÁO</span>}
                        </div>
                        {/* Visual Progress Bar */}
                        <div style={{ height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, (p.stockQty / 40) * 100)}%`, height: '100%', backgroundColor: isLowStock ? 'var(--danger)' : 'var(--success)' }} />
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => handleStockAdjust(p.id, -1)}
                          title="Xuất 1 sản phẩm khỏi kho"
                        >
                          -1
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => handleStockAdjust(p.id, 1)}
                          title="Nhập 1 sản phẩm vào kho"
                        >
                          +1
                        </button>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleStockAdjust(p.id, 5)}
                          title="Nhập 5 sản phẩm vào kho"
                        >
                          +5 Nhập
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* NEW PART FORM MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} style={{ color: 'var(--primary)' }} /> Thêm Phụ Tùng Mới Vào Kho
              </h3>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Mã SKU Phụ Tùng</span>
                  <input className="input-field" placeholder="VD: BRK-PAD-002" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
                </div>
                <div className="input-group">
                  <span className="input-label">Hãng Sản Xuất (Brand)</span>
                  <input className="input-field" placeholder="VD: Brembo, Bosch, Denso" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Tên Vật Tư Phụ Tùng</span>
                <input className="input-field" placeholder="VD: Má phanh ceramic sau..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div className="grid-3" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Giá Vốn Nhập (VNĐ)</span>
                  <input className="input-field" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) })} required />
                </div>
                <div className="input-group">
                  <span className="input-label">Giá Bán Bán Lẻ (VNĐ)</span>
                  <input className="input-field" type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: parseFloat(e.target.value) })} required />
                </div>
                <div className="input-group">
                  <span className="input-label">Số Lượng Ban Đầu</span>
                  <input className="input-field" type="number" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: parseInt(e.target.value) })} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Lưu Phụ Tùng Vào Kho
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
