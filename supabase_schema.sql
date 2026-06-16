-- ==========================================
-- Supabase Schema untuk Website Salon Widya
-- ==========================================

-- 1. Buat tabel `services`
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat tabel `bookings`
-- Menyimpan data pesanan salon pelanggan
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_code TEXT NOT NULL UNIQUE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set RLS (Row Level Security)

-- Mengaktifkan RLS untuk tabel
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy untuk tabel `services`
-- Publik (anon) bisa READ layanan yang is_active = true
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.services FOR SELECT USING (is_active = true);

-- Admin (authenticated) bisa melakukan operasi apa saja (CRUD) pada `services`
CREATE POLICY "Admins have full access to services." 
ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- Policy untuk tabel `bookings`
-- Publik (anon) bisa CREATE booking baru dan SELECT berdasarkan nomor HP (dibatasi di sisi aplikasi)
CREATE POLICY "Public can insert bookings." 
ON public.bookings FOR INSERT WITH CHECK (true);

-- Publik bisa melihat booking untuk mencari riwayat berdasarkan hp
CREATE POLICY "Public can select bookings." 
ON public.bookings FOR SELECT USING (true);

-- Admin (authenticated) bisa melihat, update, delete semua booking
CREATE POLICY "Admins have full access to bookings." 
ON public.bookings FOR ALL USING (auth.role() = 'authenticated');

-- 4. Insert Initial Mock Data
INSERT INTO public.services (name, description, price, duration, category, is_active) VALUES
('Makeup Natural', 'Makeup ringan yang cocok untuk acara santai, photoshoot, atau wisuda dengan hasil flawless namun tidak berlebihan.', 150000, 60, 'Makeup', true),
('Makeup Glamour', 'Tampil memukau di acara pesta atau resepsi dengan riasan glamour, tahan lama, dan menonjolkan fitur terbaik wajah.', 250000, 90, 'Makeup', true),
('Hairdo Party', 'Penataan rambut elegan mulai dari updo, kepang, hingga wavy style yang disesuaikan dengan gaun dan bentuk wajah Anda.', 100000, 45, 'Hair', true),
('Creambath', 'Perawatan intensif menggunakan krim khusus untuk mengatasi rambut kering, rontok, dan memberikan efek relaksasi pada kulit kepala.', 85000, 60, 'Perawatan', true),
('Hair Coloring', 'Pewarnaan rambut profesional menggunakan produk berkualitas. Bebas pilih warna trendi yang sesuai dengan karakter Anda.', 350000, 120, 'Hair', true),
('Smoothing', 'Meluruskan rambut ikal atau bergelombang secara permanen dengan hasil rambut yang lembut, mudah diatur, dan tampak alami.', 400000, 180, 'Hair', true),
('Facial Basic', 'Perawatan wajah esensial untuk membersihkan komedo, mengangkat sel kulit mati, dan mengembalikan kesegaran kulit.', 120000, 60, 'Perawatan', true),
('Hair Cut + Blow', 'Potongan rambut stylish oleh kapster berpengalaman, sudah termasuk cuci dan blow dry untuk tampilan maksimal.', 75000, 45, 'Hair', true);

-- 5. Enable Realtime (Supabase)
-- Ini diwajibkan agar aplikasi bisa menerima update secara otomatis (websocket)
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

