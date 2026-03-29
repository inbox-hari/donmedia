-- STEP 2: FIX DATABASE RELATIONSHIP
-- This SQL ensures that magazine_titles are correctly linked to categories.
-- RUN THIS IN THE SUPABASE SQL EDITOR.

ALTER TABLE magazine_titles
ADD CONSTRAINT magazine_titles_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE CASCADE;

-- Also verify column types match (UUID to UUID usually)
-- If your categories table uses an integer ID, make sure your column matches.
-- If you just added the column, you might need:
-- ALTER TABLE magazine_titles ALTER COLUMN category_id SET DATA TYPE uuid;

-- Optional: Add index for performance
CREATE INDEX IF NOT EXISTS idx_magazine_titles_category_id ON magazine_titles(category_id);
