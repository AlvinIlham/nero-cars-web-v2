-- Add missing columns to cars table
-- Run this in Supabase SQL Editor

-- Add body_type column
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS body_type TEXT;

-- Add transmission column
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS transmission TEXT DEFAULT 'Manual';

-- Add fuel_type column
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS fuel_type TEXT DEFAULT 'Bensin';

-- Add mileage column
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS mileage INTEGER DEFAULT 0;

-- Add color column
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS color TEXT;

-- Add description column (if not exists)
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add images column (if not exists) - array of text for image URLs
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'cars'
ORDER BY ordinal_position;
