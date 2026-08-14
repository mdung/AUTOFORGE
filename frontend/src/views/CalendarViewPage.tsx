import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Filter } from 'lucide-react';
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

export default function CalendarViewPage({ appointments, onAddAppointment }: CalendarViewPageProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-08-12')); // Seeding at date of demo data

  const getWeekDays = (start: Date) => {
    const days = [];
    const dateCopy = new Date(start);
    // Find monday of current date
    const day = dateCopy.getDay();
    const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1); 
    dateCopy.setDate(diff);

    for (let i = 0; i < 7; i++) {
      days.push(new Date(dateCopy));
      dateCopy.setDate(dateCopy.getDate() + 1);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);

  const formatShortDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(appt => appt.date === dateStr);
  };

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

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-indigo-400" />
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {t('navigation.appointments', 'Lịch hẹn & Bay dịch vụ')}
          </h2>
        </div>
        
        <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
          <button 
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${viewMode === 'day' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            {t('calendar.day', 'Ngày')}
          </button>
          <button 
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${viewMode === 'week' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            {t('calendar.week', 'Tuần')}
          </button>
          <button 
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${viewMode === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            {t('calendar.month', 'Tháng')}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors" aria-label="Previous">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold px-4 text-slate-200">
            {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNext} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors" aria-label="Next">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, idx) => {
            const dateStr = formatShortDate(day);
            const appts = getAppointmentsForDate(dateStr);
            const isToday = formatShortDate(new Date()) === dateStr;

            return (
              <div key={idx} className={`bg-slate-800/40 rounded-xl p-4 min-h-[300px] border transition-all duration-300 hover:bg-slate-800/75 ${isToday ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/5' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <span className="text-xs uppercase font-semibold text-slate-400">
                    {day.toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-indigo-600 text-white shadow' : 'text-slate-200'}`}>
                    {day.getDate()}
                  </span>
                </div>

                <div className="space-y-3">
                  {appts.map((appt) => (
                    <div 
                      key={appt.id} 
                      className={`p-3 rounded-lg text-xs border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        appt.status === 'ARRIVED' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                          : appt.status === 'CONFIRMED' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      }`}
                    >
                      <div className="font-semibold truncate">{appt.customerName}</div>
                      <div className="text-slate-400 mt-1 truncate">{appt.vehicleDesc}</div>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{appt.time} - {appt.type}</span>
                      </div>
                    </div>
                  ))}
                  {appts.length === 0 && (
                    <div className="text-center text-slate-600 text-xs py-8">
                      {t('calendar.no_appts', 'Không có lịch')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'day' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 p-6">
          <div className="text-lg font-semibold mb-4 text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>{currentDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <span className="text-xs px-2.5 py-1 bg-slate-800 text-indigo-400 rounded-full border border-slate-700">
              {getAppointmentsForDate(formatShortDate(currentDate)).length} {t('calendar.appointments_unit', 'lịch hẹn')}
            </span>
          </div>

          <div className="space-y-4">
            {getAppointmentsForDate(formatShortDate(currentDate)).map((appt) => (
              <div 
                key={appt.id} 
                className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex flex-col items-center justify-center text-xs font-semibold text-slate-400 border border-slate-700">
                    <Clock className="w-4 h-4 text-indigo-400 mb-0.5" />
                    {appt.time}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">{appt.customerName}</h4>
                    <p className="text-slate-400 text-sm">{appt.vehicleDesc} • <span className="text-slate-500">{appt.type}</span></p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                  appt.status === 'ARRIVED' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                    : appt.status === 'CONFIRMED' 
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' 
                      : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                }`}>
                  {appt.status}
                </span>
              </div>
            ))}
            {getAppointmentsForDate(formatShortDate(currentDate)).length === 0 && (
              <div className="text-center text-slate-500 py-12">
                {t('calendar.no_appts_day', 'Không có lịch hẹn nào được lên lịch cho ngày hôm nay')}
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'month' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 p-6 text-center text-slate-400 py-16">
          {t('calendar.month_view_fallback', 'Vui lòng chọn chế độ Tuần hoặc Ngày để xem và điều phối chi tiết công việc của xưởng dịch vụ.')}
        </div>
      )}
    </div>
  );
}
