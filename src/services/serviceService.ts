import type { Service, ServiceFormData } from '../types';
import { supabase } from '../lib/supabase';

// Helper untuk map data dari Supabase (snake_case) ke aplikasi (camelCase)
const mapServiceFromDB = (data: any): Service => ({
  id: data.id,
  name: data.name,
  description: data.description,
  price: data.price,
  duration: data.duration,
  category: data.category,
  imageUrl: data.image_url,
  isActive: data.is_active,
});

// Helper untuk map data dari aplikasi (camelCase) ke Supabase (snake_case)
const mapServiceToDB = (data: ServiceFormData) => ({
  name: data.name,
  description: data.description,
  price: data.price,
  duration: data.duration,
  category: data.category,
  image_url: data.imageUrl || null,
  is_active: data.isActive,
});

// ============================================================
// GET semua layanan
// ============================================================
export const getServices = async (onlyActive = false): Promise<Service[]> => {
  let query = supabase.from('services').select('*').order('created_at', { ascending: true });
  
  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  return (data || []).map(mapServiceFromDB);
};

// ============================================================
// GET layanan by ID
// ============================================================
export const getServiceById = async (id: string): Promise<Service | null> => {
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // Row not found
    throw new Error(error.message);
  }
  return data ? mapServiceFromDB(data) : null;
};

// ============================================================
// CREATE layanan baru
// ============================================================
export const createService = async (data: ServiceFormData): Promise<Service> => {
  const { data: newData, error } = await supabase
    .from('services')
    .insert([mapServiceToDB(data)])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapServiceFromDB(newData);
};

// ============================================================
// UPDATE layanan
// ============================================================
export const updateService = async (id: string, data: ServiceFormData): Promise<Service> => {
  const { data: updatedData, error } = await supabase
    .from('services')
    .update(mapServiceToDB(data))
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapServiceFromDB(updatedData);
};

// ============================================================
// DELETE layanan
// ============================================================
export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
