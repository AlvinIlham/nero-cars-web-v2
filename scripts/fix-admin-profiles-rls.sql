-- Fix RLS policies for admin operations on profiles table
-- Run this in Supabase SQL Editor

-- 1. Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- 2. Create new policies that allow admin full access

-- Allow anyone to view profiles (read access)
CREATE POLICY "Enable read access for all users"
ON profiles FOR SELECT
USING (true);

-- Allow users to update their own profile OR admin can update any profile
CREATE POLICY "Enable update for users and admin"
ON profiles FOR UPDATE
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND email = 'admin@gmail.com'
  )
);

-- Allow users to delete their own profile OR admin can delete any profile
CREATE POLICY "Enable delete for users and admin"
ON profiles FOR DELETE
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND email = 'admin@gmail.com'
  )
);

-- Allow authenticated users to insert profiles
CREATE POLICY "Enable insert for authenticated users"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
