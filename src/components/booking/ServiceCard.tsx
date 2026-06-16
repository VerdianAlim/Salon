import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/formatCurrency';
import Button from '../ui/Button';

interface ServiceCardProps {
  service: Service;
  onSelect?: (service: Service) => void;
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  Makeup: 'bg-rose-100 text-rose-700',
  Hair: 'bg-violet-100 text-violet-700',
  Perawatan: 'bg-emerald-100 text-emerald-700',
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, compact = false }) => {
  const navigate = useNavigate();

  const handleSelect = () => {
    if (onSelect) {
      onSelect(service);
    } else {
      navigate(`/services/${service.id}`);
    }
  };

  const categoryColor = categoryColors[service.category] || 'bg-slate-100 text-slate-700';

  if (compact) {
    return (
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-100 hover:border-rose-200 hover:shadow-sm transition-all duration-200 cursor-pointer" onClick={handleSelect}>
        <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{service.name}</h3>
          <p className="text-xs text-slate-500">{formatDuration(service.duration)}</p>
        </div>
        <p className="font-bold text-rose-600 text-sm flex-shrink-0">{formatCurrency(service.price)}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:border-rose-100 hover:-translate-y-1 transition-all duration-300 group">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-rose-300 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
            {service.category}
          </span>
        </div>
        {!service.isActive && (
          <div className="absolute inset-0 bg-slate-800/60 flex items-center justify-center">
            <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
              Tidak Tersedia
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-base mb-1.5 group-hover:text-rose-600 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-rose-600">{formatCurrency(service.price)}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(service.duration)}
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleSelect}
            disabled={!service.isActive}
          >
            Pilih Layanan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
