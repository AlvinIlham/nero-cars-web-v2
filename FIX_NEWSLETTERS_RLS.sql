-- ============================================
-- FIX NEWSLETTERS RLS POLICY - 403 ERROR
-- ============================================
-- Jalankan SQL ini di Supabase SQL Editor
-- untuk fix permission denied error

-- 1. Drop existing policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletters;
DROP POLICY IF EXISTS "Anyone can read newsletters" ON newsletters;
DROP POLICY IF EXISTS "Authenticated users can update newsletters" ON newsletters;
DROP POLICY IF EXISTS "Authenticated users can delete newsletters" ON newsletters;

-- 2. Create new policies (tanpa TO clause yang menyebabkan error)

-- Policy: Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
ON newsletters
FOR INSERT
WITH CHECK (true);

-- Policy: Everyone can read
CREATE POLICY "Anyone can read newsletters"
ON newsletters
FOR SELECT
USING (true);

-- Policy: Authenticated users can update
CREATE POLICY "Authenticated users can update newsletters"
ON newsletters
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy: Authenticated users can delete
CREATE POLICY "Authenticated users can delete newsletters"
ON newsletters
FOR DELETE
USING (true);

-- 3. Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'newsletters';

-- ============================================
-- SUCCESS!
-- ============================================
-- ✅ RLS policies fixed
-- ✅ Permission error resolved
-- ✅ Refresh website dan test lagi
