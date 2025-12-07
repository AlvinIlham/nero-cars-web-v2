-- ========================================
-- BUAT ULANG TABEL FEEDBACK DARI AWAL
-- TANPA RLS / PERMISSION SAMA SEKALI
-- ========================================
-- Copy semua script ini dan jalankan di Supabase SQL Editor
-- ========================================

-- STEP 1: Hapus tabel lama (beserta semua policies)
DROP TABLE IF EXISTS feedback CASCADE;

-- STEP 2: Buat tabel baru dengan struktur lengkap
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'other',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: DISABLE RLS PERMANENTLY
-- Ini yang penting! TIDAK ADA RLS sama sekali
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;

-- STEP 4: Buat index untuk performa
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_type ON feedback(type);

-- STEP 5: Grant full access ke semua role
GRANT ALL ON feedback TO postgres, anon, authenticated, service_role;

-- STEP 6: Verifikasi tabel sudah dibuat
SELECT 
    '✅ Tabel feedback berhasil dibuat!' as status,
    'RLS Status: DISABLED (TIDAK ADA PERMISSION)' as rls_status;

-- STEP 7: Cek struktur tabel
SELECT 
    column_name as "Column",
    data_type as "Type",
    is_nullable as "Nullable"
FROM information_schema.columns
WHERE table_name = 'feedback'
ORDER BY ordinal_position;

-- STEP 8: Cek RLS status (harus OFF)
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '❌ RLS ENABLED (BAD!)'
        ELSE '✅ RLS DISABLED (GOOD!)'
    END as rls_status
FROM pg_tables
WHERE tablename = 'feedback';

-- STEP 9: Test INSERT (uncomment untuk test)
-- INSERT INTO feedback (name, email, subject, message, type, status)
-- VALUES (
--     'Fresh Start Test',
--     'freshstart@test.com',
--     '🎉 New Table Test',
--     'Testing new feedback table without any RLS',
--     'other',
--     'pending'
-- );

-- STEP 10: Tampilkan summary
SELECT 
    '✅ SETUP COMPLETE!' as "Status",
    'Tabel feedback baru sudah siap' as "Message",
    'TIDAK ADA RLS/POLICY/PERMISSION' as "Security",
    'Sekarang test feedback form di aplikasi' as "Next Step";
