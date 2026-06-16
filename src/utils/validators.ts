import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Pilih layanan terlebih dahulu'),
  date: z.string().min(1, 'Pilih tanggal booking'),
  time: z.string().min(1, 'Pilih jam booking'),
  customerName: z.string().min(3, 'Nama minimal 3 karakter'),
  customerPhone: z
    .string()
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
      'Format nomor HP Indonesia tidak valid (contoh: 08123456789)'
    ),
  customerEmail: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(3, 'Nama layanan minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  price: z
    .number()
    .min(1000, 'Harga minimal Rp 1.000'),
  duration: z
    .number()
    .min(15, 'Durasi minimal 15 menit'),
  category: z.string().min(1, 'Pilih kategori layanan'),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username tidak boleh kosong'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
});
