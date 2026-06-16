import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Booking } from '../../types';
import { getBookingsByPhone } from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';
import { STATUS_LABELS } from '../../utils/constants';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import type { BookingStatus } from '../../types';
import { BookingCardSkeleton } from '../../components/ui/Skeleton';

const BookingHistory: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    const results = await getBookingsByPhone(phone.trim());
    setBookings(results);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-14">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-rose-500 font-semibold text-sm uppercase tracking-wide mb-2">Riwayat</p>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Riwayat Booking Saya</h1>
            <p className="text-slate-500 leading-relaxed">
              Masukkan nomor HP yang Anda gunakan saat booking untuk melihat semua riwayat booking Anda.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
            <p className="text-sm font-semibold text-slate-700 mb-4">Cari Booking Berdasarkan Nomor HP</p>
            <div className="flex gap-3">
              <Input
                id="search-phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Contoh: 08123456789"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              <Button onClick={handleSearch} isLoading={isLoading} className="flex-shrink-0">
                Cari
              </Button>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)}
            </div>
          ) : hasSearched && bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Booking Tidak Ditemukan</h3>
              <p className="text-sm text-slate-400 mb-5">Tidak ada booking dengan nomor HP ini</p>
              <Link to="/booking">
                <Button size="sm">Buat Booking Baru</Button>
              </Link>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 font-medium">
                Ditemukan <span className="text-slate-800 font-bold">{bookings.length}</span> booking
              </p>
              {bookings.map(booking => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-rose-100 hover:shadow-md transition-all duration-200"
                >
                  {/* Card header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-bold text-slate-600">{booking.bookingCode}</span>
                      <Badge variant={booking.status as BookingStatus}>
                        {STATUS_LABELS[booking.status]}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{booking.service.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateShort(booking.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {booking.time} WIB
                      </span>
                      <span className="font-semibold text-rose-600">{formatCurrency(booking.service.price)}</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedId === booking.id && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 animate-fade-in">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pelanggan</span>
                          <span className="font-medium text-slate-800">{booking.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">No. HP</span>
                          <span className="font-medium text-slate-800">{booking.customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Kategori</span>
                          <span className="font-medium text-slate-800">{booking.service.category}</span>
                        </div>
                        {booking.notes && (
                          <div>
                            <span className="text-slate-500">Catatan:</span>
                            <p className="mt-1 text-slate-700 bg-slate-50 rounded-lg p-2">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
