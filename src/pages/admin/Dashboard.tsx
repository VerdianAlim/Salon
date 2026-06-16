import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { Booking, DashboardStats } from '../../types';
import { useBookingStore } from '../../store/bookingStore';
import { STATUS_LABELS } from '../../utils/constants';
import Badge from '../../components/ui/Badge';
import type { BookingStatus } from '../../types';
import { formatDateShort } from '../../utils/formatDate';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { startOfWeek, addDays, format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

const PIE_COLORS = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}>
        <span className={color}>{icon}</span>
      </div>
    </div>
    <p className="text-3xl font-extrabold text-slate-800">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, fetchBookings, setupRealtime } = useBookingStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ name: string; booking: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings().finally(() => setIsLoading(false));
    setupRealtime();
  }, [fetchBookings, setupRealtime]);

  useEffect(() => {
    if (isLoading && bookings.length === 0) return;


      // 1. Calculate Stats
      const today = format(new Date(), 'yyyy-MM-dd');
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const currentWeekDates = Array.from({ length: 7 }, (_, i) => format(addDays(startOfCurrentWeek, i), 'yyyy-MM-dd'));

      const calculatedStats: DashboardStats = {
        totalToday: bookings.filter(b => b.date === today).length,
        totalThisWeek: bookings.filter(b => currentWeekDates.includes(b.date)).length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
      };

      // 2. Calculate Weekly Chart Data
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(startOfCurrentWeek, i);
        const dateStr = format(d, 'yyyy-MM-dd');
        return {
          name: format(d, 'EEE', { locale: localeID }),
          booking: bookings.filter(b => b.date === dateStr).length,
        };
      });

      // 3. Calculate Pie Chart (Service Distribution)
      const serviceCounts = bookings.reduce((acc, b) => {
        const sName = b.service.name;
        acc[sName] = (acc[sName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const pieChartData = Object.keys(serviceCounts).map(name => ({
        name,
        value: serviceCounts[name],
      })).sort((a, b) => b.value - a.value);

      setStats(calculatedStats);
      setRecentBookings(bookings.slice(0, 5));
      setWeeklyData(weekData);
      setPieData(pieChartData);
  }, [bookings, isLoading]);

  const statCards = stats
    ? [
        { title: 'Booking Hari Ini', value: stats.totalToday, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'text-rose-600', bgColor: 'bg-rose-100' },
        { title: 'Booking Minggu Ini', value: stats.totalThisWeek, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, color: 'text-violet-600', bgColor: 'bg-violet-100' },
        { title: 'Menunggu Konfirmasi', value: stats.pending, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-amber-600', bgColor: 'bg-amber-100' },
        { title: 'Dikonfirmasi', value: stats.confirmed, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Selesai', value: stats.completed, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
        { title: 'Dibatalkan', value: stats.cancelled, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>, color: 'text-red-600', bgColor: 'bg-red-100' },
      ]
    : [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Selamat datang di panel admin Salon Widya</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(card => <StatCard key={card.title} {...card} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-5">Tren Booking Minggu Ini</h2>
          {isLoading ? (
            <div className="h-48 skeleton-shimmer rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 13 }}
                  formatter={(val) => [`${val} booking`, 'Jumlah']}
                />
                <Bar dataKey="booking" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-5">Distribusi per Layanan</h2>
          {isLoading ? (
            <div className="h-48 skeleton-shimmer rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(val, name) => [`${val} booking`, name]}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Booking Terbaru</h2>
          <Link to="/admin/bookings" className="text-sm text-rose-500 hover:text-rose-600 font-semibold transition-colors">
            Lihat Semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Kode', 'Pelanggan', 'Layanan', 'Tanggal', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 skeleton-shimmer rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : recentBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-600">{b.bookingCode}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{b.customer.name}</td>
                  <td className="px-5 py-3 text-slate-600">{b.service.name}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDateShort(b.date)} · {b.time}</td>
                  <td className="px-5 py-3">
                    <Badge variant={b.status as BookingStatus}>{STATUS_LABELS[b.status]}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => navigate(`/admin/bookings/${b.id}`)}
                      className="text-rose-500 hover:text-rose-700 font-semibold text-xs transition-colors"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
