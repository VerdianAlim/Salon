import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import type { Booking } from '../../types';
import { getBookings } from '../../services/bookingService';
import { STATUS_LABELS } from '../../utils/constants';
import type { BookingStatus } from '../../types';
import Button from '../../components/ui/Button';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBookings().then(data => {
      setBookings(data.filter(b => b.status !== 'cancelled'));
      setIsLoading(false);
    });
  }, []);

  // Generate 6 hari (Senin - Sabtu)
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(currentWeekStart, i));

  const getBookingsForSlot = (date: Date, time: string): Booking[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(b => b.date === dateStr && b.time === time);
  };

  const goToPreviousWeek = () => setCurrentWeekStart(d => addDays(d, -7));
  const goToNextWeek = () => setCurrentWeekStart(d => addDays(d, 7));
  const goToCurrentWeek = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekRange = `${format(weekDays[0], 'd MMM', { locale: id })} – ${format(weekDays[5], 'd MMMM yyyy', { locale: id })}`;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Kalender Booking</h1>
          <p className="text-slate-500 text-sm">{weekRange}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            ← Minggu Lalu
          </Button>
          <Button variant="secondary" size="sm" onClick={goToCurrentWeek}>
            Minggu Ini
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Minggu Depan →
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        {(Object.entries(STATUS_COLORS) as [BookingStatus, string][])
          .filter(([s]) => s !== 'cancelled')
          .map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full border ${color.split(' ')[0]}`} />
              <span className="text-xs text-slate-500 font-medium">{STATUS_LABELS[status]}</span>
            </div>
          ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            {/* Day headers */}
            <thead>
              <tr className="border-b border-slate-100">
                <th className="w-20 px-3 py-3 text-xs font-semibold text-slate-400 uppercase text-left sticky left-0 bg-white">
                  Waktu
                </th>
                {weekDays.map(day => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <th key={day.toISOString()} className="px-3 py-3 text-center min-w-[120px]">
                      <div className={`text-xs font-semibold uppercase tracking-wide ${isToday ? 'text-rose-500' : 'text-slate-400'}`}>
                        {format(day, 'EEE', { locale: id })}
                      </div>
                      <div className={`text-lg font-extrabold mt-0.5 ${isToday ? 'text-rose-600' : 'text-slate-800'}`}>
                        {format(day, 'd')}
                      </div>
                      {isToday && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mx-auto mt-1" />}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {TIME_SLOTS.map(time => (
                <tr key={time} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  {/* Time label */}
                  <td className="px-3 py-2 text-xs font-semibold text-slate-400 sticky left-0 bg-white align-top pt-3">
                    {time}
                  </td>

                  {/* Booking slots */}
                  {weekDays.map(day => {
                    const slotBookings = isLoading ? [] : getBookingsForSlot(day, time);
                    const isToday = isSameDay(day, new Date());
                    return (
                      <td
                        key={`${day.toISOString()}-${time}`}
                        className={`px-2 py-2 align-top min-h-[60px] border-l border-slate-50 ${isToday ? 'bg-rose-50/30' : ''}`}
                      >
                        {isLoading ? (
                          <div className="h-8 skeleton-shimmer rounded-lg" />
                        ) : slotBookings.length === 0 ? (
                          <div className="h-8" />
                        ) : (
                          slotBookings.map(b => (
                            <button
                              key={b.id}
                              onClick={() => navigate(`/admin/bookings/${b.id}`)}
                              className={`
                                w-full text-left p-2 rounded-lg border text-xs mb-1 last:mb-0
                                transition-all hover:shadow-sm hover:-translate-y-0.5
                                ${STATUS_COLORS[b.status as BookingStatus]}
                              `}
                            >
                              <p className="font-semibold truncate">{b.customer.name}</p>
                              <p className="opacity-70 truncate">{b.service.name}</p>
                            </button>
                          ))
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
