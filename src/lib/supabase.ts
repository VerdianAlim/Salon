import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('⚠️ Supabase URL atau Anon Key tidak ditemukan. Pastikan .env.local sudah disetup dan jalankan ulang "npm run dev".');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
