import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function UserAdminPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([
    { id: 1, email: "advisor@autoforge.com", name: "Nguyễn Văn A", role: "SERVICE_ADVISOR", status: "ACTIVE" },
    { id: 2, email: "tech@autoforge.com", name: "Trần Minh Hoàng", role: "MASTER_TECHNICIAN", status: "ACTIVE" },
    { id: 3, email: "cashier@autoforge.com", name: "Lê Thị Thu", role: "CASHIER", status: "ACTIVE" }
  ]);

  const toggleStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  const updateRole = (id: number, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('admin.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('admin.desc')}</p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{t('admin.directory')}</h2>
        <table aria-label={t('admin.directory')}>
          <thead>
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.email')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('admin.status')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select 
                    value={u.role} 
                    onChange={(e) => updateRole(u.id, e.target.value)}
                  >
                    <option value="SERVICE_ADVISOR">Service Advisor</option>
                    <option value="MASTER_TECHNICIAN">Master Technician</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="CASHIER">Cashier</option>
                  </select>
                </td>
                <td>
                  <span className={`badge badge-${u.status.toLowerCase()}`}>
                    {String(t(`status.${u.status}`, u.status))}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }} 
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === 'ACTIVE' ? t('admin.suspend') : t('admin.activate')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
