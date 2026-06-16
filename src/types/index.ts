// ============================================================
// TIPE DATA UTAMA — Salon Widya Booking System
// ============================================================

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;          // dalam Rupiah
  duration: number;       // dalam menit
  category: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface TimeSlot {
  time: string;           // format "HH:mm", contoh "09:00"
  isAvailable: boolean;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;    // contoh: "BK-20260616-001"
  service: Service;
  customer: Customer;
  date: string;           // format "YYYY-MM-DD"
  time: string;           // format "HH:mm"
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface BookingFormData {
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  token: string;
}

export interface DashboardStats {
  totalToday: number;
  totalThisWeek: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
}
