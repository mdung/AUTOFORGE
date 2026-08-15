import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AuditLogPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/notifications', {
        headers: { 'X-Tenant-ID': '00000000-0000-0000-0000-000000000000' }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (e) {
      console.warn("Audit logs service offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('audit.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('audit.desc')}</p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{t('audit.registry')}</h2>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t('audit.loading')}</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>{t('audit.noEvents')}</p>
            ) : (
              logs.map((log: any) => (
                <div key={log.id} style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '4px' }}>
                    <span className="text-primary">{log.title}</span>
                    <span style={{ color: 'var(--success)' }}>{log.status}</span>
                  </div>
                  <div>Message: {log.message}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Time: {log.createdAt || log.timestamp} | Channel: {log.channel || "SYSTEM"}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
