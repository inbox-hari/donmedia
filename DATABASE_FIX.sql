-- Step 1: Add category_id and position to magazines table
ALTER TABLE magazines 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

-- Step 2: Migrate current magazines to their categories (if titles existed)
UPDATE magazines m
SET category_id = mt.category_id
FROM magazine_titles mt
WHERE m.magazine_title_id = mt.id
AND m.category_id IS NULL;

-- Step 3: (Optional Audit) Check for magazines without category_id
-- SELECT id, title FROM magazines WHERE category_id IS NULL;
