import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../../types';
import { getServices } from '../../services/serviceService';
import ServiceCard from '../../components/booking/ServiceCard';
import { ServiceCardSkeleton } from '../../components/ui/Skeleton';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';

const STEPS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Pilih Layanan',
    desc: 'Pilih layanan kecantikan yang sesuai kebutuhan Anda dari berbagai kategori yang tersedia.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Pilih Jadwal',
    desc: 'Tentukan tanggal dan jam yang paling nyaman untuk kunjungan Anda ke salon kami.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Konfirmasi',
    desc: 'Isi data diri dan konfirmasi booking Anda. Kode booking akan langsung tersedia.',
  },
];

const Landing: React.FC = () => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServices(true).then(services => {
      setFeaturedServices(services.slice(0, 3));
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50" />
        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Salon Kecantikan Terpercaya di Bandung
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                Tampil Cantik &{' '}
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  Percaya Diri
                </span>{' '}
                Bersama Kami
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Salon Widya menghadirkan layanan kecantikan profesional dengan sentuhan personal. 
                Booking sekarang dan rasakan perbedaannya!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  id="cta-booking-hero"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Booking Sekarang
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl text-base font-bold hover:border-rose-300 hover:text-rose-600 transition-all duration-300"
                >
                  Lihat Layanan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-10">
                {[
                  { value: '500+', label: 'Pelanggan Puas' },
                  { value: '8+', label: 'Layanan Tersedia' },
                  { value: '5★', label: 'Rating Pelanggan' },
                ].map(stat => (
                  <div key={stat.label}>
                    <p className="text-2xl font-extrabold text-rose-600">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative hidden lg:flex items-center justify-center animate-fade-in">
              <div className="relative w-full max-w-md">
                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-rose-100">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Booking Mudah & Cepat</h3>
                    <p className="text-sm text-slate-500 mt-1">Hanya butuh beberapa menit</p>
                  </div>
                  <div className="space-y-3">
                    {STEPS.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 bg-rose-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                          <span className="text-xs font-bold">{i + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                  ✓ Konfirmasi Instan
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white border border-rose-100 shadow-lg rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
                  📅 Buka Senin–Sabtu
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LAYANAN UNGGULAN ==================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <p className="text-rose-500 font-semibold text-sm mb-2 uppercase tracking-wide">Layanan Kami</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Layanan Unggulan Pilihan
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
              Dari makeup natural hingga perawatan rambut premium, semua tersedia di satu tempat dengan kualitas terjamin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)
              : featuredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
          </div>

          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-300"
            >
              Lihat Semua Layanan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CARA BOOKING ==================== */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-in-up">
            <p className="text-rose-500 font-semibold text-sm mb-2 uppercase tracking-wide">Cara Booking</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Mudah dalam 3 Langkah
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Proses booking yang sederhana dan cepat, tanpa perlu telepon atau chat manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 shadow-sm border border-rose-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                {/* Step number */}
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-rose-200">
                  <span className="text-white font-bold text-lg">{i + 1}</span>
                </div>
                {/* Icon */}
                <div className="text-rose-400 mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>

                {/* Connector arrow */}
                {i < 2 && (
                  <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/booking"
              id="cta-booking-steps"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Mulai Booking Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONI ==================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-500 font-semibold text-sm mb-2 uppercase tracking-wide">Ulasan Pelanggan</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Yang Mereka Katakan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sari D.', review: 'Makeup natural-nya keren banget, hasilnya awet seharian. Pelayanannya ramah dan profesional!', service: 'Makeup Natural' },
              { name: 'Putri A.', review: 'Sudah berkali-kali ke sini untuk hair coloring. Hasilnya selalu memuaskan dan tidak merusak rambut.', service: 'Hair Coloring' },
              { name: 'Mega W.', review: 'Booking-nya gampang banget via website, ga perlu chat-chat lagi. Salon rekomen!', service: 'Creambath' },
            ].map((t, i) => (
              <div key={i} className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic mb-4 leading-relaxed">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-rose-500">{t.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
