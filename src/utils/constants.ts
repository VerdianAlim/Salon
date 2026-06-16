import type { BookingStatus } from '../types';

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};
