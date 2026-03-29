-- Link magazines directly to categories and add ordering
ALTER TABLE magazines 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

-- Optional: If you have existing data and want to avoid issues, 
-- you can set category_id for existing rows or leave them as is.
