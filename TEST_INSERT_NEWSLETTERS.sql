-- ============================================
-- TEST INSERT NEWSLETTERS DATA
-- ============================================
-- Jalankan SQL ini di Supabase SQL Editor
-- untuk insert data test subscribers

-- Insert test subscribers
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
('isabella.martinez@gmail.com', true);

-- Verify inserted data
SELECT 
  id,
  email,
  is_active,
  created_at,
  updated_at
FROM newsletters 
ORDER BY created_at DESC;

-- Count total subscribers
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(*) FILTER (WHERE is_active = true) as active_subscribers,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_subscribers
FROM newsletters;

-- ============================================
-- SUCCESS!
-- ============================================
-- ✅ 10 test subscribers berhasil ditambahkan
-- ✅ 9 active subscribers
-- ✅ 1 inactive subscriber
-- ✅ Sekarang bisa dilihat di admin panel: /admin/newsletters
