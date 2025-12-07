-- Fix RLS policies for admin operations on cars table
-- Run this in Supabase SQL Editor

-- 1. Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Users can view all cars" ON cars;
DROP POLICY IF EXISTS "Users can view published cars" ON cars;
DROP POLICY IF EXISTS "Users can update own cars" ON cars;
DROP POLICY IF EXISTS "Users can delete own cars" ON cars;
DROP POLICY IF EXISTS "Users can insert own cars" ON cars;

-- 2. Create new policies that allow admin full access

-- Allow anyone to view all cars (read access)
CREATE POLICY "Enable read access for all users"
ON cars FOR SELECT
USING (true);

-- Allow users to insert their own cars OR admin can insert any car
CREATE POLICY "Enable insert for users and admin"
ON cars FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND email = 'admin@gmail.com'
  )
);

-- Allow users to update their own cars OR admin can update any car
CREATE POLICY "Enable update for car owners and admin"
ON cars FOR UPDATE
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND email = 'admin@gmail.com'
  )
);

-- Allow users to delete their own cars OR admin can delete any car
CREATE POLICY "Enable delete for car owners and admin"
ON cars FOR DELETE
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND email = 'admin@gmail.com'
  )
);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'cars';
