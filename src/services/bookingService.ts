import type { Booking, BookingFormData, BookingStatus, TimeSlot } from '../types';
import { supabase } from '../lib/supabase';
import { getServiceById } from './serviceService';

// Daftar slot waktu yang tersedia di salon
const ALL_TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const generateBookingCode = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${dateStr}-${randomStr}`;
};

// Helper untuk map data booking dari Supabase ke model aplikasi
const mapBookingFromDB = async (data: any): Promise<Booking> => {
  // Ambil detail layanan (karena di tabel bookings hanya menyimpan service_id)
  let service = data.services;
  if (!service) {
    if (data.service_id) {
      service = await getServiceById(data.service_id);
    }
  } else {
    // Jika data di-join
    service = {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      imageUrl: service.image_url,
      isActive: service.is_active,
    };
  }

  // Fallback data jika service benar-benar dihapus/null
  if (!service) {
    service = {
      id: 'deleted',
      name: 'Layanan Telah Dihapus',
      price: 0,
      duration: 0,
      category: 'Lainnya',
      isActive: false,
    };
  }

  return {
    id: data.id,
    bookingCode: data.booking_code,
    service: service as any,
    customer: {
      name: data.customer_name,
      phone: data.customer_phone,
      email: data.customer_email || undefined,
    },
    date: data.date,
    time: data.time,
    status: data.status as BookingStatus,
    notes: data.notes || undefined,
    createdAt: data.created_at,
  };
};

// ============================================================
// GET semua booking
// ============================================================
export const getBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  
  return Promise.all((data || []).map(mapBookingFromDB));
};

// ============================================================
// GET booking by ID
// ============================================================
export const getBookingById = async (id: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Row not found
    throw new Error(error.message);
  }

  return data ? mapBookingFromDB(data) : null;
};

// ============================================================
// GET booking by nomor HP pelanggan
// ============================================================
export const getBookingsByPhone = async (phone: string): Promise<Booking[]> => {
  const normalizedPhone = phone.replace(/\D/g, ''); // Hapus karakter non-digit

  // Karena like tidak support regex dengan mudah di postgrest tanpa ekstensi tambahan, 
  // kita fetch semua yang relevan atau memfilter di sisi client jika dataset kecil. 
  // Untuk scale besar, sebaiknya simpan normalized_phone di DB.
  // Untuk saat ini kita ambil yang mirip:
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(*)')
    .ilike('customer_phone', `%${normalizedPhone}%`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return Promise.all((data || []).map(mapBookingFromDB));
};

// ============================================================
// CREATE booking baru
// ============================================================
export const createBooking = async (data: BookingFormData): Promise<Booking> => {
  const newBookingData = {
    booking_code: generateBookingCode(),
    service_id: data.serviceId,
    customer_name: data.customerName,
    customer_phone: data.customerPhone,
    customer_email: data.customerEmail || null,
    date: data.date,
    time: data.time,
    notes: data.notes || null,
    status: 'pending',
  };

  const { data: insertedData, error } = await supabase
    .from('bookings')
    .insert([newBookingData])
    .select('*, services(*)')
    .single();

  if (error) throw new Error(error.message);

  return mapBookingFromDB(insertedData);
};

// ============================================================
// UPDATE status booking
// ============================================================
export const updateBookingStatus = async (
  id: string,
  status: BookingStatus
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select('*, services(*)')
    .single();

  if (error) throw new Error(error.message);

  return mapBookingFromDB(data);
};

// ============================================================
// GET slot waktu tersedia
// ============================================================
export const fetchAvailableSlots = async (
  date: string,
  _serviceId: string
): Promise<TimeSlot[]> => {
  // Ambil semua booking yang sudah dikonfirmasi/pending pada tanggal tersebut
  const { data: existingBookings, error } = await supabase
    .from('bookings')
    .select('time, status')
    .eq('date', date)
    .neq('status', 'cancelled');

  if (error) throw new Error(error.message);

  // Buat array waktu yang sudah terisi
  const bookedTimes = (existingBookings || []).map(b => b.time);

  // Jika tanggal yang dipilih adalah hari ini, nonaktifkan waktu yang sudah berlalu
  const today = new Date();
  const selectedDate = new Date(date);
  const isToday =
    today.getDate() === selectedDate.getDate() &&
    today.getMonth() === selectedDate.getMonth() &&
    today.getFullYear() === selectedDate.getFullYear();

  const currentHour = today.getHours();


  return ALL_TIME_SLOTS.map(timeStr => {
    // Cek apakah waktu sudah dibooking
    let isAvailable = !bookedTimes.includes(timeStr);

    // Cek apakah waktu sudah lewat hari ini
    if (isToday && isAvailable) {
      const [hour] = timeStr.split(':').map(Number);
      // Tambahkan margin 1 jam ke depan untuk booking hari ini
      if (hour <= currentHour + 1) {
        isAvailable = false;
      }
    }

    return {
      time: timeStr,
      isAvailable,
    };
  });
};
