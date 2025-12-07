-- Fix INSERT policy for feedback table
-- Allow anyone (authenticated or not) to insert feedback

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Allow public feedback submission" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated feedback submission" ON feedback;

-- Create new permissive INSERT policy for public access
CREATE POLICY "Allow public feedback submission"
    ON feedback
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Also ensure authenticated users can insert
CREATE POLICY "Allow authenticated feedback submission"
    ON feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Verify policies were created successfully
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd 
FROM pg_policies 
WHERE tablename = 'feedback' 
AND cmd = 'INSERT';

SELECT 'INSERT policies updated successfully! You can now submit feedback.' as message;
