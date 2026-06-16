import { create } from 'zustand';
import type { BookingFormData, Service } from '../types';

interface BookingStore {
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
}

export const useBookingStore = create<BookingStore>((set) => ({
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
}));
