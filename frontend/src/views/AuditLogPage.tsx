import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, ShieldCheck, Key, Lock, Search, Filter, Clock, User, Download, RefreshCw, AlertTriangle } from 'lucide-react';

interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  category: 'SECURITY' | 'WORKSHOP' | 'BILLING' | 'INVENTORY';
  description: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export default function AuditLogPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const [logs] = useState<AuditLogItem[]>([
    {
      id: 'log-101',
      timestamp: '2026-08-16 05:35:12',
      actorName: 'Ann Nguyen',
      actorRole: 'TENANT_ADMIN',
      action: 'UPDATE_INVENTORY_STOCK',
      category: 'INVENTORY',
      description: 'Điều chỉnh nhập +5 sản phẩm cho phụ tùng Má Phanh Trước Ceramic (BRK-PAD-001)',
      ipAddress: '192.168.1.102 (Chrome / Windows)',
      status: 'SUCCESS'
    },
    {
      id: 'log-102',
      timestamp: '2026-08-16 05:28:45',
      actorName: 'Nguyễn Văn A',
      actorRole: 'SERVICE_ADVISOR',
      action: 'CREATE_REPAIR_ORDER',
      category: 'WORKSHOP',
      description: 'Tiếp nhận xe Toyota Camry (30A-12345) & khởi tạo Lệnh Sửa Chữa RO-2026-0001',
      ipAddress: '192.168.1.115 (iPad OS / Tablet)',
      status: 'SUCCESS'
    },
    {
      id: 'log-103',
      timestamp: '2026-08-16 05:15:30',
      actorName: 'Trần Minh Hoàng',
      actorRole: 'MASTER_TECHNICIAN',
      action: 'COMPLETE_DVI_INSPECTION',
      category: 'WORKSHOP',
      description: 'Hoàn tất hồ sơ kiểm định DVI cho xe Honda CR-V (30F-56789) - Phát hiện 2 lỗi đỏ',
      ipAddress: '192.168.1.140 (PWA Mobile)',
      status: 'SUCCESS'
    },
    {
      id: 'log-104',
      timestamp: '2026-08-16 04:50:18',
      actorName: 'Lê Thị Thu',
      actorRole: 'CASHIER',
      action: 'ISSUE_INVOICE_PAYMENT',
      category: 'BILLING',
      description: 'Xác nhận thanh toán 3,450,000 ₫ cho Hóa đơn INV-2026-0001 (Toyota Camry 30A-12345)',
      ipAddress: '192.168.1.108 (Windows Desktop)',
      status: 'SUCCESS'
    },
    {
      id: 'log-105',
      timestamp: '2026-08-16 04:10:00',
      actorName: 'System Defender',
      actorRole: 'SYSTEM_BOT',
      action: 'USER_LOGIN_ATTEMPT',
      category: 'SECURITY',
      description: 'Đăng nhập hệ thống thành công từ tài khoản Quản Trị Viên Ann Nguyen',
      ipAddress: '113.161.45.88 (Hồ Chí Minh)',
      status: 'SUCCESS'
    }
  ]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);

    const matchesTab = activeTab === 'ALL' || log.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={28} style={{ color: 'var(--primary)' }} /> {t('audit.title')} & Security Audit Trail Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Nhật ký truy vết sự kiện giao dịch xưởng, bảo mật tài khoản & ghi nhận thay đổi dữ liệu thời gian thực
          </p>
        </div>

        <button className="btn btn-secondary" onClick={() => alert("Đã xuất tập tin nhật ký hệ thống CSV/PDF!")}>
          <Download size={16} /> Xuất Báo Cáo Nhật Ký Audit
        </button>
      </div>

      {/* Audit KPI Overview */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Sự Kiện Đã Ghi Nhận</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>1,480 Nhật Ký</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Trạng Thái An Ninh</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>🟢 0 Vi Phạm</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--info-glow)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tài Khoản Đang Mở Phiên</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>6 Tài Khoản</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tần Suất Cập Nhật</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>Real-time</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'ALL', label: 'Tất Cả Nhật Ký' },
            { id: 'SECURITY', label: '🔑 Bảo Mật & Đăng Nhập' },
            { id: 'WORKSHOP', label: '🚗 Xưởng & Lệnh SC' },
            { id: 'BILLING', label: '💰 Báo Giá & Hóa Đơn' },
            { id: 'INVENTORY', label: '📦 Kho Phụ Tùng' }
          ].map(tab => (
            <button
              key={tab.id}
              className="btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '8px 14px',
                borderRadius: '20px',
                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="input-field" 
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên KTV, hành động..."
          />
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="card" style={{ padding: '20px' }}>
        <table aria-label="Audit Event Trail">
          <thead>
            <tr>
              <th>Mốc Thời Gian</th>
              <th>Người Thực Hiện (Actor)</th>
              <th>Mã Hành Động (Event Action)</th>
              <th>Mô Tả Giao Dịch Chi Tiết</th>
              <th>Thiết Bị & IP</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} style={{ color: 'var(--primary)' }} /> {log.timestamp}
                  </div>
                </td>

                <td>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{log.actorName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.actorRole}</div>
                </td>

                <td>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', backgroundColor: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>
                    {log.action}
                  </span>
                </td>

                <td style={{ fontSize: '0.85rem', maxWidth: '320px' }}>
                  {log.description}
                </td>

                <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {log.ipAddress}
                </td>

                <td>
                  <span className="badge badge-completed">
                    ✓ SUCCESS
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
