import type { AdminUser } from '../types';
import { supabase } from '../lib/supabase';

// ============================================================
// ADMIN LOGIN (Supabase Auth)
// ============================================================
export const loginAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message || 'Gagal login. Kredensial tidak valid.');
  }

  return {
    id: data.user.id,
    username: data.user.email || 'Admin', // Gunakan email sebagai username
    token: data.session?.access_token || '',
  };
};

// ============================================================
// ADMIN LOGOUT
// ============================================================
export const logoutAdmin = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
  }
};

// ============================================================
// GET CURRENT SESSION
// ============================================================
export const getCurrentSession = async (): Promise<AdminUser | null> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) return null;

  return {
    id: session.user.id,
    username: session.user.email || 'Admin',
    token: session.access_token,
  };
};
