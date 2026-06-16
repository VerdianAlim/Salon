import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Booking } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/formatCurrency';
import { formatDateLong } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as Booking | undefined;

  if (!booking) {
    navigate('/booking');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      <div className="pt-16 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg animate-scale-in">
          {/* Success animation */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-200 animate-scale-in">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Booking Berhasil! 🎉</h1>
            <p className="text-slate-500">Booking Anda telah kami terima dan sedang menunggu konfirmasi</p>
          </div>

          {/* Booking code card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-6">
            {/* Code */}
            <div className="text-center border-2 border-dashed border-rose-200 rounded-2xl p-5 mb-6 bg-rose-50">
              <p className="text-xs text-rose-500 font-semibold uppercase tracking-widest mb-1">Kode Booking Anda</p>
              <p className="text-2xl font-extrabold text-rose-600 tracking-wider font-mono">
                {booking.bookingCode}
              </p>
              <p className="text-xs text-slate-400 mt-2">Simpan kode ini untuk melacak status booking Anda</p>
            </div>

            {/* Detail */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Ringkasan Booking</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Layanan</span>
                  <span className="font-semibold text-slate-800 text-right">{booking.service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Harga</span>
                  <span className="font-bold text-rose-600">{formatCurrency(booking.service.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Durasi</span>
                  <span className="font-semibold text-slate-800">{formatDuration(booking.service.duration)}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal</span>
                  <span className="font-semibold text-slate-800">{formatDateLong(booking.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jam</span>
                  <span className="font-semibold text-slate-800">{booking.time} WIB</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama</span>
                  <span className="font-semibold text-slate-800">{booking.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. HP</span>
                  <span className="font-semibold text-slate-800">{booking.customer.phone}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-amber-700 font-medium">
                  Booking sedang menunggu konfirmasi dari salon. Kami akan menghubungi Anda segera.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/booking/history">
              <Button fullWidth variant="secondary" size="lg">
                Lihat Riwayat Booking
              </Button>
            </Link>
            <Link to="/">
              <Button fullWidth variant="ghost" size="lg">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccess;
