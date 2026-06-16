import { create } from 'zustand';
import type { Booking, BookingFormData, Service } from '../types';
import { getBookings } from '../services/bookingService';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface BookingStore {
  // Wizard State (Customer)
  currentStep: number;
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  formData: Partial<BookingFormData>;
  setStep: (step: number) => void;
  setService: (service: Service) => void;
  setDateTime: (date: string, time: string) => void;
  setFormData: (data: Partial<BookingFormData>) => void;
  resetBooking: () => void;

  // Realtime State (Admin)
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  setupRealtime: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  // --- Wizard Initial State ---
  currentStep: 1,
  selectedService: null,
  selectedDate: '',
  selectedTime: '',
  formData: {},

  setStep: (step) => set({ currentStep: step }),

  setService: (service) =>
    set((state) => ({
      selectedService: service,
      formData: { ...state.formData, serviceId: service.id },
    })),

  setDateTime: (date, time) =>
    set((state) => ({
      selectedDate: date,
      selectedTime: time,
      formData: { ...state.formData, date, time },
    })),

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetBooking: () =>
    set({
      currentStep: 1,
      selectedService: null,
      selectedDate: '',
      selectedTime: '',
      formData: {},
    }),

  // --- Realtime Initial State ---
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    console.log('[bookingStore] Memulai fetchBookings...');
    set({ isLoading: true, error: null });
    try {
      const data = await getBookings();
      console.log('[bookingStore] Sukses fetchBookings! Total data:', data.length);
      set({ bookings: data, isLoading: false });
    } catch (e: any) {
      console.error('[bookingStore] Error fetchBookings:', e);
      set({ error: 'Gagal memuat data booking', isLoading: false });
    }
  },

  setupRealtime: () => {
    const channelName = 'public:bookings';
    const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
    
    // Jika channel sudah ada, jangan buat lagi (biarkan yang lama bekerja)
    if (existingChannel) {
      console.log('[bookingStore] Channel realtime sudah aktif, mengabaikan pembuatan baru.');
      return;
    }

    console.log('[bookingStore] Membuat channel realtime baru...');
    supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          console.log('[bookingStore] Realtime update diterima:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.success('Ada pesanan masuk baru!', { icon: '🔔' });
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Status pesanan diperbarui!', { icon: '📝' });
          }

          // Delay fetchBookings selama 1.5 detik agar database benar-benar selesai commit
          setTimeout(() => {
            console.log('[bookingStore] Menjalankan fetchBookings setelah delay...');
            // Menggunakan getState untuk menjamin referensi terbaru (aman dari HMR)
            useBookingStore.getState().fetchBookings();
          }, 1500);
        }
      )
      .subscribe((status) => {
        console.log('[bookingStore] Status berlangganan Realtime:', status);
      });
  },
}));
