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
        async (payload) => {
          console.log('[bookingStore] Realtime update diterima:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.success('Ada pesanan masuk baru!', { icon: '🔔' });
            
            // Tunggu sebentar lalu ambil data pesanan BARU ini saja
            setTimeout(async () => {
              try {
                // Gunakan fungsi import manual atau panggil langsung lewat supabase jika getBookingById tidak di-import
                // Lebih aman menggunakan supabase secara langsung agar tidak perlu merubah import
                const { data } = await supabase.from('bookings').select('*, services(*)').eq('id', payload.new.id).single();
                if (data) {
                  // Karena mapBookingFromDB butuh logic, kita panggil secara manual:
                  const service = data.services || {};
                  const newBooking = {
                    id: data.id,
                    bookingCode: data.booking_code,
                    service: {
                      id: service.id,
                      name: service.name,
                      description: service.description,
                      price: service.price,
                      duration: service.duration,
                      category: service.category,
                      imageUrl: service.image_url,
                      isActive: service.is_active,
                    },
                    customer: {
                      name: data.customer_name,
                      phone: data.customer_phone,
                      email: data.customer_email || undefined,
                    },
                    date: data.date,
                    time: data.time,
                    status: data.status,
                    notes: data.notes || undefined,
                    createdAt: data.created_at,
                  };
                  
                  // Masukkan langsung ke urutan teratas!
                  set(state => {
                    // Cegah duplikasi jika tiba-tiba sudah ada
                    if (state.bookings.some(b => b.id === newBooking.id)) return state;
                    return { bookings: [newBooking, ...state.bookings] };
                  });
                }
              } catch (e) {
                console.error("Error fetching single booking:", e);
              }
            }, 1000);

          } else if (payload.eventType === 'UPDATE') {
            toast.success('Status pesanan diperbarui!', { icon: '📝' });
            // Langsung ubah datanya secara instan di memori (Super Cepat!)
            set(state => ({
              bookings: state.bookings.map(b => 
                b.id === payload.new.id ? { ...b, status: payload.new.status } : b
              )
            }));
          } else if (payload.eventType === 'DELETE') {
            set(state => ({
              bookings: state.bookings.filter(b => b.id !== payload.old?.id)
            }));
          }
        }
      )
      .subscribe((status) => {
        console.log('[bookingStore] Status berlangganan Realtime:', status);
      });
  },
}));
