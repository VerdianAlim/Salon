/**
 * Format angka ke format mata uang Rupiah
 * Contoh: 150000 → "Rp 150.000"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format durasi layanan
 * Contoh: 75 → "1 jam 15 menit"
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} jam`;
  return `${hours} jam ${mins} menit`;
};
