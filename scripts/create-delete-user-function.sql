-- Create function to delete user completely (profile + auth)
-- Run this in Supabase SQL Editor

-- Drop existing function if exists
DROP FUNCTION IF EXISTS delete_user_completely(uuid);

-- Create function that deletes both profile and auth user
CREATE OR REPLACE FUNCTION delete_user_completely(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges
AS $$
BEGIN
  -- Check if the user being deleted is admin
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND email = 'admin@gmail.com'
  ) THEN
    RAISE EXCEPTION 'Cannot delete admin account';
  END IF;

  -- Delete from profiles table first
  DELETE FROM profiles WHERE id = user_id;
  
  -- Delete from auth.users table
  DELETE FROM auth.users WHERE id = user_id;
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_completely(uuid) TO authenticated;

-- Test the function (optional, remove this line when running in production)
-- SELECT delete_user_completely('some-user-id-here');
