import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEstimates, useInvoices } from '../hooks/useApi';
import { useAuth } from '../App';
import { FileText, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle, Printer, Send, Plus, Eye, Share2, Sparkles, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LocalEstimate {
  id: string;
  estimateNumber: string;
  roNumber: string;
  customerName: string;
  vehicleDesc: string;
  status: 'APPROVED' | 'PARTIALLY_APPROVED' | 'SENT' | 'DRAFT' | 'DECLINED';
  taxRate: number;
  discountAmount: number;
  totalPrice: number;
  createdAt: string;
}

interface LocalInvoice {
  id: string;
  invoiceNumber: string;
  roNumber: string;
  customerName: string;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
  subtotal: number;
  tax: number;
  total: number;
  issuedDate: string;
}

export default function EstimatesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: apiEstimates = [], isLoading, isError } = useEstimates(user?.token);
  const { data: apiInvoices = [] } = useInvoices(user?.token);

  const [selectedEst, setSelectedEst] = useState<LocalEstimate | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Enriched local state for Estimates & Billing studio
  const [estimates] = useState<LocalEstimate[]>([
    { id: '1', estimateNumber: 'EST-2026-0001', roNumber: 'RO-2026-0001', customerName: 'Nguyễn Văn Hùng', vehicleDesc: 'Toyota Camry (30A-12345)', status: 'APPROVED', taxRate: 0.08, discountAmount: 200000, totalPrice: 3450000, createdAt: '2026-08-16' },
    { id: '2', estimateNumber: 'EST-2026-0002', roNumber: 'RO-2026-0002', customerName: 'Trần Thị Mai', vehicleDesc: 'Honda CR-V (30F-56789)', status: 'SENT', taxRate: 0.08, discountAmount: 0, totalPrice: 1850000, createdAt: '2026-08-16' },
    { id: '3', estimateNumber: 'EST-2026-0003', roNumber: 'RO-2026-0003', customerName: 'Lê Hoàng Nam', vehicleDesc: 'VinFast VF8 (29A-67890)', status: 'PARTIALLY_APPROVED', taxRate: 0.08, discountAmount: 500000, totalPrice: 5200000, createdAt: '2026-08-15' },
    { id: '4', estimateNumber: 'EST-2026-0004', roNumber: 'RO-2026-0004', customerName: 'Đặng Tuấn Anh', vehicleDesc: 'Mercedes E300 (30H-99999)', status: 'APPROVED', taxRate: 0.08, discountAmount: 1000000, totalPrice: 12800000, createdAt: '2026-08-14' }
  ]);

  const [invoices] = useState<LocalInvoice[]>([
    { id: 'inv-1', invoiceNumber: 'INV-2026-0001', roNumber: 'RO-2026-0001', customerName: 'Nguyễn Văn Hùng', status: 'PAID', subtotal: 3200000, tax: 250000, total: 3450000, issuedDate: '2026-08-16' },
    { id: 'inv-2', invoiceNumber: 'INV-2026-0004', roNumber: 'RO-2026-0004', customerName: 'Đặng Tuấn Anh', status: 'PAID', subtotal: 12000000, tax: 800000, total: 12800000, issuedDate: '2026-08-14' }
  ]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      'DRAFT': { bg: 'var(--bg-surface)', color: 'var(--text-secondary)', label: '📝 Bản Thảo' },
      'SENT': { bg: 'var(--info-glow)', color: 'var(--info)', label: '📩 Đã Gửi Khách' },
      'APPROVED': { bg: 'var(--success-glow)', color: 'var(--success)', label: '🟢 Đã Duyệt' },
      'PARTIALLY_APPROVED': { bg: 'var(--warning-glow)', color: 'var(--warning)', label: '🟡 Duyệt Một Phần' },
      'PAID': { bg: 'var(--success-glow)', color: 'var(--success)', label: '💰 ĐÃ THANH TOÁN' }
    };
    const s = styles[status] || styles['DRAFT'];
    return (
      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} style={{ color: 'var(--primary)' }} /> Báo Giá & Hóa Đơn (Estimates & Billing Studio)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý báo giá dịch vụ sửa chữa, duyệt hạng mục từ xa & phát hành hóa đơn thanh toán
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/delivery')}>
          Bàn Giao Xe & Xuất Hóa Đơn →
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--info-glow)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Báo Giá Đã Lập</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{estimates.length} Báo Giá</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Khách Đã Chấp Nhận</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>3 Báo Giá</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Chờ Khách Duyệt</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>1 Báo Giá</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Doanh Thu Hóa Đơn</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(16250000)}</div>
          </div>
        </div>
      </div>

      {/* Estimates Table */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} style={{ color: 'var(--primary)' }} /> Danh Sách Báo Giá Sửa Chữa Mới Nhất
        </h3>

        <table aria-label="Estimates List">
          <thead>
            <tr>
              <th>Số Báo Giá</th>
              <th>Khách Hàng & Phương Tiện</th>
              <th>Lệnh SC</th>
              <th>Trạng Thái Duyệt</th>
              <th>Giảm Giá</th>
              <th>Tổng Tiền</th>
              <th>Thao Tác Tương Tác</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((est) => (
              <tr key={est.id}>
                <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{est.estimateNumber}</td>

                <td>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{est.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{est.vehicleDesc}</div>
                </td>

                <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{est.roNumber}</td>

                <td>{getStatusBadge(est.status)}</td>

                <td style={{ fontSize: '0.85rem' }}>{formatCurrency(est.discountAmount)}</td>

                <td style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>{formatCurrency(est.totalPrice)}</td>

                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => { setSelectedEst(est); setShowPreviewModal(true); }}>
                      <Eye size={12} /> Xem
                    </button>
                    <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => navigate('/delivery')}>
                      Giao Xe →
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoices Table */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={20} style={{ color: 'var(--success)' }} /> Hóa Đơn Đã Phát Hành & Thu Tiền
        </h3>

        <table aria-label="Invoices List">
          <thead>
            <tr>
              <th>Số Hóa Đơn</th>
              <th>Lệnh SC</th>
              <th>Khách Hàng</th>
              <th>Trạng Thái Thanh Toán</th>
              <th>Tạm Tính</th>
              <th>Thuế GTGT</th>
              <th>Tổng Cộng</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 800, color: 'var(--success)' }}>{inv.invoiceNumber}</td>
                <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{inv.roNumber}</td>
                <td style={{ fontWeight: 700 }}>{inv.customerName}</td>
                <td>{getStatusBadge(inv.status)}</td>
                <td>{formatCurrency(inv.subtotal)}</td>
                <td>{formatCurrency(inv.tax)}</td>
                <td style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.95rem' }}>{formatCurrency(inv.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ESTIMATE PREVIEW MODAL */}
      {showPreviewModal && selectedEst && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '580px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>CHI TIẾT BÁO GIÁ DỊCH VỤ</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedEst.estimateNumber}</h3>
              </div>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowPreviewModal(false)}>✕</button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>Khách hàng: <strong>{selectedEst.customerName}</strong></div>
              <div>Xe sửa chữa: <strong>{selectedEst.vehicleDesc}</strong></div>
              <div>Mã Lệnh SC: <strong>{selectedEst.roNumber}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Tổng giá trị báo giá:</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{formatCurrency(selectedEst.totalPrice)}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={() => { alert("Đã gửi link báo giá Zalo cho khách thành công!"); setShowPreviewModal(false); }}>
                <Share2 size={16} /> Gửi Zalo Cho Khách Duyệt
              </button>
              <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => { window.print(); setShowPreviewModal(false); }}>
                <Printer size={16} /> In Báo Giá (Print PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
