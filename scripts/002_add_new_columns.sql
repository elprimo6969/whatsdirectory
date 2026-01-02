-- Add new columns to channels table for enhanced features
ALTER TABLE channels 
ADD COLUMN IF NOT EXISTS total_votes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS creator_name text,
ADD COLUMN IF NOT EXISTS followers integer,
ADD COLUMN IF NOT EXISTS thumbnail text,
ADD COLUMN IF NOT EXISTS screenshots text[];

-- Update existing rows to have default total_votes
UPDATE channels SET total_votes = 0 WHERE total_votes IS NULL;
