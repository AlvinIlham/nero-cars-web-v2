-- ================================================
-- COMPLETE FIX FOR NOTIFICATIONS RLS POLICIES
-- ================================================
-- Run this in Supabase SQL Editor

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies completely
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'notifications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON notifications';
    END LOOP;
END $$;

-- Policy 1: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: AUTHENTICATED users can INSERT notifications for ANY user
-- This is CRITICAL: allows User A to create notifications for User B
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verify policies - should show 4 policies
SELECT 
    policyname,
    cmd as operation,
    permissive,
    roles,
    qual as "using_clause",
    with_check as "with_check_clause"
FROM pg_policies 
WHERE tablename = 'notifications'
ORDER BY cmd;
