-- Add description field to categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS description text;
