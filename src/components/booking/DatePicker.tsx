import React from 'react';
import { Input } from '../ui/Input';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label = 'Pilih Tanggal',
  error,
}) => {
  // Tanggal minimum: hari ini
  const today = new Date().toISOString().split('T')[0];

  // Tanggal maksimum: 60 hari ke depan
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) return;

    // Cek apakah hari Minggu (0 = Sunday)
    const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
    if (dayOfWeek === 0) {
      // Reset jika pilih hari Minggu
      return;
    }
    onChange(selectedDate);
  };

  // Tentukan apakah tanggal yang dipilih adalah Minggu
  const isSelectedSunday = value
    ? new Date(value + 'T00:00:00').getDay() === 0
    : false;

  return (
    <div className="space-y-1">
      <Input
        type="date"
        label={label}
        value={value}
        onChange={handleChange}
        min={today}
        max={maxDate}
        error={error || (isSelectedSunday ? 'Salon tutup pada hari Minggu' : undefined)}
        helperText="Salon buka Senin–Sabtu. Hari Minggu tutup."
        required
        className="cursor-pointer"
      />
    </div>
  );
};

export default DatePicker;
