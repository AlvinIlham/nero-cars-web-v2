-- ================================================
-- ULTIMATE FIX - RECREATE NOTIFICATIONS NO RLS
-- ================================================
-- Run this in Supabase SQL Editor as POSTGRES ADMIN

-- 1. Drop table completely
DROP TABLE IF EXISTS notifications CASCADE;

-- 2. Buat tabel baru
CREATE TABLE public.notifications (
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

-- 3. MATIKAN RLS SEPENUHNYA
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 4. Hapus semua policy yang mungkin masih ada
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'notifications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.notifications';
    END LOOP;
END $$;

-- 5. Berikan FULL PERMISSION ke authenticated users
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 6. Buat index untuk performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- 7. Auto-update trigger
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- 8. VERIFY - Semua harus OK
SELECT 'Table created' as status;

SELECT 'RLS Status (should be FALSE):' as check_name, 
       tablename, 
       rowsecurity 
FROM pg_tables 
WHERE tablename = 'notifications';

SELECT 'Policies (should be 0 rows):' as check_name,
       COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'notifications';

SELECT 'Permissions:' as check_name,
       grantee,
       privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'notifications'
ORDER BY grantee;
