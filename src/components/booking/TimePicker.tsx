import React from 'react';
import type { TimeSlot } from '../../types';

interface TimePickerProps {
  slots: TimeSlot[];
  selectedTime: string;
  onSelect: (time: string) => void;
  isLoading?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  slots,
  selectedTime,
  onSelect,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-12 skeleton-shimmer rounded-xl" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p className="text-sm">Pilih tanggal untuk melihat slot waktu tersedia</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        {slots.map(slot => (
          <button
            key={slot.time}
            onClick={() => slot.isAvailable && onSelect(slot.time)}
            disabled={!slot.isAvailable}
            className={`
              relative h-12 rounded-xl text-sm font-semibold border-2 transition-all duration-200
              ${selectedTime === slot.time
                ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200'
                : slot.isAvailable
                  ? 'bg-white border-slate-200 text-slate-700 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50'
                  : 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed'
              }
            `}
          >
            {slot.time}
            {!slot.isAvailable && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-rose-500 bg-rose-500" />
          <span>Dipilih</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-slate-200 bg-white" />
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-slate-100 bg-slate-100" />
          <span>Sudah Terisi</span>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
