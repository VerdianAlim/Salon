import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format tanggal ke Bahasa Indonesia
 * Contoh: "Senin, 16 Juni 2026"
 */
export const formatDateLong = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return format(date, 'EEEE, dd MMMM yyyy', { locale: id });
  } catch {
    return dateStr;
  }
};

/**
 * Format tanggal pendek
 * Contoh: "16 Jun 2026"
 */
export const formatDateShort = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return format(date, 'dd MMM yyyy', { locale: id });
  } catch {
    return dateStr;
  }
};

/**
 * Format tanggal dan waktu
 * Contoh: "Senin, 16 Juni 2026 pukul 09:00"
 */
export const formatDateTime = (dateStr: string, time: string): string => {
  return `${formatDateLong(dateStr)} pukul ${time}`;
};

/**
 * Mendapatkan nama hari
 * Contoh: "Senin"
 */
export const getDayName = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return format(date, 'EEEE', { locale: id });
  } catch {
    return '';
  }
};

/**
 * Format waktu relatif dari sekarang
 */
export const formatRelativeTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return formatDateShort(date.toISOString().slice(0, 10));
  } catch {
    return isoString;
  }
};
