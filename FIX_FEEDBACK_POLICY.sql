-- ========================================
-- FIX FEEDBACK PERMISSION ERROR
-- ========================================
-- CARA PAKAI:
-- 1. Copy semua script ini (Ctrl+A, Ctrl+C)
-- 2. Buka Supabase Dashboard → SQL Editor
-- 3. Paste script (Ctrl+V)
-- 4. Klik RUN atau tekan Ctrl+Enter
-- 5. Tunggu sampai selesai
-- ========================================

-- Hapus policy lama (jika ada)
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Allow public feedback submission" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated feedback submission" ON feedback;

-- Buat policy baru untuk INSERT (Public)
CREATE POLICY "Allow public feedback submission"
    ON feedback
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Buat policy baru untuk INSERT (Authenticated)
CREATE POLICY "Allow authenticated feedback submission"
    ON feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Verifikasi policy sudah dibuat
SELECT 
    policyname as "Policy Name", 
    roles as "Roles", 
    cmd as "Command"
FROM pg_policies 
WHERE tablename = 'feedback' 
AND cmd = 'INSERT';

-- Tampilkan pesan sukses
SELECT '✅ Feedback INSERT policies created successfully!' as "Status",
       'Sekarang Anda bisa submit feedback dari aplikasi.' as "Message";
