-- Fix RLS policy for notifications table to allow insert
-- This allows users to create notifications for other users (e.g., when favoriting a car)

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON notifications;

-- Create new policy to allow authenticated users to insert notifications
CREATE POLICY "Allow authenticated users to insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Keep the existing policies for SELECT, UPDATE, DELETE
-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'notifications';
