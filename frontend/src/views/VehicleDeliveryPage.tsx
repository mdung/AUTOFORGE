import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VehicleDeliveryPage() {
  const { t } = useTranslation();
  const [odometer, setOdometer] = useState(125350);
  const [signature, setSignature] = useState('');
  const [deferredList] = useState<string[]>([
    "Thay thế lốp trước bên phải (Hao mòn nặng)",
    "Bảo dưỡng định kỳ hộp số (Rò rỉ nhớt nhẹ)"
  ]);
  const [delivered, setDelivered] = useState(false);

  const handleDelivery = async () => {
    if (!signature.trim()) {
      alert("Vui lòng yêu cầu khách hàng ký nhận bàn giao xe!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/vehicles/00000000-0000-0000-0000-000000000000/delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 't-1'
        },
        body: JSON.stringify({
          odometerReading: odometer,
          customerSignature: signature,
          deferredWork: deferredList
        })
      });
      if (response.ok) {
        setDelivered(true);
      }
    } catch (e) {
      setDelivered(true);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('delivery.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('delivery.desc')}</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem' }}>Handover Protocol Checklist</h2>

        <div className="input-group">
          <span className="input-label">{t('delivery.odometer')}</span>
          <input className="input-field" type="number" value={odometer} onChange={(e) => setOdometer(parseInt(e.target.value))} />
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>{t('delivery.deferredTitle')}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {deferredList.map((def, idx) => (
              <div key={idx} style={{ fontSize: '0.8rem', padding: '6px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '4px' }}>
                • {def}
              </div>
            ))}
          </div>
        </div>

        {!delivered ? (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="input-label">{t('delivery.signature')}</span>
            <input className="input-field" placeholder={t('delivery.signaturePlaceholder')} value={signature} onChange={(e) => setSignature(e.target.value)} />
            <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={handleDelivery}>{t('delivery.complete')}</button>
          </div>
        ) : (
          <div style={{ padding: '12px', backgroundColor: 'var(--success-glow)', border: '1px solid var(--success)', borderRadius: '6px', color: 'var(--success)', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
            {t('delivery.successMsg')} {signature}
          </div>
        )}
      </div>
    </div>
  );
}
