-- ========================================
-- ALTERNATIVE FIX - Jika masih error 403
-- ========================================
-- Coba approach yang lebih sederhana
-- ========================================

-- 1. Disable RLS sementara untuk testing
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;

-- 2. Test apakah feedback bisa masuk tanpa RLS
-- Jika berhasil, berarti masalahnya di RLS policy

-- 3. Jika berhasil, enable RLS lagi dengan policy yang SANGAT permissive
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 4. Drop SEMUA policy
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Allow public feedback submission" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated feedback submission" ON feedback;
DROP POLICY IF EXISTS "Enable insert for all users" ON feedback;

-- 5. Buat 1 policy sederhana yang mengizinkan semua operasi
CREATE POLICY "allow_all_feedback"
    ON feedback
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. Verifikasi
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'feedback';

SELECT '✅ Policy allow_all_feedback created!' as status;
