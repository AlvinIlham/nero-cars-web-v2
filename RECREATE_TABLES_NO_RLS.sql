-- ============================================
-- DROP & RECREATE NEWSLETTERS + FEEDBACK
-- TANPA RLS (No Permission Issues)
-- ============================================
-- Copy semua SQL ini dan jalankan sekaligus di Supabase SQL Editor

-- ============================================
-- 1. DROP EXISTING TABLES
-- ============================================
DROP TABLE IF EXISTS newsletters CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;

-- ============================================
-- 2. CREATE NEWSLETTERS TABLE (NO RLS)
-- ============================================
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_newsletters_email ON newsletters(email);
CREATE INDEX idx_newsletters_is_active ON newsletters(is_active);

-- Insert test data
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

-- ============================================
-- 3. CREATE FEEDBACK TABLE (NO RLS)
-- ============================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'other' CHECK (type IN ('bug', 'feature', 'improvement', 'complaint', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- Insert test feedback data
INSERT INTO feedback (name, email, subject, message, type, status) VALUES
('John Doe', 'john.doe@gmail.com', '🐛 Bug: Login Error', 'Saya mengalami error saat login dengan akun Google. Mohon bantuannya.', 'bug', 'pending'),
('Sarah Wilson', 'sarah.wilson@yahoo.com', '⭐ Feature Request: Dark Mode', 'Tolong tambahkan fitur dark mode untuk tampilan website. Terima kasih!', 'feature', 'reviewed'),
('Michael Brown', 'michael.brown@outlook.com', '⚡ Improvement: Loading Speed', 'Website loading terlalu lama, mohon optimasi kecepatan.', 'improvement', 'pending'),
('Emma Davis', 'emma.davis@gmail.com', '😊 Compliment: Great Website', 'Website sangat bagus dan mudah digunakan. Terima kasih!', 'other', 'resolved'),
('David Johnson', 'david.johnson@hotmail.com', '❌ Complaint: Harga Tidak Sesuai', 'Harga mobil yang ditampilkan berbeda dengan harga sebenarnya.', 'complaint', 'pending'),
('Olivia Smith', 'olivia.smith@gmail.com', '🐛 Bug: Image Upload Failed', 'Upload gambar profil gagal, selalu muncul error 500.', 'bug', 'reviewed'),
('James Miller', 'james.miller@yahoo.com', '⭐ Feature: Chat Notification', 'Tolong tambahkan notifikasi real-time untuk chat.', 'feature', 'resolved'),
('Sophia Taylor', 'sophia.taylor@gmail.com', '⚡ UI/UX Improvement', 'Tampilan mobile perlu diperbaiki, beberapa button terlalu kecil.', 'improvement', 'pending'),
('William Anderson', 'william.anderson@outlook.com', '🐛 Bug: Search Not Working', 'Fitur search mobil tidak berfungsi dengan baik.', 'bug', 'pending'),
('Isabella Martinez', 'isabella.martinez@gmail.com', '⭐ Feature: Favorite Cars', 'Tolong tambahkan fitur untuk save favorite cars.', 'feature', 'reviewed');

-- ============================================
-- 4. CREATE TRIGGERS FOR updated_at
-- ============================================

-- Trigger for newsletters
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

-- Trigger for feedback
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_feedback_updated_at
BEFORE UPDATE ON feedback
FOR EACH ROW
EXECUTE FUNCTION update_feedback_updated_at();

-- ============================================
-- 5. VERIFICATION
-- ============================================

-- Count newsletters
SELECT 
  'NEWSLETTERS' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE is_active = true) as active,
  COUNT(*) FILTER (WHERE is_active = false) as inactive
FROM newsletters;

-- Count feedback
SELECT 
  'FEEDBACK' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'reviewed') as reviewed,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved
FROM feedback;

-- Show sample newsletters
SELECT id, email, is_active, created_at FROM newsletters ORDER BY created_at DESC LIMIT 5;

-- Show sample feedback
SELECT id, name, email, subject, type, status, created_at FROM feedback ORDER BY created_at DESC LIMIT 5;

-- ============================================
-- ✅ SUCCESS!
-- ============================================
-- ✅ Tabel newsletters berhasil dibuat (12 subscribers)
-- ✅ Tabel feedback berhasil dibuat (10 feedback entries)
-- ✅ TANPA RLS - No permission issues!
-- ✅ Refresh website dan test sekarang
-- ============================================
