import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Booking, BookingStatus } from '../../types';
import { getBookingById, updateBookingStatus } from '../../services/bookingService';
import { STATUS_LABELS } from '../../utils/constants';
import { formatDateLong } from '../../utils/formatDate';
import { formatCurrency, formatDuration } from '../../utils/formatCurrency';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import { PageSpinner } from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../utils/formatDate';

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'pending', label: STATUS_LABELS.pending },
  { value: 'confirmed', label: STATUS_LABELS.confirmed },
  { value: 'completed', label: STATUS_LABELS.completed },
  { value: 'cancelled', label: STATUS_LABELS.cancelled },
];

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | ''>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBookingById(id).then(data => {
      setBooking(data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) return <PageSpinner />;

  if (!booking) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-xl font-bold text-slate-700 mb-3">Booking Tidak Ditemukan</h2>
      <Button onClick={() => navigate('/admin/bookings')}>← Kembali ke Daftar</Button>
    </div>
  );

  const availableTransitions = STATUS_TRANSITIONS[booking.status];

  const handleStatusChange = () => {
    if (!selectedStatus) return;
    setShowConfirm(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedStatus || !booking) return;
    setIsUpdating(true);
    try {
      const updated = await updateBookingStatus(booking.id, selectedStatus);
      setBooking(updated);
      setSelectedStatus('');
      toast.success(`Status diubah ke "${STATUS_LABELS[selectedStatus]}"`);
    } catch {
      toast.error('Gagal mengubah status booking');
    } finally {
      setIsUpdating(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Detail Booking</h1>
          <p className="text-slate-500 text-sm font-mono">{booking.bookingCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Status Booking</h2>
              <Badge variant={booking.status}>{STATUS_LABELS[booking.status]}</Badge>
            </div>

            {availableTransitions.length > 0 ? (
              <div className="flex items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as BookingStatus)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                >
                  <option value="">Pilih status baru...</option>
                  {STATUS_OPTIONS.filter(o => availableTransitions.includes(o.value)).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <Button
                  onClick={handleStatusChange}
                  disabled={!selectedStatus}
                  size="md"
                >
                  Ubah Status
                </Button>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Status tidak dapat diubah lagi</p>
            )}
          </div>

          {/* Layanan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">Informasi Layanan</h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">{booking.service.name}</p>
                <p className="text-sm text-slate-500 mb-2">{booking.service.category}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{booking.service.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="font-bold text-rose-600">{formatCurrency(booking.service.price)}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{formatDuration(booking.service.duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Jadwal */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">Jadwal Booking</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-1">TANGGAL</p>
                <p className="font-bold text-slate-800">{formatDateLong(booking.date)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-1">JAM</p>
                <p className="font-bold text-slate-800">{booking.time} WIB</p>
              </div>
            </div>
          </div>

          {/* Catatan */}
          {booking.notes && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h2 className="font-bold text-amber-800 mb-2 text-sm">📝 Catatan Pelanggan</h2>
              <p className="text-amber-700 text-sm">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-5">
          {/* Pelanggan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">Data Pelanggan</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm flex-shrink-0">
                  {booking.customer.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{booking.customer.name}</p>
                  <p className="text-slate-400 text-xs">Pelanggan</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{booking.customer.phone}</span>
              </div>
              {booking.customer.email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{booking.customer.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">Informasi Booking</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Kode</span>
                <span className="font-mono font-bold text-slate-700 text-xs">{booking.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dibuat</span>
                <span className="text-slate-600">{formatRelativeTime(booking.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <Badge variant={booking.status}>{STATUS_LABELS[booking.status]}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmStatusChange}
        title="Ubah Status Booking"
        message={`Apakah Anda yakin ingin mengubah status booking ini menjadi "${selectedStatus ? STATUS_LABELS[selectedStatus] : ''}"?`}
        confirmLabel="Ya, Ubah Status"
        confirmVariant={selectedStatus === 'cancelled' ? 'danger' : 'primary'}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default BookingDetail;
