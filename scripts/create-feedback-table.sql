-- Create feedback table
-- This table stores user feedback including bug reports, feature requests, improvements, etc.

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'other' CHECK (type IN ('bug', 'feature', 'improvement', 'complaint', 'other')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_feedback_updated_at ON feedback;
CREATE TRIGGER set_feedback_updated_at
    BEFORE UPDATE ON feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Anyone can insert feedback (even non-authenticated users)
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
CREATE POLICY "Anyone can insert feedback"
    ON feedback
    FOR INSERT
    WITH CHECK (true);

-- 2. Users can view their own feedback OR admin can view all
DROP POLICY IF EXISTS "Users can view own feedback" ON feedback;
CREATE POLICY "Users can view own feedback"
    ON feedback
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND email = 'admin@gmail.com'
        )
    );

-- 3. Only admins can update feedback
DROP POLICY IF EXISTS "Admins can update feedback" ON feedback;
CREATE POLICY "Admins can update feedback"
    ON feedback
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND email = 'admin@gmail.com'
        )
    );

-- 4. Only admins can delete feedback
DROP POLICY IF EXISTS "Admins can delete feedback" ON feedback;
CREATE POLICY "Admins can delete feedback"
    ON feedback
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND email = 'admin@gmail.com'
        )
    );

-- Insert sample data for testing (optional)
-- Remove these if not needed
INSERT INTO feedback (name, email, subject, message, type) VALUES
    ('Anonymous User', 'anonymous@example.com', '🐛 Laporkan Bug: Login button not working', 'The login button on the homepage is not responding when clicked.', 'bug'),
    ('John Doe', 'john@example.com', '💡 Saran Fitur: Dark mode toggle', 'Would be great to have a dark mode option for better viewing at night.', 'feature'),
    ('Jane Smith', 'jane@example.com', '⭐ Perbaikan: Improve search functionality', 'The search feature could be faster and show more relevant results.', 'improvement')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'feedback'
ORDER BY ordinal_position;

-- Display result
SELECT 
    'Feedback table created successfully!' as message,
    COUNT(*) as sample_feedback_count
FROM feedback;
