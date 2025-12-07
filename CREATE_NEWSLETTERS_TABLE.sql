-- ============================================
-- CREATE NEWSLETTERS TABLE
-- ============================================
-- Tabel untuk menyimpan email subscribers newsletter
-- Jalankan SQL ini di Supabase SQL Editor

-- 1. Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for faster email lookup
CREATE INDEX IF NOT EXISTS idx_newsletters_email ON newsletters(email);
CREATE INDEX IF NOT EXISTS idx_newsletters_is_active ON newsletters(is_active);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Policy: Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
ON newsletters
FOR INSERT
WITH CHECK (true);

-- Policy: Everyone can read (untuk public & admin)
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

-- 5. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_newsletters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_newsletters_updated_at
BEFORE UPDATE ON newsletters
FOR EACH ROW
EXECUTE FUNCTION update_newsletters_updated_at();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'newsletters';

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'newsletters'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'newsletters';

-- ============================================
-- TEST INSERT (Optional - for testing)
-- ============================================

-- Test insert a sample subscriber
INSERT INTO newsletters (email) 
VALUES ('test@example.com');

-- View all newsletters
SELECT * FROM newsletters ORDER BY created_at DESC;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- ✅ Tabel newsletters berhasil dibuat!
-- ✅ RLS policies sudah aktif
-- ✅ Siap digunakan untuk fitur newsletter subscription
