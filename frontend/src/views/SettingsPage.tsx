import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../App';
import type { ThemeStyle } from '../App';
import { Palette, Sun, Moon, Globe, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, themeStyle, toggleTheme, changeThemeStyle } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const themeOptions: Array<{ id: ThemeStyle; name: string; desc: string; badge: string; color: string }> = [
    {
      id: 'smart-garage',
      name: '⚡ High-Tech Smart Garage',
      desc: 'Tông màu Xanh Cobalt Công nghiệp + Cam Cảnh Báo. Sáng sủa, sắc nét & tương phản cao.',
      badge: 'Cobalt & Forge Amber',
      color: '#2563eb'
    },
    {
      id: 'industrial',
      name: '🔧 Industrial Precision',
      desc: 'Tông Titan Metallic + Vàng Chẩn Đoán & Cyber Cyan. Phong cách thiết bị kỹ thuật chuyên dụng.',
      badge: 'Titanium & Diagnostic Yellow',
      color: '#eab308'
    },
    {
      id: 'premium',
      name: '🏎️ Porsche / Audi Showroom',
      desc: 'Tông Đỏ Racing + Trắng Kim Loại Tối Giản. Đột phá sang trọng như showroom xe hơi cao cấp.',
      badge: 'Porsche Red & Platinum',
      color: '#e53e3e'
    }
  ];

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Palette size={28} style={{ color: 'var(--primary)' }} /> {t('settings')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Cấu hình hệ thống, ngôn ngữ quốc tế hóa (i18n) và tùy chọn phong cách xưởng sửa chữa
        </p>
      </div>

      {/* Workshop Theme Style Selector Section */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Phong Cách Giao Diện Xưởng (Workshop Theme)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Lựa chọn phong cách thẩm mỹ phù hợp nhất với mô hình vận hành xưởng dịch vụ của bạn
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {themeOptions.map((opt) => {
            const isSelected = themeStyle === opt.id;
            return (
              <div 
                key={opt.id}
                onClick={() => changeThemeStyle(opt.id)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: isSelected ? `2px solid ${opt.color}` : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: opt.color, display: 'inline-block' }}></span>
                    {opt.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {opt.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    {opt.badge}
                  </span>
                  {isSelected && <CheckCircle size={20} style={{ color: opt.color }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Light / Dark Mode & Language Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Tùy Chọn Chế Độ & Ngôn Ngữ
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} /> Ngôn ngữ hiển thị (i18n)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Chuyển đổi ngôn ngữ ứng dụng</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${i18n.language === 'vi' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => changeLanguage('vi')}>🇻🇳 Tiếng Việt</button>
            <button className={`btn ${i18n.language === 'en' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => changeLanguage('en')}>🇺🇸 English</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} Chế độ Sáng / Tối (Light / Dark Mode)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Đang bật: <strong>{theme === 'dark' ? 'Executive Dark' : 'Executive Light'}</strong>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Bật Chế Độ Sáng' : '🌙 Bật Chế Độ Tối'}
          </button>
        </div>
      </div>
    </div>
  );
}
