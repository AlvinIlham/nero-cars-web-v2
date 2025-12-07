-- ================================================
-- DROP & RECREATE NOTIFICATIONS TABLE - NO RLS
-- ================================================
-- Run this in Supabase SQL Editor

-- Drop the existing table (akan hapus semua data!)
DROP TABLE IF EXISTS notifications CASCADE;

-- Buat tabel notifications baru
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('chat', 'favorite', 'car_update', 'system', 'review')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISABLE RLS (ini yang penting!)
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Buat index untuk performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Buat trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- Verify RLS is DISABLED
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'notifications';
-- rowsecurity should be FALSE
