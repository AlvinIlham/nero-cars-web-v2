-- ============================================
-- DISABLE RLS UNTUK NEWSLETTERS
-- ============================================
-- Jalankan SQL ini di Supabase SQL Editor

-- DISABLE RLS
ALTER TABLE newsletters DISABLE ROW LEVEL SECURITY;

-- Drop semua policy yang ada
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletters;
DROP POLICY IF EXISTS "Anyone can read newsletters" ON newsletters;
DROP POLICY IF EXISTS "Authenticated users can update newsletters" ON newsletters;
DROP POLICY IF EXISTS "Authenticated users can delete newsletters" ON newsletters;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'newsletters';

-- Check policies (should be empty)
SELECT * FROM pg_policies WHERE tablename = 'newsletters';

-- Test query
SELECT COUNT(*) as total FROM newsletters;

-- ============================================
-- ✅ RLS DISABLED!
-- ============================================
-- ✅ Refresh admin panel sekarang
-- ✅ Error 403 akan hilang
-- ============================================
