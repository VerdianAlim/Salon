import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL atau Anon Key tidak ditemukan. Pastikan .env.local sudah disetup.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
