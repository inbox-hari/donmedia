-- Add 'is_featured' flag to magazines for the new top section
ALTER TABLE magazines 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
