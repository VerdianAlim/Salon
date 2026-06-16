import { create } from 'zustand';
import type { AdminUser } from '../types';
import { logoutAdmin, getCurrentSession } from '../services/authService';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  login: (user) => {
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await logoutAdmin();
    set({ user: null, isAuthenticated: false });
  },

  initializeAuth: async () => {
    try {
      // Cek sesi yang sudah ada saat reload halaman
      const session = await getCurrentSession();
      if (session) {
        set({ user: session, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }

      // Dengarkan perubahan status auth dari Supabase (misal: login dari tab lain, session expired)
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          set({
            user: {
              id: session.user.id,
              username: session.user.email || 'Admin',
              token: session.access_token,
            },
            isAuthenticated: true,
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isInitializing: false });
    }
  },
}));
