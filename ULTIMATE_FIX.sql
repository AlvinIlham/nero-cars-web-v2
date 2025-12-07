-- ================================================================
-- ULTIMATE FIX - JALANKAN INI JIKA MASIH ERROR 403
-- ================================================================
-- Script ini akan membuat policy yang SANGAT permissive
-- untuk memastikan feedback bisa disubmit dari aplikasi
-- ================================================================

-- STEP 1: Drop semua policy yang ada (clean slate)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'feedback'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON feedback', policy_record.policyname);
    END LOOP;
END $$;

-- STEP 2: Pastikan RLS aktif
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- STEP 3: Buat policy yang mengizinkan SEMUA operasi untuk SEMUA user
CREATE POLICY "feedback_allow_all"
    ON feedback
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- STEP 4: Tambahkan policy khusus untuk authenticated users (backup)
CREATE POLICY "feedback_authenticated"
    ON feedback
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- STEP 5: Verifikasi policy yang baru dibuat
SELECT 
    '✅ POLICIES CREATED' as status,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'feedback';

-- STEP 6: Tampilkan detail semua policies
SELECT 
    policyname as "Policy Name",
    cmd as "Command",
    roles as "Roles",
    CASE 
        WHEN permissive = 'PERMISSIVE' THEN '✅ Permissive'
        ELSE '❌ Restrictive'
    END as "Type"
FROM pg_policies 
WHERE tablename = 'feedback'
ORDER BY policyname;

-- STEP 7: Test INSERT (uncomment untuk test)
-- INSERT INTO feedback (name, email, subject, message, type, status)
-- VALUES (
--     'SQL Test User',
--     'sqltest@test.com',
--     '🧪 Test from SQL Editor',
--     'This is a test insert to verify permissions',
--     'other',
--     'pending'
-- );

-- STEP 8: Cek jumlah feedback (untuk verifikasi)
SELECT 
    '📊 Total feedback in database' as info,
    COUNT(*) as count
FROM feedback;

-- STEP 9: Tampilkan pesan sukses
SELECT 
    '✅ SETUP COMPLETE!' as "Status",
    'Policy "feedback_allow_all" sudah dibuat' as "Policy Status",
    'Sekarang refresh browser dan test feedback form' as "Next Step",
    'Jika masih error, cek TROUBLESHOOT_403.md' as "If Still Error";
