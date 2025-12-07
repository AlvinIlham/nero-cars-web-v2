-- ========================================
-- FIX FEEDBACK PERMISSION - COMPLETE SOLUTION
-- ========================================
-- Jalankan semua script ini di Supabase SQL Editor
-- ========================================

-- 1. Pastikan RLS aktif
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 2. Drop semua policy lama
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Allow public feedback submission" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated feedback submission" ON feedback;
DROP POLICY IF EXISTS "Enable insert for all users" ON feedback;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON feedback;
DROP POLICY IF EXISTS "Allow anonymous feedback" ON feedback;

-- 3. Buat policy baru untuk INSERT - LEBIH PERMISSIVE
CREATE POLICY "Enable insert for all users"
    ON feedback
    FOR INSERT
    WITH CHECK (true);

-- 4. Verifikasi policy
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'feedback';

-- 5. Cek struktur tabel
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'feedback'
ORDER BY ordinal_position;

-- 6. Test INSERT manual (untuk verifikasi)
-- Uncomment baris di bawah untuk test insert
-- INSERT INTO feedback (name, email, subject, message, type, status)
-- VALUES ('Test User', 'test@test.com', 'Test Subject', 'Test message from SQL', 'other', 'pending');

SELECT '✅ SETUP COMPLETE! Policy sudah dibuat.' as status;
SELECT 'Sekarang refresh browser dan test feedback form lagi.' as next_step;
