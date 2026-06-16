import React, { useEffect, useState } from 'react';
import type { Service } from '../../types';
import { getServices } from '../../services/serviceService';
import ServiceCard from '../../components/booking/ServiceCard';
import { ServiceCardSkeleton } from '../../components/ui/Skeleton';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';

const CATEGORIES = ['Semua', 'Makeup', 'Hair', 'Perawatan'];

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getServices(true)
      .then(data => {
        setServices(data);
        setFiltered(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil data layanan:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = services;
    if (activeCategory !== 'Semua') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeCategory, searchQuery, services]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="pt-16 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-wide mb-2">Apa yang Kami Tawarkan</p>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Layanan Salon Widya</h1>
          <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
            Temukan layanan kecantikan yang tepat untuk Anda. Semua dikerjakan oleh tenaga profesional berpengalaman.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-auto">
            <Input
              id="search-services"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-slate-500 mb-6">
            Menampilkan <span className="font-semibold text-slate-800">{filtered.length}</span> layanan
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Layanan Tidak Ditemukan</h3>
            <p className="text-sm text-slate-400 mb-5">Coba ubah kata kunci atau filter kategori</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('Semua'); }}
              className="text-rose-500 font-semibold text-sm hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;
