import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, ShieldCheck, Key, Lock, Plus, UserPlus, CheckCircle2, AlertTriangle, Shield, Edit3, Trash2 } from 'lucide-react';

interface StaffUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'TENANT_ADMIN' | 'SERVICE_ADVISOR' | 'MASTER_TECHNICIAN' | 'TECHNICIAN' | 'CASHIER' | 'PARTS_MANAGER';
  status: 'ACTIVE' | 'SUSPENDED';
  lastActive: string;
}

export default function UserAdminPage() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'SERVICE_ADVISOR' });

  const [users, setUsers] = useState<StaffUser[]>([
    { id: 1, name: 'Ann Nguyen', email: 'admin@autoforge.com', phone: '0912345678', role: 'TENANT_ADMIN', status: 'ACTIVE', lastActive: 'Đang hoạt động' },
    { id: 2, name: 'Nguyễn Văn A', email: 'advisor@autoforge.com', phone: '0987654321', role: 'SERVICE_ADVISOR', status: 'ACTIVE', lastActive: '5 phút trước' },
    { id: 3, name: 'Trần Minh Hoàng', email: 'tech@autoforge.com', phone: '0901122334', role: 'MASTER_TECHNICIAN', status: 'ACTIVE', lastActive: 'Vừa xong' },
    { id: 4, name: 'Lê Thị Thu', email: 'cashier@autoforge.com', phone: '0944556677', role: 'CASHIER', status: 'ACTIVE', lastActive: '12 phút trước' },
    { id: 5, name: 'Phạm Quốc Bảo', email: 'ev.tech@autoforge.com', phone: '0933445566', role: 'TECHNICIAN', status: 'ACTIVE', lastActive: '30 phút trước' }
  ]);

  const toggleStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  const updateRole = (id: number, newRole: any) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newU: StaffUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone || '0900000000',
      role: form.role as any,
      status: 'ACTIVE',
      lastActive: 'Vừa khởi tạo'
    };
    setUsers([...users, newU]);
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', role: 'SERVICE_ADVISOR' });
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      'TENANT_ADMIN': { label: '👑 Quản Trị Viên (Admin)', color: 'var(--primary)' },
      'SERVICE_ADVISOR': { label: '📋 Cố Vấn Dịch Vụ (Advisor)', color: 'var(--info)' },
      'MASTER_TECHNICIAN': { label: '👨‍🔧 Master Technician', color: '#a855f7' },
      'TECHNICIAN': { label: '🔧 Kỹ Thuật Viên (Technician)', color: 'var(--warning)' },
      'CASHIER': { label: '💰 Thu Ngân (Cashier)', color: 'var(--success)' },
      'PARTS_MANAGER': { label: '📦 Quản Lý Kho (Parts Manager)', color: '#06b6d4' }
    };
    return roles[role] || { label: role, color: 'var(--text-primary)' };
  };

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={28} style={{ color: 'var(--primary)' }} /> {t('admin.title')} & RBAC Control Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Danh sách tài khoản nhân viên, thiết lập vai trò phân quyền (RBAC) & quản lý quyền truy cập xưởng
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} /> Thêm Nhân Viên Mới
        </button>
      </div>

      {/* Staff KPI Summary */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tổng Nhân Viên Xưởng</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{users.length} Nhân Viên</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tài Khoản Đang Hoạt Động</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>{users.filter(u => u.status === 'ACTIVE').length} Tài Khoản</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Cấp Độ Phân Quyền (RBAC)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>6 Vai Trò</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--info-glow)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Bảo Mật Mật Khẩu & 2FA</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--info)' }}>100% An Toàn</div>
          </div>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="card" style={{ padding: '20px' }}>
        <table aria-label="Staff Members Directory">
          <thead>
            <tr>
              <th>Nhân Viên</th>
              <th>Email & Số Điện Thoại</th>
              <th>Vai Trò Phân Quyền (RBAC)</th>
              <th>Hoạt Động Gần Nhất</th>
              <th>Trạng Thái</th>
              <th>Thao Tác Quản Trị</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const roleObj = getRoleLabel(u.role);
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: roleObj.color, color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                        {u.name.split(' ').pop()?.[0] || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mã NV: #00{u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.email}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>SĐT: {u.phone}</div>
                  </td>

                  <td>
                    <select 
                      value={u.role} 
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
                    >
                      <option value="TENANT_ADMIN">👑 Quản Trị Viên (Admin)</option>
                      <option value="SERVICE_ADVISOR">📋 Cố Vấn Dịch Vụ (Advisor)</option>
                      <option value="MASTER_TECHNICIAN">👨‍🔧 Master Technician</option>
                      <option value="TECHNICIAN">🔧 Kỹ Thuật Viên (Technician)</option>
                      <option value="CASHIER">💰 Thu Ngân (Cashier)</option>
                      <option value="PARTS_MANAGER">📦 Quản Lý Kho (Parts)</option>
                    </select>
                  </td>

                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {u.lastActive}
                  </td>

                  <td>
                    <span className={`badge badge-${u.status.toLowerCase()}`}>
                      {u.status === 'ACTIVE' ? '🟢 HOẠT ĐỘNG' : '🔴 TẠM KHÓA'}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => alert(`Đã gửi email reset mật khẩu đến ${u.email}!`)}>
                        <Key size={12} /> Reset Pass
                      </button>
                      <button 
                        className={`btn ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }} 
                        onClick={() => toggleStatus(u.id)}
                      >
                        {u.status === 'ACTIVE' ? 'Khóa' : 'Mở Khóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* NEW STAFF MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface-elevated)', border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} style={{ color: 'var(--primary)' }} /> Thêm Tài Khoản Nhân Viên Mới
              </h3>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="input-group">
                <span className="input-label">Họ Tên Nhân Viên</span>
                <input className="input-field" placeholder="VD: Nguyễn Văn B" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">Email Đăng Nhập</span>
                  <input className="input-field" type="email" placeholder="email@autoforge.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="input-group">
                  <span className="input-label">Số Điện Thoại</span>
                  <input className="input-field" placeholder="09xxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Vai Trò Phân Quyền (RBAC Role)</span>
                <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="SERVICE_ADVISOR">📋 Cố Vấn Dịch Vụ (Advisor)</option>
                  <option value="MASTER_TECHNICIAN">👨‍🔧 Master Technician</option>
                  <option value="TECHNICIAN">🔧 Kỹ Thuật Viên (Technician)</option>
                  <option value="CASHIER">💰 Thu Ngân (Cashier)</option>
                  <option value="PARTS_MANAGER">📦 Quản Lý Kho (Parts)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Khởi Tạo Tài Khoản Nhân Viên
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
