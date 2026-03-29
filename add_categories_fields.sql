-- Add cover_url and position to categories if they don't exist
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
