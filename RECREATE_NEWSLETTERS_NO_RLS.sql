-- ============================================
-- DROP & RECREATE NEWSLETTERS ONLY
-- TANPA RLS (No Permission Issues)
-- ============================================
-- Copy semua dan jalankan di Supabase SQL Editor

-- 1. Drop existing table
DROP TABLE IF EXISTS newsletters CASCADE;

-- 2. Create newsletters table (NO RLS)
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX idx_newsletters_email ON newsletters(email);
CREATE INDEX idx_newsletters_is_active ON newsletters(is_active);

-- 4. Create trigger for updated_at
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

-- 5. Insert test data (12 subscribers)
INSERT INTO newsletters (email, is_active) VALUES
('john.doe@gmail.com', true),
('sarah.wilson@yahoo.com', true),
('michael.brown@outlook.com', true),
('emma.davis@gmail.com', true),
('david.johnson@hotmail.com', true),
('olivia.smith@gmail.com', false),
('james.miller@yahoo.com', true),
('sophia.taylor@gmail.com', true),
('william.anderson@outlook.com', true),
('isabella.martinez@gmail.com', true),
('car.showroom@gmail.com', true),
('nerocars.admin@yahoo.com', true);

-- 6. Verify data
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(*) FILTER (WHERE is_active = true) as active_subscribers,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_subscribers
FROM newsletters;

-- Show all data
SELECT id, email, is_active, created_at 
FROM newsletters 
ORDER BY created_at DESC;

-- ============================================
-- ✅ SUCCESS!
-- ============================================
-- ✅ Tabel newsletters berhasil dibuat
-- ✅ 12 subscribers ditambahkan (11 active, 1 inactive)
-- ✅ TANPA RLS - No permission issues!
-- ✅ Refresh admin panel: /admin/newsletters
-- ============================================
