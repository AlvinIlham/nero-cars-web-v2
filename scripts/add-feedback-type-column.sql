-- Add type column to existing feedback table
-- NOTE: If table doesn't exist, run 'create-feedback-table.sql' first!

-- Add type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'feedback' 
        AND column_name = 'type'
    ) THEN
        ALTER TABLE feedback 
        ADD COLUMN type TEXT DEFAULT 'other';
        
        RAISE NOTICE '✅ Column type added to feedback table';
    ELSE
        RAISE NOTICE '⚠️ Column type already exists in feedback table';
    END IF;
END $$;

-- Update existing feedback records without type
UPDATE feedback 
SET type = 'other' 
WHERE type IS NULL;

-- Make type column NOT NULL
ALTER TABLE feedback 
ALTER COLUMN type SET NOT NULL;

-- Add check constraint for valid feedback types
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'feedback_type_check'
    ) THEN
        ALTER TABLE feedback
        ADD CONSTRAINT feedback_type_check 
        CHECK (type IN ('bug', 'feature', 'improvement', 'complaint', 'other'));
        
        RAISE NOTICE '✅ Check constraint added for feedback type';
    ELSE
        RAISE NOTICE '⚠️ Check constraint already exists for feedback type';
    END IF;
END $$;

-- Create index on type for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);

-- Display result
SELECT 
    '✅ Migration completed successfully!' as status,
    COUNT(*) as total_feedback
FROM feedback;

SELECT 
    type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM feedback
GROUP BY type
ORDER BY COUNT(*) DESC;
