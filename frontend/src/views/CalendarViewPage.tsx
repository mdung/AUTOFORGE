import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Appointment {
  id: string;
  customerName: string;
  vehicleDesc: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface CalendarViewPageProps {
  appointments: Appointment[];
  onAddAppointment?: () => void;
}

export default function CalendarViewPage({ appointments }: CalendarViewPageProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  // Seed at 2026-08-14 where demo data is populated
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-08-14'));

  const formatShortDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(appt => appt.date === dateStr);
  };

  const getWeekDays = (start: Date) => {
    const days = [];
    const dateCopy = new Date(start);
    const day = dateCopy.getDay();
    const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1);
    dateCopy.setDate(diff);

    for (let i = 0; i < 7; i++) {
      days.push(new Date(dateCopy));
      dateCopy.setDate(dateCopy.getDate() + 1);
    }
    return days;
  };

  const getMonthGridDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const day = firstDay.getDay();
    const diff = firstDay.getDate() - day + (day === 0 ? -6 : 1);
    
    const startDate = new Date(firstDay);
    startDate.setDate(diff);

    const days: Date[] = [];
    const curr = new Date(startDate);
    for (let i = 0; i < 35; i++) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const monthDays = getMonthGridDays(currentDate);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleSelectDay = (day: Date) => {
    setCurrentDate(day);
    setViewMode('day');
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarIcon size={28} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {t('calendar.title')}
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setViewMode('day')}
            className="btn"
            style={{ padding: '6px 16px', fontSize: '0.85rem', backgroundColor: viewMode === 'day' ? 'var(--primary)' : 'transparent', color: viewMode === 'day' ? '#fff' : 'var(--text-secondary)' }}
          >
            {t('calendar.day')}
          </button>
          <button 
            onClick={() => setViewMode('week')}
            className="btn"
            style={{ padding: '6px 16px', fontSize: '0.85rem', backgroundColor: viewMode === 'week' ? 'var(--primary)' : 'transparent', color: viewMode === 'week' ? '#fff' : 'var(--text-secondary)' }}
          >
            {t('calendar.week')}
          </button>
          <button 
            onClick={() => setViewMode('month')}
            className="btn"
            style={{ padding: '6px 16px', fontSize: '0.85rem', backgroundColor: viewMode === 'month' ? 'var(--primary)' : 'transparent', color: viewMode === 'month' ? '#fff' : 'var(--text-secondary)' }}
          >
            {t('calendar.month')}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrev} className="btn btn-secondary" style={{ padding: '8px 12px' }} aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontWeight: 700, padding: '0 12px', fontSize: '1rem', minWidth: '160px', textAlign: 'center' }}>
            {viewMode === 'day'
              ? currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
              : currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNext} className="btn btn-secondary" style={{ padding: '8px 12px' }} aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
          {weekDays.map((day, idx) => {
            const dateStr = formatShortDate(day);
            const appts = getAppointmentsForDate(dateStr);
            const isSelected = formatShortDate(currentDate) === dateStr;

            return (
              <div 
                key={idx} 
                onClick={() => handleSelectDay(day)}
                style={{ 
                  backgroundColor: 'var(--bg-surface-elevated)', 
                  borderRadius: '12px', 
                  padding: '12px', 
                  minHeight: '340px', 
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {day.toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                  <span style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.85rem', fontWeight: 700, backgroundColor: isSelected ? 'var(--primary)' : 'transparent', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                    {day.getDate()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {appts.map((appt) => (
                    <div 
                      key={appt.id} 
                      style={{ padding: '8px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
                    >
                      <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.customerName}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.vehicleDesc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        <Clock size={11} />
                        <span>{appt.time} - {String(t(`serviceTypes.${appt.type}`, appt.type || ''))}</span>
                      </div>
                    </div>
                  ))}
                  {appts.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '40px 0' }}>
                      {t('calendar.no_appts')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{currentDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="badge badge-requested" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
              {getAppointmentsForDate(formatShortDate(currentDate)).length} {t('calendar.appointments_unit')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {getAppointmentsForDate(formatShortDate(currentDate)).map((appt) => (
              <div 
                key={appt.id} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '10px', backgroundColor: 'var(--bg-surface-elevated)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', border: '1px solid var(--border-color)' }}>
                    <Clock size={16} />
                    {appt.time}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>{appt.customerName}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{appt.vehicleDesc} • <span style={{ color: 'var(--text-muted)' }}>{String(t(`serviceTypes.${appt.type}`, appt.type || ''))}</span></p>
                  </div>
                </div>

                <span className={`badge badge-${appt.status?.toLowerCase()}`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  {String(t(`status.${appt.status}`, appt.status || ''))}
                </span>
              </div>
            ))}
            {getAppointmentsForDate(formatShortDate(currentDate)).length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontSize: '0.95rem' }}>
                {t('calendar.no_appts_day')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div>
          {/* Month Header Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px', textAlign: 'center' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', padding: '8px 0' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Month Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {monthDays.map((day, idx) => {
              const dateStr = formatShortDate(day);
              const appts = getAppointmentsForDate(dateStr);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = formatShortDate(new Date()) === dateStr;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectDay(day)}
                  style={{
                    backgroundColor: isCurrentMonth ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                    opacity: isCurrentMonth ? 1 : 0.4,
                    borderRadius: '10px',
                    padding: '8px',
                    minHeight: '100px',
                    cursor: 'pointer',
                    border: isToday ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {day.getDate()}
                    </span>
                    {appts.length > 0 && (
                      <span className="badge badge-requested" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        {appts.length}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                    {appts.slice(0, 2).map((appt) => (
                      <div
                        key={appt.id}
                        style={{
                          fontSize: '0.65rem',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {appt.time} {appt.customerName}
                      </div>
                    ))}
                    {appts.length > 2 && (
                      <div style={{ fontSize: '0.62rem', color: 'var(--primary)', fontWeight: 600 }}>
                        +{appts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
