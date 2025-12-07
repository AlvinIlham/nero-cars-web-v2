-- Fix NULL values in is_read column
-- Run this in Supabase SQL Editor

-- 1. Check current NULL values
SELECT 
  id, 
  conversation_id, 
  sender_id, 
  content, 
  is_read,
  created_at
FROM messages
WHERE is_read IS NULL
ORDER BY created_at DESC;

-- 2. Set all NULL values to false (unread by default)
UPDATE messages
SET is_read = false
WHERE is_read IS NULL;

-- 3. Verify no more NULLs
SELECT COUNT(*) as null_count
FROM messages
WHERE is_read IS NULL;

-- 4. Set default value for future inserts
ALTER TABLE messages
ALTER COLUMN is_read SET DEFAULT false;

-- 5. Add NOT NULL constraint (optional, but recommended)
ALTER TABLE messages
ALTER COLUMN is_read SET NOT NULL;

-- 6. Verify final state
SELECT 
  COUNT(*) as total_messages,
  COUNT(CASE WHEN is_read = true THEN 1 END) as read_count,
  COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count,
  COUNT(CASE WHEN is_read IS NULL THEN 1 END) as null_count
FROM messages;
