import { create } from 'zustand';
import type { Service, ServiceFormData } from '../types';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../services/serviceService';

interface ServiceStore {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: (activeOnly?: boolean) => Promise<void>;
  addService: (data: ServiceFormData) => Promise<void>;
  editService: (id: string, data: ServiceFormData) => Promise<void>;
  removeService: (id: string) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async (activeOnly = false) => {
    set({ isLoading: true, error: null });
    try {
      const services = await getServices(activeOnly);
      set({ services, isLoading: false });
    } catch {
      set({ error: 'Gagal memuat data layanan', isLoading: false });
    }
  },

  addService: async (data) => {
    const newService = await createService(data);
    set({ services: [...get().services, newService] });
  },

  editService: async (id, data) => {
    const updated = await updateService(id, data);
    set({
      services: get().services.map(s => (s.id === id ? updated : s)),
    });
  },

  removeService: async (id) => {
    await deleteService(id);
    set({ services: get().services.filter(s => s.id !== id) });
  },
}));
