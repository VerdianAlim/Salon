import { create } from 'zustand';
import type { Booking } from '../types';
import { getBookings } from '../services/bookingService';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface BookingStore {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  setupRealtime: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBookings();
      set({ bookings: data, isLoading: false });
    } catch {
      set({ error: 'Gagal memuat data booking', isLoading: false });
    }
  },

  setupRealtime: () => {
    // Hindari langganan ganda jika sudah ada instance
    const channelName = 'public:bookings';
    const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
    if (existingChannel) return;

    supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          // Ketika ada perubahan apa pun di Supabase, kita ambil ulang datanya
          // agar relasi (service & customer) ter-fetch utuh lewat query getBookings().
          // Ini cara paling aman daripada menggabungkan payload partial.
          console.log('Realtime update received:', payload);
          get().fetchBookings();
          
          if (payload.eventType === 'INSERT') {
            toast.success('Ada pesanan masuk baru!', { icon: '🔔' });
          }
        }
      )
      .subscribe();
  },
}));
