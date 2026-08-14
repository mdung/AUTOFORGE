import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../App';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('settings')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Cấu hình hệ thống, ngôn ngữ quốc tế hóa (i18n) và tùy chỉnh giao diện</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Tùy Chọn Cá Nhân</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ngôn ngữ hiển thị (i18n)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lựa chọn tiếng Anh hoặc tiếng Việt</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => changeLanguage('en')}>English</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Giao diện (Theme)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Đang chọn: <strong>{theme === 'dark' ? 'Chế độ Tối (Dark Mode)' : 'Chế độ Sáng (Light Mode)'}</strong>
            </div>
          </div>
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={toggleTheme}>
            {theme === 'dark' ? 'Chuyển sang Sáng' : 'Chuyển sang Tối'}
          </button>
        </div>
      </div>
    </div>
  );
}
