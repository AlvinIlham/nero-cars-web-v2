-- Fix RLS policies for feedback table
-- This script creates a function that allows admin to fetch all feedback

-- Create function to get all feedback (admin only)
CREATE OR REPLACE FUNCTION get_all_feedback()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    type TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
AS $$
BEGIN
    -- Check if current user is admin
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.email = 'admin@gmail.com'
    ) THEN
        -- Return all feedback if admin
        RETURN QUERY 
        SELECT 
            feedback.id,
            feedback.user_id,
            feedback.name,
            feedback.email,
            feedback.subject,
            feedback.message,
            feedback.type,
            feedback.status,
            feedback.created_at,
            feedback.updated_at
        FROM feedback
        ORDER BY feedback.created_at DESC;
    ELSE
        -- Return only user's own feedback if not admin
        RETURN QUERY 
        SELECT 
            feedback.id,
            feedback.user_id,
            feedback.name,
            feedback.email,
            feedback.subject,
            feedback.message,
            feedback.type,
            feedback.status,
            feedback.created_at,
            feedback.updated_at
        FROM feedback
        WHERE feedback.user_id = auth.uid()
        ORDER BY feedback.created_at DESC;
    END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_all_feedback() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_feedback() TO anon;

-- Test the function (optional)
-- SELECT * FROM get_all_feedback();

-- Show success message
SELECT 'Function get_all_feedback() created successfully!' as message;
