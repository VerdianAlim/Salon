import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Service } from '../../types';
import { getServiceById } from '../../services/serviceService';
import { formatCurrency, formatDuration } from '../../utils/formatCurrency';
import { useBookingStore } from '../../store/bookingStore';
import Button from '../../components/ui/Button';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { PageSpinner } from '../../components/ui/Spinner';

const categoryColors: Record<string, string> = {
  Makeup: 'bg-rose-100 text-rose-700',
  Hair: 'bg-violet-100 text-violet-700',
  Perawatan: 'bg-emerald-100 text-emerald-700',
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setService, setStep } = useBookingStore();
  const [service, setServiceData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getServiceById(id).then(data => {
      if (!data) setNotFound(true);
      else setServiceData(data);
      setIsLoading(false);
    });
  }, [id]);

  const handleBookNow = () => {
    if (!service) return;
    setService(service);
    setStep(2); // Langsung ke step 2 (pilih jadwal)
    navigate('/booking');
  };

  if (isLoading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16"><PageSpinner /></div>
    </div>
  );

  if (notFound || !service) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Layanan Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">Layanan yang Anda cari tidak tersedia atau sudah dihapus.</p>
        <Link to="/services">
          <Button>Kembali ke Daftar Layanan</Button>
        </Link>
      </div>
    </div>
  );

  const categoryColor = categoryColors[service.category] || 'bg-slate-100 text-slate-700';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link to="/" className="hover:text-rose-500 transition-colors">Beranda</Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link to="/services" className="hover:text-rose-500 transition-colors">Layanan</Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-800 font-medium truncate">{service.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="h-64 lg:h-full min-h-[280px] bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-rose-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="text-rose-400 text-sm font-medium mt-3">{service.category}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-8 lg:p-10">
                <div className="mb-6">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${categoryColor}`}>
                    {service.category}
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{service.name}</h1>
                <p className="text-slate-500 text-base leading-relaxed mb-8">{service.description}</p>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                    <p className="text-xs text-rose-600 font-semibold mb-1">HARGA</p>
                    <p className="text-2xl font-extrabold text-rose-600">{formatCurrency(service.price)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold mb-1">DURASI</p>
                    <p className="text-xl font-bold text-slate-800">{formatDuration(service.duration)}</p>
                  </div>
                </div>

                {/* CTA */}
                {service.isActive ? (
                  <Button
                    id={`book-service-${service.id}`}
                    fullWidth
                    size="lg"
                    onClick={handleBookNow}
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  >
                    Booking Layanan Ini
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-500 font-medium">Layanan ini sementara tidak tersedia</p>
                  </div>
                )}

                <Link
                  to="/services"
                  className="block text-center mt-4 text-sm text-slate-400 hover:text-rose-500 transition-colors"
                >
                  ← Kembali ke daftar layanan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
